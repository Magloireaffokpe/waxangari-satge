'use client'
import { motion } from 'framer-motion'
import { ArrowRight, GraduationCap, Lightbulb, Users, TrendingUp, Code2, Wifi } from 'lucide-react'
import { WaxangariLogo } from '@/components/WaxangariLogo'
import Link from 'next/link'

const featureItems = [
  { icon: GraduationCap, label: 'Stages académiques', color: '#4CAF18' },
  { icon: Code2, label: 'Développement digital', color: '#FF8200' },
  { icon: Users, label: 'Accompagnement humain', color: '#4CAF18' },
  { icon: TrendingUp, label: 'Employabilité renforcée', color: '#FF8200' },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      
      {/* Animated blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-blob animation-delay-2000 absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #4CAF18 0%, transparent 70%)' }} />
        <div className="animate-blob absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #FF8200 0%, transparent 70%)' }} />
        <div className="animate-blob animation-delay-4000 absolute -bottom-32 left-1/3 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4CAF18 0%, transparent 70%)' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#4CAF18 1px, transparent 1px), linear-gradient(90deg, #4CAF18 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <WaxangariLogo size="md" />
        <Link href="/admin/login">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-xl px-4 py-2 hover:border-foreground/30">
            Connexion admin
          </button>
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl mx-auto">
          
          {/* Pill badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm text-sm text-muted-foreground mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#4CAF18' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#4CAF18' }} />
            </span>
            Inscriptions ouvertes · Bénin
          </motion.div>

          {/* Main heading */}
          <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-7xl leading-[1.1] mb-6">
            <span className="block text-foreground">Nouveau stagiaire</span>
            <span className="block text-foreground">à</span>
            <span className="block gradient-text mt-1">Waxangari Labs ?</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
            Rejoignez notre laboratoire d'innovation numérique. Boostez votre employabilité, développez vos compétences, construisez votre avenir.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeUp}>
            <Link href="/formulaire">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 rounded-2xl px-10 py-5 text-lg font-bold text-white shadow-2xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #FF8200 0%, #FF9E00 100%)', boxShadow: '0 20px 60px rgba(255,130,0,0.35)' }}
              >
                <span>Commencer mon inscription</span>
                <motion.span
                  className="inline-block"
                  initial={{ x: 0 }}
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
                {/* Shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {featureItems.map(({ icon: Icon, label, color }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-4 cursor-default"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${color}18` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground text-center leading-tight">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-xs text-muted-foreground border-t border-border/50">
        © {new Date().getFullYear()} Waxangari Labs · Bénin · Tous droits réservés
      </footer>
    </div>
  )
}
