// Текст из данных на языке страницы.
// В YAML текст записан либо строкой (одинаков на всех языках: «SOFTSWISS», «Infostart Event»),
// либо тремя вариантами: { ru, en, sr }.

import type { Locale } from '../i18n';

export type Localized = string | Record<Locale, string>;

export function tr(value: Localized, locale: Locale): string {
  return typeof value === 'string' ? value : value[locale];
}
