'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Download, Trash2, Save, FileText, Clock, User, GraduationCap, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { formatDate, formatDateTime } from '@/lib/utils'

export default function StagiaireDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [stagiaire, setStagiaire] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [commentaire, setCommentaire] = useState('')
  const [statut, setStatut] = useState('')
  const [dateFinReelle, setDateFinReelle] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/stagiaires/${id}`).then(r => r.json()).then(d => {
      setStagiaire(d)
      setCommentaire(d.commentaireInterne || '')
      setStatut(d.statutAvancement)
      setDateFinReelle(d.dateFinReelle ? new Date(d.dateFinReelle).toISOString().split('T')[0] : '')
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const save = async () => {
    setSaving(true)
    const res = await fetch(`/api/admin/stagiaires/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentaireInterne: commentaire, statutAvancement: statut, dateFinReelle: dateFinReelle || undefined })
    })
    if (res.ok) { toast.success('Modifications enregistrées'); const d = await res.json(); setStagiaire((prev: any) => ({ ...prev, ...d })) }
    else toast.error('Erreur lors de la sauvegarde')
    setSaving(false)
  }

  const deleteStagiaire = async () => {
    const res = await fetch(`/api/admin/stagiaires/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Stagiaire supprimé'); router.push('/admin/stagiaires') }
    else toast.error('Erreur')
  }

  if (loading) return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    </div>
  )

  if (!stagiaire) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Stagiaire introuvable</p>
      <Button variant="outline" className="mt-4" onClick={() => router.back()}>Retour</Button>
    </div>
  )

  const infoBlocks = [
    { icon: User, label: 'Identité', items: [
      { k: 'Nom complet', v: `${stagiaire.prenom} ${stagiaire.nom}` },
      { k: 'Email', v: stagiaire.email },
      { k: 'Téléphone', v: stagiaire.telephone || '—' },
      { k: 'Sexe', v: stagiaire.sexe },
      { k: 'Date de naissance', v: formatDate(stagiaire.dateNaissance) },
      { k: 'Lieu de provenance', v: stagiaire.lieuProvenance },
    ]},
    { icon: GraduationCap, label: 'Formation', items: [
      { k: 'École / Université', v: stagiaire.ecoleUniversite },
      { k: 'Filière', v: stagiaire.filiere },
      { k: 'Niveau', v: stagiaire.niveauEtude || '—' },
    ]},
    { icon: Briefcase, label: 'Stage', items: [
      { k: 'Type', v: stagiaire.typeStage },
      { k: 'Durée', v: `${stagiaire.dureeMois} mois` },
      { k: 'Date début', v: formatDate(stagiaire.dateDebut) },
      { k: 'Date fin prévue', v: formatDate(stagiaire.dateFin) },
      { k: 'Inscrit le', v: formatDate(stagiaire.dateInscription) },
    ]},
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <h1 className="text-xl font-bold">{stagiaire.prenom} {stagiaire.nom}</h1>
            <p className="text-sm text-muted-foreground">{stagiaire.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={stagiaire.statutAvancement === 'TERMINE' ? 'success' : 'warning'}>
            {stagiaire.statutAvancement === 'TERMINE' ? 'Terminé' : 'En cours'}
          </Badge>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)} className="gap-1.5">
            <Trash2 className="h-4 w-4" /> Supprimer
          </Button>
        </div>
      </div>

      {/* Info blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {infoBlocks.map(({ icon: Icon, label, items }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">{label}</h3>
            </div>
            <div className="space-y-2.5">
              {items.map(({ k, v }) => (
                <div key={k}>
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="text-sm font-medium truncate">{v}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Objet du stage */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Objet du stage</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{stagiaire.objetStage}</p>
        {stagiaire.cvUrl && (
          <a href={stagiaire.cvUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary hover:underline">
            <Download className="h-4 w-4" /> Télécharger le CV
          </a>
        )}
      </div>

      {/* Edition zone */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
        <h3 className="font-semibold flex items-center gap-2"><Save className="h-4 w-4 text-primary" /> Gestion du dossier</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Statut d&apos;avancement</Label>
            <Select value={statut} onValueChange={setStatut}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="EN_COURS">En cours</SelectItem>
                <SelectItem value="TERMINE">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date de fin réelle</Label>
            <Input type="date" value={dateFinReelle} onChange={e => setDateFinReelle(e.target.value)} className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label>Commentaire interne</Label>
          <Textarea value={commentaire} onChange={e => setCommentaire(e.target.value)} placeholder="Notes internes sur ce stagiaire..." rows={4} className="mt-1.5" />
        </div>
        <Button onClick={save} disabled={saving} className="gap-2" style={{ background: 'linear-gradient(135deg, #FF8200, #4CAF18)', border: 'none' }}>
          <Save className="h-4 w-4" /> {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>

      {/* Logs */}
      {stagiaire.logs?.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><Clock className="h-4 w-4 text-primary" /> Historique des actions</h3>
          <div className="space-y-3">
            {stagiaire.logs.map((log: any) => (
              <div key={log.id} className="flex items-start gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-muted-foreground"> · par {log.admin?.name}</span>
                  {log.details && <span className="text-muted-foreground"> · {JSON.stringify(log.details)}</span>}
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>Supprimer définitivement {stagiaire.prenom} {stagiaire.nom} ? Cette action est irréversible.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="flex-1">Annuler</Button>
            <Button variant="destructive" onClick={deleteStagiaire} className="flex-1">Confirmer la suppression</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
