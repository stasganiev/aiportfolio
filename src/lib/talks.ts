// Списки докладов и статей для вывода: сверху новые, у каждого готовые подписи ссылок.
// Используются на главной и на странице спикера.
//
// Все доклады и статьи на русском. На русской странице показывается оригинальное название.
// На английской и сербской первой строкой идёт перевод, под ним оригинал и пометка «на русском».

import { articles, names, talks } from '../data';
import type { Locale } from '../i18n';
import { tr } from './localized';

interface LinkLabels {
  video: string;
  slides: string;
  article: string;
  part_2: string;
}

const newestFirst = <T extends { date: string }>(items: T[]) =>
  [...items].sort((a, b) => b.date.localeCompare(a.date));
const year = (date: string) => date.slice(0, 4);

/** Название на языке страницы и оригинал, если страница не русская. */
function titles(item: { title: string; title_translation: { en: string; sr: string } }, locale: Locale) {
  return locale === 'ru'
    ? { title: item.title, original: undefined }
    : { title: item.title_translation[locale], original: item.title };
}

/**
 * @param labels подписи ссылок на языке страницы
 * @param note пометка «на русском» на языке страницы
 */
export function talkEntries(labels: LinkLabels, locale: Locale, note: string) {
  return newestFirst(talks).map((talk) => ({
    featured: talk.featured === true,
    ...titles(talk, locale),
    meta: [
      tr(talk.venue, locale),
      tr(names.places[talk.place]!, locale),
      year(talk.date),
      ...(locale === 'ru' ? [] : [note]),
    ],
    links: [
      { label: labels.video, url: talk.video },
      { label: labels.slides, url: talk.slides },
      { label: labels.article, url: talk.article },
    ].flatMap((link) => (link.url ? [{ label: link.label, url: link.url }] : [])),
  }));
}

export function articleEntries(labels: LinkLabels, locale: Locale, note: string) {
  return newestFirst(articles).map((article) => ({
    featured: article.featured === true,
    ...titles(article, locale),
    href: article.url,
    meta: [
      tr(names.publishers[article.publisher]!, locale),
      year(article.date),
      ...(article.award ? [article.award[locale]] : []),
      ...(locale === 'ru' ? [] : [note]),
    ],
    links: article.url_part_2 ? [{ label: labels.part_2, url: article.url_part_2 }] : [],
  }));
}
