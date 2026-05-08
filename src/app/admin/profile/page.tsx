'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const pwdSchema = z.object({
  currentPassword: z.string().min(1, 'Requis'),
  newPassword: z.string().min(8, 'Min 8 caractères').regex(/[A-Z]/, 'Doit contenir une majuscule').regex(/[0-9]/, 'Doit contenir un chiffre'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: 'Les mots de passe ne correspondent pas', path: ['confirmPassword'] })

type PwdData = z.infer<typeof pwdSchema>

export default function ProfilePage() {
  const { data: session } = useSession()
  const [show, setShow] = useState({ current: false, new: false, confirm: false })
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PwdData>({ resolver: zodResolver(pwdSchema) })

  const changePassword = async (data: PwdData) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/profile/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword })
      })
      if (res.ok) { toast.success('Mot de passe mis à jour'); reset() }
      else { const e = await res.json(); toast.error(e.error || 'Erreur') }
    } finally { setSaving(false) }
  }

  const user = session?.user as any

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon profil</h1>
        <p className="text-sm text-muted-foreground">Gérez vos informations et votre sécurité</p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: 'linear-gradient(135deg, #FF8200, #4CAF18)' }}>
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-bold text-lg">{user?.name}</p>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              {user?.isSuperAdmin
                ? <><ShieldCheck className="h-3.5 w-3.5 text-amber-500" /><span className="text-xs font-medium text-amber-600">Super Admin</span></>
                : <><User className="h-3.5 w-3.5 text-primary" /><span className="text-xs font-medium text-primary">Administrateur</span></>}
            </div>
          </div>
        </div>
      </div>

      {/* Password change */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold flex items-center gap-2 mb-5">
          <Lock className="h-4 w-4 text-primary" /> Changer le mot de passe
        </h2>
        <form onSubmit={handleSubmit(changePassword)} className="space-y-4">
          {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field) => {
            const labels = { currentPassword: 'Mot de passe actuel', newPassword: 'Nouveau mot de passe', confirmPassword: 'Confirmer le nouveau mot de passe' }
            const keys = { currentPassword: 'current', newPassword: 'new', confirmPassword: 'confirm' } as const
            const key = keys[field]
            return (
              <div key={field}>
                <Label>{labels[field]}</Label>
                <div className="relative mt-1.5">
                  <Input {...register(field)} type={show[key] ? 'text' : 'password'} placeholder="••••••••" className="pr-10" />
                  <button type="button" onClick={() => setShow(s => ({ ...s, [key]: !s[key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {show[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors[field] && <p className="text-destructive text-xs mt-1">{errors[field]?.message}</p>}
              </div>
            )
          })}
          <Button type="submit" disabled={saving} className="w-full mt-2" style={{ background: 'linear-gradient(135deg, #FF8200, #4CAF18)', border: 'none' }}>
            {saving ? 'Enregistrement...' : 'Mettre à jour le mot de passe'}
          </Button>
        </form>
      </div>
    </div>
  )
}
