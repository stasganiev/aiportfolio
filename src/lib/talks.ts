// Списки докладов и статей для вывода: сверху новые, у каждого готовые подписи ссылок.
// Используются на главной и на странице спикера.

import { articles, talks } from '../data';

interface LinkLabels {
  video: string;
  slides: string;
  article: string;
  part_2: string;
}

const newestFirst = <T extends { date: string }>(items: T[]) =>
  [...items].sort((a, b) => b.date.localeCompare(a.date));
const year = (date: string) => date.slice(0, 4);

export function talkEntries(labels: LinkLabels) {
  return newestFirst(talks).map((talk) => ({
    featured: talk.featured === true,
    title: talk.title,
    meta: [talk.venue, talk.place, year(talk.date)],
    links: [
      { label: labels.video, url: talk.video },
      { label: labels.slides, url: talk.slides },
      { label: labels.article, url: talk.article },
    ].flatMap((link) => (link.url ? [{ label: link.label, url: link.url }] : [])),
  }));
}

export function articleEntries(labels: LinkLabels) {
  return newestFirst(articles).map((article) => ({
    featured: article.featured === true,
    title: article.title,
    href: article.url,
    meta: [article.publisher, year(article.date), article.award].filter((part) => part !== undefined),
    links: article.url_part_2 ? [{ label: labels.part_2, url: article.url_part_2 }] : [],
  }));
}
