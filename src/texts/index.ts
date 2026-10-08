// Тексты секций по языкам. Русский файл служит мастер-версией.
// Пока перевода нет, страница получает русский текст и пометку translated: false.
// На этапе 7 появляются home.en.yaml и home.sr.yaml, и запасной вариант убирается.

import { z } from 'astro/zod';

import { facts } from '../data';
import { htmlLang, type Locale } from '../i18n';
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
  companies: z.strictObject({
    lead: text,
    formats: z.array(z.strictObject({ title: text, text })).min(1),
    button: text,
  }),
  open_source: z.strictObject({
    /** Описание репозитория по его id из links.yaml. */
    repos: z.record(z.string(), text),
    all: text,
  }),
  talks: z.strictObject({
    lead: text,
    about: text,
    featured_talks: text,
    featured_articles: text,
    all_talks: text,
    all_articles: text,
    invite: text,
    photo_alt: text,
    photo_caption: text,
    video: text,
    slides: text,
    article: text,
    part_2: text,
  }),
  experience: z.strictObject({ lead: text, all: text }),
  about: z.strictObject({
    portrait_alt: text,
    story: z.array(text).min(1),
    facts: z
      .array(
        z.strictObject({
          photo: z.enum(['train', 'bachata', 'avacha', 'contest', 'plane', 'twins']),
          alt: text.optional(),
          text,
        }),
      )
      .min(1),
  }),
  contact: z.strictObject({
    lead: text,
    form: z.strictObject({
      name: text,
      email: text,
      company: text,
      optional: text,
      topic: text,
      topic_placeholder: text,
      topics: z.record(z.string(), text),
      message: text,
      submit: text,
      errors: z.strictObject({ name: text, email: text, email_format: text, topic: text, message: text }),
      success: text,
      failure: text,
    }),
  }),
});
export type HomeTexts = z.infer<typeof homeSchema>;

/** Значения для подстановки в тексты: цифры из facts.yaml и дата первого отчёта словами. */
function textValues(locale: Locale): Record<string, string | number> {
  const dayMonth = new Intl.DateTimeFormat(htmlLang[locale], {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(facts.firstReportDate));
  return { ...facts, firstReportDayMonth: dayMonth };
}

/** Подставляет цифры в один текст. Нужна там, где текст лежит не в файле текстов, а в данных. */
export function fillFacts(
  value: string,
  locale: Locale,
  options: Parameters<typeof fill>[3] = {},
): string {
  return fill(value, textValues(locale), locale, options);
}

/** Подставляет цифры из facts.yaml во все строки файла. */
function fillAll<T>(value: T, locale: Locale, file: string): T {
  if (typeof value === 'string') return fillFacts(value, locale, { where: file }) as T;
  if (Array.isArray(value)) return value.map((item) => fillAll(item, locale, file)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, fillAll(item, locale, file)]),
    ) as T;
  }
  return value;
}

function loadHome(locale: Locale, raw: string): HomeTexts {
  const file = `src/texts/home.${locale}.yaml`;
  return fillAll(loadYaml(file, raw, homeSchema), locale, file);
}

const masterLocale = 'ru' satisfies Locale;
const home: Partial<Record<Locale, HomeTexts>> & { ru: HomeTexts } = {
  ru: loadHome('ru', homeRuRaw),
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
