import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/**
 * Modular translation system (inspired by the KPU website concept).
 *
 * Every file in ./modules exports a default object shaped like:
 *   { en: { ns: {...} }, da: { ns: {...} }, ps: { ns: {...} } }
 *
 * They are auto-discovered with Vite's import.meta.glob and deep-merged per
 * language, so a new page can be localized just by dropping a new module file
 * here — no edits to this file are required (keeps parallel work conflict-free).
 */
const moduleFiles = import.meta.glob("./modules/*.js", { eager: true });

const LANGS = ["en", "da", "ps"];

const deepMerge = (target, source) => {
  for (const key of Object.keys(source || {})) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

const resources = { en: { translation: {} }, da: { translation: {} }, ps: { translation: {} } };

for (const path of Object.keys(moduleFiles)) {
  const mod = moduleFiles[path].default || moduleFiles[path];
  if (!mod) continue;
  for (const lang of LANGS) {
    if (mod[lang]) deepMerge(resources[lang].translation, mod[lang]);
  }
}

export const SUPPORTED_LANGUAGES = [
  { code: "ps", label: "پښتو", fullLabel: "پښتو", dir: "rtl" },
  { code: "da", label: "دری", fullLabel: "دری", dir: "rtl" },
  { code: "en", label: "EN", fullLabel: "English", dir: "ltr" },
];

export const isRTL = (lang) => lang === "ps" || lang === "da";

// Default language is Pashto (like the KPU website's national-language default).
const DEFAULT_LANGUAGE = "ps";

const stored = (() => {
  try {
    return localStorage.getItem("alumni-language");
  } catch {
    return null;
  }
})();

const initialLang = LANGS.includes(stored) ? stored : DEFAULT_LANGUAGE;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  });

// Apply document direction/lang on load and whenever the language changes.
const applyDir = (lang) => {
  if (typeof document === "undefined") return;
  document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr";
  document.documentElement.lang = lang;
};

applyDir(initialLang);
i18n.on("languageChanged", (lng) => {
  applyDir(lng);
  try {
    localStorage.setItem("alumni-language", lng);
  } catch {
    /* ignore */
  }
});

export default i18n;
