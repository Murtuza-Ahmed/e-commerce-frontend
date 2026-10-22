import { describe, it, expect } from "vitest";
import { resetPasswordSchema } from "@/lib/validators";

const base = { email: "user@example.com", otp: "123456" };

describe("resetPasswordSchema", () => {
  it("matching passwords (8+ chars) accept karta hai", () => {
    const r = resetPasswordSchema.safeParse({
      ...base,
      newPassword: "secret123",
      confirmPassword: "secret123",
    });
    expect(r.success).toBe(true);
  });

  it("mismatched confirm password reject karta hai", () => {
    const r = resetPasswordSchema.safeParse({
      ...base,
      newPassword: "secret123",
      confirmPassword: "secret999",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path.includes("confirmPassword"))).toBe(true);
    }
  });

  it("8 se chhota password reject karta hai", () => {
    const r = resetPasswordSchema.safeParse({
      ...base,
      newPassword: "1234",
      confirmPassword: "1234",
    });
    expect(r.success).toBe(false);
  });
});
