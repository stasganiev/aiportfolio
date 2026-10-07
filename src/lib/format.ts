// Подстановка цифр в тексты, формы слов после чисел, выделение слов.

import { htmlLang, type Locale } from '../i18n';
import type { PluralForms } from '../texts';

type Values = Record<string, string | number>;

/** Порядок форм в записи {talks|доклад|доклада|докладов}: от единственного числа к множественному. */
const categoryOrder = ['zero', 'one', 'two', 'few', 'many', 'other'] as const;

/** Форма слова по позиции: для русского one|few|many, для английского one|other, для сербского one|few|other. */
function pickForm(locale: Locale, n: number, forms: string[]): string {
  const rules = new Intl.PluralRules(htmlLang[locale]);
  const categories = categoryOrder.filter((category) =>
    rules.resolvedOptions().pluralCategories.includes(category),
  );
  const index = categories.indexOf(rules.select(n));
  return forms[Math.min(index, forms.length - 1)]!;
}

/**
 * Заменяет {имя} значением. Неизвестное имя останавливает сборку.
 * {имя|форма|форма|форма} ставит число и слово в нужной форме: «18 докладов», «21 доклад».
 * {n} не трогается, если значения n нет: это число, которое компонент подставит сам.
 */
export function fill(text: string, values: Values, locale: Locale, where = ''): string {
  return text.replace(/\{(\w+)((?:\|[^|{}]+)*)\}/g, (match, key: string, tail: string) => {
    if (key === 'n' && !('n' in values)) return match;
    if (!(key in values)) {
      const place = where ? ` (${where})` : '';
      throw new Error(`В тексте стоит {${key}}, а такого значения нет${place}: «${text}»`);
    }
    const value = values[key]!;
    if (!tail) return String(value);
    if (typeof value !== 'number') {
      throw new Error(`Формы слова заданы для {${key}}, а это не число: «${text}»`);
    }
    return `${value} ${pickForm(locale, value, tail.slice(1).split('|'))}`;
  });
}

/** Форма слова для числа: plural('ru', 24, { one: 'год', few: 'года', many: 'лет' }) → «года». */
export function plural(locale: Locale, n: number, forms: PluralForms): string {
  const category = new Intl.PluralRules(htmlLang[locale]).select(n);
  const form = forms[category] ?? forms.other;
  if (!form) {
    throw new Error(
      `Для числа ${n} нужна форма «${category}», а есть только: ${Object.keys(forms).join(', ')}`,
    );
  }
  return form;
}

/** Готовит текст для вывода как HTML: *слово* становится <em>слово</em>. */
export function emphasis(text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(/\*(.+?)\*/g, '<em>$1</em>');
}
