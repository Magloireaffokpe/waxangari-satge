'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react'
import { WaxangariLogo } from '@/components/WaxangariLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'

type LoginData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginData) => {
    setLoading(true)
    const res = await signIn('credentials', { ...data, redirect: false })
    if (res?.ok) {
      toast.success('Connexion réussie')
      router.push('/admin/dashboard')
    } else {
      toast.error('Email ou mot de passe incorrect')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#FF8200 1px, transparent 1px), linear-gradient(90deg, #FF8200 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#FF8200' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: '#4CAF18' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        
        <div className="rounded-2xl border border-border bg-card shadow-xl p-8">
          <div className="text-center mb-8">
            <WaxangariLogo className="mx-auto mb-5" size="lg" />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Shield className="h-4 w-4" /> Espace Admin
            </div>
            <h1 className="text-2xl font-bold">Connexion</h1>
            <p className="text-sm text-muted-foreground mt-1">Accédez au tableau de bord</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register('email')} type="email" placeholder="admin@waxangari.com" className="mt-1.5" autoComplete="email" />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative mt-1.5">
                <Input id="password" {...register('password')} type={showPwd ? 'text' : 'password'} placeholder="••••••••" autoComplete="current-password" className="pr-10" />
                <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={loading} size="lg" className="w-full gap-2 mt-2" style={{ background: 'linear-gradient(135deg, #FF8200, #FF9E00)', border: 'none' }}>
              {loading ? 'Connexion...' : (<><LogIn className="h-4 w-4" /> Se connecter</>)}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
