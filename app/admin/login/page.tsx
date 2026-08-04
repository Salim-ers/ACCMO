"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES, SITE } from "@/lib/site";
import { Icon } from "@/components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Connexion impossible.");
      }
    } catch {
      setError("Connexion au serveur impossible. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col justify-center bg-[var(--color-surface)] px-5 py-12">
      <div className="mx-auto w-full max-w-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-terra-600">
          {SITE.shortName} · {SITE.association}
        </p>
        <h1 className="title-md mt-3 text-night-900">Espace d’administration</h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-night-600">
          Gestion des annonces publiées sur le site de la mosquée.
        </p>

        <form onSubmit={submit} className="mt-8 border-t border-[var(--rule-strong)] pt-6">
          <label
            htmlFor="pwd"
            className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.1em] text-night-600"
          >
            Mot de passe
          </label>
          <input
            id="pwd"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-describedby={error ? "login-error" : undefined}
            className="w-full border border-[var(--rule-strong)] bg-white px-4 py-3 text-[16px] text-night-900 outline-none transition-colors focus:border-night-900"
          />

          {error && (
            <p
              id="login-error"
              role="alert"
              className="mt-3 border-l-2 border-terra-600 bg-terra-100 px-4 py-3 text-[14px] text-terra-700"
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary mt-5 w-full disabled:opacity-60">
            {loading ? "Connexion…" : "Se connecter"}
            <Icon.arrow width={16} height={16} className="arw" />
          </button>
        </form>

        <Link href={ROUTES.home} className="link-arrow mt-8 inline-flex">
          Retour au site
        </Link>
      </div>
    </main>
  );
}
