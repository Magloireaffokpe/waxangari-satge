"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAdminSchema } from "@/lib/validations";
import { z } from "zod";
import {
  Plus,
  Trash2,
  ShieldCheck,
  Shield,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatDateTime } from "@/lib/utils";

type CreateAdminData = z.infer<typeof createAdminSchema>;

export default function AdminsPage() {
  const { data: session } = useSession();
  const isSuperAdmin = (session?.user as any)?.isSuperAdmin;
  const currentId = (session?.user as any)?.id;
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAdminData>({
    resolver: zodResolver(createAdminSchema),
  });

  const fetchAdmins = () => {
    setLoading(true);
    fetch("/api/admin/admins")
      .then((r) => r.json())
      .then((d) => {
        setAdmins(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (isSuperAdmin) fetchAdmins();
  }, [isSuperAdmin]);

  const createAdmin = async (data: CreateAdminData) => {
    setCreating(true);
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success("Admin créé avec succès");
      setCreateOpen(false);
      reset();
      fetchAdmins();
    } else {
      const e = await res.json();
      toast.error(e.error || "Erreur");
    }
    setCreating(false);
  };

  const deleteAdmin = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/admins/${deleteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Admin supprimé");
      setDeleteId(null);
      fetchAdmins();
    } else {
      const e = await res.json();
      toast.error(e.error || "Erreur");
    }
  };

  if (!isSuperAdmin)
    return (
      <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center px-4">
        <Lock className="h-14 w-14 sm:h-16 sm:w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-lg sm:text-xl font-bold mb-2">Accès réservé</h2>
        <p className="text-sm text-muted-foreground">
          Seul le Super Admin peut gérer les administrateurs.
        </p>
      </div>
    );

  return (
    <div className="space-y-4 sm:space-y-5 max-w-3xl">
      {/* En-tête — responsive */}
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Administrateurs</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {admins.length} compte{admins.length > 1 ? "s" : ""}
          </p>
        </div>
        {/* Bouton compact sur mobile */}
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #FF8200, #4CAF18)" }}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">Ajouter un admin</span>
          <span className="xs:hidden">Ajouter</span>
        </button>
      </div>

      {/* Liste des admins */}
      <div className="space-y-3">
        {loading
          ? [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))
          : admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 sm:p-4 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{
                      background: admin.isSuperAdmin
                        ? "linear-gradient(135deg, #FF8200, #FF9E00)"
                        : "linear-gradient(135deg, #4CAF18, #6acd2f)",
                    }}
                  >
                    {admin.name[0].toUpperCase()}
                  </div>

                  {/* Infos */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm truncate max-w-[120px] sm:max-w-none">
                        {admin.name}
                      </span>
                      {admin.isSuperAdmin ? (
                        <Badge variant="warning" className="gap-1 text-xs">
                          <ShieldCheck className="h-3 w-3" /> Super Admin
                        </Badge>
                      ) : (
                        <Badge variant="info" className="gap-1 text-xs">
                          <Shield className="h-3 w-3" /> Admin
                        </Badge>
                      )}
                      {String(admin.id) === String(currentId) && (
                        <Badge variant="outline" className="text-xs">
                          Vous
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {admin.email}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Créé le {formatDate(admin.createdAt)} ·{" "}
                      {admin.lastLogin
                        ? formatDateTime(admin.lastLogin)
                        : "Jamais connecté"}
                    </p>
                  </div>
                </div>

                {String(admin.id) !== String(currentId) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-destructive shrink-0 h-8 w-8"
                    onClick={() => setDeleteId(admin.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
      </div>

      {/* Dialog création */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvel administrateur</DialogTitle>
            <DialogDescription>
              Créez un compte admin pour votre équipe.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(createAdmin)} className="space-y-4 mt-2">
            <div>
              <Label>Nom complet</Label>
              <Input
                {...register("name")}
                placeholder="Ex: Magloire Affokpe"
                className="mt-1.5"
              />
              {errors.name && (
                <p className="text-destructive text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label>Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="admin@waxangari.com"
                className="mt-1.5"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label>Mot de passe</Label>
              <div className="relative mt-1.5">
                <Input
                  {...register("password")}
                  type={showPwd ? "text" : "password"}
                  placeholder="Min. 8 caractères"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl font-semibold text-sm text-white disabled:opacity-60 transition-all"
                style={{
                  background: "linear-gradient(135deg, #FF8200, #4CAF18)",
                }}
              >
                {creating ? "Création..." : "Créer le compte"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog suppression */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;administrateur ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. L&apos;admin perdra tout accès.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={deleteAdmin}
              className="flex-1"
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
