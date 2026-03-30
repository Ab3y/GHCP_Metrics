import type { CopilotMetricsDay } from '../api/types';

export function getDayCompletionTotals(day: CopilotMetricsDay) {
  let suggestions = 0,
    acceptances = 0,
    linesSuggested = 0,
    linesAccepted = 0;
  if (day.copilot_ide_code_completions) {
    for (const editor of day.copilot_ide_code_completions.editors) {
      for (const model of editor.models) {
        for (const lang of model.languages) {
          suggestions += lang.total_code_suggestions;
          acceptances += lang.total_code_acceptances;
          linesSuggested += lang.total_code_lines_suggested;
          linesAccepted += lang.total_code_lines_accepted;
        }
      }
    }
  }
  return { suggestions, acceptances, linesSuggested, linesAccepted };
}

export function getLanguageBreakdown(days: CopilotMetricsDay[]) {
  const langMap = new Map<
    string,
    { suggestions: number; acceptances: number; users: number }
  >();
  for (const day of days) {
    if (!day.copilot_ide_code_completions) continue;
    for (const editor of day.copilot_ide_code_completions.editors) {
      for (const model of editor.models) {
        for (const lang of model.languages) {
          const existing = langMap.get(lang.name) || {
            suggestions: 0,
            acceptances: 0,
            users: 0,
          };
          existing.suggestions += lang.total_code_suggestions;
          existing.acceptances += lang.total_code_acceptances;
          existing.users = Math.max(existing.users, lang.total_engaged_users);
          langMap.set(lang.name, existing);
        }
      }
    }
  }
  return Array.from(langMap.entries())
    .map(([name, data]) => ({
      name,
      ...data,
      acceptanceRate: data.suggestions
        ? Math.round((data.acceptances / data.suggestions) * 100)
        : 0,
    }))
    .sort((a, b) => b.suggestions - a.suggestions);
}

export function getEditorBreakdown(days: CopilotMetricsDay[]) {
  const editorMap = new Map<
    string,
    { users: number; suggestions: number; acceptances: number }
  >();
  for (const day of days) {
    if (!day.copilot_ide_code_completions) continue;
    for (const editor of day.copilot_ide_code_completions.editors) {
      const existing = editorMap.get(editor.name) || {
        users: 0,
        suggestions: 0,
        acceptances: 0,
      };
      existing.users = Math.max(existing.users, editor.total_engaged_users);
      for (const model of editor.models) {
        for (const lang of model.languages) {
          existing.suggestions += lang.total_code_suggestions;
          existing.acceptances += lang.total_code_acceptances;
        }
      }
      editorMap.set(editor.name, existing);
    }
  }
  return Array.from(editorMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.suggestions - a.suggestions);
}

export function getDayChatTotals(day: CopilotMetricsDay) {
  let ideChats = 0,
    ideCopyEvents = 0,
    ideInsertionEvents = 0,
    dotcomChats = 0;
  if (day.copilot_ide_chat) {
    for (const editor of day.copilot_ide_chat.editors) {
      for (const model of editor.models) {
        ideChats += model.total_chats;
        ideCopyEvents += model.total_chat_copy_events;
        ideInsertionEvents += model.total_chat_insertion_events;
      }
    }
  }
  if (day.copilot_dotcom_chat) {
    for (const model of day.copilot_dotcom_chat.models) {
      dotcomChats += model.total_chats;
    }
  }
  return { ideChats, ideCopyEvents, ideInsertionEvents, dotcomChats };
}

export function getPRSummaryTotals(days: CopilotMetricsDay[]) {
  const repoMap = new Map<string, number>();
  let total = 0;
  for (const day of days) {
    if (!day.copilot_dotcom_pull_requests) continue;
    for (const repo of day.copilot_dotcom_pull_requests.repositories) {
      for (const model of repo.models) {
        const count = model.total_pr_summaries_created;
        total += count;
        repoMap.set(repo.name, (repoMap.get(repo.name) || 0) + count);
      }
    }
  }
  const repos = Array.from(repoMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  return { total, repos };
}

export function applyFilters(
  days: CopilotMetricsDay[],
  filters: { languages: string[]; editors: string[]; models: string[] },
): CopilotMetricsDay[] {
  if (
    !filters.languages.length &&
    !filters.editors.length &&
    !filters.models.length
  ) {
    return days;
  }
  return days.map((day) => {
    const filtered = { ...day };

    // Filter code completions by editor, model, and language
    if (
      filtered.copilot_ide_code_completions &&
      (filters.editors.length ||
        filters.languages.length ||
        filters.models.length)
    ) {
      filtered.copilot_ide_code_completions = {
        ...filtered.copilot_ide_code_completions,
        editors: filtered.copilot_ide_code_completions.editors
          .filter(
            (e) =>
              !filters.editors.length || filters.editors.includes(e.name),
          )
          .map((e) => ({
            ...e,
            models: e.models
              .filter(
                (m) =>
                  !filters.models.length || filters.models.includes(m.name),
              )
              .map((m) => ({
                ...m,
                languages: m.languages.filter(
                  (l) =>
                    !filters.languages.length ||
                    filters.languages.includes(l.name),
                ),
              })),
          })),
      };
    }

    // Filter IDE chat by editor and model
    if (
      filtered.copilot_ide_chat &&
      (filters.editors.length || filters.models.length)
    ) {
      filtered.copilot_ide_chat = {
        ...filtered.copilot_ide_chat,
        editors: filtered.copilot_ide_chat.editors
          .filter(
            (e) =>
              !filters.editors.length || filters.editors.includes(e.name),
          )
          .map((e) => ({
            ...e,
            models: e.models.filter(
              (m) =>
                !filters.models.length || filters.models.includes(m.name),
            ),
          })),
      };
    }

    // Filter Dotcom chat by model
    if (filtered.copilot_dotcom_chat && filters.models.length) {
      filtered.copilot_dotcom_chat = {
        ...filtered.copilot_dotcom_chat,
        models: filtered.copilot_dotcom_chat.models.filter(
          (m) => filters.models.includes(m.name),
        ),
      };
    }

    // Filter PR summaries by model
    if (filtered.copilot_dotcom_pull_requests && filters.models.length) {
      filtered.copilot_dotcom_pull_requests = {
        ...filtered.copilot_dotcom_pull_requests,
        repositories: filtered.copilot_dotcom_pull_requests.repositories.map(
          (repo) => ({
            ...repo,
            models: repo.models.filter(
              (m) => filters.models.includes(m.name),
            ),
          }),
        ),
      };
    }

    return filtered;
  });
}

export function getUniqueLanguages(days: CopilotMetricsDay[]): string[] {
  const langs = new Set<string>();
  for (const day of days) {
    if (!day.copilot_ide_code_completions) continue;
    for (const editor of day.copilot_ide_code_completions.editors) {
      for (const model of editor.models) {
        for (const lang of model.languages) {
          langs.add(lang.name);
        }
      }
    }
  }
  return Array.from(langs).sort();
}

export function getUniqueEditors(days: CopilotMetricsDay[]): string[] {
  const editors = new Set<string>();
  for (const day of days) {
    if (day.copilot_ide_code_completions) {
      for (const editor of day.copilot_ide_code_completions.editors) {
        editors.add(editor.name);
      }
    }
    if (day.copilot_ide_chat) {
      for (const editor of day.copilot_ide_chat.editors) {
        editors.add(editor.name);
      }
    }
  }
  return Array.from(editors).sort();
}

export function getUniqueModels(days: CopilotMetricsDay[]): string[] {
  const models = new Set<string>();
  for (const day of days) {
    if (day.copilot_ide_code_completions) {
      for (const editor of day.copilot_ide_code_completions.editors) {
        for (const model of editor.models) {
          models.add(model.name);
        }
      }
    }
    if (day.copilot_ide_chat) {
      for (const editor of day.copilot_ide_chat.editors) {
        for (const model of editor.models) {
          models.add(model.name);
        }
      }
    }
    if (day.copilot_dotcom_chat) {
      for (const model of day.copilot_dotcom_chat.models) {
        models.add(model.name);
      }
    }
    if (day.copilot_dotcom_pull_requests) {
      for (const repo of day.copilot_dotcom_pull_requests.repositories) {
        for (const model of repo.models) {
          models.add(model.name);
        }
      }
    }
  }
  return Array.from(models).sort();
}
