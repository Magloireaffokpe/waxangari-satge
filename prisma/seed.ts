import { PrismaClient, Sexe, TypeStage, StatutAvancement } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const noms = ['Adjovi', 'Ahouansou', 'Alowanou', 'Bada', 'Bello', 'Bocovo', 'Chabi', 'Dossou', 'Gnacadja', 'Houinsou', 'Kpèdékpo', 'Kossou', 'Loko', 'Mahinou', 'Montcho', 'Noudéhouènou', 'Ogunwale', 'Padonou', 'Quenum', 'Sènou', 'Sogbossi', 'Talon', 'Vodounou', 'Yèhouénou', 'Zannou']
const prenoms = ['Abiodun', 'Adjoa', 'Akosua', 'Arnaud', 'Bénédicte', 'Christelle', 'Cyprien', 'Dina', 'Emmanuel', 'Fatimata', 'Gilles', 'Honoré', 'Isidore', 'Jessica', 'Koffi', 'Laurence', 'Marcel', 'Nadège', 'Oluwafemi', 'Patricia', 'Roméo', 'Sandrine', 'Théophile', 'Ulrich', 'Véronique']
const ecoles = ['UAC - Université d\'Abomey-Calavi', 'UP - Université de Parakou', 'EPAC', 'ENEAM', 'ENAM', 'Institut CERCO', 'ESAE', 'Université de Natitingou', 'PIGIER Bénin', 'ISMA']
const filieres = ['Informatique de Gestion', 'Génie Logiciel', 'Réseaux et Télécommunications', 'Data Science', 'Marketing Digital', 'Gestion des Entreprises', 'Finance-Comptabilité', 'Communication', 'Droit des Affaires', 'Management de Projets']
const lieux = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon', 'Natitingou', 'Lokossa', 'Ouidah', 'Kandi', 'Djougou']
const niveaux = ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'BTS', 'DUT', 'Bac+5']
const objets = [
  'Développement d\'une application web de gestion de stock',
  'Mise en place d\'un système de monitoring réseau',
  'Analyse de données pour optimisation marketing',
  'Développement d\'une plateforme e-learning',
  'Conception d\'une base de données relationnelle',
  'Développement d\'une API REST pour gestion RH',
  'Intégration d\'un système de paiement mobile',
  'Création d\'un tableau de bord analytique',
  'Développement d\'une application mobile Android',
  'Mise en place d\'une infrastructure cloud'
]

async function main() {
  console.log('🌱 Seeding database...')

  // Create super admin
  const hashedPassword = await bcrypt.hash('Admin@Waxangari2024', 10)
  const superAdmin = await prisma.admin.upsert({
    where: { email: 'admin@waxangari.com' },
    update: {},
    create: {
      email: 'admin@waxangari.com',
      name: 'Super Admin',
      password: hashedPassword,
      isSuperAdmin: true,
    },
  })
  console.log('✅ Super admin créé:', superAdmin.email)

  // Create second admin
  const admin2 = await prisma.admin.upsert({
    where: { email: 'maître@waxangari.com' },
    update: {},
    create: {
      email: 'maître@waxangari.com',
      name: 'Maître de Stage',
      password: await bcrypt.hash('Stage@2024!', 10),
      isSuperAdmin: false,
    },
  })
  console.log('✅ Admin 2 créé:', admin2.email)

  // Create stagiaires
  const stagiaires = []
  for (let i = 0; i < 28; i++) {
    const nom = noms[i % noms.length]
    const prenom = prenoms[i % prenoms.length]
    const dateDebut = new Date(2024, Math.floor(i / 4) % 12, (i % 28) + 1)
    const dureeMois = [1, 2, 3, 6][i % 4]
    const dateFin = new Date(dateDebut)
    dateFin.setMonth(dateFin.getMonth() + dureeMois)
    
    stagiaires.push({
      nom,
      prenom,
      email: `${prenom.toLowerCase().replace(/[^a-z]/g, '')}.${nom.toLowerCase().replace(/[^a-z]/g, '')}${i}@email.com`,
      telephone: `+229 ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`,
      sexe: i % 3 === 0 ? Sexe.FEMININ : Sexe.MASCULIN,
      dateNaissance: new Date(1998 + i % 6, i % 12, (i % 28) + 1),
      lieuProvenance: lieux[i % lieux.length],
      ecoleUniversite: ecoles[i % ecoles.length],
      filiere: filieres[i % filieres.length],
      niveauEtude: niveaux[i % niveaux.length],
      typeStage: i % 3 === 0 ? TypeStage.PROFESSIONNEL : TypeStage.ACADEMIQUE,
      dureeMois,
      dateDebut,
      dateFin,
      objetStage: objets[i % objets.length],
      statutAvancement: i < 10 ? StatutAvancement.TERMINE : StatutAvancement.EN_COURS,
      commentaireInterne: i % 4 === 0 ? 'Stagiaire très motivé, bon travail en équipe.' : null,
      dateInscription: new Date(dateDebut.getTime() - 7 * 24 * 60 * 60 * 1000),
    })
  }

  for (const s of stagiaires) {
    await prisma.stagiaire.upsert({
      where: { email: s.email },
      update: {},
      create: s,
    })
  }
  console.log(`✅ ${stagiaires.length} stagiaires créés`)

  // Create some logs
  const allStagiaires = await prisma.stagiaire.findMany({ take: 5 })
  for (const s of allStagiaires) {
    await prisma.adminLog.create({
      data: {
        adminId: superAdmin.id,
        action: 'INSCRIPTION',
        stagiaireId: s.id,
        details: { message: `Inscription de ${s.prenom} ${s.nom}` },
      },
    })
  }
  console.log('✅ Logs créés')
  console.log('\n🎉 Seed terminé !')
  console.log('📧 Admin: admin@waxangari.com')
  console.log('🔑 Mot de passe: Admin@Waxangari2024')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
