import {useState } from 'react';
import BlueTickIntro from './BlueTickIntro';
import PaymentStep from './PaymentStep';
import { fetchPayment } from '@/redux/slices/paymentSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

export default function BlueTickFlow() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);

  const handlePayment = async () => {
    if (!profile?._id) return;

    try {
      setLoading(true);

      const resultAction = await dispatch(fetchPayment(profile._id));

      if (fetchPayment.fulfilled.match(resultAction)) {
        const { url } = resultAction.payload;

        if (url) {
          window.location.href = url; // Redirect
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === 1 && <BlueTickIntro onSubscribe={() => setStep(2)} />}
      {step === 2 && (
        <PaymentStep
          onPay={handlePayment}
          loading={loading}
        />
      )}
    </>
  );
}
