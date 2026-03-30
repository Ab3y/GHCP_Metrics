import type {
  CopilotMetricsDay,
  CopilotSeat,
  CopilotSeatsResponse,
  ApiConfig,
  OrgContext,
} from './types';

const DEFAULT_BASE_URL = 'https://api.github.com';
const API_VERSION = '2022-11-28';

function buildHeaders(token: string): HeadersInit {
  return {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${token}`,
    'X-GitHub-Api-Version': API_VERSION,
  };
}

async function fetchJson<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, { headers: buildHeaders(token) });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `GitHub API error ${response.status}: ${response.statusText}. ${body}`,
    );
  }
  return response.json() as Promise<T>;
}

export function getMetricsUrl(
  baseUrl: string,
  ctx: OrgContext,
  params?: { since?: string; until?: string },
): string {
  let path: string;
  if (ctx.type === 'enterprise') {
    path = ctx.teamSlug
      ? `/enterprises/${ctx.name}/team/${ctx.teamSlug}/copilot/metrics`
      : `/enterprises/${ctx.name}/copilot/metrics`;
  } else {
    path = ctx.teamSlug
      ? `/orgs/${ctx.name}/team/${ctx.teamSlug}/copilot/metrics`
      : `/orgs/${ctx.name}/copilot/metrics`;
  }
  const url = new URL(path, baseUrl);
  if (params?.since) url.searchParams.set('since', params.since);
  if (params?.until) url.searchParams.set('until', params.until);
  url.searchParams.set('per_page', '100');
  return url.toString();
}

export function getSeatsUrl(
  baseUrl: string,
  orgName: string,
  page = 1,
): string {
  const url = new URL(`/orgs/${orgName}/copilot/billing/seats`, baseUrl);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', '100');
  return url.toString();
}

export async function fetchMetrics(
  config: ApiConfig,
  ctx: OrgContext,
  params?: { since?: string; until?: string },
): Promise<CopilotMetricsDay[]> {
  const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  const url = getMetricsUrl(baseUrl, ctx, params);
  return fetchJson<CopilotMetricsDay[]>(url, config.token);
}

export async function fetchSeats(
  config: ApiConfig,
  orgName: string,
): Promise<CopilotSeatsResponse> {
  const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  const url = getSeatsUrl(baseUrl, orgName);
  return fetchJson<CopilotSeatsResponse>(url, config.token);
}

export async function fetchAllSeats(
  config: ApiConfig,
  orgName: string,
): Promise<CopilotSeat[]> {
  const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  const allSeats: CopilotSeat[] = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const url = getSeatsUrl(baseUrl, orgName, page);
    const resp = await fetchJson<CopilotSeatsResponse>(url, config.token);
    allSeats.push(...resp.seats);
    hasMore = allSeats.length < resp.total_seats;
    page++;
  }
  return allSeats;
}
