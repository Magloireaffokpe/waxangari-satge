import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const setupSchema = z.object({
  key: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  const count = await prisma.admin.count()
  if (count > 0) return NextResponse.json({ error: 'Setup déjà effectué' }, { status: 403 })
  
  const body = await req.json()
  const parsed = setupSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  
  if (parsed.data.key !== process.env.FIRST_ADMIN_KEY) {
    return NextResponse.json({ error: 'Clé invalide' }, { status: 403 })
  }
  
  const hashed = await bcrypt.hash(parsed.data.password, 10)
  const admin = await prisma.admin.create({
    data: { email: parsed.data.email, name: parsed.data.name, password: hashed, isSuperAdmin: true }
  })
  
  return NextResponse.json({ success: true, email: admin.email }, { status: 201 })
}
