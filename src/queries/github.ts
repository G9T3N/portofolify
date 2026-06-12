import { useQuery } from "@tanstack/react-query";

export function useGithubStats(username: string = "G9t3n") {
  return useQuery({
    queryKey: ["github-stats", username],
    queryFn: async () => {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      
      // Use real data to drive procedural metrics
      const publicRepos = data.public_repos || 0;
      const createdAt = new Date(data.created_at);
      const monthsActive = Math.max(1, (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30));
      
      // These numbers dynamically scale up as you create more repos and as your account ages
      let exactCommits: number | null = null;
      try {
        const commitRes = await fetch(`https://api.github.com/search/commits?q=author:${username}`, {
          headers: { Accept: "application/vnd.github.cloak-preview" }
        });
        if (commitRes.ok) {
          const commitData = await commitRes.json();
          exactCommits = commitData.total_count;
        }
      } catch (e) {
        console.warn("Failed to fetch exact commits", e);
      }
      
      let totalSizeKb = 0;
      try {
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          totalSizeKb = reposData.reduce((acc: number, repo: any) => acc + (repo.size || 0), 0);
        }
      } catch(e) {
        console.warn("Failed to fetch repos", e);
      }
      
      const commits = exactCommits !== null ? exactCommits : Math.floor(publicRepos * 85 + monthsActive * 12);
      
      // Calculate realistic lines of code based on real GitHub repo sizes (1 KB ~ 30 lines of code)
      // Fallback to procedural if API fails
      const linesOfCode = totalSizeKb > 0 
        ? Math.floor(totalSizeKb * 30) 
        : Math.floor(publicRepos * 3450 + commits * 15);
        
      const hoursDebugging = Math.floor(commits * 0.4 + monthsActive * 5);
      
      const coffeeCups = Math.floor(hoursDebugging * 1.2);
      
      return {
        commits,
        linesOfCode,
        hoursDebugging,
        coffeeCups,
        publicRepos,
        followers: data.followers || 0
      };
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
