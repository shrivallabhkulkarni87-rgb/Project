import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { getApplications, getJobs, getLoggedInUser, initializeStorage, saveApplications } from '../services/storage';

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getLoggedInUser();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    initializeStorage();
    if (!user || user.role !== 'candidate') {
      navigate('/candidate-login');
      return;
    }
    const currentJob = getJobs().find((item) => item.id === Number(id));
    setJob(currentJob || null);
  }, [id, navigate, user]);

  const handleApply = () => {
    const applications = getApplications();
    const duplicate = applications.some((app) => app.jobId === Number(id) && app.candidateEmail === user.email);
    if (duplicate) {
      setMessage('You have already applied to this job.');
      return;
    }

    const newApplication = {
      id: Date.now(),
      jobId: Number(id),
      candidateEmail: user.email,
      candidateName: user.name,
      appliedAt: new Date().toLocaleString(),
    };
    saveApplications([...applications, newApplication]);
    setMessage('Application submitted successfully.');
  };

  return (
    <Layout title="Apply for Job">
      {job ? (
        <div className="form-card">
          <h2>{job.title}</h2>
          <p className="job-meta">{job.company} • {job.location}</p>
          <p>{job.description}</p>
          {message ? <div className="message success">{message}</div> : null}
          <button className="btn" onClick={handleApply}>Submit Application</button>
          <p style={{ marginTop: '1rem' }}><Link to="/candidate-dashboard">Return to Dashboard</Link></p>
        </div>
      ) : (
        <p>No job found.</p>
      )}
    </Layout>
  );
}

export default ApplyJob;
