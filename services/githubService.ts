import { GeneratedPage } from '../types';

export const fetchRepoReadme = async (repoUrl: string): Promise<string> => {
  // Extract owner and repo from URL
  // Format: https://github.com/owner/repo
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  
  if (!match) {
    throw new Error("Invalid GitHub URL format");
  }

  const [_, owner, repo] = match;

  try {
    // Attempt to fetch raw README from main or master
    const branches = ['main', 'master'];
    for (const branch of branches) {
      const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`);
      if (response.ok) {
        return await response.text();
      }
    }
    throw new Error("Could not fetch raw README");
  } catch (error) {
    console.warn("Direct README fetch failed (likely CORS or private repo), falling back to Gemini inference based on URL context.", error);
    // If we can't fetch the readme directly due to CORS/Private, we return a string
    // that tells Gemini to infer from the repo name/structure known in its training data 
    // or generic assumptions.
    return `Could not fetch raw content for ${owner}/${repo}. Please infer context based on a ${repo} project typically found on GitHub.`;
  }
};

export const fetchRepoStats = async (repoUrl: string) => {
    // In a real production app, this would use the GitHub API with a proxy.
    // For this demo, we return plausible mock data or use public API if accessible.
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return { stars: 120, forks: 45, issues: 12 };

    const [_, owner, repo] = match;
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if(response.ok) {
            const data = await response.json();
            return {
                stars: data.stargazers_count,
                forks: data.forks_count,
                issues: data.open_issues_count
            };
        }
    } catch (e) {
        // Fallback
    }

    return { stars: Math.floor(Math.random() * 5000), forks: Math.floor(Math.random() * 500), issues: Math.floor(Math.random() * 50) };
}
