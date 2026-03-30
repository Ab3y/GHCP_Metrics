export interface CopilotMetricsDay {
  date: string;
  total_active_users: number;
  total_engaged_users: number;
  copilot_ide_code_completions: CopilotIdeCodeCompletions | null;
  copilot_ide_chat: CopilotIdeChat | null;
  copilot_dotcom_chat: CopilotDotcomChat | null;
  copilot_dotcom_pull_requests: CopilotDotcomPullRequests | null;
}

export interface CopilotIdeCodeCompletions {
  total_engaged_users: number;
  languages: LanguageSummary[];
  editors: EditorCompletions[];
}

export interface LanguageSummary {
  name: string;
  total_engaged_users: number;
}

export interface EditorCompletions {
  name: string;
  total_engaged_users: number;
  models: ModelCompletions[];
}

export interface ModelCompletions {
  name: string;
  is_custom_model: boolean;
  custom_model_training_date: string | null;
  total_engaged_users?: number;
  languages: LanguageCompletions[];
}

export interface LanguageCompletions {
  name: string;
  total_engaged_users: number;
  total_code_suggestions: number;
  total_code_acceptances: number;
  total_code_lines_suggested: number;
  total_code_lines_accepted: number;
}

export interface CopilotIdeChat {
  total_engaged_users: number;
  editors: EditorChat[];
}

export interface EditorChat {
  name: string;
  total_engaged_users: number;
  models: ModelChat[];
}

export interface ModelChat {
  name: string;
  is_custom_model: boolean;
  custom_model_training_date: string | null;
  total_engaged_users: number;
  total_chats: number;
  total_chat_insertion_events: number;
  total_chat_copy_events: number;
}

export interface CopilotDotcomChat {
  total_engaged_users: number;
  models: DotcomChatModel[];
}

export interface DotcomChatModel {
  name: string;
  is_custom_model: boolean;
  custom_model_training_date: string | null;
  total_engaged_users: number;
  total_chats: number;
}

export interface CopilotDotcomPullRequests {
  total_engaged_users: number;
  repositories: PullRequestRepo[];
}

export interface PullRequestRepo {
  name: string;
  total_engaged_users: number;
  models: PullRequestModel[];
}

export interface PullRequestModel {
  name: string;
  is_custom_model: boolean;
  custom_model_training_date: string | null;
  total_pr_summaries_created: number;
  total_engaged_users: number;
}

export interface CopilotSeat {
  created_at: string;
  updated_at: string;
  pending_cancellation_date: string | null;
  last_activity_at: string | null;
  last_activity_editor: string | null;
  plan_type?: string;
  assignee: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: string;
  };
  assigning_team?: {
    id: number;
    name: string;
    slug: string;
    description: string;
  } | null;
}

export interface CopilotSeatsResponse {
  total_seats: number;
  seats: CopilotSeat[];
}

export interface OrgContext {
  type: 'org' | 'enterprise';
  name: string;
  teamSlug?: string;
}

export interface ApiConfig {
  token: string;
  baseUrl?: string;
}
