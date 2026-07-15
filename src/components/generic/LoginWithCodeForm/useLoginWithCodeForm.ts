"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AuthMode,
  LoginCodeEndpoints,
  LoginStep,
  SendCodeResponse,
  extractErrorMessage,
  postJson,
  toastVerificationDispatch,
} from "../../../lib/login-code-auth";

const emptyOtp = () => ["", "", "", "", "", ""] as string[];

export interface UseLoginWithCodeFormOptions {
  apiBaseUrl: string;
  endpoints: LoginCodeEndpoints;
  productQuery?: string;
  onSuccess: (data: Record<string, unknown>) => void | Promise<void>;
  onError?: (message: string) => void;
  onInfo?: (message: string) => void;
}

export function useLoginWithCodeForm({
  apiBaseUrl,
  endpoints,
  productQuery,
  onSuccess,
  onError,
  onInfo,
}: UseLoginWithCodeFormOptions) {
  const [loginStep, setLoginStep] = useState<LoginStep>("credentials");
  const [authMode, setAuthMode] = useState<AuthMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastEmail, setLastEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(emptyOtp);
  const [credentialsSubmitting, setCredentialsSubmitting] = useState(false);
  const [codeSubmitting, setCodeSubmitting] = useState(false);
  const [resendCodeLoading, setResendCodeLoading] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const sendLockRef = useRef(false);

  const query = productQuery ? `?product=${encodeURIComponent(productQuery)}` : "";
  const base = apiBaseUrl.replace(/\/$/, "");

  const notifyError = useCallback(
    (message: string) => {
      onError?.(message);
    },
    [onError],
  );

  const notifyInfo = useCallback(
    (message: string) => {
      onInfo?.(message);
    },
    [onInfo],
  );

  const goToCodeStep = useCallback((sentEmail: string) => {
    setLastEmail(sentEmail);
    setOtp(emptyOtp());
    setLoginStep("code");
  }, []);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      notifyError("Email is required");
      return;
    }
    if (authMode === "password" && !password) {
      notifyError("Password is required");
      return;
    }
    if (sendLockRef.current) return;
    sendLockRef.current = true;

    setCredentialsSubmitting(true);
    try {
      const endpoint =
        authMode === "email"
          ? `${base}${endpoints.sendLoginCode}${query}`
          : `${base}${endpoints.login}${query}`;
      const payload =
        authMode === "email"
          ? { email: trimmedEmail }
          : { email: trimmedEmail, password };

      const res = await postJson<SendCodeResponse>(endpoint, payload);

      if (res.login_code_email === "failed" || res.login_code_email === "skipped") {
        toastVerificationDispatch(res.login_code_email, notifyError);
        return;
      }
      if (res.login_code_email === "sent") {
        notifyInfo("Check your email for the 6-digit sign-in code.");
        goToCodeStep(trimmedEmail);
        return;
      }
      notifyInfo("If this email is registered, a code was sent. Check your inbox.");
      goToCodeStep(trimmedEmail);
    } catch (error) {
      notifyError(extractErrorMessage(error, "Invalid credentials. Please try again."));
    } finally {
      setCredentialsSubmitting(false);
      sendLockRef.current = false;
    }
  };

  const handleResendLoginCode = async () => {
    const trimmedEmail = (lastEmail || email).trim();
    if (!trimmedEmail) {
      notifyError("Go back and enter your email first.");
      return;
    }
    if (authMode === "password" && !password) {
      notifyError("Go back and enter your password to resend the code.");
      return;
    }
    if (sendLockRef.current) return;
    sendLockRef.current = true;

    setResendCodeLoading(true);
    try {
      const payload =
        authMode === "email"
          ? { email: trimmedEmail }
          : { email: trimmedEmail, password };
      const data = await postJson<SendCodeResponse>(
        `${base}${endpoints.sendLoginCode}${query}`,
        payload,
      );
      if (data.login_code_email === "sent") {
        notifyInfo("A new 6-digit code has been sent.");
        setOtp(emptyOtp());
      } else {
        notifyInfo("If this email is registered, a new code was sent. Check your inbox.");
        setOtp(emptyOtp());
      }
    } catch (error) {
      notifyError(extractErrorMessage(error));
    } finally {
      setResendCodeLoading(false);
      sendLockRef.current = false;
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = (lastEmail || email).trim();
    const code = otp.join("");
    if (!trimmedEmail) {
      notifyError("Enter your email first.");
      return;
    }
    if (code.length !== 6) {
      notifyError("Enter all 6 digits.");
      return;
    }

    setCodeSubmitting(true);
    try {
      const data = await postJson<Record<string, unknown>>(
        `${base}${endpoints.loginWithCode}${query}`,
        { email: trimmedEmail, code },
      );
      await onSuccess(data);
    } catch (error) {
      notifyError(extractErrorMessage(error, "Invalid or expired code."));
    } finally {
      setCodeSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 1) {
      const digits = raw.slice(0, 6).split("");
      const next = emptyOtp();
      digits.forEach((d, j) => {
        if (j < 6) next[j] = d;
      });
      setOtp(next);
      otpInputRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }
    const digit = raw.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        otpInputRefs.current[index - 1]?.focus();
        const next = [...otp];
        next[index - 1] = "";
        setOtp(next);
      }
      e.preventDefault();
    }
    if (e.key === "ArrowLeft" && index > 0) otpInputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = emptyOtp();
    for (let k = 0; k < text.length; k++) next[k] = text[k] ?? "";
    setOtp(next);
    otpInputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const goBack = () => {
    setLoginStep("credentials");
    setOtp(emptyOtp());
  };

  useEffect(() => {
    if (loginStep === "code") {
      const t = window.setTimeout(() => otpInputRefs.current[0]?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [loginStep]);

  return {
    loginStep,
    authMode,
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    lastEmail,
    otp,
    otpInputRefs,
    credentialsSubmitting,
    codeSubmitting,
    resendCodeLoading,
    handleCredentialsSubmit,
    handleVerifyCode,
    handleResendLoginCode,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    goBack,
    setPasswordBlank: () => setPassword(""),
  };
}
