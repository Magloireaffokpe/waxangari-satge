import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stagiaireSchema } from '@/lib/validations'
import { uploadCV } from '@/lib/upload'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const raw: Record<string, any> = {}
    
    for (const [key, value] of formData.entries()) {
      if (key !== 'cv') raw[key] = value
    }
    
    raw.dureeMois = Number(raw.dureeMois)
    
    const parsed = stagiaireSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ message: 'Données invalides', errors: parsed.error.flatten() }, { status: 400 })
    }
    
    let cvUrl: string | undefined
    const cvFile = formData.get('cv') as File | null
    if (cvFile && cvFile.size > 0) {
      cvUrl = await uploadCV(cvFile)
    }
    
    const data = parsed.data
    const stagiaire = await prisma.stagiaire.create({
      data: {
        ...data,
        dateNaissance: data.dateNaissance ? new Date(data.dateNaissance) : null,
        dateDebut: new Date(data.dateDebut),
        dateFin: new Date(data.dateFin),
        cvUrl,
      },
    })
    
    return NextResponse.json({ success: true, id: stagiaire.id }, { status: 201 })
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ message: 'Cet email est déjà inscrit.' }, { status: 409 })
    }
    console.error(e)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}
