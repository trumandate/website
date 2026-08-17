import { languages, type Language } from "./types";
import { ui } from "./ui";

const defaultLang: Language = "en";

/** First path segment decides the locale; anything else falls back to `en`. */
export function getLangFromUrl(url: URL): Language {
  const [, maybeLang] = url.pathname.split("/");
  if ((languages as readonly string[]).includes(maybeLang)) {
    return maybeLang as Language;
  }
  return defaultLang;
}

type Join<K extends string, P extends string> = P extends "" ? K : `${K}.${P}`;

/** Every dot-path into the UiStrings tree, e.g. "nav.strategy" — typed so a
 * typo in a translation key is a compile error, not a silent blank string. */
type KeyPath<T> = {
  [K in Extract<keyof T, string>]: T[K] extends string
    ? K
    : Join<K, KeyPath<T[K]>>;
}[Extract<keyof T, string>];

function getByPath(source: unknown, path: string): string {
  const value = path
    .split(".")
    .reduce<unknown>(
      (node, segment) =>
        node && typeof node === "object"
          ? (node as Record<string, unknown>)[segment]
          : undefined,
      source,
    );
  if (typeof value !== "string") {
    throw new Error(`Missing UI string for key "${path}"`);
  }
  return value;
}

/** `const t = useTranslations(lang); t('nav.strategy')`. Falls back to the
 * English string if a given Arabic key is ever missing, rather than
 * rendering blank — Arabic must never carry less content than English. */
export function useTranslations(lang: Language) {
  return function t(key: KeyPath<(typeof ui)["en"]>): string {
    try {
      return getByPath(ui[lang], key);
    } catch {
      return getByPath(ui[defaultLang], key);
    }
  };
}

/**
 * Route suffixes (everything after the `/{lang}` prefix) that exist in BOTH
 * language trees. Add a route here the moment its second-language file lands;
 * `altUrl` uses this to decide whether a straight locale swap has anywhere to
 * go.
 *
 * As of P6-AR that is the home page and all three product pages: the Arabic
 * copy was approved and written, so `/en/strategy` ↔ `/ar/strategy` and its
 * two siblings are now straight locale swaps rather than fallbacks to the
 * Arabic home page. `/contact` (P7) lands in both languages in the same
 * prompt, so it joins the set immediately rather than waiting a round trip.
 */
// Suffixes are normalised without a trailing slash (the home page is the one
// exception, since its suffix is nothing at all) — see `altUrl` below, which
// filters empty segments out before joining.
const pairedRoutes = new Set([
  "/",
  "/strategy",
  "/execution",
  "/benefits",
  "/contact",
]);

/**
 * Swaps the leading /en/ or /ar/ path segment for the target language, keeping
 * the rest of the path intact — used by LangToggle.astro.
 *
 * When the current route has no counterpart in the target language, this
 * returns that language's home page instead of a URL that would 404. The
 * alternative — hiding the toggle on unpaired routes — was rejected: spec §8
 * treats the language toggle as permanent site chrome, and a control that
 * silently disappears on three of five routes reads as a bug to a reader who
 * has just used it on the home page. Sending them to the Arabic home page is
 * a real page in their language, and this whole branch deletes itself the
 * moment the Arabic product pages are added to `pairedRoutes` above.
 */
export function altUrl(url: URL, targetLang: Language): string {
  const segments = url.pathname.split("/");
  const currentLang = getLangFromUrl(url);
  if (segments[1] === currentLang) {
    segments[1] = targetLang;
  } else {
    segments.splice(1, 0, targetLang);
  }

  const path = segments.join("/") || "/";
  const withSlash = path.endsWith("/") ? path : `${path}/`;

  // The suffix is the path minus the leading `/{lang}` segment, normalised so
  // the home page reads as "/" rather than "".
  const suffix = `/${segments.slice(2).filter(Boolean).join("/")}`.replace(
    /\/+$/,
    "/",
  );

  return pairedRoutes.has(suffix) ? withSlash : `/${targetLang}/`;
}
