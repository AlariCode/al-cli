import { ConfigRepository } from "./config.repository";
import { Octokit } from '@octokit/rest';

export class GitHubService {
    private static octokit: Octokit;

    public static async loadRepos(name: string) {
        const names = await ConfigRepository.loadDBKey<string>('githubNames');
        await GitHubService.auth();
        let res: any[] = [];
        try {
            const r = await GitHubService.octokit.repos.listForAuthenticatedUser({ username: name });
            res = [...res, ...r.data]
        } catch {}
        try {
            const r = await GitHubService.octokit.repos.listForOrg({ org: name });
            res = [...res, ...r.data]
        } catch {}

        return res;
    }

    public static async getPipelineStatus(owner: string, repo: string) {
        await GitHubService.auth();
        return GitHubService.octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
            owner,
            repo,
          })
    }

    private static async auth() {
        const token = await ConfigRepository.loadDBKey<string>('githubToken');
        GitHubService.octokit = new Octokit({ auth: token.data });
    }
}