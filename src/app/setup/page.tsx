'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { WaxangariLogo } from '@/components/WaxangariLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Rocket } from 'lucide-react'

export default function SetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    setLoading(true)
    const res = await fetch('/api/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) { toast.success('Super admin créé ! Connectez-vous.'); router.push('/admin/login') }
    else { const e = await res.json(); toast.error(e.error || 'Erreur') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <WaxangariLogo className="mx-auto mb-6" size="lg" />
        <div className="text-center mb-6">
          <Rocket className="h-10 w-10 mx-auto mb-3 text-primary" />
          <h1 className="text-2xl font-bold">Première configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Créez votre compte Super Admin</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><Label>Clé de configuration</Label><Input {...register('key')} type="password" placeholder="FIRST_ADMIN_KEY" className="mt-1.5" /></div>
          <div><Label>Nom</Label><Input {...register('name')} placeholder="Super Admin" className="mt-1.5" /></div>
          <div><Label>Email</Label><Input {...register('email')} type="email" placeholder="admin@waxangari.com" className="mt-1.5" /></div>
          <div><Label>Mot de passe</Label><Input {...register('password')} type="password" placeholder="Minimum 8 caractères" className="mt-1.5" /></div>
          <Button type="submit" disabled={loading} className="w-full" style={{ background: 'linear-gradient(135deg, #FF8200, #4CAF18)', border: 'none' }}>
            {loading ? 'Création...' : 'Créer le compte'}
          </Button>
        </form>
      </div>
    </div>
  )
}
