"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  X,
  User,
  BookOpen,
  FileText,
  ClipboardList,
} from "lucide-react";
import { WaxangariLogo } from "@/components/WaxangariLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const STORAGE_KEY = "wax_form_draft";

const schema = z.object({
  nom: z.string().min(2, "Nom requis (min 2 caractères)"),
  prenom: z.string().min(2, "Prénom requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().optional(),
  sexe: z.enum(["MASCULIN", "FEMININ", "AUTRE"]),
  dateNaissance: z.string().optional(),
  lieuProvenance: z.string().min(2, "Lieu requis"),
  ecoleUniversite: z.string().min(2, "École requise"),
  filiere: z.string().min(2, "Filière requise"),
  niveauEtude: z.string().optional(),
  typeStage: z.enum(["ACADEMIQUE", "PROFESSIONNEL"]),
  dureeMois: z.coerce.number().min(1).max(24),
  dateDebut: z.string().min(1, "Date de début requise"),
  dateFin: z.string().min(1, "Date de fin requise"),
  objetStage: z.string().min(10, "Objet requis (min 10 caractères)"),
});

type FormData = z.infer<typeof schema>;

const steps = [
  { id: 0, label: "Identité", icon: User },
  { id: 1, label: "Stage", icon: BookOpen },
  { id: 2, label: "CV", icon: Upload },
  { id: 3, label: "Récapitulatif", icon: ClipboardList },
];

const stepFields: (keyof FormData)[][] = [
  [
    "nom",
    "prenom",
    "email",
    "telephone",
    "sexe",
    "dateNaissance",
    "lieuProvenance",
  ],
  [
    "ecoleUniversite",
    "filiere",
    "niveauEtude",
    "typeStage",
    "dureeMois",
    "dateDebut",
    "dateFin",
    "objetStage",
  ],
  [],
  [],
];

export default function FormulaireInscription() {
  const [step, setStep] = useState(0);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvPreview, setCvPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: (() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      }
      return {};
    })(),
  });

  const formValues = watch();

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handler = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    const sub = watch((values) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const nextStep = async () => {
    const fields = stepFields[step];
    if (fields.length > 0) {
      const valid = await trigger(fields as any);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("CV trop volumineux (max 5Mo)");
      return;
    }
    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      toast.error("Format invalide (PDF, DOC, DOCX uniquement)");
      return;
    }
    setCvFile(file);
    setCvPreview(file.name);
    toast.success("CV chargé avec succès");
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) =>
        formData.append(k, String(v ?? "")),
      );
      if (cvFile) formData.append("cv", cvFile);
      const res = await fetch("/api/stagiaires", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur lors de la soumission");
      }
      localStorage.removeItem(STORAGE_KEY);
      setIsSuccess(true);
      toast.success("Inscription soumise avec succès !");
    } catch (e: any) {
      toast.error(e.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={400}
          colors={["#FF8200", "#4CAF18", "#FF9E00", "#6acd2f"]}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <CheckCircle2
              className="h-24 w-24 mx-auto mb-6"
              style={{ color: "#4CAF18" }}
            />
          </motion.div>
          <h2 className="font-display text-4xl mb-4">Inscription envoyée !</h2>
          <p className="text-muted-foreground mb-8">
            Notre équipe examinera votre dossier et vous contactera très
            prochainement.
          </p>
          <WaxangariLogo className="justify-center mx-auto" size="lg" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <WaxangariLogo className="mx-auto" size="lg" />
          <h1 className="font-display text-3xl md:text-4xl mb-2">
            Formulaire d'inscription
          </h1>
          <p className="text-muted-foreground">
            Rejoignez notre programme de stage en quelques étapes
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-10">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div
                  className={`flex items-center gap-2 flex-1 ${i > 0 ? "flex-col sm:flex-row" : ""}`}
                >
                  {i > 0 && (
                    <div
                      className={`h-0.5 flex-1 hidden sm:block transition-colors duration-300 ${done ? "bg-primary" : "bg-border"}`}
                    />
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                        active
                          ? "border-primary bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                          : done
                            ? "border-secondary bg-secondary text-white"
                            : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block ${active ? "text-primary" : done ? "text-secondary" : "text-muted-foreground"}`}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 0: Identité */}
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Informations
                    personnelles
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nom *</Label>
                      <Input
                        {...register("nom")}
                        placeholder="Ex: Adjovi"
                        className="mt-1.5"
                      />
                      {errors.nom && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.nom.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Prénom *</Label>
                      <Input
                        {...register("prenom")}
                        placeholder="Ex: Emmanuel"
                        className="mt-1.5"
                      />
                      {errors.prenom && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.prenom.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="email@exemple.com"
                      className="mt-1.5"
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Téléphone</Label>
                      <Input
                        {...register("telephone")}
                        placeholder="+229 XX XX XX XX"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Sexe *</Label>
                      <Select
                        onValueChange={(v) => setValue("sexe", v as any)}
                        defaultValue={getValues("sexe")}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MASCULIN">Masculin</SelectItem>
                          <SelectItem value="FEMININ">Féminin</SelectItem>
                          <SelectItem value="AUTRE">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.sexe && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.sexe.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Date de naissance</Label>
                      <Input
                        {...register("dateNaissance")}
                        type="date"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Lieu de provenance *</Label>
                      <Input
                        {...register("lieuProvenance")}
                        placeholder="Ex: Cotonou"
                        className="mt-1.5"
                      />
                      {errors.lieuProvenance && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.lieuProvenance.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Stage */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Informations
                    sur le stage
                  </h2>
                  <div>
                    <Label>École / Université *</Label>
                    <Input
                      {...register("ecoleUniversite")}
                      placeholder="Ex: Université de Parakou"
                      className="mt-1.5"
                    />
                    {errors.ecoleUniversite && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.ecoleUniversite.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Filière *</Label>
                      <Input
                        {...register("filiere")}
                        placeholder="Ex: Informatique de Gestion"
                        className="mt-1.5"
                      />
                      {errors.filiere && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.filiere.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Niveau d'étude</Label>
                      <Input
                        {...register("niveauEtude")}
                        placeholder="Ex: Licence 3"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Type de stage *</Label>
                      <Select
                        onValueChange={(v) => setValue("typeStage", v as any)}
                        defaultValue={getValues("typeStage")}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACADEMIQUE">Académique</SelectItem>
                          <SelectItem value="PROFESSIONNEL">
                            Professionnel
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.typeStage && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.typeStage.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Durée (mois) *</Label>
                      <Input
                        {...register("dureeMois")}
                        type="number"
                        min={1}
                        max={24}
                        placeholder="Ex: 3"
                        className="mt-1.5"
                      />
                      {errors.dureeMois && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.dureeMois.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Date de début *</Label>
                      <Input
                        {...register("dateDebut")}
                        type="date"
                        className="mt-1.5"
                      />
                      {errors.dateDebut && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.dateDebut.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Date de fin *</Label>
                      <Input
                        {...register("dateFin")}
                        type="date"
                        className="mt-1.5"
                      />
                      {errors.dateFin && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.dateFin.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Objet du stage *</Label>

                    <Textarea
                      {...register("objetStage")}
                      placeholder={`Décrivez brièvement l'objet de votre stage...

Ex : Stage en développement web`}
                      className="mt-1.5"
                      rows={4}
                    />

                    {errors.objetStage && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.objetStage.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: CV */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" /> Upload de votre
                    CV
                  </h2>
                  <label
                    className={`block cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 ${cvFile ? "border-secondary bg-secondary/5" : "border-border"}`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvUpload}
                      className="sr-only"
                    />
                    {cvFile ? (
                      <div className="flex flex-col items-center gap-3">
                        <FileText
                          className="h-12 w-12"
                          style={{ color: "#4CAF18" }}
                        />
                        <p className="font-semibold text-foreground">
                          {cvPreview}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Fichier chargé avec succès
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setCvFile(null);
                            setCvPreview(null);
                          }}
                          className="flex items-center gap-1 text-xs text-destructive hover:underline mt-2"
                        >
                          <X className="h-3 w-3" /> Supprimer
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">
                          Glissez votre CV ici ou cliquez
                        </p>
                        <p className="text-sm text-muted-foreground">
                          PDF, DOC, DOCX · Max 5 Mo
                        </p>
                      </div>
                    )}
                  </label>
                  <p className="text-sm text-muted-foreground text-center">
                    Le CV est optionnel mais recommandé pour optimiser votre
                    candidature.
                  </p>
                </div>
              )}

              {/* Step 3: Récapitulatif */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />{" "}
                    Récapitulatif
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        label: "Nom complet",
                        value: `${formValues.prenom} ${formValues.nom}`,
                      },
                      { label: "Email", value: formValues.email },
                      {
                        label: "Téléphone",
                        value: formValues.telephone || "—",
                      },
                      { label: "Sexe", value: formValues.sexe },
                      { label: "Lieu", value: formValues.lieuProvenance },
                      { label: "École", value: formValues.ecoleUniversite },
                      { label: "Filière", value: formValues.filiere },
                      { label: "Niveau", value: formValues.niveauEtude || "—" },
                      { label: "Type de stage", value: formValues.typeStage },
                      { label: "Durée", value: `${formValues.dureeMois} mois` },
                      { label: "Début", value: formValues.dateDebut },
                      { label: "Fin", value: formValues.dateFin },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          {label}
                        </p>
                        <p className="text-sm font-medium truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Objet du stage
                    </p>
                    <p className="text-sm font-medium">
                      {formValues.objetStage}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">CV</p>
                    <p className="text-sm font-medium">
                      {cvFile ? cvFile.name : "Aucun CV fourni"}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Précédent
            </Button>
            {step < 3 ? (
              <Button
                onClick={nextStep}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                Suivant <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                size="lg"
                className="gap-2"
                style={{
                  background: "linear-gradient(135deg, #FF8200, #4CAF18)",
                  border: "none",
                }}
              >
                {isSubmitting
                  ? "Envoi en cours..."
                  : "Soumettre mon inscription"}
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #FF8200, #4CAF18)" }}
            animate={{ width: `${((step + 1) / 4) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Étape {step + 1} sur 4
        </p>
      </div>
    </div>
  );
}
