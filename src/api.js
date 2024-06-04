export const fetchCommitData = async (owner, repo, page) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch commit data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching commit data:', error);
      return [];
    }
  };