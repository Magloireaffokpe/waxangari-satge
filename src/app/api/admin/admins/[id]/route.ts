import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any).isSuperAdmin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  
  const targetId = parseInt(params.id)
  const selfId = parseInt((session.user as any).id)
  if (targetId === selfId) return NextResponse.json({ error: 'Vous ne pouvez pas vous supprimer vous-même' }, { status: 400 })
  
  const admin = await prisma.admin.findUnique({ where: { id: targetId } })
  await prisma.adminLog.deleteMany({ where: { adminId: targetId } })
  await prisma.admin.delete({ where: { id: targetId } })
  
  await prisma.adminLog.create({
    data: { adminId: selfId, action: 'SUPPRESSION_ADMIN', details: { email: admin?.email } }
  })
  
  return NextResponse.json({ success: true })
}
