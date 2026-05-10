import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const currentYear = new Date().getFullYear();

  const [total, enCours, termines, allStagiaires, byEcole, byType, byLieu] =
    await Promise.all([
      prisma.stagiaire.count(),
      prisma.stagiaire.count({ where: { statutAvancement: "EN_COURS" } }),
      prisma.stagiaire.count({ where: { statutAvancement: "TERMINE" } }),
      prisma.stagiaire.findMany({
        select: {
          dateInscription: true,
          lieuProvenance: true,
          typeStage: true,
          dateNaissance: true, // peut être null
        },
      }),
      prisma.stagiaire.groupBy({
        by: ["ecoleUniversite"],
        _count: true,
        orderBy: { _count: { ecoleUniversite: "desc" } },
        take: 8,
      }),
      prisma.stagiaire.groupBy({ by: ["typeStage"], _count: true }),
      prisma.stagiaire.groupBy({
        by: ["lieuProvenance"],
        _count: true,
        orderBy: { _count: { lieuProvenance: "desc" } },
      }),
    ]);

  // ── Évolution mensuelle ──
  const monthly: Record<string, number> = {};
  allStagiaires.forEach((s) => {
    const key = new Date(s.dateInscription).toLocaleDateString("fr-FR", {
      month: "short",
      year: "2-digit",
    });
    monthly[key] = (monthly[key] || 0) + 1;
  });

  // ── Top lieux (top 6 + Autres) ──
  const topLieux = byLieu.slice(0, 6);
  const autresCount = byLieu.slice(6).reduce((acc, l) => acc + l._count, 0);
  const lieuData = [
    ...topLieux.map((l) => ({ name: l.lieuProvenance, value: l._count })),
    ...(autresCount > 0 ? [{ name: "Autres", value: autresCount }] : []),
  ];

  // ── Tranches d'âge ──
  // Calcul basé sur l'année de naissance vs année courante
  const tranches: Record<string, number> = {
    "Moins de 18": 0,
    "18 – 21 ans": 0,
    "22 – 25 ans": 0,
    "26 – 29 ans": 0,
    "30 ans et +": 0,
    "Non renseigné": 0,
  };

  allStagiaires.forEach((s) => {
    if (!s.dateNaissance) {
      tranches["Non renseigné"]++;
      return;
    }
    // Utiliser l'année de naissance uniquement pour éviter les bugs de timezone
    const anneeNaissance = new Date(s.dateNaissance).getFullYear();
    const age = currentYear - anneeNaissance;

    if (age < 18) tranches["Moins de 18"]++;
    else if (age <= 21) tranches["18 – 21 ans"]++;
    else if (age <= 25) tranches["22 – 25 ans"]++;
    else if (age <= 29) tranches["26 – 29 ans"]++;
    else tranches["30 ans et +"]++;
  });

  // Filtrer les tranches à 0 ET garder "Non renseigné" seulement si > 0
  const parAge = Object.entries(tranches)
    .filter(([, count]) => count > 0)
    .map(([tranche, count]) => ({ tranche, count }));

  return NextResponse.json({
    kpis: {
      total,
      enCours,
      termines,
      tauxCompletion: total > 0 ? Math.round((termines / total) * 100) : 0,
    },
    monthly: Object.entries(monthly).map(([name, count]) => ({ name, count })),
    ecoles: byEcole.map((e) => ({
      name: e.ecoleUniversite.split(" - ")[0].substring(0, 18),
      count: e._count,
    })),
    typeStage: byType.map((t) => ({
      name: t.typeStage === "ACADEMIQUE" ? "Académique" : "Professionnel",
      value: t._count,
    })),
    lieux: lieuData,
    parAge,
  });
}
