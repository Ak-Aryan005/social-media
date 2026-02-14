// src/pages/ConfirmationCode.tsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { verifyEmail, sendOtp } from '@/redux/slices/authSlice';
import Loader from '@/components/common/Loader';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import * as Yup from 'yup';

// Validation schema - includes email
const confirmationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  code: Yup.string()
    .required('Confirmation code is required')
    .matches(/^\d{6}$/, 'Code must be exactly 6 digits'),
});

export default function ConfirmationCode() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useAppSelector((state) => state.auth);
const { purpose } = useAppSelector((state) => state.auth);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [codeValues, setCodeValues] = useState(['', '', '', '', '', '']);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get email from navigation state or localStorage
  const email =
    location.state?.email ||
    localStorage.getItem('pendingVerificationEmail') ||
    '';

  // Redirect if no email is available
  useEffect(() => {
    if (!email) {
      navigate('/signup', {
        state: { message: 'Please sign up first to verify your email.' },
        replace: true,
      });
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Clean up localStorage on successful verification
  const clearStoredEmail = () => {
    localStorage.removeItem('pendingVerificationEmail');
  };

  // Mask email for display (e.g., j***@gmail.com)
  const maskEmail = (email: string): string => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;

    const maskedLocal =
      localPart.length > 2
        ? `${localPart[0]}${'*'.repeat(Math.min(localPart.length - 1, 5))}`
        : localPart;

    return `${maskedLocal}@${domain}`;
  };

  const handleInputChange = (
    index: number,
    value: string,
    setFieldValue: any
  ) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCodeValues = [...codeValues];
    newCodeValues[index] = value;
    setCodeValues(newCodeValues);

    // Update Formik field
    setFieldValue('code', newCodeValues.join(''));

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === 'Backspace' && !codeValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent, setFieldValue: any) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (pastedData) {
      const newCodeValues = [...codeValues];
      pastedData.split('').forEach((char, index) => {
        if (index < 6) newCodeValues[index] = char;
      });
      setCodeValues(newCodeValues);
      setFieldValue('code', newCodeValues.join(''));

      // Focus appropriate input
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (values: { email: string; code: string }) => {
    setSubmitError(null);
    try {
      const result = await dispatch(
        verifyEmail({
          email: values.email,
          code: values.code,
        })
      ).unwrap();

      if (result) {
        // Clear stored email
        clearStoredEmail();
        toast.success('Email verified successfully!');
        navigate('/login', {
          state: { message: 'Email verified successfully! Please sign in.' },
          replace: true,
        });
      }
    } catch (err: any) {
      const errorMsg = err || 'Verification failed';
      setSubmitError(errorMsg);
      toast.error(errorMsg);
      // Clear code inputs on error
      setCodeValues(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };


  const handleResendCode = async () => {
    if (countdown > 0 || resendLoading || !email) return;

    setResendLoading(true);
    setSubmitError(null);

    try {
      await dispatch(sendOtp({ email,purpose:"verifyEmail" })).unwrap();
      toast.success('A new code has been sent to your email');
      setCountdown(60); // 60 second cooldown
    } catch (err: any) {
      const errorMsg = err || 'Failed to resend code';
      setSubmitError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  // Don't render if no email
  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Verify Email
          </h1>
          <p className="text-muted-foreground">
            Enter the code sent to your email
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8"
        >
          {/* Email Display */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="w-8 h-8 text-primary" />
            </motion.div>
            <p className="text-muted-foreground text-sm">
              We've sent a 6-digit confirmation code to
            </p>
            <p className="text-foreground font-semibold mt-1 break-all">
              {maskEmail(email)}
            </p>
          </div>

          {/* Error Message */}
          {(submitError || error) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20"
            >
              {submitError || error}
            </motion.div>
          )}

          <Formik
            initialValues={{ email: email, code: '' }}
            validationSchema={confirmationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ setFieldValue, errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                {/* Hidden Email Field - Required by API */}
                <Field type="hidden" name="email" value={email} />

                {/* Code Input Fields */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-4 text-center">
                    Enter confirmation code
                  </label>
                  <div
                    className="flex justify-center gap-2 sm:gap-3"
                    onPaste={(e) => handlePaste(e, setFieldValue)}
                  >
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <motion.input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={codeValues[index]}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value, setFieldValue)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        whileFocus={{ scale: 1.05 }}
                        className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold 
                          border-2 rounded-lg transition-all duration-200
                          bg-muted text-foreground
                          ${
                            codeValues[index]
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-input'
                          }
                          focus:border-primary focus:ring-2 focus:ring-primary/50
                          focus:outline-none
                          ${
                            errors.code && touched.code
                              ? 'border-destructive ring-2 ring-destructive/20'
                              : ''
                          }
                        `}
                        disabled={isSubmitting}
                        aria-label={`Digit ${index + 1}`}
                      />
                    ))}
                  </div>
                  {errors.code && touched.code && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-destructive text-center"
                    >
                      {errors.code}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting || codeValues.join('').length !== 6}
                    className="w-full py-6 text-base font-semibold"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size="sm" variant="spinner" /> Verifying...
                      </>
                    ) : (
                      'Verify Email'
                    )}
                  </Button>
                </motion.div>
              </Form>
            )}
          </Formik>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={countdown > 0 || resendLoading}
                className={`font-semibold transition ${
                  countdown > 0 || resendLoading
                    ? 'text-muted-foreground cursor-not-allowed opacity-50'
                    : 'text-primary hover:underline cursor-pointer'
                }`}
              >
                {resendLoading ? (
                  <span className="inline-flex items-center gap-1">
                    <Loader size="sm" variant="spinner" /> Sending...
                  </span>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  'Resend code'
                )}
              </button>
            </p>
          </div>

          {/* Back to Login */}
          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-muted-foreground hover:text-foreground text-sm transition inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-muted-foreground text-xs">
            Check your spam folder if you don't see the email.
            <br />
            The code expires in 10 minutes.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
