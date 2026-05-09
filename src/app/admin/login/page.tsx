"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
    const res = await signIn("credentials", { ...data, redirect: false });
    if (res?.ok) {
      toast.success("Connexion réussie");
      router.push("/admin/dashboard");
    } else {
      toast.error("Email ou mot de passe incorrect");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden font-sans selection:bg-[#FF8200] selection:text-white">
      {/* Texture de fond "Bruit" & Grille pour l'identité Labo */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02] z-0 mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      />
      <div className="pointer-events-none fixed inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#FF8200 1px, transparent 1px), linear-gradient(90deg, #FF8200 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Halo lumineux */}
      <div className="pointer-events-none fixed inset-0 flex justify-center items-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{ background: "#FF8200" }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: "#4CAF18" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl p-6 sm:p-8 md:p-10">
          {/* Header du Formulaire - Structure Flex pour forcer l'alignement responsive */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex justify-center w-full mb-6">
              {/* Taille "md" recommandée pour ne pas exploser la vue mobile */}
              <WaxangariLogo size="md" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FF8200]/20 bg-[#FF8200]/10 text-[#FF8200] text-xs sm:text-sm font-semibold tracking-wide mb-4">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Espace Admin</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Connexion
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Accédez au tableau de bord
            </p>
          </div>

          {/* Formulaire */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5"
          >
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Adresse Email
              </Label>
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="admin@waxangari.com"
                className="h-11 rounded-xl bg-background/50 border-border focus-visible:ring-[#FF8200]"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  {...register("password")}
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 rounded-xl bg-background/50 border-border focus-visible:ring-[#FF8200] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8200]"
                >
                  {showPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-[15px] gap-2 mt-6 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, #FF8200 0%, #FF9E00 100%)",
                border: "none",
                boxShadow: "0 8px 20px rgba(255,130,0,0.25)",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion en cours...
                </span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Se connecter
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
