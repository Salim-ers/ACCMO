import { chromium } from "playwright-core";

// =============================================================
// Audit responsive sur navigateur reel.
//
// Couvre la diversite reelle du parc : ecrans tres etroits, pliables,
// mode paysage a faible hauteur, tablettes, et agrandissement du texte.
//
//   npm run build && npm run start     (dans un terminal)
//   npm run audit:mobile               (dans un autre)
// =============================================================

const BASE = process.env.AUDIT_BASE || "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

/** Formats representatifs, du plus contraint au plus large. */
const FORMATS = [
  { nom: "Galaxy Fold ferme  280x653", w: 280, h: 653, mobile: true },
  { nom: "iPhone SE 1        320x568", w: 320, h: 568, mobile: true },
  { nom: "Android courant    360x640", w: 360, h: 640, mobile: true },
  { nom: "iPhone SE 2/3      375x667", w: 375, h: 667, mobile: true },
  { nom: "iPhone 13/14       390x844", w: 390, h: 844, mobile: true },
  { nom: "Pixel 8            412x915", w: 412, h: 915, mobile: true },
  { nom: "iPhone Pro Max     430x932", w: 430, h: 932, mobile: true },
  { nom: "telephone paysage  667x375", w: 667, h: 375, mobile: true },
  { nom: "iPhone paysage     844x390", w: 844, h: 390, mobile: true },
  { nom: "tablette portrait  768x1024", w: 768, h: 1024, mobile: true },
  { nom: "iPad Air portrait  820x1180", w: 820, h: 1180, mobile: true },
  { nom: "tablette paysage  1024x768", w: 1024, h: 768, mobile: true },
  { nom: "ordinateur        1280x800", w: 1280, h: 800, mobile: false },
];

const PAGES = [
  "/",
  "/horaires",
  "/annonces",
  "/la-mosquee",
  "/ecole",
  "/visite-virtuelle",
  "/contact",
  "/soutenir",
  "/mentions-legales",
  "/confidentialite",
  "/admin/login",
];

/** Mesures effectuees dans la page. */
function sonde() {
  const de = document.documentElement;
  const vw = de.clientWidth;
  const vh = de.clientHeight;

  // 1. Le contenu est-il atteignable, ou une surcouche le recouvre-t-elle ?
  const cible = document.elementFromPoint(vw / 2, vh / 2);
  const recouvrement = cible?.closest("main")
    ? null
    : { tag: cible?.tagName?.toLowerCase() || "?", id: cible?.closest("[id]")?.id || "" };

  // 2. Debordement horizontal, et qui en est responsable.
  const coupables = [];
  for (const el of document.querySelectorAll("body *")) {
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) continue;
    if (getComputedStyle(el).position === "fixed") continue;
    if (b.right > vw + 1 || b.left < -1) {
      const cls = el.className?.toString?.().split(" ")[0] || "";
      coupables.push(el.tagName.toLowerCase() + (cls ? "." + cls : ""));
    }
  }

  // 3. Cibles tactiles trop petites. Hors liens en plein texte, exemptes par
  //    WCAG 2.2, et hors lien d'evitement, visible au focus seulement.
  const petites = [];
  for (const el of document.querySelectorAll("a[href], button, input, select, textarea")) {
    if ((el.className?.toString?.() || "").includes("sr-only")) continue;
    const par = el.closest("p, dd, li");
    const texte = (el.textContent || "").trim();
    if (par && par.textContent.trim().length > texte.length + 25) continue;
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) continue;
    if (b.height < 24 || b.width < 24) {
      petites.push(
        el.tagName.toLowerCase() +
          "(" + Math.round(b.width) + "x" + Math.round(b.height) + ")" +
          JSON.stringify(texte.slice(0, 22))
      );
    }
  }

  // 4. Texte trop petit pour etre lu confortablement.
  const minuscule = new Set();
  for (const el of document.querySelectorAll(
    "p,span,a,li,dt,dd,td,button,h1,h2,h3,label"
  )) {
    const t = el.textContent?.trim();
    if (!t) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs && fs < 11) minuscule.add(fs + "px " + JSON.stringify(t.slice(0, 20)));
  }

  // 5. Contenu rogne par un parent. Une image en object-fit: cover est
  //    volontairement plus grande que son cadre : on l'ignore.
  const clippes = [];
  for (const el of document.querySelectorAll("[class*='overflow-hidden'], .frame")) {
    const pb = el.getBoundingClientRect();
    if (pb.height === 0) continue;
    for (const c of el.children) {
      if (c.tagName === "IMG" || getComputedStyle(c).objectFit === "cover") continue;
      const cb = c.getBoundingClientRect();
      if (cb.height > pb.height + 2) clippes.push(Math.round(cb.height - pb.height) + "px");
    }
  }

  // 6. Un mot trop long peut forcer une largeur incompressible.
  const tropLarges = [];
  for (const el of document.querySelectorAll("h1,h2,h3,p,dt,dd,span,a")) {
    if (el.children.length) continue;
    if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2) {
      const st = getComputedStyle(el);
      if (st.overflow === "visible" && st.textOverflow !== "ellipsis") {
        tropLarges.push(
          el.tagName.toLowerCase() +
            " " + JSON.stringify(el.textContent.trim().slice(0, 22)) +
            " (+" + (el.scrollWidth - el.clientWidth) + "px)"
        );
      }
    }
  }

  return {
    recouvrement,
    scrollX: de.scrollWidth > vw + 1,
    largeurDoc: de.scrollWidth,
    vw,
    coupables: [...new Set(coupables)].slice(0, 4),
    petites: petites.slice(0, 4),
    minuscule: [...minuscule].slice(0, 3),
    clippes: clippes.slice(0, 3),
    tropLarges: tropLarges.slice(0, 3),
  };
}

/** Analyse une page et renvoie la liste des soucis constates. */
async function analyser(ctx, chemin) {
  const page = await ctx.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(e.message.slice(0, 60)));
  page.on("response", (r) => {
    if (r.status() >= 400 && !r.url().includes("_rsc")) {
      erreurs.push(r.status() + " " + r.url().replace(BASE, "").slice(0, 44));
    }
  });

  try {
    await page.goto(BASE + chemin, { waitUntil: "networkidle", timeout: 30000 });
  } catch {
    // Reseau lent : on mesure quand meme l'etat atteint.
  }

  const r = await page.evaluate(sonde).catch(() => null);
  const soucis = [];
  if (!r) soucis.push("page non mesurable");
  else {
    if (r.recouvrement) {
      soucis.push(
        "CONTENU RECOUVERT par <" +
          r.recouvrement.tag +
          (r.recouvrement.id ? " #" + r.recouvrement.id : "") +
          ">"
      );
    }
    if (r.scrollX) soucis.push("DEBORDEMENT " + r.largeurDoc + "px > " + r.vw + "px");
    if (r.coupables.length) soucis.push("hors cadre : " + r.coupables.join(", "));
    if (r.tropLarges.length)
      soucis.push("texte plus large que son bloc : " + r.tropLarges.join(" | "));
    if (r.petites.length) soucis.push("cible <24px : " + r.petites.join(", "));
    if (r.minuscule.length) soucis.push("texte <11px : " + r.minuscule.join(" | "));
    if (r.clippes.length) soucis.push("contenu rogne : " + r.clippes.join(", "));
  }
  if (erreurs.length) {
    soucis.push("console : " + [...new Set(erreurs)].slice(0, 3).join(" | "));
  }
  await page.close();
  return soucis;
}

/** Ouverture, defilement et fermeture du menu plein ecran. */
async function verifierMenu(ctx) {
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" }).catch(() => {});

  const ferme = await page.evaluate(
    () => getComputedStyle(document.getElementById("menu-principal")).display
  );
  await page
    .getByRole("button", { name: /Ouvrir le menu/i })
    .click({ timeout: 8000 })
    .catch(() => {});
  await page.waitForTimeout(350);

  const m = await page.evaluate(() => {
    const el = document.getElementById("menu-principal");
    const liens = [...el.querySelectorAll("a")];
    const dernier = liens[liens.length - 1]?.getBoundingClientRect();
    const defilable = el.scrollHeight > el.clientHeight + 1;
    return {
      display: getComputedStyle(el).display,
      defilable,
      hautContenu: el.scrollHeight,
      hautVisible: el.clientHeight,
      // Soit tout tient a l'ecran, soit le panneau defile pour y acceder.
      dernierAtteignable:
        !!dernier && (defilable || dernier.bottom <= el.clientHeight + 2),
    };
  });

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const apres = await page.evaluate(
    () => getComputedStyle(document.getElementById("menu-principal")).display
  );
  await page.close();

  const ko = [];
  if (ferme !== "none") ko.push("ferme mais display=" + ferme);
  if (m.display !== "flex") ko.push("ouvert mais display=" + m.display);
  if (!m.dernierAtteignable) {
    ko.push(
      "dernier lien hors d'atteinte (" + m.hautContenu + "px pour " + m.hautVisible + "px)"
    );
  }
  if (apres !== "none") ko.push("Echap ne referme pas (display=" + apres + ")");
  return { ko, defilable: m.defilable };
}

const navigateur = await chromium.launch({ executablePath: CHROME });
let problemes = 0;

for (const f of FORMATS) {
  const ctx = await navigateur.newContext({
    viewport: { width: f.w, height: f.h },
    isMobile: f.mobile,
    hasTouch: f.mobile,
    deviceScaleFactor: f.mobile ? 2 : 1,
  });
  console.log("\n=== " + f.nom + " ===");

  for (const chemin of PAGES) {
    const soucis = await analyser(ctx, chemin);
    if (soucis.length) {
      problemes++;
      console.log("  KO " + chemin);
      soucis.forEach((s) => console.log("       " + s));
    } else {
      console.log("  ok " + chemin);
    }
  }

  if (f.w < 1024) {
    const { ko, defilable } = await verifierMenu(ctx);
    if (ko.length) {
      problemes++;
      console.log("  KO menu mobile : " + ko.join(" - "));
    } else {
      console.log(
        "  ok menu mobile (ouvre, " +
          (defilable ? "defile" : "tient a l'ecran") +
          ", Echap referme)"
      );
    }
  }

  await ctx.close();
}

// --- Agrandissement du texte : exigence WCAG, courante chez les seniors ---
console.log("\n=== texte agrandi 200% (390x844) ===");
const ctxZoom = await navigateur.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
for (const chemin of ["/", "/horaires", "/contact", "/soutenir"]) {
  const page = await ctxZoom.newPage();
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      document.documentElement.style.fontSize = "32px"; // 200 % de 16 px
    });
  });
  await page.goto(BASE + chemin, { waitUntil: "networkidle" }).catch(() => {});
  const r = await page.evaluate(sonde).catch(() => null);
  const soucis = [];
  if (r?.scrollX) soucis.push("DEBORDEMENT " + r.largeurDoc + "px > " + r.vw + "px");
  if (r?.coupables.length) soucis.push("hors cadre : " + r.coupables.join(", "));
  if (r?.tropLarges.length)
    soucis.push("texte plus large que son bloc : " + r.tropLarges.join(" | "));
  if (soucis.length) {
    problemes++;
    console.log("  KO " + chemin);
    soucis.forEach((s) => console.log("       " + s));
  } else {
    console.log("  ok " + chemin);
  }
  await page.close();
}
await ctxZoom.close();

await navigateur.close();
console.log(problemes ? "\n" + problemes + " point(s) a corriger" : "\nAucun probleme detecte.");
