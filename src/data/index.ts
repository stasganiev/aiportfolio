// Данные сайта из YAML-файлов этой папки.
// Каждый файл проверяется по схеме. Ошибка в структуре останавливает сборку
// и называет файл и поле.

import { z } from 'astro/zod';

import { fetchRepoStats } from '../lib/github';
import { fail, loadYaml } from '../lib/yaml';

import articlesRaw from './articles.yaml?raw';
import coursesRaw from './courses.yaml?raw';
import experienceRaw from './experience.yaml?raw';
import factsRaw from './facts.yaml?raw';
import linksRaw from './links.yaml?raw';
import talksRaw from './talks.yaml?raw';
import testimonialsRaw from './testimonials.yaml?raw';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'дата в виде ГГГГ-ММ-ДД');
const monthOrDate = z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'дата в виде ГГГГ-ММ или ГГГГ-ММ-ДД');
const url = z.url();
const text = z.string().min(1);
const count = z.number().int().positive();

/** Запись в facts.yaml: значение и откуда оно взято. */
function fact<T extends z.ZodType>(value: T) {
  return z.strictObject({ value, note: text.optional(), source: text, checked: isoDate });
}

const factsSchema = z.strictObject({
  career: z.strictObject({
    since_year: fact(count),
    first_report_date: fact(isoDate),
    moved_to_serbia_year: fact(count),
  }),
  teaching: z.strictObject({
    graduates: fact(count),
    mentored_developers: fact(count),
  }),
  public: z.strictObject({
    talks: fact(count),
    articles: fact(count),
    conferences_organized_corporate: fact(count),
    conferences_organized_open: fact(count),
  }),
  open_source: z.strictObject({
    onestemplates_stars: fact(count),
    onestemplates_forks: fact(count),
  }),
  projects: z.strictObject({
    payroll_employees: fact(count),
    payroll_branches: fact(count),
    report_minutes_before: fact(count),
    report_minutes_after: fact(count),
    paydesk_stores: fact(count),
  }),
});

const talksSchema = z.array(
  z.strictObject({
    id: text,
    date: monthOrDate,
    title: text,
    venue: text,
    place: text,
    format: z.enum(['offline', 'online']),
    featured: z.boolean().optional(),
    video: url.optional(),
    slides: url.optional(),
    article: url.optional(),
  }),
);

const articlesSchema = z.array(
  z.strictObject({
    id: text,
    date: monthOrDate,
    title: text,
    publisher: text,
    url,
    url_part_2: url.optional(),
    award: text.optional(),
    featured: z.boolean().optional(),
  }),
);

const coursesSchema = z.array(
  z.strictObject({
    id: text,
    title: text,
    language: z.enum(['ru', 'en', 'sr']),
    school: text,
    landing: url,
    modules: count,
    lessons: count,
    format: text,
    audience: text,
    outcomes: z.array(text).min(1),
  }),
);

const testimonialsSchema = z.array(
  z.strictObject({
    id: text,
    author: text,
    course: text,
    course_label: text,
    cohort: count,
    quote: text,
  }),
);

const experienceSchema = z.array(
  z.strictObject({
    id: text,
    company: text,
    period: text,
    role: text,
    about: text,
    summary: text,
    highlights: z.array(text).min(1),
  }),
);

const linksSchema = z.strictObject({
  contacts: z.array(
    z.strictObject({
      id: text,
      label: text,
      handle: text.optional(),
      url,
      show: z.boolean().optional(),
    }),
  ),
  speaker_kit: z.strictObject({ intro_video: url }),
  repositories: z.array(z.strictObject({ id: text, name: text, url, summary: text })),
});

function checkUniqueIds(file: string, items: { id: string }[]): void {
  const seen = new Set<string>();
  const repeated = items.filter((item) => seen.size === seen.add(item.id).size).map((item) => item.id);
  if (repeated.length > 0) fail(file, [`id повторяется: ${repeated.join(', ')}`]);
}

const factsFile = loadYaml('src/data/facts.yaml', factsRaw, factsSchema);

export const talks = loadYaml('src/data/talks.yaml', talksRaw, talksSchema);
export const articles = loadYaml('src/data/articles.yaml', articlesRaw, articlesSchema);
export const courses = loadYaml('src/data/courses.yaml', coursesRaw, coursesSchema);
export const testimonials = loadYaml('src/data/testimonials.yaml', testimonialsRaw, testimonialsSchema);
export const experience = loadYaml('src/data/experience.yaml', experienceRaw, experienceSchema);
export const links = loadYaml('src/data/links.yaml', linksRaw, linksSchema);

checkUniqueIds('src/data/talks.yaml', talks);
checkUniqueIds('src/data/articles.yaml', articles);
checkUniqueIds('src/data/courses.yaml', courses);
checkUniqueIds('src/data/testimonials.yaml', testimonials);
checkUniqueIds('src/data/experience.yaml', experience);
checkUniqueIds('src/data/links.yaml', links.contacts);
checkUniqueIds('src/data/links.yaml', links.repositories);

// Счётчики в facts.yaml обязаны совпадать с числом записей в списках.
if (talks.length !== factsFile.public.talks.value) {
  fail('src/data/facts.yaml', [
    `public.talks: указано ${factsFile.public.talks.value}, а в talks.yaml записей ${talks.length}`,
  ]);
}
if (articles.length !== factsFile.public.articles.value) {
  fail('src/data/facts.yaml', [
    `public.articles: указано ${factsFile.public.articles.value}, а в articles.yaml записей ${articles.length}`,
  ]);
}
for (const item of testimonials) {
  if (!courses.some((course) => course.id === item.course)) {
    fail('src/data/testimonials.yaml', [`${item.id}: курса «${item.course}» нет в courses.yaml`]);
  }
}

/** Полных лет от даты до сегодняшнего дня. Считается в момент сборки. */
export function fullYearsSince(date: string, now = new Date()): number {
  const [year, month, day] = date.split('-').map(Number) as [number, number, number];
  const beforeAnniversary =
    now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day);
  return now.getFullYear() - year - (beforeAnniversary ? 1 : 0);
}

// Звёзды и форки OnesTemplates берутся с GitHub при сборке.
// В facts.yaml лежат запасные значения на случай сбоя.
const onestemplates = await fetchRepoStats('stasganiev/OnesTemplates');

/** Цифры сайта. Компоненты берут их только отсюда. */
export const facts = {
  sinceYear: factsFile.career.since_year.value,
  firstReportDate: factsFile.career.first_report_date.value,
  /** Стаж в полных годах от даты первого отчёта. */
  experienceYears: fullYearsSince(factsFile.career.first_report_date.value),
  movedToSerbiaYear: factsFile.career.moved_to_serbia_year.value,
  graduates: factsFile.teaching.graduates.value,
  mentoredDevelopers: factsFile.teaching.mentored_developers.value,
  talks: factsFile.public.talks.value,
  articles: factsFile.public.articles.value,
  conferencesCorporate: factsFile.public.conferences_organized_corporate.value,
  conferencesOpen: factsFile.public.conferences_organized_open.value,
  onestemplatesStars: onestemplates?.stars ?? factsFile.open_source.onestemplates_stars.value,
  onestemplatesForks: onestemplates?.forks ?? factsFile.open_source.onestemplates_forks.value,
  payrollEmployees: factsFile.projects.payroll_employees.value,
  payrollBranches: factsFile.projects.payroll_branches.value,
  reportMinutesBefore: factsFile.projects.report_minutes_before.value,
  reportMinutesAfter: factsFile.projects.report_minutes_after.value,
  paydeskStores: factsFile.projects.paydesk_stores.value,
};

/** Контакт по id из links.yaml. Отсутствие контакта останавливает сборку. */
export function contact(id: string) {
  const found = links.contacts.find((item) => item.id === id);
  if (!found) fail('src/data/links.yaml', [`нет контакта с id «${id}»`]);
  return found;
}
