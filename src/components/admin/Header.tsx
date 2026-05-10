"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, Moon, Sun, Bell, Settings, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [newCount, setNewCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [recentSignups, setRecentSignups] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Charger les nouvelles inscriptions depuis la dernière connexion de l'admin
  useEffect(() => {
    if (!session) return;

    const lastLogin = (session.user as any)?.lastLogin;
    const sinceDate = lastLogin
      ? new Date(lastLogin).toISOString()
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 derniers jours si premier login

    fetch(`/api/admin/notifications?since=${encodeURIComponent(sinceDate)}`)
      .then((r) => r.json())
      .then((d) => {
        setNewCount(d.count ?? 0);
        setRecentSignups(d.recent ?? []);
      })
      .catch(() => {});
  }, [session]);

  const user = session?.user as any;

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-3 sm:px-4 md:px-6">
      {/* Gauche — burger mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-accent transition-colors"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Spacer desktop */}
      <div className="hidden lg:block" />

      {/* Droite — actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Toggle dark/light */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Changer le thème"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Notifications — fonctionnelles */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="relative p-2 rounded-xl hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {newCount > 0 && (
                <span
                  className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: "#FF8200" }}
                >
                  {newCount > 9 ? "9+" : newCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Nouvelles inscriptions</span>
              {newCount > 0 && (
                <span
                  className="text-xs font-normal px-2 py-0.5 rounded-full text-white"
                  style={{ background: "#FF8200" }}
                >
                  {newCount} nouveau{newCount > 1 ? "x" : ""}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {recentSignups.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                Aucune nouvelle inscription
              </div>
            ) : (
              recentSignups.slice(0, 5).map((s: any) => (
                <DropdownMenuItem key={s.id} asChild className="cursor-pointer">
                  <a
                    href={`/admin/stagiaires/${s.id}`}
                    className="flex flex-col gap-0.5 px-3 py-2"
                  >
                    <span className="font-medium text-sm">
                      {s.prenom} {s.nom}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {s.ecoleUniversite}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.dateInscription).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </a>
                </DropdownMenuItem>
              ))
            )}

            {recentSignups.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a
                    href="/admin/stagiaires"
                    className="text-center text-sm text-primary w-full"
                  >
                    Voir tous les stagiaires →
                  </a>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar + menu utilisateur */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-2 pr-2 sm:pr-3 py-1.5 rounded-xl hover:bg-accent transition-colors">
              <div
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shrink-0"
                style={{
                  background: "linear-gradient(135deg, #FF8200, #4CAF18)",
                }}
              >
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-none">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-none">
                  {user?.isSuperAdmin ? "Super Admin" : "Admin"}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground font-normal truncate">
                {user?.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a
                href="/admin/profile"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4 w-4" /> Mon profil
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" /> Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
