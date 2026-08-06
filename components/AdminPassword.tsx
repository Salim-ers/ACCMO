"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Changement du mot de passe de l'administration.
//
// Le nouveau mot de passe est envoyé au serveur, qui le stocke haché. La
// session est fermée dans la foulée : un changement fait souvent suite à une
// fuite, et il ne doit rester aucune session ouverte derrière.

const field =
  "w-full border border-[var(--rule-strong)] bg-white px-3 py-2.5 text-[15px] text-night-900 outline-none transition-colors focus:border-night-900";
const label = "mb-1.5 block text-[12px] font-bold uppercase tracking-[0.1em] text-night-600";

const MIN = 10;

export default function AdminPassword() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    if (next !== confirm) {
      setErrors(["Les deux nouveaux mots de passe ne correspondent pas."]);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.errors || [data.error || "Changement impossible."]);
        return;
      }
      setDone(true);
      setCurrent("");
      setNext("");
      setConfirm("");
      // La session vient d'être fermée par le serveur : on renvoie au formulaire.
      setTimeout(() => {
        router.push("/admin/login");
        router.refresh();
      }, 2200);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <section className="border-l-4 border-night-900 bg-night-100 p-6" role="status">
        <h2 className="text-[17px] font-extrabold tracking-tight text-night-900">
          Mot de passe modifié
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-night-700">
          Votre session a été fermée par sécurité. Reconnectez-vous avec le nouveau mot
          de passe — vous allez être redirigé.
        </p>
      </section>
    );
  }

  return (
    <section className="border border-[var(--rule)] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-extrabold tracking-tight text-night-900">
            Mot de passe
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-night-600">
            Il protège la seule porte d’entrée du site. Changez-le si vous l’avez
            communiqué à quelqu’un qui n’en a plus besoin.
          </p>
        </div>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn btn-outline shrink-0 !min-h-[40px] !px-4 !text-[13.5px]"
          >
            Modifier
          </button>
        )}
      </div>

      {open && (
        <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
          <div>
            <label htmlFor="pwd-actuel" className={label}>
              Mot de passe actuel
            </label>
            <input
              id="pwd-actuel"
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
              className={field}
            />
          </div>

          <div>
            <label htmlFor="pwd-nouveau" className={label}>
              Nouveau mot de passe
            </label>
            <input
              id="pwd-nouveau"
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              minLength={MIN}
              required
              aria-describedby="pwd-aide"
              className={field}
            />
            <p id="pwd-aide" className="mt-1.5 text-[12.5px] text-night-600">
              {MIN} caractères minimum. Une phrase dont vous vous souvenez vaut mieux
              qu’un mot court compliqué.
            </p>
          </div>

          <div>
            <label htmlFor="pwd-confirme" className={label}>
              Répéter le nouveau mot de passe
            </label>
            <input
              id="pwd-confirme"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className={field}
            />
          </div>

          {errors.length > 0 && (
            <ul
              role="alert"
              className="border-l-2 border-terra-600 bg-terra-100 px-4 py-3 text-[14px] text-terra-700"
            >
              {errors.map((er, i) => (
                <li key={i}>{er}</li>
              ))}
            </ul>
          )}

          <div className="flex gap-2">
            <button type="submit" disabled={busy} className="btn btn-primary flex-1 disabled:opacity-60">
              {busy ? "Enregistrement…" : "Changer le mot de passe"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setErrors([]);
              }}
              className="btn btn-outline"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
