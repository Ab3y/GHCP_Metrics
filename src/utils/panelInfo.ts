import type { PanelId } from '../store/pinStore';

export interface PanelInfo {
  title: string;
  description: string;
  docsUrl: string;
  apiEndpoint: string;
  details: string;
}

export const PANEL_INFO: Record<PanelId, PanelInfo> = {
  adoption: {
    title: 'Adoption Overview',
    description:
      'Shows the total number of active and engaged Copilot users over time.',
    details:
      "Active Users: Users with a Copilot license who have used any Copilot feature. Engaged Users: Users who actively interacted with Copilot (accepted suggestions, used chat, etc.). The engagement rate is calculated as (Engaged Users / Active Users) × 100%. Metrics are processed daily and cover the previous day's activity.",
    docsUrl:
      'https://docs.github.com/en/copilot/rolling-out-github-copilot-at-scale/analyzing-usage-over-time',
    apiEndpoint: 'GET /orgs/{org}/copilot/metrics',
  },
  completions: {
    title: 'Code Completions',
    description:
      "Tracks code suggestions and acceptance rates from Copilot's inline completions.",
    details:
      'Total Code Suggestions: Number of inline code completions shown to users. Total Code Acceptances: Number of suggestions accepted by users. Acceptance Rate: (Acceptances / Suggestions) × 100%. Lines Suggested/Accepted: Volume of code lines. Higher acceptance rates indicate better suggestion quality and user trust. Metrics are broken down by language, editor, and model.',
    docsUrl: 'https://docs.github.com/en/rest/copilot/copilot-metrics',
    apiEndpoint: 'GET /orgs/{org}/copilot/metrics',
  },
  languages: {
    title: 'Language Breakdown',
    description:
      'Shows Copilot usage distribution across programming languages.',
    details:
      'Displays which programming languages developers are using Copilot with most frequently. Languages are ranked by total code suggestions. This helps identify where Copilot provides the most value and which language communities are adopting it fastest.',
    docsUrl: 'https://docs.github.com/en/rest/copilot/copilot-metrics',
    apiEndpoint: 'GET /orgs/{org}/copilot/metrics',
  },
  editors: {
    title: 'Editor Distribution',
    description:
      'Shows Copilot usage across different IDEs and code editors.',
    details:
      'Displays the distribution of Copilot usage across supported editors including VS Code, JetBrains IDEs, Neovim, and Visual Studio. Each editor shows its engaged user count and code completion metrics. This helps understand which development environments your team prefers.',
    docsUrl: 'https://docs.github.com/en/rest/copilot/copilot-metrics',
    apiEndpoint: 'GET /orgs/{org}/copilot/metrics',
  },
  chat: {
    title: 'Chat Activity',
    description:
      'Tracks Copilot Chat usage in IDEs and on GitHub.com.',
    details:
      'IDE Chats: Conversations with Copilot Chat in VS Code, JetBrains, etc. Dotcom Chats: Conversations on github.com. Insertion Events: Times users inserted chat-suggested code. Copy Events: Times users copied chat responses. Higher insertion rates indicate chat is being used for productive coding.',
    docsUrl: 'https://docs.github.com/en/rest/copilot/copilot-metrics',
    apiEndpoint: 'GET /orgs/{org}/copilot/metrics',
  },
  'pr-summaries': {
    title: 'PR Summaries',
    description:
      'Tracks Copilot-generated pull request summaries.',
    details:
      'Shows how many pull request summaries Copilot has generated, broken down by repository. PR summaries help reviewers understand changes quickly. This metric indicates adoption of Copilot for code review workflows. Data is broken down by repository and model.',
    docsUrl: 'https://docs.github.com/en/rest/copilot/copilot-metrics',
    apiEndpoint: 'GET /orgs/{org}/copilot/metrics',
  },
  seats: {
    title: 'Seat Utilization',
    description:
      'Shows Copilot license seat allocation and activity status.',
    details:
      'Total Seats: Number of Copilot licenses assigned. Active: Users with activity in the last 7 days. Inactive: Users with no recent activity. Pending Cancellation: Seats scheduled for removal. Use this to identify unused licenses and optimize seat allocation.',
    docsUrl:
      'https://docs.github.com/en/rest/copilot/copilot-user-management',
    apiEndpoint: 'GET /orgs/{org}/copilot/billing/seats',
  },
  trends: {
    title: 'Trends Over Time',
    description:
      'Multi-metric trend analysis showing all key Copilot metrics over time.',
    details:
      'Combines multiple metrics on a single chart to identify correlations and trends. Includes active users, engaged users, code suggestions, acceptances, and chat usage. Use the legend to toggle individual metrics on/off. Helpful for executive reporting and measuring the impact of Copilot rollout initiatives.',
    docsUrl:
      'https://docs.github.com/en/copilot/rolling-out-github-copilot-at-scale/analyzing-usage-over-time',
    apiEndpoint: 'GET /orgs/{org}/copilot/metrics',
  },
};
