import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from "./config";
import enDict from "./dictionaries/en.json";

export type TranslationDictionary = Record<string, any>;

const dictionaryCache: Partial<Record<Locale, TranslationDictionary>> = {
  en: enDict,
};

const LOADERS: Record<Locale, () => Promise<{ default: TranslationDictionary }>> = {
  en: async () => ({ default: enDict }),
  es: () => import("./dictionaries/es.json"),
  pt: () => import("./dictionaries/pt.json"),
  de: () => import("./dictionaries/de.json"),
  fr: () => import("./dictionaries/fr.json"),
  ja: () => import("./dictionaries/ja.json"),
  ko: () => import("./dictionaries/ko.json"),
  ru: () => import("./dictionaries/ru.json"),
  it: () => import("./dictionaries/it.json"),
  pl: () => import("./dictionaries/pl.json"),
  tr: () => import("./dictionaries/tr.json"),
  id: () => import("./dictionaries/id.json"),
  vi: () => import("./dictionaries/vi.json"),
  "zh-CN": () => import("./dictionaries/zh-CN.json"),
  "zh-TW": () => import("./dictionaries/zh-TW.json"),
  nl: () => import("./dictionaries/nl.json"),
};

export function getEnglishDictionary(): TranslationDictionary {
  return enDict;
}

export async function loadLocaleDictionary(locale: string): Promise<TranslationDictionary> {
  const target: Locale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  if (dictionaryCache[target]) {
    return dictionaryCache[target]!;
  }
  try {
    const mod = await LOADERS[target]();
    const dict = mod.default || enDict;
    dictionaryCache[target] = dict;
    return dict;
  } catch {
    return enDict;
  }
}
