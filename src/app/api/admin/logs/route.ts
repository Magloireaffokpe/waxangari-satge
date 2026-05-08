import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  const [logs, total] = await Promise.all([
    prisma.adminLog.findMany({
      skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
      include: { admin: { select: { name: true, email: true } } }
    }),
    prisma.adminLog.count(),
  ])
  
  return NextResponse.json({ logs, total, pages: Math.ceil(total / limit) })
}
