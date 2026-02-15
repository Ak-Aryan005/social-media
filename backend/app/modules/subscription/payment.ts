import { Response, Request } from "express";
import Stripe from "stripe";
import { AuthRequest } from "middleware/checkJwt";

// 🔑 Alias Mongoose models to avoid name collisions
import {
  Plan,
  Subscription as SubscriptionModel,
  Transaction as TransactionModel,
} from "./models/index";
import User from "../user/models/user.model";




// ✅ DO NOT set apiVersion (fixes TS2322)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/* ======================================================
   CREATE SUBSCRIPTION (CHECKOUT)
====================================================== */

export const subscription = async (req: AuthRequest, res: Response) => {
  try {
    const { userId=req.user!.id, planId="697dc7342dbaaa5a2d1bc670" } = req.body as {
      userId: string;
      planId: string;
    };

    if (!userId || !planId) {
      return res.status(400).json({ message: "userId and planId required" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (!plan.priceId) {
      return res.status(400).json({ message: "Plan missing Stripe priceId" });
    }

    const price = await stripe.prices.retrieve(plan.priceId);
    if (!price.recurring) {
      return res.status(400).json({ message: "PriceId is not recurring" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url:
        "http://https://social-media-5juuilloq-ak-aryan005s-projects.vercel.app/subscription-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://social-media-5juuilloq-ak-aryan005s-projects.vercel.app/subscription-cancel",
      metadata: { userId, planId, type: "subscription" },
      subscription_data: {
        metadata: { userId, planId, type: "subscription" },
      },
    });

    return res.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error("Error creating subscription session:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   WEBHOOK HANDLERS
====================================================== */

async function handleSubscriptionCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as any; // ✅ boundary cast

  if (session.mode !== "subscription") return;

  const { userId, planId } = session.metadata ?? {};
  const stripeSubId = session.subscription as string;

  try {
    const stripeSub = (await stripe.subscriptions.retrieve(
      stripeSubId
    )) as any;

    const unitAmount = stripeSub.items?.data?.[0]?.price?.unit_amount ?? 0;
    const amount = unitAmount / 100;

    const nextPaymentDate = stripeSub.current_period_end
      ? new Date(stripeSub.current_period_end * 1000)
      : null;

    const existingSub = await SubscriptionModel.findOne({
      stripeSubscriptionId: stripeSubId,
    });
     
    if (!existingSub) {
      await SubscriptionModel.create({
        userId,
        planId,
        amount,
        startDate: new Date(),
        lastPaymentDate: new Date(),
        nextPaymentDate,
        status: "active",
        autoRenew: true,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: stripeSubId,
      });
    } else {
      existingSub.status = "active";
      existingSub.lastPaymentDate = new Date();
      existingSub.nextPaymentDate =
        nextPaymentDate ?? existingSub.nextPaymentDate;
      await existingSub.save();
    }
  } catch (err) {
    console.error("handleSubscriptionCheckoutCompleted error:", err);
  }
}

async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  let invoice = event.data.object as any; // ✅ boundary cast
console.log("invoice handle")
  try {
    if (!invoice.payment_intent || !invoice.lines || !invoice.subscription) {
      invoice = await stripe.invoices.retrieve(invoice.id, {
        expand: ["payment_intent", "charge", "lines.data", "subscription"]
      });
    }
    const stripeSubscriptionId =
      typeof invoice.subscription === "string"
        ? invoice.subscription
        : invoice.subscription?.id;

    const stripeCustomerId = invoice.customer;
    console.log("Invoice :", invoice);
    console.log("Invoice metadata:", invoice.parent.subscription_details.metadata);
    console.log("Invoice metadata:", invoice.metadata);

    let userId = invoice.parent.subscription_details.metadata?.userId;
    let planId = invoice.parent.subscription_details.metadata?.planId;
    let stripeSub: any = null;

    if (stripeSubscriptionId) {
      stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      userId ||= stripeSub.metadata?.userId;
      planId ||= stripeSub.metadata?.planId;
    }
console.log(planId,userId)

    const existingSub = stripeSubscriptionId
      ? await SubscriptionModel.findOne({ stripeSubscriptionId })
      : null;

    if (existingSub) {
      existingSub.status = "active";
      existingSub.lastPaymentDate = new Date();
      existingSub.nextPaymentDate = stripeSub?.current_period_end
        ? new Date(stripeSub.current_period_end * 1000)
        : existingSub.nextPaymentDate;
      await existingSub.save();
    }

    const transactionId =
      typeof invoice.payment_intent === "string"
        ? invoice.payment_intent
        : invoice.payment_intent?.id ?? invoice.id;

    if (!transactionId || !userId) return;
    const verifyUser= await User.findByIdAndUpdate({_id:userId},{isVerified:true},{ new: true })
    const existingTx = await TransactionModel.findOne({ transactionId });
    if (existingTx) return;
    await TransactionModel.create({
      userId,
      planId,
      amount: (invoice.amount_paid || 0) / 100,
      currency: invoice.currency || "usd",
      status: "success",
      paymentMethod: "stripe",
      transactionId,
      refundedAmount: 0,
    });
  } catch (err) {
    console.error("handleInvoicePaymentSucceeded error:", err);
  }
}

async function handleSubscriptionUpdated(event: Stripe.Event) {
  const stripeSub = event.data.object as any;

  try {
    const priceId = stripeSub.items?.data?.[0]?.price?.id;
    const plan = priceId ? await Plan.findOne({ priceId }) : null;

    await SubscriptionModel.findOneAndUpdate(
      { stripeSubscriptionId: stripeSub.id },
      {
        status: stripeSub.status,
        planId: plan?._id,
        nextPaymentDate: stripeSub.current_period_end
          ? new Date(stripeSub.current_period_end * 1000)
          : undefined,
      }
    );
  } catch (err) {
    console.error("handleSubscriptionUpdated error:", err);
  }
}

async function handleSubscriptionDeleted(event: Stripe.Event) {
  const stripeSub = event.data.object as any;

  await SubscriptionModel.findOneAndUpdate(
    { stripeSubscriptionId: stripeSub.id },
    { status: "canceled", cancelDate: new Date() }
  );
}

/* ======================================================
   WEBHOOK ENTRY POINT
====================================================== */

export const stripeSubscriptionHookHandler = async (
  req: Request,
  res: Response
) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_SUBSCRIPTION as string
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleSubscriptionCheckoutCompleted(event);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event);
        break;

      default:
        console.log("Unhandled event:", event.type);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).send("Internal Server Error");
  }
};
