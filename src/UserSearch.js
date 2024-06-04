import React, { useState, useEffect } from 'react';
import { TextInput, Spinner, Alert } from 'evergreen-ui';
import CommitsChart from './CommitsChart';
//import RepositoryModal from './RepositoryModal';

 const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [commits, setCommits] = useState({});

   useEffect(() => {
     const searchProfile = async () => {
      if (query.trim() === '') {
        setData(null);
        setRepos([]);
        return; 
      } 
      
      
      setLoading(true);
      setError(null); 

      try {
        const res = await fetch(`https://api.github.com/search/users?q=${query}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const result = await res.json();
        setData(result);
        if (result.items.length > 0) {
          const user = result.items[0];
          const reposRes = await fetch(user.repos_url);
          const reposData = await reposRes.json();
          setRepos(reposData);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      searchProfile();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const fetchCommits = async (repo) => {
      try {
        setLoading(true);
        setError(null);

        const commitsRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits`);
        if (!commitsRes.ok) {
          throw new Error(`HTTP error! status: ${commitsRes.status}`);
        }
        const commitsData = await commitsRes.json();
        const commitCounts = {};
        commitsData.forEach(commit => {
          const date = new Date(commit.commit.author.date).toLocaleDateString();
          commitCounts[date] = (commitCounts[date] || 0) + 1;
        });
        setCommits(commitCounts);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    if (selectedRepo) {
      fetchCommits(selectedRepo);
    }
  }, [selectedRepo]);

  return (
    <div>
      <h1>GitHub UseSearch</h1>
      <TextInput
        width="100%"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for users"
      />
  
      {loading && <Spinner />}
      {error && <Alert intent="danger" title={error.message} />}
      {data && (
        <div>
          <h2>Results:</h2>
          <ul>
            {data.items.map((user) => (
              <li key={user.id}>
                <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                  {user.login}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {repos.length > 0 && (
        <div>
          <h2>Repositories:</h2>
          <ul>
            {repos.map((repo) => (
              <li key={repo.id}>
                <button onClick={() => setSelectedRepo(repo)}>{repo.name}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedRepo && Object.keys(commits).length > 0 && (
        <CommitsChart commits={commits} />
      )}
    </div>
  );
};

export default UserSearch; 