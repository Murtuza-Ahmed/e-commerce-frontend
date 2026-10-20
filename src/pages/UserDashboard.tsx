import { useState, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Mail, LogOut, Camera, Trash2, Package, Heart } from "lucide-react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { FormField } from "@/components/ui/FormField";
import { ApiError } from "@/lib/api-client";
import * as usersApi from "@/api/users";
import * as authApi from "@/api/auth";
import { changePasswordSchema, changeEmailSchema, otpSchema } from "@/lib/validators";

type Tab = "profile" | "security" | "email";

function apiMessage(e: unknown): string {
  return e instanceof ApiError ? e.message : "Kuch ghalat ho gaya — dobara koshish karen";
}

const UserDashboard = () => {
  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");
  const [busy, setBusy] = useState(false);

  // profile
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  // password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // email change
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailStep, setEmailStep] = useState<"request" | "confirm">("request");
  // avatar
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Password", icon: Lock },
    { id: "email", label: "Email", icon: Mail },
  ];

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Name kam az kam 2 characters ho");
    setBusy(true);
    try {
      const updated = await usersApi.updateMe({ name: name.trim(), phone: phone.trim() || undefined });
      setUser(updated);
      toast.success("Profile update ho gaya");
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleAvatar = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return toast.error("Image 5 MB se chhoti ho");
    setBusy(true);
    try {
      const updated = await usersApi.uploadAvatar(file);
      setUser(updated);
      toast.success("Profile picture lag gayi");
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!confirm("Profile picture hatani hai?")) return;
    setBusy(true);
    try {
      const updated = await usersApi.deleteAvatar();
      setUser(updated);
      toast.success("Profile picture hata di");
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = changePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!r.success) {
      const first = r.error.issues[0];
      return toast.error(first.message);
    }
    setBusy(true);
    try {
      await usersApi.changePassword({ currentPassword, newPassword });
      toast.success("Password change ho gaya");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleEmailRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = changeEmailSchema.safeParse({ newEmail });
    if (!r.success) return toast.error(r.error.issues[0].message);
    setBusy(true);
    try {
      await authApi.requestEmailChange(newEmail.trim());
      toast.success("Naye email par OTP bheja gaya hai");
      setEmailStep("confirm");
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleEmailConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = otpSchema.safeParse({ otp: emailOtp });
    if (!r.success) return toast.error(r.error.issues[0].message);
    setBusy(true);
    try {
      const res = await authApi.confirmEmailChange({ newEmail: newEmail.trim(), otp: emailOtp });
      setUser(res.user);
      toast.success("Email change ho gaya — dobara login karen");
      await logout();
      navigate("/auth");
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="container py-8 md:py-12">
      <SEO title="My Account" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-muted/50 rounded-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-body font-semibold text-sm truncate">{user.name}</p>
                <p className="text-xs font-body text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-1" aria-label="Account navigation">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-body rounded-sm transition-colors ${
                    tab === t.id ? "bg-background font-medium" : "text-muted-foreground hover:bg-background/50"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
              <Link
                to="/wishlist"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-body rounded-sm text-muted-foreground hover:bg-background/50 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Wishlist
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-body rounded-sm text-muted-foreground hover:bg-background/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-background border rounded-sm p-6 md:p-8">
            {tab === "profile" && (
              <>
                <h2 className="font-display text-xl font-bold mb-6">Profile</h2>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={busy}
                      className="flex items-center gap-2 text-xs font-body font-medium px-3 py-2 border rounded-sm hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      {user.avatarUrl ? "Change" : "Upload"}
                    </button>
                    {user.avatarUrl && (
                      <button
                        onClick={handleAvatarDelete}
                        disabled={busy}
                        className="flex items-center gap-2 text-xs font-body font-medium px-3 py-2 border rounded-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleAvatar(f);
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>
                <form onSubmit={handleProfile} className="space-y-4 max-w-md" noValidate>
                  <FormField label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  <FormField label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03001234567" />
                  <div className="text-xs font-body text-muted-foreground">
                    Email: <span className="font-medium text-foreground">{user.email}</span>
                    {user.emailVerified ? (
                      <span className="ml-2 text-success">· Verified</span>
                    ) : (
                      <span className="ml-2 text-warning">· Not verified</span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={busy}
                    className="bg-foreground text-background px-6 py-3 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {busy ? "Saving…" : "Save Changes"}
                  </button>
                </form>
              </>
            )}

            {tab === "security" && (
              <>
                <h2 className="font-display text-xl font-bold mb-2">Change Password</h2>
                <p className="text-sm font-body text-muted-foreground mb-6">
                  Password change karne par baqi saari devices se logout ho jayenge.
                </p>
                <form onSubmit={handlePassword} className="space-y-4 max-w-md" noValidate>
                  <FormField label="Current Password" type="password" value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
                  <FormField label="New Password" type="password" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
                  <FormField label="Confirm New Password" type="password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
                  <button
                    type="submit"
                    disabled={busy}
                    className="bg-foreground text-background px-6 py-3 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {busy ? "Saving…" : "Change Password"}
                  </button>
                </form>
              </>
            )}

            {tab === "email" && (
              <>
                <h2 className="font-display text-xl font-bold mb-2">Change Email</h2>
                <p className="text-sm font-body text-muted-foreground mb-6">
                  Current: <span className="font-medium text-foreground">{user.email}</span>
                </p>
                {emailStep === "request" ? (
                  <form onSubmit={handleEmailRequest} className="space-y-4 max-w-md" noValidate>
                    <FormField label="New Email" type="email" value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)} placeholder="new@example.com" />
                    <button
                      type="submit"
                      disabled={busy}
                      className="bg-foreground text-background px-6 py-3 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {busy ? "Sending…" : "Send OTP"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleEmailConfirm} className="space-y-4 max-w-md" noValidate>
                    <p className="text-sm font-body text-muted-foreground">
                      <span className="font-medium text-foreground">{newEmail}</span> par bheja gaya 6-digit OTP likhen.
                    </p>
                    <FormField label="6-digit OTP" type="text" inputMode="numeric" value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456" autoComplete="one-time-code" />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={busy}
                        className="bg-foreground text-background px-6 py-3 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {busy ? "Verifying…" : "Confirm Change"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmailStep("request")}
                        className="px-6 py-3 text-sm font-body border rounded-sm hover:bg-muted transition-colors"
                      >
                        Back
                      </button>
                    </div>
                    <p className="text-xs font-body text-muted-foreground">
                      Email change hone par saari sessions logout ho jayengi.
                    </p>
                  </form>
                )}
              </>
            )}
          </div>

          {/* Orders note — backend me orders API abhi nahi */}
          <div className="mt-6 bg-muted/50 rounded-sm p-6 flex items-center gap-4">
            <Package className="w-5 h-5 text-muted-foreground shrink-0" />
            <p className="text-sm font-body text-muted-foreground">
              Order history jald aa rahi hai — backend me orders API ban'ne ke baad yahan dikhegi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
