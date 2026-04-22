"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data, isPending, error } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !data) router.replace("/login");
  }, [isPending, data, router]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-red-400">
        {error.message ?? "Erreur de chargement de la session"}
      </div>
    );
  }

  if (!data) return null;

  const { user, session } = data;

  const rows: Array<[string, string | null | undefined]> = [
    ["Nom", user.name],
    ["Email", user.email],
    ["Nom d'utilisateur", user.username],
    ["Email vérifié", user.emailVerified ? "oui" : "non"],
    ["Rôle système", user.role ?? "—"],
    ["2FA activé", user.twoFactorEnabled ? "oui" : "non"],
    ["ID", user.id],
    ["Créé le", new Date(user.createdAt).toLocaleString("fr-FR")],
    ["Organisation active", session.activeOrganizationId ?? "—"],
    ["Session expire", new Date(session.expiresAt).toLocaleString("fr-FR")],
  ];

  return (
    <div className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-2">
          <h1 className="font-serif text-3xl font-light">Profil</h1>
          <p className="text-sm text-muted-foreground">
            Informations de votre compte et de votre session.
          </p>
        </header>

        <dl className="divide-y divide-border rounded-xl border bg-card">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-6 px-5 py-3 text-sm"
            >
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-mono text-right break-all">{value ?? "—"}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={async () => {
            await authClient.signOut();
            router.replace("/login");
          }}
          className="h-10 rounded-lg border border-border px-4 text-sm hover:bg-accent transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
