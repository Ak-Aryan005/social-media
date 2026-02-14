import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  sendOtp,
  verifyOtp,
  forgotPassword,
  clearError,
} from "@/redux/slices/authSlice";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import InstagramLogo from "@/components/common/InstagramLogo";

export default function ForgotPassword() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ---------------- SEND OTP ----------------
  const handleSendOtp = async () => {
    if (!email) return setSubmitError("Email is required");

    setSubmitError(null);
    dispatch(clearError());

    try {
      await dispatch(
        sendOtp({ email, purpose: "resetPassword" })
      ).unwrap();

      setOtpSent(true);
    } catch (err: any) {
      setSubmitError(err || "Failed to send OTP");
    }
  };

  // ---------------- VERIFY OTP ----------------
  const handleVerifyOtp = async () => {
    if (!otp) return setSubmitError("OTP is required");

    setSubmitError(null);
    dispatch(clearError());

    try {
      await dispatch(
        verifyOtp({ email, code: otp })
      ).unwrap();

      setOtpVerified(true);
    } catch (err: any) {
      setSubmitError(err || "OTP verification failed");
    }
  };

  // ---------------- RESET PASSWORD ----------------
  const handleResetPassword = async () => {
    if (!password) return setSubmitError("New password is required");

    setSubmitError(null);
    dispatch(clearError());

    try {
      await dispatch(
        forgotPassword({ email, password })
      ).unwrap();

      navigate("/login");
    } catch (err: any) {
      setSubmitError(err || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <InstagramLogo size={48} />
            <h1 className="text-4xl font-bold">Instagram</h1>
          </div>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border p-6 space-y-5">
          {(submitError || error) && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20">
              {submitError || error}
            </div>
          )}

          {/* EMAIL + SEND OTP */}
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 pr-28 bg-destructive/0"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleSendOtp}
              disabled={isLoading || otpSent}
              // className="absolute right-1 top-1 bottom-1"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 text-xs"
            >
              {isLoading && !otpSent ? (
                <Loader size="sm" variant="spinner" />
              ) : otpSent ? (
                "Sent"
              ) : (
                "Send OTP"
              )}
            </Button>
          </div>

          {/* OTP + VERIFY */}
          <div className="relative">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={!otpSent}
              className="w-full border rounded-lg px-3 py-2 pr-28"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleVerifyOtp}
              disabled={!otpSent || otpVerified || isLoading}
              // className="absolute right-1 top-1 bottom-1"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 text-xs"
            >
              {isLoading && otpSent && !otpVerified ? (
                <Loader size="sm" variant="spinner" />
              ) : otpVerified ? (
                "Verified"
              ) : (
                "Verify"
              )}
            </Button>
          </div>

          {/* NEW PASSWORD */}
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!otpVerified}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* FINAL SUBMIT */}
          <Button
            onClick={handleResetPassword}
            disabled={!otpVerified || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader size="sm" variant="spinner" /> Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
