"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Announcement, StoreStatus } from "@/lib/announcements";
import { CATEGORIES, DEFAULT_CATEGORY, type Category } from "@/lib/categories";
import { ROUTES } from "@/lib/site";

type FormState = {
  id: string | null;
  title: string;
  body: string;
  date: string;
  category: Category;
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
  category: DEFAULT_CATEGORY,
  image: "",
  link: "",
  linkLabel: "",
  featured: false,
  published: true,
});

const field =
  "w-full border border-[var(--rule-strong)] bg-white px-3 py-2.5 text-[15px] text-night-900 outline-none transition-colors focus:border-night-900";
const label = "mb-1.5 block text-[12px] font-bold uppercase tracking-[0.1em] text-night-600";

export default function AdminDashboard({ initial }: { initial: Announcement[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Announcement[]>(initial);
  const [form, setForm] = useState<FormState>(empty());
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aidEnabled, setAidEnabled] = useState(false);
  const [store, setStore] = useState<StoreStatus | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => setAidEnabled(!!s?.aidEnabled))
      .catch(() => {});

    // État réel du stockage : prévenir avant un enregistrement perdu.
    fetch("/api/storage-status")
      .then((r) => (r.ok ? r.json() : null))
      .then((s: StoreStatus | null) => setStore(s))
      .catch(() => {});
  }, []);

  async function toggleAid(value: boolean) {
    setAidEnabled(value); // optimiste
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aidEnabled: value }),
    });
    if (!res.ok) {
      setAidEnabled(!value); // rollback
      const data = await res.json().catch(() => ({}));
      setErrors([data.error || "Réglage non enregistré."]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Les mutations renvoient la liste complete a jour : on l'applique telle
  // quelle. Une relecture immediate pourrait retomber sur une copie en cache
  // (le Blob Store est a coherence differee) et afficher un etat perime.
  function applyList(data: unknown) {
    const items = (data as { items?: Announcement[] })?.items;
    if (Array.isArray(items)) setItems(items);
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
      category: form.category,
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
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setForm(empty());
        applyList(data);
      } else {
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
      category: a.category ?? DEFAULT_CATEGORY,
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
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      applyList(data);
    } else {
      setErrors([data.error || (data.errors?.[0] ?? "Suppression impossible.")]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Bascule rapide publier/dépublier ou à la une depuis la liste.
  async function toggle(a: Announcement, key: "published" | "featured") {
    setErrors([]);
    const res = await fetch(`/api/announcements/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...a, [key]: !a[key] }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      applyList(data);
    } else {
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
    <div className="shell py-10">
      {/* En-tête */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--rule)] pb-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-terra-600">
            Espace d’administration
          </p>
          <h1 className="title-md mt-2 text-night-900">Annonces de la mosquée</h1>
          <p className="mt-2 text-[14px] text-night-600">
            {items.length} annonce(s) · «&nbsp;Dépublier&nbsp;» retire l’annonce du site sans
            la supprimer.
          </p>
          {store?.ok && (
            <p className="mt-1 flex items-center gap-2 text-[12.5px] text-night-500">
              <span className="h-1.5 w-1.5 shrink-0 bg-night-600" aria-hidden />
              Enregistrement actif — {store.label}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <a href={ROUTES.home} target="_blank" rel="noopener noreferrer" className="btn btn-outline !min-h-[42px]">
            Voir le site
          </a>
          <button type="button" onClick={logout} className="btn btn-primary !min-h-[42px]">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Alerte de stockage — n'apparaît que si quelque chose cloche. */}
      {store && !store.ok && (
        <div
          role="alert"
          className="mb-8 border-l-4 border-terra-600 bg-terra-100 p-5"
        >
          <p className="text-[15px] font-extrabold tracking-tight text-terra-700">
            Les annonces ne peuvent pas être enregistrées
          </p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-night-800">{store.hint}</p>
          <p className="mt-2 text-[13px] text-night-600">
            Le site public reste en ligne et affiche les rendez-vous récurrents ;
            seules les annonces gérées depuis cette page sont concernées.
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <div className="flex flex-col gap-6">
          {/* Réglages du site */}
          <section className="border border-[var(--rule)] bg-white p-6">
            <h2 className="text-[17px] font-extrabold tracking-tight text-night-900">
              Réglages du site
            </h2>
            <label className="mt-4 flex items-start gap-3 text-[14.5px] text-night-800">
              <input
                type="checkbox"
                checked={aidEnabled}
                onChange={(e) => toggleAid(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#c66f4e]"
              />
              <span>
                Afficher le service <strong>Aïd — Commande de mouton</strong>
                <span className="mt-1 block text-[13px] text-night-600">
                  À cocher chaque année à l’approche de l’Aïd, puis à décocher ensuite.
                </span>
              </span>
            </label>
          </section>

          {/* Formulaire */}
          <form onSubmit={save} className="h-fit border border-[var(--rule)] bg-white p-6">
            <h2 className="mb-5 text-[17px] font-extrabold tracking-tight text-night-900">
              {form.id ? "Modifier l’annonce" : "Nouvelle annonce"}
            </h2>

            <div className="flex flex-col gap-5">
              <div>
                <label htmlFor="title" className={label}>
                  Titre
                </label>
                <input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  maxLength={160}
                  required
                  className={field}
                />
              </div>

              <div>
                <label htmlFor="body" className={label}>
                  Contenu
                </label>
                <textarea
                  id="body"
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  maxLength={2000}
                  rows={4}
                  required
                  className={`${field} resize-y`}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className={label}>
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="category" className={label}>
                    Rubrique
                  </label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as Category })
                    }
                    className={field}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo */}
              <div>
                <span className={label}>Photo (optionnel)</span>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer border border-[var(--rule-strong)] bg-sand-100 px-3 py-2 text-[13.5px] font-semibold text-night-800 transition-colors hover:bg-sand-200">
                    {uploading ? "Envoi…" : "Choisir une image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="text-[13px] font-semibold text-terra-700 underline underline-offset-4"
                    >
                      Retirer
                    </button>
                  )}
                </div>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="…ou collez une URL d’image (https://…)"
                  aria-label="URL de l’image"
                  className={`${field} mt-2 !text-[14px]`}
                />
                {form.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.image}
                    alt="Aperçu de l’image de l’annonce"
                    className="mt-2 h-28 w-full border border-[var(--rule)] object-cover"
                  />
                )}
              </div>

              {/* Lien */}
              <div>
                <label htmlFor="link" className={label}>
                  Lien (optionnel)
                </label>
                <input
                  id="link"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://… (inscription, don, document…)"
                  className={field}
                />
                <input
                  value={form.linkLabel}
                  onChange={(e) => setForm({ ...form, linkLabel: e.target.value })}
                  maxLength={60}
                  placeholder="Texte du bouton (ex. « S’inscrire »)"
                  aria-label="Texte du bouton de lien"
                  className={`${field} mt-2 !text-[14px]`}
                />
              </div>

              <div className="flex flex-col gap-2.5 border-t border-[var(--rule)] pt-4">
                <label className="flex items-center gap-3 text-[14.5px] text-night-800">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="h-4 w-4 accent-[#c66f4e]"
                  />
                  Mettre à la une (grand bloc de l’agenda)
                </label>
                <label className="flex items-center gap-3 text-[14.5px] text-night-800">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="h-4 w-4 accent-[#c66f4e]"
                  />
                  Publier immédiatement
                </label>
              </div>

              {errors.length > 0 && (
                <ul role="alert" className="border-l-2 border-terra-600 bg-terra-100 px-4 py-3 text-[14px] text-terra-700">
                  {errors.map((er, i) => (
                    <li key={i}>{er}</li>
                  ))}
                </ul>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="btn btn-primary flex-1 disabled:opacity-60"
                >
                  {busy ? "Enregistrement…" : form.id ? "Mettre à jour" : "Ajouter"}
                </button>
                {form.id && (
                  <button type="button" onClick={() => setForm(empty())} className="btn btn-outline">
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Liste */}
        <div className="flex flex-col gap-2.5">
          {items.length === 0 && (
            <p className="border border-[var(--rule)] bg-white p-6 text-[15px] text-night-600">
              Aucune annonce pour l’instant. Créez-en une avec le formulaire à gauche.
            </p>
          )}
          {items.map((a) => (
            <article
              key={a.id}
              className="flex flex-col gap-4 border border-[var(--rule)] bg-white p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[17px] font-extrabold tracking-tight text-night-900">
                    {a.title}
                  </h3>
                  {a.featured && (
                    <span className="tag bg-terra-600 text-white">À la une</span>
                  )}
                  <span
                    className={`tag ${
                      a.published ? "bg-night-900 text-sand-100" : "bg-night-100 text-night-600"
                    }`}
                  >
                    {a.published ? "Publiée" : "Brouillon"}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-night-600">
                  {a.body}
                </p>
                <p className="tabular mt-1.5 text-[12.5px] text-night-500">
                  {a.date} · {a.category ?? DEFAULT_CATEGORY}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggle(a, "published")}
                  className="border border-[var(--rule-strong)] px-3 py-2 text-[12.5px] font-semibold text-night-800 transition-colors hover:bg-sand-100"
                >
                  {a.published ? "Dépublier" : "Publier"}
                </button>
                <button
                  type="button"
                  onClick={() => toggle(a, "featured")}
                  className="border border-[var(--rule-strong)] px-3 py-2 text-[12.5px] font-semibold text-night-800 transition-colors hover:bg-sand-100"
                >
                  {a.featured ? "Retirer de la une" : "Mettre à la une"}
                </button>
                <button
                  type="button"
                  onClick={() => edit(a)}
                  className="bg-night-900 px-3 py-2 text-[12.5px] font-semibold text-sand-50 transition-colors hover:bg-night-700"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="border border-terra-500 px-3 py-2 text-[12.5px] font-semibold text-terra-700 transition-colors hover:bg-terra-100"
                >
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
