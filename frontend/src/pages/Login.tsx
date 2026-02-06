import { useState } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { login } from '@/redux/slices/authSlice';
import InputField from '@/components/common/InputField';
import Loader from '@/components/common/Loader';
import { loginSchema } from '@/utils/validationSchemas';
import { Button } from '@/components/ui/button';
import InstagramLogo from '@/components/common/InstagramLogo';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setSubmitError(null);
    try {
      const result = await dispatch(login(values)).unwrap();
      if (result) {
        navigate('/');
      }
    } catch (err: any) {
      setSubmitError(err || 'Login failed');
    }
  };

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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <InstagramLogo size={48} animated className="flex-shrink-0" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Instagram
            </h1>
          </motion.div>
          <p className="text-muted-foreground">
            Sign in to your account
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8"
        >
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
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-5">
              <InputField
                name="email"
                label="Email or Phone"
                type="text"
                placeholder="Enter your email or phone"
                autoComplete="email"
                required
              />

              <InputField
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 text-base font-semibold"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader size="sm" variant="spinner" /> Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>
            </Form>
          </Formik>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary hover:underline font-semibold transition"
              >
                Sign up
              </Link>
            </p>
            <p className="text-primary hover:underline font-semibold transition">
              <Link to={"/forgot-password"}>forgot password</Link>  
              </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
