import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since");

  // Date de référence : lastLogin de l'admin ou 7 derniers jours
  const sinceDate = since
    ? new Date(since)
    : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [count, recent] = await Promise.all([
    prisma.stagiaire.count({
      where: { dateInscription: { gt: sinceDate } },
    }),
    prisma.stagiaire.findMany({
      where: { dateInscription: { gt: sinceDate } },
      orderBy: { dateInscription: "desc" },
      take: 10,
      select: {
        id: true,
        nom: true,
        prenom: true,
        ecoleUniversite: true,
        dateInscription: true,
        typeStage: true,
      },
    }),
  ]);

  return NextResponse.json({ count, recent });
}
