import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export const checkoutSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  address: z.string().trim().min(5, "Please enter a valid address").max(300),
  city: z.string().trim().min(2, "City is required").max(100),
  postalCode: z.string().trim().min(3, "Postal code is required").max(20),
  country: z.string().trim().min(2, "Country is required").max(100),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const otpSchema = z.object({
  otp: z.string().trim().length(6, "OTP must be 6 digits").regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
  otp: z.string().trim().length(6, "OTP must be 6 digits").regex(/^\d{6}$/, "OTP must be 6 digits"),
newPassword: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
newPassword: z.string().min(8, "Password must be at least 8 characters").max(72),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const changeEmailSchema = z.object({
  newEmail: z.string().trim().email("Please enter a valid email address").max(255),
});

export type OtpInput = z.infer<typeof otpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
