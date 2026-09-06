/**
 * GitHub Developer Intelligence Provider
 * Implements DeveloperDataProvider interface.
 * Uses background/scheduled ingestion — does NOT poll on every page load.
 */

import { HttpClient } from "../infra/httpClient.js";
import { config } from "../config/env.js";
import { recordProviderSuccess, recordProviderError } from "../monitoring/providerHealth.js";
import type {
  DeveloperDataProvider,
  RepoInfo,
  WeeklyCommitActivity,
  ContributorInfo,
  ReleaseInfo,
} from "./interfaces.js";

export class GitHubProvider implements DeveloperDataProvider {
  readonly name = "github";
  private client: HttpClient;

  constructor() {
    const headers: Record<string, string> = { accept: "application/vnd.github.v3+json" };
    if (config.github.hasKey) {
      headers["Authorization"] = `token ${config.github.token}`;
    }
    this.client = new HttpClient({
      provider: "github",
      baseUrl: config.github.baseUrl,
      headers,
      timeout: 10_000,
    });
  }

  async getRepoInfo(owner: string, repo: string): Promise<RepoInfo | null> {
    const start = Date.now();
    try {
      const result = await this.client.get<any>(
        `/repos/${owner}/${repo}`,
        {},
        "DEVELOPER"
      );
      if (!result?.data) return null;

      recordProviderSuccess(this.name, Date.now() - start);
      const d = result.data;

      return {
        name: d.name,
        fullName: d.full_name,
        description: d.description || "",
        stars: d.stargazers_count || 0,
        forks: d.forks_count || 0,
        watchers: d.subscribers_count || 0,
        openIssues: d.open_issues_count || 0,
        language: d.language,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        pushedAt: d.pushed_at,
        license: d.license?.spdx_id || null,
        archived: d.archived || false,
      };
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return null;
    }
  }

  async getCommitActivity(owner: string, repo: string): Promise<WeeklyCommitActivity[]> {
    const start = Date.now();
    try {
      const result = await this.client.get<any[]>(
        `/repos/${owner}/${repo}/stats/code_frequency`,
        {},
        "DEVELOPER"
      );
      if (!result?.data) return [];

      recordProviderSuccess(this.name, Date.now() - start);

      // Returns array of [week_unix, additions, deletions]
      return result.data
        .slice(-12) // Last 12 weeks
        .map((w: any): WeeklyCommitActivity => ({
          weekStart: w[0] * 1000,
          totalCommits: 0, // code_frequency doesn't have commit counts
          additions: w[1] || 0,
          deletions: Math.abs(w[2] || 0),
        }));
    } catch (err: any) {
      // GitHub stats endpoints return 202 (computing) — retry after delay
      recordProviderError(this.name, err.message);
      return [];
    }
  }

  async getContributors(owner: string, repo: string): Promise<ContributorInfo[]> {
    const start = Date.now();
    try {
      const result = await this.client.get<any[]>(
        `/repos/${owner}/${repo}/contributors`,
        { per_page: 30 },
        "DEVELOPER"
      );
      if (!result?.data) return [];

      recordProviderSuccess(this.name, Date.now() - start);

      return result.data.map((c: any): ContributorInfo => ({
        login: c.login,
        contributions: c.contributions,
        avatarUrl: c.avatar_url,
      }));
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return [];
    }
  }

  async getReleases(owner: string, repo: string, limit = 10): Promise<ReleaseInfo[]> {
    const start = Date.now();
    try {
      const result = await this.client.get<any[]>(
        `/repos/${owner}/${repo}/releases`,
        { per_page: limit },
        "DEVELOPER"
      );
      if (!result?.data) return [];

      recordProviderSuccess(this.name, Date.now() - start);

      return result.data.map((r: any): ReleaseInfo => ({
        name: r.name || r.tag_name,
        tagName: r.tag_name,
        publishedAt: r.published_at,
        body: r.body || "",
        prerelease: r.prerelease,
      }));
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return [];
    }
  }

  /**
   * Get commit count for last N weeks (uses participation stats).
   * More accurate than code_frequency for actual commit counts.
   */
  async getCommitCount(owner: string, repo: string): Promise<{ total4Weeks: number; weekly: number[] } | null> {
    const start = Date.now();
    try {
      const result = await this.client.get<any>(
        `/repos/${owner}/${repo}/stats/participation`,
        {},
        "DEVELOPER"
      );
      if (!result?.data?.all) return null;

      recordProviderSuccess(this.name, Date.now() - start);

      const allWeeks: number[] = result.data.all;
      const last4 = allWeeks.slice(-4);

      return {
        total4Weeks: last4.reduce((a, b) => a + b, 0),
        weekly: allWeeks.slice(-12),
      };
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return null;
    }
  }
}
