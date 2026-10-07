// Звёзды и форки репозитория с GitHub. Запрос идёт один раз при сборке.
// При любом сбое (нет сети, лимит запросов) возвращается null,
// и сайт берёт сохранённые значения из facts.yaml.

export interface RepoStats {
  stars: number;
  forks: number;
}

export async function fetchRepoStats(repo: string): Promise<RepoStats | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`ответ ${response.status}`);
    const data = (await response.json()) as { stargazers_count?: unknown; forks_count?: unknown };
    if (typeof data.stargazers_count !== 'number' || typeof data.forks_count !== 'number') {
      throw new Error('в ответе нет счётчиков');
    }
    return { stars: data.stargazers_count, forks: data.forks_count };
  } catch (error) {
    console.warn(
      `[github] Не удалось получить счётчики ${repo} (${(error as Error).message}). Взяты значения из facts.yaml.`,
    );
    return null;
  }
}
