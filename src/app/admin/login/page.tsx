"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { WaxangariLogo } from "@/components/WaxangariLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false, // Ne jamais laisser NextAuth gérer la redirection
      });

      if (res?.ok && !res?.error) {
        toast.success("Connexion réussie");
        // Forcer la navigation dure — contourne le bug App Router + NextAuth
        window.location.href = "/admin/dashboard";
      } else {
        toast.error("Email ou mot de passe incorrect");
        setLoading(false);
      }
    } catch {
      toast.error("Erreur de connexion, réessayez");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "#FF8200" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "#4CAF18" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <WaxangariLogo className="mx-auto mb-5" size="lg" />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Shield className="h-4 w-4" /> Espace Admin
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Connexion</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Accédez au tableau de bord
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="email@gmail.com"
                className="mt-1.5"
                autoComplete="email"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  {...register("password")}
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #FF8200, #4CAF18)",
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 shrink-0" />
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
