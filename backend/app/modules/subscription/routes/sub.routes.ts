import { Router } from "express";
import { authenticate } from "../../../middleware/checkJwt";
import * as payment from "../payment"
const router = Router();

router.post("/", authenticate,payment.subscription);


export default router;
