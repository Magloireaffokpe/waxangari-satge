import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAdminSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any).isSuperAdmin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  const admins = await prisma.admin.findMany({ select: { id: true, email: true, name: true, isSuperAdmin: true, createdAt: true, lastLogin: true } })
  return NextResponse.json(admins)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any).isSuperAdmin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  
  const body = await req.json()
  const parsed = createAdminSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Données invalides', details: parsed.error.flatten() }, { status: 400 })
  
  const hashed = await bcrypt.hash(parsed.data.password, 10)
  const admin = await prisma.admin.create({ data: { ...parsed.data, password: hashed } })
  
  await prisma.adminLog.create({
    data: { adminId: parseInt((session.user as any).id), action: 'CREATION_ADMIN', details: { email: admin.email } }
  })
  
  return NextResponse.json({ id: admin.id, email: admin.email, name: admin.name }, { status: 201 })
}
