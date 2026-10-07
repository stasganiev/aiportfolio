// Подстановка цифр в тексты, формы слов после чисел, выделение слов.

import { htmlLang, type Locale } from '../i18n';
import type { PluralForms } from '../texts';

/**
 * Заменяет {имя} значением. Неизвестное имя останавливает сборку.
 * {n} не трогается: это число, которое компонент подставит сам.
 */
export function fill(text: string, values: Record<string, string | number>, where = ''): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (key === 'n' && !('n' in values)) return match;
    if (!(key in values)) {
      const place = where ? ` (${where})` : '';
      throw new Error(`В тексте стоит {${key}}, а такого значения нет${place}: «${text}»`);
    }
    return String(values[key]);
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
