import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

// Five main languages. Translation is done by Google's website translator, loaded only when a
// non-English language is chosen, so it also covers seller-written product descriptions.
// shortcut: machine translation; swap for i18next + reviewed copy if wording quality matters.
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
] as const;

const COOKIE = "googtrans";

const readLang = () => {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-z-]+)/i);
  return m ? m[1] : "en";
};

const writeLang = (code: string) => {
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  // Google reads the cookie on both the bare host and the dotted domain; clear both before setting.
  for (const domain of ["", `; domain=${location.hostname}`, `; domain=.${location.hostname}`]) {
    document.cookie = `${COOKIE}=; ${expire}; path=/${domain}`;
  }
  if (code !== "en") document.cookie = `${COOKIE}=/en/${code}; path=/`;
};

// React and Google Translate both edit text nodes; without this, React can crash with
// "Failed to execute 'removeChild'" after the page is translated (facebook/react#11538).
const patchDomForTranslation = () => {
  const w = window as any;
  if (w.__ahDomPatched) return;
  w.__ahDomPatched = true;
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };
  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return insertBefore.call(this, node, null) as T;
    return insertBefore.call(this, node, ref) as T;
  };
};

const loadTranslator = () => {
  const w = window as any;
  if (w.__ahTranslatorLoaded) return;
  w.__ahTranslatorLoaded = true;
  patchDomForTranslation();
  const holder = document.createElement("div");
  holder.id = "google_translate_element";
  holder.style.display = "none";
  document.body.appendChild(holder);
  w.googleTranslateElementInit = () =>
    new w.google.translate.TranslateElement(
      { pageLanguage: "en", includedLanguages: LANGUAGES.map((l) => l.code).join(","), autoDisplay: false },
      "google_translate_element"
    );
  const s = document.createElement("script");
  s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  s.async = true;
  document.body.appendChild(s);
};

const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const current = readLang();
    setLang(current);
    if (current !== "en") loadTranslator();
  }, []);

  const change = (code: string) => {
    if (code === lang) return;
    writeLang(code);
    window.location.reload(); // translator applies the cookie on load
  };

  return (
    <label className={`notranslate relative inline-flex items-center gap-1.5 text-sm ${className}`} translate="no">
      <Globe className="h-4 w-4 opacity-80" aria-hidden />
      <span className="sr-only">Language</span>
      <select
        value={lang}
        onChange={(e) => change(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-1 font-medium outline-none focus-visible:underline"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="text-slate-900">
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default LanguageSwitcher;
