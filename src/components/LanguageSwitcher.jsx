import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../localization/i18n";

/**
 * Language switcher for Pashto / Dari / English.
 * Brand navy (#002759) for the active pill — matches the KPU concept.
 */
const LanguageSwitcher = ({ className = "", variant = "pills" }) => {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const changeLanguage = (code) => {
    if (code === current) return;
    i18n.changeLanguage(code); // i18n.js listener handles dir + persistence
  };

  if (variant === "select") {
    return (
      <div className={`relative inline-block ${className}`}>
        <select
          value={current}
          onChange={(e) => changeLanguage(e.target.value)}
          className="appearance-none bg-white/10 border border-white/30 rounded-lg px-3 py-1.5 pe-7 text-sm font-medium text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Select language"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-gray-800">
              {lang.fullLabel}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-white/70 text-xs">
          ▾
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-2.5 py-1 text-xs sm:text-sm rounded-full font-semibold transition-all duration-200 ${
            current === lang.code
              ? "bg-white text-[#002759] shadow"
              : "bg-white/10 text-white/90 hover:bg-white/20"
          }`}
          aria-label={lang.fullLabel}
          aria-pressed={current === lang.code}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
