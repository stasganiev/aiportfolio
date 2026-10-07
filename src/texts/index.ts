// Тексты секций по языкам. Русский файл служит мастер-версией.
// Пока перевода нет, страница получает русский текст и пометку translated: false.
// На этапе 7 появляются home.en.yaml и home.sr.yaml, и запасной вариант убирается.

import { z } from 'astro/zod';

import { facts } from '../data';
import type { Locale } from '../i18n';
import { fill } from '../lib/format';
import { loadYaml } from '../lib/yaml';

import homeRuRaw from './home.ru.yaml?raw';

const text = z.string().min(1);

/** Формы слова после числа. Набор форм у каждого языка свой. */
const pluralForms = z.partialRecord(z.enum(['zero', 'one', 'two', 'few', 'many', 'other']), text);
export type PluralForms = z.infer<typeof pluralForms>;

const card = z.strictObject({ title: text, text, link: text });

const homeSchema = z.strictObject({
  meta: z.strictObject({ title: text, description: text }),
  hero: z.strictObject({
    name: text,
    photo_alt: text,
    title: text,
    lead: text,
    stats: z.strictObject({
      years: pluralForms,
      graduates: pluralForms,
      talks: pluralForms,
      articles: pluralForms,
    }),
    primary: text,
    secondary: text,
    xray: z.strictObject({ label: text, inside: text, outside: text, range: text, hint: text }),
  }),
  now: z.strictObject({ work: card, teaching: card, ai: card }),
  courses: z.strictObject({
    lead: text,
    modules: pluralForms,
    lessons: pluralForms,
    format: text,
    button: text,
    testimonials_title: text,
    cohort: text,
  }),
});
export type HomeTexts = z.infer<typeof homeSchema>;

/** Подставляет цифры из facts.yaml во все строки файла. */
function fillAll<T>(value: T, file: string): T {
  if (typeof value === 'string') return fill(value, facts, file) as T;
  if (Array.isArray(value)) return value.map((item) => fillAll(item, file)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, fillAll(item, file)]),
    ) as T;
  }
  return value;
}

function loadHome(file: string, raw: string): HomeTexts {
  return fillAll(loadYaml(file, raw, homeSchema), file);
}

const masterLocale = 'ru' satisfies Locale;
const home: Partial<Record<Locale, HomeTexts>> & { ru: HomeTexts } = {
  ru: loadHome('src/texts/home.ru.yaml', homeRuRaw),
};

interface PageTexts<T> {
  texts: T;
  /** Язык, на котором написан текст. От него зависят формы слов после чисел. */
  locale: Locale;
  /** false: перевода нет, показан русский текст. */
  translated: boolean;
}

export function homeTexts(locale: Locale): PageTexts<HomeTexts> {
  const own = home[locale];
  return own
    ? { texts: own, locale, translated: true }
    : { texts: home[masterLocale], locale: masterLocale, translated: false };
}
