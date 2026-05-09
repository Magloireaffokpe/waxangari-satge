"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Users,
  TrendingUp,
  Code2,
  Sparkles,
} from "lucide-react";
import { WaxangariLogo } from "@/components/WaxangariLogo";
import Link from "next/link";

const featureItems = [
  {
    icon: GraduationCap,
    label: "Stages académiques",
    desc: "Validation de parcours",
    color: "#4CAF18",
    delay: 0,
  },
  {
    icon: Code2,
    label: "Développement digital",
    desc: "Code & No-code",
    color: "#FF8200",
    delay: 0.2,
  },
  {
    icon: Users,
    label: "Accompagnement humain",
    desc: "Mentorat dédié",
    color: "#4CAF18",
    delay: 0.4,
  },
  {
    icon: TrendingUp,
    label: "Employabilité",
    desc: "Prêt pour le marché",
    color: "#FF8200",
    delay: 0.6,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col font-sans selection:bg-[#FF8200] selection:text-white">
      {/* Texture bruit */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02] z-0 mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      />

      {/* Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="fixed -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "#4CAF18" }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[40%] -right-[10%] w-[40vw] h-[40vw] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "#FF8200" }}
      />

      {/* Grille technique */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── Header ── */}
      <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 md:px-12 w-full max-w-7xl mx-auto">
        <WaxangariLogo size="sm" className="sm:hidden" />
        <WaxangariLogo size="md" className="hidden sm:inline-flex" />

        <Link href="/admin/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-semibold tracking-wide flex items-center gap-2 group"
          >
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              Admin
            </span>
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-[#4CAF18] transition-colors">
              <Sparkles className="w-4 h-4 text-muted-foreground group-hover:text-[#4CAF18]" />
            </div>
          </motion.button>
        </Link>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-10 md:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[70vh]">
          {/* Colonne texte */}
          <div className="flex flex-col items-start space-y-6 sm:space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-none border-l-4 border-[#4CAF18] bg-card/30 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-[#FF8200] animate-pulse shrink-0" />
              <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-muted-foreground">
                Promo 2026 ouverte
              </span>
            </motion.div>

            {/* Titre — texte original */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]"
            >
              Nouveau stagiaire
              <br />à{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF18] to-[#FF8200]">
                Waxangari Labs ?
              </span>
            </motion.h1>

            {/* Sous-titre — texte original */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground max-w-md border-l border-border pl-5 sm:pl-6"
            >
              Rejoignez notre laboratoire d&apos;innovation numérique. Boostez
              votre employabilité, développez vos compétences, construisez votre
              avenir.
            </motion.p>

            {/* ── CTA — dégradé vert→orange, compatible dark/light ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2 sm:pt-4 relative w-full sm:w-auto"
            >
              {/* Halo orange derrière le bouton */}
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, #4CAF18, #FF8200)",
                }}
              />

              <Link
                href="/formulaire"
                className="block w-full sm:inline-block sm:w-auto"
              >
                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 40px rgba(255,130,0,0.4)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="
                    group relative w-full sm:w-auto
                    flex items-center justify-center gap-3
                    px-8 py-4 sm:py-5
                    rounded-full font-bold text-base sm:text-lg
                    text-white overflow-hidden
                    transition-all duration-300
                  "
                  style={{
                    background:
                      "linear-gradient(135deg, #4CAF18 0%, #FF8200 100%)",
                  }}
                >
                  {/* Shimmer au survol */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                  <span className="relative z-10">
                    Commencer mon inscription
                  </span>

                  {/* Icône flèche — se déplace au survol */}
                  <motion.span
                    className="relative z-10 shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </motion.span>
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Cartes flottantes — desktop (lg+) */}
          <div className="relative h-full min-h-[400px] hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-square">
              {featureItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + item.delay,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className={`absolute p-6 rounded-3xl border border-border bg-card/40 backdrop-blur-xl shadow-2xl flex flex-col gap-4 w-[220px] ${
                    index === 0
                      ? "top-0 left-0 z-20"
                      : index === 1
                        ? "top-12 right-0 z-10"
                        : index === 2
                          ? "bottom-12 left-8 z-30"
                          : "bottom-0 right-4 z-20"
                  }`}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index,
                      ease: "easeInOut",
                    }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}18` }}
                  >
                    <item.icon
                      className="w-6 h-6"
                      style={{ color: item.color }}
                    />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm mb-1">
                      {item.label}
                    </h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center -z-10"
              >
                <div className="w-16 h-16 rounded-full bg-muted/20" />
              </motion.div>
            </div>
          </div>

          {/* Grille 2×2 — mobile / tablette */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
            {featureItems.map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + item.delay }}
                className="flex flex-col gap-3 p-4 sm:p-5 rounded-2xl border border-border bg-card/40 backdrop-blur-sm"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon
                    className="w-5 h-5"
                    style={{ color: item.color }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-0.5">
                    {item.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 flex justify-between items-center px-5 sm:px-8 md:px-12 py-5 sm:py-6 w-full max-w-7xl mx-auto border-t border-border/40 mt-8">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          © {new Date().getFullYear()} Waxangari Labs
        </span>
        <div className="flex gap-4">
          <div className="w-2 h-2 rounded-full bg-[#4CAF18]" />
          <div className="w-2 h-2 rounded-full bg-[#FF8200]" />
        </div>
      </footer>
    </div>
  );
}
