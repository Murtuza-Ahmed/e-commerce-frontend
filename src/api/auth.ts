/**
 * Auth API — backend ke `/api/auth/*` endpoints.
 * Har function seedha backend se baat karta hai; token ka intezam
 * `lib/api-client` + `store/auth` karte hain.
 */
import { api } from "@/lib/api-client";
import type { AuthResponse, User } from "@/types";
import { normalizeUser, type BackendUser } from "./users";

export type OtpPurpose = "email_verification" | "password_reset" | "email_recovery" | "email_change";

/** Backend AuthResponse me user ka role object hota hai — normalize karo. */
type RawAuthResponse = Omit<AuthResponse, "user"> & { user: BackendUser };

function withNormalizedUser(res: RawAuthResponse): AuthResponse {
  return { ...res, user: normalizeUser(res.user) };
}

export async function signup(input: { name: string; email: string; password: string; phone?: string }) {
  return api.post<{ message: string; userId: string }>("/auth/signup", { body: input, auth: false });
}

export async function verifyEmail(input: { email: string; otp: string }): Promise<AuthResponse> {
  return withNormalizedUser(await api.post<RawAuthResponse>("/auth/verify-email", { body: input, auth: false }));
}

export async function resendOtp(input: { email: string; purpose: OtpPurpose }) {
  return api.post<{ message: string }>("/auth/resend-otp", { body: input, auth: false });
}

export async function login(input: { email: string; password: string }): Promise<AuthResponse> {
  return withNormalizedUser(await api.post<RawAuthResponse>("/auth/login", { body: input, auth: false }));
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  return withNormalizedUser(await api.post<RawAuthResponse>("/auth/refresh", { body: { refreshToken }, auth: false }));
}

export async function logout(): Promise<void> {
  try {
    await api.post<void>("/auth/logout", {});
  } catch {
    // logout hamesha local state bhi clear karega — error ignore
  }
}

export async function forgotPassword(email: string) {
  return api.post<{ message: string }>("/auth/forgot-password", { body: { email }, auth: false });
}

export async function resetPassword(input: { email: string; otp: string; newPassword: string }) {
  return api.post<{ message: string }>("/auth/reset-password", { body: input, auth: false });
}

export async function forgotEmail(phone: string) {
  return api.post<{ message: string }>("/auth/forgot-email", { body: { phone }, auth: false });
}

export async function recoverEmail(input: { phone: string; otp: string }): Promise<{ email: string }> {
  return api.post<{ email: string }>("/auth/recover-email", { body: input, auth: false });
}

export async function requestEmailChange(newEmail: string) {
  return api.post<{ message: string }>("/auth/change-email/request", { body: { newEmail } });
}

export async function confirmEmailChange(input: { newEmail: string; otp: string }): Promise<{ user: User }> {
  const res = await api.post<{ user: BackendUser }>("/auth/change-email/confirm", { body: input });
  return { user: normalizeUser(res.user) };
}
