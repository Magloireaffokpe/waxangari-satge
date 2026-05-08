'use client'
import { useEffect, useState } from 'react'
import { FileText, ChevronLeft, ChevronRight, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime } from '@/lib/utils'

const actionColors: Record<string, any> = {
  INSCRIPTION: 'success',
  MISE_A_JOUR: 'info',
  SUPPRESSION: 'destructive',
  CREATION_ADMIN: 'warning',
  SUPPRESSION_ADMIN: 'destructive',
}

const actionLabels: Record<string, string> = {
  INSCRIPTION: 'Inscription',
  MISE_A_JOUR: 'Mise à jour',
  SUPPRESSION: 'Suppression',
  CREATION_ADMIN: 'Création admin',
  SUPPRESSION_ADMIN: 'Suppression admin',
}

export default function LogsPage() {
  const [data, setData] = useState<any>({ logs: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/logs?page=${page}&limit=20`).then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [page])

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Journaux d'activité</h1>
        <p className="text-sm text-muted-foreground">{data.total} actions enregistrées</p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        ) : data.logs.length === 0 ? (
          <div className="py-16 text-center">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">Aucun journal pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {data.logs.map((log: any) => (
              <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-muted/20 transition-colors">
                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10 mt-0.5">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={actionColors[log.action] || 'outline'}>
                      {actionLabels[log.action] || log.action}
                    </Badge>
                    <span className="text-sm font-medium">{log.admin?.name}</span>
                    <span className="text-xs text-muted-foreground">{log.admin?.email}</span>
                  </div>
                  {log.details && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted/50 rounded px-2 py-1 mt-1.5 break-all">
                      {JSON.stringify(log.details)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{formatDateTime(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {data.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Page {page} / {data.pages}</span>
          <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
