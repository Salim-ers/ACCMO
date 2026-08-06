"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Déconnexion automatique après une période sans activité.
//
// Le cookie de session disparaît déjà à la fermeture du navigateur ; ce
// garde-fou traite l'autre cas, plus fréquent : l'onglet resté ouvert sur un
// poste partagé. Un avertissement précède la déconnexion, pour ne jamais
// perdre une annonce en cours de saisie sans prévenir.

const IDLE_MS = 30 * 60 * 1000; // 30 minutes sans activité
const WARN_MS = 2 * 60 * 1000; // avertissement 2 minutes avant

export default function AdminIdleLogout() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const warnAt = useRef<number>(0);
  const logoutAt = useRef<number>(0);

  const reset = useCallback(() => {
    const now = Date.now();
    warnAt.current = now + IDLE_MS - WARN_MS;
    logoutAt.current = now + IDLE_MS;
    setSecondsLeft(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Même si l'appel échoue, on quitte la page : le jeton finira par expirer.
    }
    router.push("/admin/login");
    router.refresh();
  }, [router]);

  useEffect(() => {
    reset();

    const events = ["mousedown", "keydown", "wheel", "touchstart", "focus"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));

    const tick = window.setInterval(() => {
      const now = Date.now();
      if (now >= logoutAt.current) {
        void logout();
        return;
      }
      setSecondsLeft(now >= warnAt.current ? Math.ceil((logoutAt.current - now) / 1000) : null);
    }, 1000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      window.clearInterval(tick);
    };
  }, [reset, logout]);

  if (secondsLeft === null) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-terra-600 bg-terra-100 px-[var(--gutter)] py-4"
    >
      <div className="shell flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14.5px] text-night-800">
          <strong className="font-bold">Déconnexion imminente</strong> — sans activité de
          votre part, la session se fermera dans{" "}
          <span className="tabular font-bold">{secondsLeft}&nbsp;s</span>. Vos saisies non
          enregistrées seraient perdues.
        </p>
        <button type="button" onClick={reset} className="btn btn-primary shrink-0 !min-h-[42px]">
          Rester connecté
        </button>
      </div>
    </div>
  );
}
