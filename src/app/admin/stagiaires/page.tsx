'use client'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Eye, Trash2, Search, Download, CheckSquare, Square, ChevronLeft, ChevronRight, UserX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function StagiairesPage() {
  const [data, setData] = useState<any>({ data: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState('')
  const [typeStage, setTypeStage] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set('search', search)
      if (statut && statut !== 'all') params.set('statut', statut)
      if (typeStage && typeStage !== 'all') params.set('typeStage', typeStage)
      const res = await fetch(`/api/admin/stagiaires?${params}`)
      const d = await res.json()
      setData(d)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, statut, typeStage])

  useEffect(() => { fetchData() }, [fetchData])

  const toggleStatut = async (id: number, current: string) => {
    const next = current === 'EN_COURS' ? 'TERMINE' : 'EN_COURS'
    const res = await fetch(`/api/admin/stagiaires/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ statutAvancement: next }) })
    if (res.ok) { toast.success('Statut mis à jour'); fetchData() } else toast.error('Erreur')
  }

  const deleteStagiaire = async () => {
    if (!deleteId) return
    const res = await fetch(`/api/admin/stagiaires/${deleteId}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Stagiaire supprimé'); setDeleteId(null); fetchData() } else toast.error('Erreur')
  }

  const exportCSV = async () => {
    const params = new URLSearchParams({ limit: '9999' })
    if (search) params.set('search', search)
    if (statut && statut !== 'all') params.set('statut', statut)
    if (typeStage && typeStage !== 'all') params.set('typeStage', typeStage)
    const res = await fetch(`/api/admin/stagiaires?${params}`)
    const d = await res.json()
    const rows = d.data
    const headers = ['ID', 'Nom', 'Prénom', 'Email', 'Téléphone', 'École', 'Filière', 'Niveau', 'Type Stage', 'Date Début', 'Date Fin', 'Statut']
    const csv = [headers.join(','), ...rows.map((r: any) => [
      r.id, r.nom, r.prenom, r.email, r.telephone || '', r.ecoleUniversite, r.filiere, r.niveauEtude || '',
      r.typeStage, formatDate(r.dateDebut), formatDate(r.dateFin), r.statutAvancement
    ].map(v => `"${v}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'stagiaires.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Export CSV lancé')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Stagiaires</h1>
          <p className="text-sm text-muted-foreground">{data.total} stagiaire{data.total > 1 ? 's' : ''} au total</p>
        </div>
        <Button onClick={exportCSV} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Exporter CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher nom, prénom, email..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <Select value={statut} onValueChange={v => { setStatut(v); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="EN_COURS">En cours</SelectItem>
            <SelectItem value="TERMINE">Terminés</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeStage} onValueChange={v => { setTypeStage(v); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Type stage" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            <SelectItem value="ACADEMIQUE">Académique</SelectItem>
            <SelectItem value="PROFESSIONNEL">Professionnel</SelectItem>
          </SelectContent>
        </Select>
        <Select value={String(limit)} onValueChange={v => { setLimit(Number(v)); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {['Nom', 'Établissement', 'Filière', 'Type', 'Début', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    {[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}
                  </tr>
                ))
              ) : data.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <UserX className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="font-medium text-muted-foreground">Aucun stagiaire trouvé</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Modifiez vos filtres ou attendez de nouvelles inscriptions</p>
                  </td>
                </tr>
              ) : data.data.map((s: any) => (
                <tr key={s.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{s.prenom} {s.nom}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-[160px] truncate">{s.ecoleUniversite}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell max-w-[130px] truncate">{s.filiere}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant={s.typeStage === 'ACADEMIQUE' ? 'info' : 'warning'}>{s.typeStage === 'ACADEMIQUE' ? 'Académique' : 'Pro'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap hidden md:table-cell">{formatDate(s.dateDebut)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatut(s.id, s.statutAvancement)} className="flex items-center gap-1.5 group">
                      {s.statutAvancement === 'TERMINE'
                        ? <CheckSquare className="h-4 w-4 text-secondary" />
                        : <Square className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                      <Badge variant={s.statutAvancement === 'TERMINE' ? 'success' : 'warning'} className="cursor-pointer">
                        {s.statutAvancement === 'TERMINE' ? 'Terminé' : 'En cours'}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/stagiaires/${s.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => setDeleteId(s.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">
          {Math.min((page - 1) * limit + 1, data.total)}–{Math.min(page * limit, data.total)} sur {data.total}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-4 py-2 text-sm font-medium">Page {page} / {data.pages}</span>
          <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>Cette action est irréversible. Le stagiaire sera définitivement supprimé.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Annuler</Button>
            <Button variant="destructive" onClick={deleteStagiaire} className="flex-1">Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
