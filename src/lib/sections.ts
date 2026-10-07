// Секции главной в порядке показа. Якоря одинаковые на всех языках:
// по ним переключатель языков возвращает человека в ту же секцию.

import type { DictKey } from '../i18n';

interface Section {
  id: string;
  title: DictKey;
  /** Подпись в меню. Секции без подписи в меню не попадают. */
  nav?: DictKey;
}

export const sections: Section[] = [
  { id: 'now', title: 'section.now' },
  { id: 'courses', title: 'section.courses', nav: 'nav.courses' },
  { id: 'companies', title: 'section.companies', nav: 'nav.companies' },
  { id: 'open-source', title: 'section.openSource' },
  { id: 'talks', title: 'section.talks', nav: 'nav.talks' },
  { id: 'experience', title: 'section.experience', nav: 'nav.experience' },
  { id: 'about', title: 'section.about', nav: 'nav.about' },
  { id: 'contact', title: 'section.contact', nav: 'nav.contact' },
];
