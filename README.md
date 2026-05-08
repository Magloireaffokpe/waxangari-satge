# Waxangari Labs - Gestion des Stagiaires

Plateforme complète d'inscription et de suivi des stagiaires de Waxangari Labs (Bénin).

---

## Stack technique
- **Next.js 14** (App Router) · TypeScript
- **Prisma** + **PostgreSQL** (Neon recommandé)
- **NextAuth.js** (Credentials)
- **Tailwind CSS** + **Shadcn/ui** + **Framer Motion**
- **Recharts** · **React Hook Form** + **Zod** · **Sonner**

---

## Installation rapide

### 1. Cloner et installer
```bash
git clone <votre-repo>
cd waxangari-labs
npm install
```

### 2. Configurer l'environnement
```bash
cp .env.example .env.local
# Éditez .env.local avec vos valeurs
```

### 3. Variables d'environnement

| Variable | Description | Requis |
|---|---|---|
| `DATABASE_URL` | URL PostgreSQL (Neon: `postgresql://...`) | ✅ |
| `NEXTAUTH_SECRET` | Secret JWT (générez avec `openssl rand -base64 32`) | ✅ |
| `NEXTAUTH_URL` | URL de l'app (`http://localhost:3000` en dev) | ✅ |
| `FIRST_ADMIN_KEY` | Clé secrète pour créer le premier admin | ✅ |
| `STORAGE_TYPE` | `local` (défaut) ou `vercel-blob` | ❌ |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob (si `STORAGE_TYPE=vercel-blob`) | ❌ |

### 4. Configurer Neon (PostgreSQL)
1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez un projet et copiez la `Connection string`
3. Collez-la dans `DATABASE_URL`

### 5. Migrer la base de données
```bash
npx prisma migrate dev --name init
```

### 6. (Optionnel) Peupler avec des données de test
```bash
npm run seed
```
→ Crée 28 stagiaires fictifs + 2 admins

**Identifiants admin de test :**
- Email: `admin@waxangari.com`
- Mot de passe: `Admin@Waxangari2024`

### 7. Lancer le serveur de développement
```bash
npm run dev
```

---

## Premier lancement en production

Si aucun admin n'existe encore :
1. Configurez `FIRST_ADMIN_KEY` dans `.env`
2. Rendez-vous sur `/setup`
3. Entrez la clé et créez votre Super Admin
4. La page `/setup` devient inaccessible une fois un admin créé

---

## Structure des URLs

| URL | Accès | Description |
|---|---|---|
| `/` | Public | Page d'accueil |
| `/formulaire` | Public | Formulaire d'inscription |
| `/admin/login` | Public | Connexion admin |
| `/admin/dashboard` | Admin | KPIs et graphiques |
| `/admin/stagiaires` | Admin | Liste paginée |
| `/admin/stagiaires/[id]` | Admin | Détail + édition |
| `/admin/admins` | Super Admin | Gestion des comptes |
| `/admin/logs` | Admin | Journaux d'activité |
| `/admin/profile` | Admin | Profil + mot de passe |
| `/setup` | Public (si 0 admin) | Première configuration |

---

## Stockage des CV

### Mode `local` (défaut)
Les CV sont enregistrés dans `public/uploads/`. Ce dossier doit être accessible en écriture. Sur un serveur avec Nginx, assurez-vous qu'il est servi statiquement.

### Mode `vercel-blob`
Installez le package : `npm install @vercel/blob`
Puis configurez `STORAGE_TYPE=vercel-blob` et `BLOB_READ_WRITE_TOKEN`.

---

## Déploiement Vercel

```bash
vercel deploy
```
Ajoutez les variables d'environnement dans le dashboard Vercel.
