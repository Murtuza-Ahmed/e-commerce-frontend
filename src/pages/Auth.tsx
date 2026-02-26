import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { FormField } from "@/components/ui/FormField";
import { loginSchema, registerSchema } from "@/lib/validators";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const schema = isLogin ? loginSchema : registerSchema;
    const data = isLogin ? { email, password } : { name, email, password };
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (isLogin) {
      login(email, password);
      toast.success("Welcome back!");
    } else {
      register(name, email, password);
      toast.success("Account created!");
    }
    navigate("/");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <SEO title={isLogin ? "Sign In" : "Create Account"} description="Sign in or create your Al-ucaaz account for exclusive benefits." />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-6"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-sm font-body text-muted-foreground">
            {isLogin ? "Sign in to your account" : "Join us for exclusive benefits"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {!isLogin && (
            <FormField
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              error={errors.name}
              autoComplete="name"
            />
          )}
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={errors.email}
            autoComplete="email"
          />
          <FormField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          <button
            type="submit"
            className="w-full bg-foreground text-background py-3.5 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
            className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-sm text-center">
          <p className="text-xs font-body text-muted-foreground">
            Demo: Use any email to sign in. Use "admin@" for admin access.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
