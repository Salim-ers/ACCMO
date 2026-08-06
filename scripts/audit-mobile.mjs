import { chromium } from "playwright-core";

const BASE = "http://localhost:3000";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const VIEWPORTS = [
  { nom: "petit tel.  360x740", width: 360, height: 740, mobile: true },
  { nom: "iPhone      390x844", width: 390, height: 844, mobile: true },
  { nom: "grand tel.  430x932", width: 430, height: 932, mobile: true },
  { nom: "tabl. port. 768x1024", width: 768, height: 1024, mobile: true },
  { nom: "tabl. pays. 1024x768", width: 1024, height: 768, mobile: true },
];

const PAGES = ["/", "/horaires", "/annonces", "/la-mosquee", "/ecole",
                "/visite-virtuelle", "/contact", "/soutenir", "/mentions-legales"];

const browser = await chromium.launch({ executablePath: CHROME });
let problemes = 0;

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: 2,
  });
  console.log(`\n═══ ${vp.nom} ═══`);

  for (const path of PAGES) {
    const page = await ctx.newPage();
    const erreurs = [];
    page.on("pageerror", (e) => erreurs.push(e.message));
    await page.goto(BASE + path, { waitUntil: "networkidle" }).catch(() => {});

    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const vw = de.clientWidth;

      // Débordement horizontal : qui dépasse ?
      const coupables = [];
      for (const el of document.querySelectorAll("body *")) {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        const st = getComputedStyle(el);
        if (st.position === "fixed") continue;
        if (b.right > vw + 1 || b.left < -1) {
          coupables.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className?.toString?.() || "").slice(0, 70),
            left: Math.round(b.left), right: Math.round(b.right),
          });
        }
      }

      // Cibles tactiles trop petites
      const petites = [];
      for (const el of document.querySelectorAll("a[href], button, input, select")) {
        if (el.className?.toString?.().includes("sr-only")) continue;
        // Lien en plein texte : exempte par WCAG 2.2 (Target Size, exception « inline »).
        const par = el.closest("p, dd, li");
        if (par && par.querySelectorAll("a").length >= 1 && par.textContent.trim().length > el.textContent.trim().length + 25) continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        if (b.height < 24 || b.width < 24) {
          petites.push({ tag: el.tagName.toLowerCase(),
            txt: (el.textContent || "").trim().slice(0, 28),
            h: Math.round(b.height), w: Math.round(b.width) });
        }
      }

      // Texte minuscule
      const minuscule = new Set();
      for (const el of document.querySelectorAll("p,span,a,li,dt,dd,td,button,h1,h2,h3")) {
        if (!el.textContent?.trim()) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs && fs < 11) minuscule.add(`${el.tagName.toLowerCase()} ${fs}px "${el.textContent.trim().slice(0, 24)}"`);
      }

      // Contenu clippé par un parent en overflow:hidden
      const clippes = [];
      for (const el of document.querySelectorAll("[class*='overflow-hidden'], .frame")) {
        const pb = el.getBoundingClientRect();
        for (const c of el.children) {
          if (c.tagName === "IMG" || getComputedStyle(c).objectFit === "cover") continue;
          const cb = c.getBoundingClientRect();
          if (cb.height > pb.height + 2 && cb.height > 0 && pb.height > 0) {
            clippes.push({ parent: (el.className?.toString?.()||"").slice(0,45),
              debord: Math.round(cb.height - pb.height) });
          }
        }
      }

      return {
        scrollX: de.scrollWidth > vw + 1,
        scrollWidth: de.scrollWidth, vw,
        coupables: coupables.slice(0, 4),
        petites: petites.slice(0, 4),
        minuscule: [...minuscule].slice(0, 3),
        clippes: clippes.slice(0, 3),
      };
    });

    const soucis = [];
    if (r.scrollX) soucis.push(`DEBORDEMENT ${r.scrollWidth}px > ${r.vw}px`);
    if (r.coupables.length) soucis.push(`hors cadre: ${r.coupables.map(c=>c.tag+"."+c.cls.split(" ")[0]).join(", ")}`);
    if (r.petites.length) soucis.push(`cible <24px: ${r.petites.map(p=>`${p.tag}(${p.w}x${p.h})"${p.txt}"`).join(", ")}`);
    if (r.minuscule.length) soucis.push(`texte <11px: ${r.minuscule.join(" | ")}`);
    if (r.clippes.length) soucis.push(`contenu clippe: ${r.clippes.map(c=>c.debord+"px").join(", ")}`);
    if (erreurs.length) soucis.push(`erreur JS: ${erreurs[0].slice(0,60)}`);

    if (soucis.length) { problemes++; console.log(`  !! ${path}\n       ${soucis.join("\n       ")}`); }
    else console.log(`  OK ${path}`);
    await page.close();
  }
  await ctx.close();
}

await browser.close();
console.log(problemes ? `\n${problemes} page(s)/format(s) a corriger` : "\nAucun probleme detecte.");
