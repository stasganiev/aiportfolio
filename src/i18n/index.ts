// Языки сайта и словари интерфейса.
// Русский словарь служит мастер-версией: набор его ключей обязателен для остальных.
// При расхождении сборка останавливается с перечнем проблем.

import en from './en.json';
import ru from './ru.json';
import sr from './sr.json';

export const locales = ['en', 'ru', 'sr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const masterLocale: Locale = 'ru';

export type DictKey = keyof typeof ru;
type Dict = Record<DictKey, string>;

const dictionaries: Record<Locale, Record<string, unknown>> = { en, ru, sr };

/** Значение атрибута lang и hreflang. Сербский текст на сайте идёт латиницей. */
export const htmlLang: Record<Locale, string> = { en: 'en', ru: 'ru', sr: 'sr-Latn' };

/** Метка языка в переключателе. */
export const localeLabel: Record<Locale, string> = { en: 'EN', ru: 'RU', sr: 'SR' };

function checkDictionaries(): void {
  const masterKeys = Object.keys(dictionaries[masterLocale]);
  const problems: string[] = [];

  for (const locale of locales) {
    const dict = dictionaries[locale];
    const file = `${locale}.json`;
    for (const key of masterKeys) {
      if (!(key in dict)) problems.push(`${file}: нет ключа «${key}»`);
    }
    for (const [key, value] of Object.entries(dict)) {
      if (!masterKeys.includes(key)) {
        problems.push(`${file}: лишний ключ «${key}», которого нет в ${masterLocale}.json`);
      } else if (typeof value !== 'string' || value.trim() === '') {
        problems.push(`${file}: у ключа «${key}» пустое значение`);
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Словари интерфейса в src/i18n не совпадают (${problems.length}):\n  ${problems.join('\n  ')}`,
    );
  }
}

checkDictionaries();

/** Возвращает функцию перевода для языка страницы. */
export function useTranslations(locale: Locale): (key: DictKey) => string {
  const dict = dictionaries[locale] as Dict;
  return (key) => dict[key];
}

/** Путь страницы на нужном языке: localePath('ru', 'speaker/') → /ru/speaker/. */
export function localePath(locale: Locale, path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return `${base}${prefix}/${path.replace(/^\//, '')}`;
}

/** Путь страницы без приставки языка: /ru/speaker/ → speaker/. */
export function pathWithoutLocale(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const parts = pathname.slice(base.length).split('/').filter(Boolean);
  if (locales.includes(parts[0] as Locale)) parts.shift();
  return parts.length > 0 ? `${parts.join('/')}/` : '';
}

/** Путь к файлу из public/ с учётом базового адреса сайта. */
export function publicPath(file: string): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${file.replace(/^\//, '')}`;
}
