import { z } from 'zod'

export const stagiaireSchema = z.object({
  nom: z.string().min(2, 'Nom requis'),
  prenom: z.string().min(2, 'Prénom requis'),
  email: z.string().email('Email invalide'),
  telephone: z.string().optional(),
  sexe: z.enum(['MASCULIN', 'FEMININ', 'AUTRE']),
  dateNaissance: z.string().optional(),
  lieuProvenance: z.string().min(2, 'Lieu requis'),
  ecoleUniversite: z.string().min(2, 'École requise'),
  filiere: z.string().min(2, 'Filière requise'),
  niveauEtude: z.string().optional(),
  typeStage: z.enum(['ACADEMIQUE', 'PROFESSIONNEL']),
  dureeMois: z.number().min(1).max(24),
  dateDebut: z.string(),
  dateFin: z.string(),
  objetStage: z.string().min(10, 'Objet du stage requis (min 10 caractères)'),
  cvUrl: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const createAdminSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8, 'Au moins 8 caractères').regex(/[A-Z]/, 'Une majuscule').regex(/[0-9]/, 'Un chiffre'),
  isSuperAdmin: z.boolean().optional(),
})

export const updateStagiaireSchema = z.object({
  statutAvancement: z.enum(['EN_COURS', 'TERMINE']).optional(),
  commentaireInterne: z.string().optional(),
  dateFinReelle: z.string().optional(),
})
