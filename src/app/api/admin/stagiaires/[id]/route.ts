import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateStagiaireSchema } from '@/lib/validations'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  
  const stagiaire = await prisma.stagiaire.findUnique({
    where: { id: parseInt(params.id) },
    include: { logs: { include: { admin: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' }, take: 20 } }
  })
  if (!stagiaire) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
  return NextResponse.json(stagiaire)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  
  const body = await req.json()
  const parsed = updateStagiaireSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  
  const id = parseInt(params.id)
  const adminId = parseInt((session.user as any).id)
  
  const stagiaire = await prisma.stagiaire.update({
    where: { id },
    data: {
      ...parsed.data,
      dateFinReelle: parsed.data.dateFinReelle ? new Date(parsed.data.dateFinReelle) : undefined,
    },
  })
  
  await prisma.adminLog.create({
    data: { adminId, action: 'MISE_A_JOUR', stagiaireId: id, details: { changes: parsed.data } }
  })
  
  return NextResponse.json(stagiaire)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  
  const id = parseInt(params.id)
  const adminId = parseInt((session.user as any).id)
  const stagiaire = await prisma.stagiaire.findUnique({ where: { id } })
  
  await prisma.adminLog.deleteMany({ where: { stagiaireId: id } })
  await prisma.stagiaire.delete({ where: { id } })
  await prisma.adminLog.create({
    data: { adminId, action: 'SUPPRESSION', details: { nom: stagiaire?.nom, prenom: stagiaire?.prenom, email: stagiaire?.email } }
  })
  
  return NextResponse.json({ success: true })
}
