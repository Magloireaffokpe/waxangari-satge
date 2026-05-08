import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''
  const statut = searchParams.get('statut') || ''
  const typeStage = searchParams.get('typeStage') || ''
  const ecole = searchParams.get('ecole') || ''

  const where: any = {}
  if (search) {
    where.OR = [
      { nom: { contains: search, mode: 'insensitive' } },
      { prenom: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (statut) where.statutAvancement = statut
  if (typeStage) where.typeStage = typeStage
  if (ecole) where.ecoleUniversite = { contains: ecole, mode: 'insensitive' }

  const [data, total] = await Promise.all([
    prisma.stagiaire.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { dateInscription: 'desc' } }),
    prisma.stagiaire.count({ where }),
  ])

  return NextResponse.json({ data, total, pages: Math.ceil(total / limit), page })
}
