import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiGlobe, FiChevronDown, FiCheck } from "react-icons/fi";
import { SUPPORTED_LANGUAGES } from "../localization/i18n";

/**
 * Professional single-button language dropdown (Pashto / Dari / English).
 * Brand navy (#002759) for the active item — matches the KPU concept.
 */
const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ||
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const changeLanguage = (code) => {
    setOpen(false);
    if (code !== i18n.language) i18n.changeLanguage(code); // i18n.js handles dir + persistence
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white/10 text-white border border-white/25 hover:bg-white/20 transition-all duration-200 text-xs sm:text-sm font-semibold"
      >
        <FiGlobe className="text-sm sm:text-base" />
        <span>{current.label}</span>
        <FiChevronDown
          className={`text-xs transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full end-0 mt-2 w-44 max-w-[calc(100vw-1.5rem)] rounded-xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden z-[100] animate-fade-in origin-top">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-gray-400 border-b border-gray-100">
            <FiGlobe className="inline -mt-0.5 me-1" />
            Language
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                dir={lang.dir}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[#002759]/5 text-[#002759] font-bold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                aria-selected={active}
                role="option"
              >
                <span>{lang.fullLabel}</span>
                {active && <FiCheck className="text-[#194ce6]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
