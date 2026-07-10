import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getJobs, initializeStorage } from '../services/storage';

function SearchJobs() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const jobs = useMemo(() => getJobs(), []);

  initializeStorage();

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = `${job.title} ${job.company}`.toLowerCase().includes(search.toLowerCase());
      const matchesLocation = !location || job.location.toLowerCase() === location.toLowerCase();
      return matchesSearch && matchesLocation;
    });
  }, [jobs, search, location]);

  return (
    <Layout title="Search Jobs">
      <div className="search-box">
        <input className="input" placeholder="Search by title or company" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="select" value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">All locations</option>
          <option value="Remote">Remote</option>
          <option value="New York">New York</option>
          <option value="Chicago">Chicago</option>
          <option value="Austin">Austin</option>
          <option value="Seattle">Seattle</option>
        </select>
      </div>
      <div className="grid grid-3">
        {filteredJobs.map((job) => (
          <div className="job-card" key={job.id}>
            <span className="badge">{job.type}</span>
            <h3>{job.title}</h3>
            <p className="job-meta">{job.company} • {job.location}</p>
            <p className="muted">{job.description}</p>
            <Link className="btn small" to={`/jobs/${job.id}`} style={{ marginTop: '0.6rem' }}>View Details</Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default SearchJobs;
