"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Announcement } from "@/lib/announcements";
import { Icon } from "@/components/Icons";

type FormState = {
  id: string | null;
  title: string;
  body: string;
  date: string;
  image: string;
  link: string;
  linkLabel: string;
  featured: boolean;
  published: boolean;
};

const empty = (): FormState => ({
  id: null,
  title: "",
  body: "",
  date: new Date().toISOString().slice(0, 10),
  image: "",
  link: "",
  linkLabel: "",
  featured: false,
  published: true,
});

export default function AdminDashboard({ initial }: { initial: Announcement[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Announcement[]>(initial);
  const [form, setForm] = useState<FormState>(empty());
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function refresh() {
    const res = await fetch("/api/announcements", { cache: "no-store" });
    if (res.ok) setItems(await res.json());
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrors([]);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        setForm((f) => ({ ...f, image: data.url }));
      } else {
        setErrors([data.error || "Échec de l'envoi de l'image."]);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setBusy(true);
    const payload = {
      title: form.title,
      body: form.body,
      date: form.date,
      image: form.image,
      link: form.link,
      linkLabel: form.linkLabel,
      featured: form.featured,
      published: form.published,
    };
    const url = form.id ? `/api/announcements/${form.id}` : "/api/announcements";
    const method = form.id ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm(empty());
        await refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors(data.errors || [data.error || "Une erreur est survenue."]);
      }
    } finally {
      setBusy(false);
    }
  }

  function edit(a: Announcement) {
    setForm({
      id: a.id,
      title: a.title,
      body: a.body,
      date: a.date,
      image: a.image || "",
      link: a.link || "",
      linkLabel: a.linkLabel || "",
      featured: a.featured,
      published: a.published,
    });
    setErrors([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer définitivement cette annonce ?")) return;
    setErrors([]);
    const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    if (res.ok) {
      await refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setErrors([data.error || (data.errors?.[0] ?? "Suppression impossible.")]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Bascule rapide publier/dépublier ou à la une depuis la liste.
  async function toggle(a: Announcement, field: "published" | "featured") {
    setErrors([]);
    const res = await fetch(`/api/announcements/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...a, [field]: !a[field] }),
    });
    if (res.ok) {
      await refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setErrors([data.error || (data.errors?.[0] ?? "Modification impossible.")]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="container-x py-10">
      {/* En-tête */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-emerald-900">
            Gestion des annonces
          </h1>
          <p className="text-sm text-emerald-800/60">
            {items.length} annonce(s) · « Dépublier » masque l&apos;annonce du site mais la
            conserve (réactivable chaque année).
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" className="btn-ghost !py-2.5">Voir le site</a>
          <button onClick={logout} className="btn-primary !py-2.5">Déconnexion</button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Formulaire */}
        <form onSubmit={save} className="card h-fit p-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-emerald-900">
            {form.id ? "Modifier l'annonce" : "Nouvelle annonce"}
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium text-emerald-900">Titre</label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                maxLength={160}
                required
                className="w-full rounded-xl border border-emerald-900/15 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <label htmlFor="body" className="mb-1 block text-sm font-medium text-emerald-900">Contenu</label>
              <textarea
                id="body"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                maxLength={2000}
                rows={4}
                required
                className="w-full resize-y rounded-xl border border-emerald-900/15 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <label htmlFor="date" className="mb-1 block text-sm font-medium text-emerald-900">Date</label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="w-full rounded-xl border border-emerald-900/15 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            {/* Photo */}
            <div>
              <label className="mb-1 block text-sm font-medium text-emerald-900">Photo (optionnel)</label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-900/10 hover:bg-emerald-100">
                  {uploading ? "Envoi…" : "Choisir une image"}
                  <input type="file" accept="image/*" onChange={onUpload} disabled={uploading} className="hidden" />
                </label>
                {form.image && (
                  <button type="button" onClick={() => setForm({ ...form, image: "" })} className="text-xs text-red-600 hover:underline">
                    Retirer
                  </button>
                )}
              </div>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="…ou collez une URL d'image (https://…)"
                className="mt-2 w-full rounded-xl border border-emerald-900/15 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
              {form.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image} alt="Aperçu" className="mt-2 h-28 w-full rounded-lg object-cover ring-1 ring-emerald-900/10" />
              )}
            </div>

            {/* Lien */}
            <div>
              <label htmlFor="link" className="mb-1 block text-sm font-medium text-emerald-900">Lien (optionnel)</label>
              <input
                id="link"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://… (inscription, don, document…)"
                className="w-full rounded-xl border border-emerald-900/15 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
              <input
                value={form.linkLabel}
                onChange={(e) => setForm({ ...form, linkLabel: e.target.value })}
                maxLength={60}
                placeholder="Texte du bouton (ex. « S'inscrire »)"
                className="mt-2 w-full rounded-xl border border-emerald-900/15 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-emerald-900">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 accent-emerald-600"
              />
              Mettre en avant (à la une)
            </label>

            <label className="flex items-center gap-3 text-sm text-emerald-900">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="h-4 w-4 accent-emerald-600"
              />
              Publier immédiatement
            </label>

            {errors.length > 0 && (
              <ul role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {errors.map((er, i) => <li key={i}>{er}</li>)}
              </ul>
            )}

            <div className="flex gap-2">
              <button type="submit" disabled={busy} className="btn-primary flex-1 disabled:opacity-60">
                {busy ? "Enregistrement…" : form.id ? "Mettre à jour" : "Ajouter"}
              </button>
              {form.id && (
                <button type="button" onClick={() => setForm(empty())} className="btn-ghost">
                  Annuler
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Liste */}
        <div className="flex flex-col gap-3">
          {items.length === 0 && (
            <p className="card p-6 text-emerald-800/60">Aucune annonce. Créez-en une à gauche.</p>
          )}
          {items.map((a) => (
            <article key={a.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-emerald-900">{a.title}</h3>
                  {a.featured && (
                    <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[11px] font-semibold text-gold-600">À la une</span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${a.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {a.published ? "Publiée" : "Brouillon"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-emerald-800/70">{a.body}</p>
                <time className="mt-1 block text-xs text-emerald-600">{a.date}</time>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <button onClick={() => toggle(a, "published")} className="rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 ring-emerald-900/15 hover:bg-emerald-50" title={a.published ? "Dépublier" : "Publier"}>
                  {a.published ? "Dépublier" : "Publier"}
                </button>
                <button onClick={() => toggle(a, "featured")} className="rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 ring-emerald-900/15 hover:bg-emerald-50" title="À la une">
                  {a.featured ? "Retirer une" : "À la une"}
                </button>
                <button onClick={() => edit(a)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-sand-50 hover:bg-emerald-700">
                  Modifier
                </button>
                <button onClick={() => remove(a.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
