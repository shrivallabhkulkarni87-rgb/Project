import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { getJobs, initializeStorage } from '../services/storage';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    initializeStorage();
    const currentJob = getJobs().find((item) => item.id === Number(id));
    setJob(currentJob || null);
  }, [id]);

  return (
    <Layout title="Job Details">
      {job ? (
        <div className="form-card">
          <span className="badge">{job.type}</span>
          <h2>{job.title}</h2>
          <p className="job-meta">{job.company} • {job.location} • {job.salary}</p>
          <p>{job.description}</p>
          <div className="row" style={{ marginTop: '1rem' }}>
            <Link className="btn" to={`/apply/${job.id}`}>Apply Now</Link>
            <Link className="btn secondary" to="/search-jobs">Back to Jobs</Link>
          </div>
        </div>
      ) : (
        <p>No job found.</p>
      )}
    </Layout>
  );
}

export default JobDetails;
