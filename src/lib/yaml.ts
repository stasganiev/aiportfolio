// Чтение YAML-файла с проверкой по схеме. Ошибка останавливает сборку
// и называет файл и поле.

import { parse } from 'yaml';
import type { z } from 'astro/zod';

export function fail(file: string, problems: string[]): never {
  throw new Error(`Ошибка в файле ${file}:\n  ${problems.join('\n  ')}`);
}

/** Место ошибки словами: «запись 3 (extensions-1c).format» вместо «2.format». */
function describePath(data: unknown, path: PropertyKey[]): string {
  const [first, ...rest] = path;
  if (typeof first === 'number' && Array.isArray(data)) {
    const id = (data[first] as { id?: unknown } | undefined)?.id;
    const item = `запись ${first + 1}${typeof id === 'string' ? ` (${id})` : ''}`;
    return [item, ...rest].map(String).join('.');
  }
  return path.map(String).join('.') || '(корень)';
}

export function loadYaml<T extends z.ZodType>(file: string, raw: string, schema: T): z.infer<T> {
  let data: unknown;
  try {
    data = parse(raw);
  } catch (error) {
    fail(file, [`файл не читается как YAML: ${(error as Error).message}`]);
  }
  const result = schema.safeParse(data);
  if (!result.success) {
    fail(
      file,
      result.error.issues.map((issue) => `${describePath(data, issue.path)}: ${issue.message}`),
    );
  }
  return result.data;
}
