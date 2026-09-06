/**
 * Developer Health Engine
 * Analyzes developer activity quality, NOT just "high commits = good".
 * Consumes GitHub provider data.
 */

import { GitHubProvider } from "../providers/github.js";
import { getGithubRepos } from "../models/identifiers.js";
import { config } from "../config/env.js";

export interface DeveloperHealthReport {
  assetId: string;
  overallHealth: "STRONG" | "MODERATE" | "WEAK" | "INACTIVE" | "UNAVAILABLE";
  repos: RepoHealthSummary[];
  aggregate: {
    totalStars: number;
    totalForks: number;
    totalContributors: number;
    totalCommits4Weeks: number;
    activeContributors: number;
    contributorConcentration: "LOW" | "MODERATE" | "HIGH";  // bus factor
    commitConsistency: "CONSISTENT" | "SPORADIC" | "INACTIVE";
    lastRelease: string | null;
    releaseFrequency: string;
    codeVelocity: "ACCELERATING" | "STEADY" | "SLOWING" | "STALLED";
  };
  assessment: string;
  source: string;
  analyzedAt: string;
}

export interface RepoHealthSummary {
  repo: string;
  stars: number;
  forks: number;
  openIssues: number;
  contributors: number;
  commits4Weeks: number;
  lastPush: string | null;
  archived: boolean;
  language: string | null;
}

const github = new GitHubProvider();

export async function analyzeDeveloperHealth(assetId: string): Promise<DeveloperHealthReport> {
  const repos = getGithubRepos(assetId);

  const base: DeveloperHealthReport = {
    assetId,
    overallHealth: "UNAVAILABLE",
    repos: [],
    aggregate: {
      totalStars: 0, totalForks: 0, totalContributors: 0,
      totalCommits4Weeks: 0, activeContributors: 0,
      contributorConcentration: "HIGH",
      commitConsistency: "INACTIVE",
      lastRelease: null, releaseFrequency: "Unknown",
      codeVelocity: "STALLED",
    },
    assessment: "No GitHub repositories configured for this asset.",
    source: "github",
    analyzedAt: new Date().toISOString(),
  };

  if (repos.length === 0 || !config.github.enabled) {
    base.assessment = config.github.enabled
      ? "No GitHub repositories mapped for this asset."
      : "GitHub integration not configured (missing GITHUB_TOKEN).";
    return base;
  }

  const repoSummaries: RepoHealthSummary[] = [];
  let totalStars = 0, totalForks = 0, totalContributors = 0, totalCommits = 0;
  const allWeeklyCommits: number[][] = [];

  for (const repoPath of repos.slice(0, 3)) { // Max 3 repos per asset
    const [owner, repo] = repoPath.split("/");
    if (!owner || !repo) continue;

    const [repoInfo, commitData, contributors, releases] = await Promise.all([
      github.getRepoInfo(owner, repo),
      github.getCommitCount(owner, repo),
      github.getContributors(owner, repo),
      github.getReleases(owner, repo, 5),
    ]);

    if (!repoInfo) continue;

    const commits4w = commitData?.total4Weeks || 0;
    repoSummaries.push({
      repo: repoPath,
      stars: repoInfo.stars,
      forks: repoInfo.forks,
      openIssues: repoInfo.openIssues,
      contributors: contributors.length,
      commits4Weeks: commits4w,
      lastPush: repoInfo.pushedAt,
      archived: repoInfo.archived,
      language: repoInfo.language,
    });

    totalStars += repoInfo.stars;
    totalForks += repoInfo.forks;
    totalContributors += contributors.length;
    totalCommits += commits4w;

    if (commitData?.weekly) allWeeklyCommits.push(commitData.weekly);

    if (releases.length > 0 && !base.aggregate.lastRelease) {
      base.aggregate.lastRelease = releases[0].publishedAt;
      if (releases.length >= 2) {
        const span = new Date(releases[0].publishedAt).getTime() - new Date(releases[releases.length - 1].publishedAt).getTime();
        const avgDays = Math.round(span / (releases.length - 1) / 86_400_000);
        base.aggregate.releaseFrequency = avgDays <= 7 ? "Weekly" : avgDays <= 30 ? "Monthly" : avgDays <= 90 ? "Quarterly" : "Infrequent";
      }
    }
  }

  base.repos = repoSummaries;
  base.aggregate.totalStars = totalStars;
  base.aggregate.totalForks = totalForks;
  base.aggregate.totalContributors = totalContributors;
  base.aggregate.totalCommits4Weeks = totalCommits;

  // Contributor concentration (bus factor)
  if (totalContributors === 0) {
    base.aggregate.contributorConcentration = "HIGH";
  } else if (totalContributors >= 20) {
    base.aggregate.contributorConcentration = "LOW";
    base.aggregate.activeContributors = totalContributors;
  } else if (totalContributors >= 5) {
    base.aggregate.contributorConcentration = "MODERATE";
    base.aggregate.activeContributors = totalContributors;
  } else {
    base.aggregate.contributorConcentration = "HIGH";
    base.aggregate.activeContributors = totalContributors;
  }

  // Commit consistency & velocity from weekly data
  if (allWeeklyCommits.length > 0) {
    const combined = allWeeklyCommits[0].map((_, i) =>
      allWeeklyCommits.reduce((sum, arr) => sum + (arr[i] || 0), 0)
    );
    const recent4 = combined.slice(-4);
    const previous4 = combined.slice(-8, -4);

    const recentAvg = recent4.reduce((a, b) => a + b, 0) / recent4.length;
    const previousAvg = previous4.length > 0 ? previous4.reduce((a, b) => a + b, 0) / previous4.length : recentAvg;

    // Consistency
    const zeroWeeks = recent4.filter((w) => w === 0).length;
    if (zeroWeeks >= 3) base.aggregate.commitConsistency = "INACTIVE";
    else if (zeroWeeks >= 1) base.aggregate.commitConsistency = "SPORADIC";
    else base.aggregate.commitConsistency = "CONSISTENT";

    // Velocity
    if (previousAvg === 0 && recentAvg === 0) base.aggregate.codeVelocity = "STALLED";
    else if (recentAvg > previousAvg * 1.2) base.aggregate.codeVelocity = "ACCELERATING";
    else if (recentAvg < previousAvg * 0.5) base.aggregate.codeVelocity = "SLOWING";
    else base.aggregate.codeVelocity = "STEADY";
  }

  // Overall health
  if (totalCommits === 0 && repoSummaries.every((r) => r.archived)) {
    base.overallHealth = "INACTIVE";
    base.assessment = "All tracked repositories appear archived or inactive. Zero commits in the past 4 weeks.";
  } else if (totalCommits === 0) {
    base.overallHealth = "WEAK";
    base.assessment = "No commits detected in the past 4 weeks, but repositories are not archived. Development may have paused.";
  } else if (totalCommits < 5 || base.aggregate.commitConsistency === "SPORADIC") {
    base.overallHealth = "WEAK";
    base.assessment = `Only ${totalCommits} commits across ${repoSummaries.length} repo(s) in 4 weeks. Activity is sporadic.`;
  } else if (totalContributors < 3 || base.aggregate.contributorConcentration === "HIGH") {
    base.overallHealth = "MODERATE";
    base.assessment = `Active development (${totalCommits} commits/4w) but high contributor concentration — bus factor risk.`;
  } else {
    base.overallHealth = "STRONG";
    base.assessment = `Healthy development: ${totalCommits} commits/4w across ${totalContributors} contributors. ${base.aggregate.codeVelocity.toLowerCase()} velocity.`;
  }

  return base;
}
