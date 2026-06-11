export type LoginCodeEmailStatus = "sent" | "skipped" | "failed";

export type AuthMode = "email" | "password";

export type LoginStep = "credentials" | "code";

export interface LoginCodeEndpoints {
  login: string;
  sendLoginCode: string;
  loginWithCode: string;
}

export interface SendCodeResponse {
  message?: string;
  login_code_email?: LoginCodeEmailStatus;
  error?: string;
}

export function extractErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const e = error as { message?: string; error?: string | { message?: string } };
    if (typeof e.error === "string") return e.error;
    if (e.error && typeof e.error === "object" && e.error.message) return e.error.message;
    if (e.message) return e.message;
  }
  return fallback;
}

export async function postJson<T>(url: string, body: Record<string, string | undefined>): Promise<T> {
  const payload = Object.fromEntries(
    Object.entries(body).filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(extractErrorMessage(data, "Request failed"));
  }
  return data as T;
}

export function toastVerificationDispatch(
  status: LoginCodeEmailStatus | undefined,
  onError: (message: string) => void,
) {
  if (status === "skipped") {
    onError(
      "Verification email was not sent: the server is missing RESEND_API_KEY or MAIL_FROM_ADDRESS.",
    );
    return;
  }
  if (status === "failed") {
    onError(
      "Sign-in code could not be sent. Verify MAIL_FROM_ADDRESS and check server logs.",
    );
  }
}
