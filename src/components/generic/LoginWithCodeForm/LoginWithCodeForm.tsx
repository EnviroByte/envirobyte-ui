"use client";

import { Button } from "../../primitives/Button";
import { Input } from "../../primitives/Input";
import { LoginCodeEndpoints } from "../../../lib/login-code-auth";
import { useLoginWithCodeForm } from "./useLoginWithCodeForm";

export interface LoginWithCodeFormProps {
  apiBaseUrl: string;
  endpoints: LoginCodeEndpoints;
  productQuery?: string;
  onSuccess: (data: Record<string, unknown>) => void | Promise<void>;
  onError?: (message: string) => void;
  onInfo?: (message: string) => void;
  forgotPasswordHref?: string;
  microsoftLoginButton?: React.ReactNode;
  footer?: React.ReactNode;
  submitLabel?: string;
}

export function LoginWithCodeForm({
  apiBaseUrl,
  endpoints,
  productQuery,
  onSuccess,
  onError,
  onInfo,
  forgotPasswordHref,
  microsoftLoginButton,
  footer,
  submitLabel = "Send Code",
}: LoginWithCodeFormProps) {
  const form = useLoginWithCodeForm({
    apiBaseUrl,
    endpoints,
    productQuery,
    onSuccess,
    onError,
    onInfo,
  });

  if (form.loginStep === "code") {
    return (
      <div className="space-y-6">
        <p className="text-sm text-gray-600 text-center">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-gray-900">{form.lastEmail}</span>
        </p>

        <form onSubmit={form.handleVerifyCode} className="space-y-6">
          <div className="flex justify-center">
            <div className="flex gap-2.5" onPaste={form.handleOtpPaste}>
              {form.otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    form.otpInputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => form.handleOtpChange(i, e)}
                  onKeyDown={(e) => form.handleOtpKeyDown(i, e)}
                  aria-label={`Digit ${i + 1} of 6`}
                  className="h-11 w-10 shrink-0 rounded-lg border border-gray-300 bg-white text-center text-base font-semibold text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            loading={form.codeSubmitting}
            className="w-full !justify-center"
          >
            Verify Code
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Didn&apos;t get it?{" "}
          <button
            type="button"
            onClick={form.handleResendLoginCode}
            disabled={form.resendCodeLoading}
            className="text-primary hover:underline disabled:opacity-60"
          >
            {form.resendCodeLoading ? "Sending…" : "Resend code"}
          </button>
        </p>

        <div className="text-center">
          <button
            type="button"
            onClick={form.goBack}
            className="text-sm font-medium text-gray-600 hover:text-primary"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={form.handleCredentialsSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => form.setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>

        {form.authMode === "password" && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              {forgotPasswordHref ? (
                <a href={forgotPasswordHref} className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              ) : null}
            </div>
            <Input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => form.setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
        )}

        <Button
          type="submit"
          loading={form.credentialsSubmitting}
          className="w-full !justify-center"
        >
          {form.credentialsSubmitting ? "Sending…" : submitLabel}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        {form.authMode === "email" ? (
          <>
            Prefer a password?{" "}
            <button
              type="button"
              onClick={() => form.setAuthMode("password")}
              className="text-primary hover:underline"
            >
              Log in with password
            </button>
          </>
        ) : (
          <>
            No password?{" "}
            <button
              type="button"
              onClick={() => {
                form.setAuthMode("email");
                form.setPasswordBlank();
              }}
              className="text-primary hover:underline"
            >
              Send a code to my email
            </button>
          </>
        )}
      </p>

      {microsoftLoginButton ? (
        <>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>
          {microsoftLoginButton}
        </>
      ) : null}

      {footer}
    </div>
  );
}
