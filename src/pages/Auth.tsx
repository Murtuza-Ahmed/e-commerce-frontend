import { useState } from "react";
import { useAuthStore, isStaff } from "@/store/auth";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { FormField } from "@/components/ui/FormField";
import { ApiError, isApiEnabled } from "@/lib/api-client";
import * as authApi from "@/api/auth";
import {
  loginSchema,
  registerSchema,
  otpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validators";

type Step =
  | "login"
  | "signup"
  | "verify"
  | "forgot"
  | "reset"
  | "forgotEmail"
  | "recoverEmail";

function fieldErrorsOf(e: unknown): Record<string, string> | null {
  const err = e as { issues?: { path: (string | number)[]; message: string }[] };
  if (!err.issues) return null;
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function apiMessage(e: unknown): string {
  return e instanceof ApiError ? e.message : "Kuch ghalat ho gaya — dobara koshish karen";
}

const Auth = () => {
  const [step, setStep] = useState<Step>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const { login, signup, verifyEmail } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  if (!isApiEnabled()) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-6">
        <SEO title="Sign In" description="Sign in to your Al-ucaaz account." />
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-display font-bold mb-3">Backend connect nahi hai</h1>
          <p className="text-sm font-body text-muted-foreground">
            Auth ke liye backend zaroori hai. <code>VITE_API_URL</code> set karke dobara build karen.
          </p>
        </div>
      </div>
    );
  }

  const go = (s: Step) => {
    setStep(s);
    setErrors({});
  };

  const afterLogin = () => {
    const u = useAuthStore.getState().user;
    toast.success("Welcome back!");
    navigate(isStaff(u) ? "/admin" : from, { replace: true });
  };

  const startCooldown = () => {
    setCooldown(30);
    const t = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) clearInterval(t);
        return c - 1;
      });
    }, 1000);
  };

  // ---------- handlers ----------

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = loginSchema.safeParse({ email, password });
    if (!r.success) return setErrors(fieldErrorsOf(r.error) ?? {});
    setBusy(true);
    try {
      await login(email, password);
      afterLogin();
    } catch (err) {
      if (err instanceof ApiError && err.code === "EMAIL_NOT_VERIFIED") {
        toast.info("Pehle apna email verify karen — OTP bhej diya gaya hai");
        try {
          await authApi.resendOtp({ email, purpose: "email_verification" });
        } catch {
          /* ignore */
        }
        go("verify");
      } else {
        toast.error(apiMessage(err));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = registerSchema.safeParse({ name, email, password });
    if (!r.success) return setErrors(fieldErrorsOf(r.error) ?? {});
    setBusy(true);
    try {
      await signup(name, email, password);
      toast.success("Account ban gaya! Email par OTP bheja gaya hai");
      go("verify");
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = otpSchema.safeParse({ otp });
    if (!r.success) return setErrors(fieldErrorsOf(r.error) ?? {});
    setBusy(true);
    try {
      await verifyEmail(email, otp);
      afterLogin();
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async (purpose: authApi.OtpPurpose) => {
    if (cooldown > 0) return;
    setBusy(true);
    try {
      await authApi.resendOtp({ email, purpose });
      toast.success("OTP dobara bhej diya gaya");
      startCooldown();
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = forgotPasswordSchema.safeParse({ email });
    if (!r.success) return setErrors(fieldErrorsOf(r.error) ?? {});
    setBusy(true);
    try {
      await authApi.forgotPassword(email);
      toast.success("OTP bhej diya gaya hai");
      go("reset");
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = resetPasswordSchema.safeParse({ email, otp, newPassword, confirmPassword });
    if (!r.success) return setErrors(fieldErrorsOf(r.error) ?? {});
    setBusy(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      toast.success("Password change ho gaya — ab login karen");
      setPassword("");
      setOtp("");
      go("login");
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return setErrors({ phone: "Phone number zaroori hai" });
    setBusy(true);
    try {
      await authApi.forgotEmail(phone.trim());
      toast.success("Phone par OTP bheja gaya hai");
      go("recoverEmail");
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleRecoverEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = otpSchema.safeParse({ otp });
    if (!r.success) return setErrors(fieldErrorsOf(r.error) ?? {});
    setBusy(true);
    try {
      const res = await authApi.recoverEmail({ phone: phone.trim(), otp });
      setMaskedEmail(res.email);
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  // ---------- UI ----------

  const titles: Record<Step, { h: string; p: string }> = {
    login: { h: "Welcome Back", p: "Sign in to your account" },
    signup: { h: "Create Account", p: "Join us for exclusive benefits" },
    verify: { h: "Verify Email", p: `6-digit OTP bheja gaya: ${email}` },
    forgot: { h: "Forgot Password", p: "Email likhen — OTP bhejen ge" },
    reset: { h: "Reset Password", p: "OTP aur naya password likhen" },
    forgotEmail: { h: "Forgot Email", p: "Account wala phone number likhen" },
    recoverEmail: { h: "Recover Email", p: "Phone par aaya OTP likhen" },
  };
  const t = titles[step];

  const submitLabel: Record<Step, string> = {
    login: "Sign In",
    signup: "Create Account",
    verify: "Verify & Continue",
    forgot: "Send OTP",
    reset: "Reset Password",
    forgotEmail: "Send OTP",
    recoverEmail: "Recover Email",
  };

  const onSubmit =
    step === "login"
      ? handleLogin
      : step === "signup"
        ? handleSignup
        : step === "verify"
          ? handleVerify
          : step === "forgot"
            ? handleForgot
            : step === "reset"
              ? handleReset
              : step === "forgotEmail"
                ? handleForgotEmail
                : handleRecoverEmail;

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <SEO title={t.h} description="Sign in or create your Al-ucaaz account." />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold mb-2">{t.h}</h1>
          <p className="text-sm font-body text-muted-foreground break-all">{t.p}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {step === "signup" && (
            <FormField label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Your name" error={errors.name} autoComplete="name" />
          )}
          {["login", "signup", "forgot"].includes(step) && (
            <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" error={errors.email} autoComplete="email" />
          )}
          {["login", "signup"].includes(step) && (
            <FormField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" error={errors.password}
              autoComplete={step === "login" ? "current-password" : "new-password"} />
          )}
          {["verify", "reset", "recoverEmail"].includes(step) && (
            <FormField label="6-digit OTP" type="text" inputMode="numeric" value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456" error={errors.otp} autoComplete="one-time-code" />
          )}
          {step === "reset" && (
            <>
              <FormField label="New Password" type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••"
                error={errors.newPassword} autoComplete="new-password" />
              <FormField label="Confirm Password" type="password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                error={errors.confirmPassword} autoComplete="new-password" />
            </>
          )}
          {step === "forgotEmail" && (
            <FormField label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="03001234567" error={errors.phone} autoComplete="tel" />
          )}

          {errors.form && <p className="text-sm text-destructive font-body">{errors.form}</p>}

          <button type="submit" disabled={busy}
            className="w-full bg-foreground text-background py-3.5 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {busy ? "Please wait…" : submitLabel[step]}
          </button>
        </form>

        {/* step links */}
        <div className="text-center mt-6 space-y-2">
          {step === "login" && (
            <>
              <button onClick={() => go("signup")} className="block w-full text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                Don&apos;t have an account? Sign up
              </button>
              <div className="flex justify-center gap-4 text-sm font-body">
                <button onClick={() => go("forgot")} className="text-muted-foreground hover:text-foreground transition-colors">
                  Forgot password?
                </button>
                <span className="text-muted-foreground/40">·</span>
                <button onClick={() => go("forgotEmail")} className="text-muted-foreground hover:text-foreground transition-colors">
                  Forgot email?
                </button>
              </div>
            </>
          )}
          {step === "signup" && (
            <button onClick={() => go("login")} className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
              Already have an account? Sign in
            </button>
          )}
          {step === "verify" && (
            <button disabled={cooldown > 0 || busy} onClick={() => handleResend("email_verification")}
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </button>
          )}
          {step === "reset" && (
            <button disabled={cooldown > 0 || busy} onClick={() => handleResend("password_reset")}
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </button>
          )}
          {["forgot", "forgotEmail", "recoverEmail"].includes(step) && (
            <button onClick={() => go("login")} className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
              Back to sign in
            </button>
          )}
        </div>

        {step === "recoverEmail" && maskedEmail && (
          <div className="mt-6 p-4 bg-muted rounded-sm text-center">
            <p className="text-xs font-body text-muted-foreground mb-1">Your account email is</p>
            <p className="text-lg font-body font-semibold">{maskedEmail}</p>
            <Link to="/auth" onClick={() => { setEmail(""); go("login"); }}
              className="text-sm font-body text-foreground underline mt-2 inline-block">
              Sign in
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
