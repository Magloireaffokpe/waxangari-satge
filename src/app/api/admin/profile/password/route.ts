import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  const adminId = parseInt((session.user as any).id)
  const admin = await prisma.admin.findUnique({ where: { id: adminId } })
  if (!admin) return NextResponse.json({ error: 'Admin non trouvé' }, { status: 404 })
  const valid = await bcrypt.compare(parsed.data.currentPassword, admin.password)
  if (!valid) return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 })
  const hashed = await bcrypt.hash(parsed.data.newPassword, 10)
  await prisma.admin.update({ where: { id: adminId }, data: { password: hashed } })
  return NextResponse.json({ success: true })
}
