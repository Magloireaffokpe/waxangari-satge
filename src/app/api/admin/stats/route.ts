import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const [total, enCours, termines, allStagiaires, byEcole, byType, byLieu] = await Promise.all([
    prisma.stagiaire.count(),
    prisma.stagiaire.count({ where: { statutAvancement: 'EN_COURS' } }),
    prisma.stagiaire.count({ where: { statutAvancement: 'TERMINE' } }),
    prisma.stagiaire.findMany({ select: { dateInscription: true, ecoleUniversite: true, typeStage: true, lieuProvenance: true } }),
    prisma.stagiaire.groupBy({ by: ['ecoleUniversite'], _count: true, orderBy: { _count: { ecoleUniversite: 'desc' } }, take: 10 }),
    prisma.stagiaire.groupBy({ by: ['typeStage'], _count: true }),
    prisma.stagiaire.groupBy({ by: ['lieuProvenance'], _count: true, orderBy: { _count: { lieuProvenance: 'desc' } } }),
  ])

  // Monthly inscriptions
  const monthly: Record<string, number> = {}
  allStagiaires.forEach(s => {
    const key = new Date(s.dateInscription).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
    monthly[key] = (monthly[key] || 0) + 1
  })

  // Top lieux (top 6 + Autres)
  const topLieux = byLieu.slice(0, 6)
  const autresCount = byLieu.slice(6).reduce((acc, l) => acc + l._count, 0)
  const lieuData = [...topLieux.map(l => ({ name: l.lieuProvenance, value: l._count })), ...(autresCount > 0 ? [{ name: 'Autres', value: autresCount }] : [])]

  return NextResponse.json({
    kpis: { total, enCours, termines, tauxCompletion: total > 0 ? Math.round((termines / total) * 100) : 0 },
    monthly: Object.entries(monthly).map(([name, count]) => ({ name, count })),
    ecoles: byEcole.map(e => ({ name: e.ecoleUniversite.split(' - ')[0].substring(0, 20), count: e._count })),
    typeStage: byType.map(t => ({ name: t.typeStage === 'ACADEMIQUE' ? 'Académique' : 'Professionnel', value: t._count })),
    lieux: lieuData,
  })
}
