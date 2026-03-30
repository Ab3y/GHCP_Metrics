import Papa from 'papaparse';
import type { CopilotMetricsDay, CopilotSeat } from '../api/types';

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportMetricsToCsv(data: CopilotMetricsDay[], filename = 'copilot-metrics') {
  const rows = data.map((day) => {
    let totalSuggestions = 0;
    let totalAcceptances = 0;
    let totalLinesSuggested = 0;
    let totalLinesAccepted = 0;
    let ideChats = 0;
    let dotcomChats = 0;
    let prSummaries = 0;

    if (day.copilot_ide_code_completions) {
      for (const editor of day.copilot_ide_code_completions.editors) {
        for (const model of editor.models) {
          for (const lang of model.languages) {
            totalSuggestions += lang.total_code_suggestions;
            totalAcceptances += lang.total_code_acceptances;
            totalLinesSuggested += lang.total_code_lines_suggested;
            totalLinesAccepted += lang.total_code_lines_accepted;
          }
        }
      }
    }

    if (day.copilot_ide_chat) {
      for (const editor of day.copilot_ide_chat.editors) {
        for (const model of editor.models) {
          ideChats += model.total_chats;
        }
      }
    }

    if (day.copilot_dotcom_chat) {
      for (const model of day.copilot_dotcom_chat.models) {
        dotcomChats += model.total_chats;
      }
    }

    if (day.copilot_dotcom_pull_requests) {
      for (const repo of day.copilot_dotcom_pull_requests.repositories) {
        for (const model of repo.models) {
          prSummaries += model.total_pr_summaries_created;
        }
      }
    }

    return {
      date: day.date,
      active_users: day.total_active_users,
      engaged_users: day.total_engaged_users,
      total_suggestions: totalSuggestions,
      total_acceptances: totalAcceptances,
      acceptance_rate: totalSuggestions
        ? Math.round((totalAcceptances / totalSuggestions) * 100)
        : 0,
      lines_suggested: totalLinesSuggested,
      lines_accepted: totalLinesAccepted,
      ide_chats: ideChats,
      dotcom_chats: dotcomChats,
      pr_summaries: prSummaries,
    };
  });

  const csv = Papa.unparse(rows);
  downloadCsv(csv, filename);
}

export function exportLanguagesToCsv(
  data: Array<{
    name: string;
    suggestions: number;
    acceptances: number;
    acceptanceRate: number;
    users: number;
  }>,
  filename = 'copilot-languages',
) {
  const csv = Papa.unparse(
    data.map((l) => ({
      language: l.name,
      suggestions: l.suggestions,
      acceptances: l.acceptances,
      acceptance_rate_pct: l.acceptanceRate,
      engaged_users: l.users,
    })),
  );
  downloadCsv(csv, filename);
}

export function exportSeatsToCsv(seats: CopilotSeat[], filename = 'copilot-seats') {
  const rows = seats.map((s) => ({
    username: s.assignee.login,
    type: s.assignee.type,
    plan_type: s.plan_type || '',
    team: s.assigning_team?.name || '',
    last_activity: s.last_activity_at || 'Never',
    last_editor: s.last_activity_editor || '',
    created: s.created_at,
    pending_cancellation: s.pending_cancellation_date || '',
  }));
  const csv = Papa.unparse(rows);
  downloadCsv(csv, filename);
}
