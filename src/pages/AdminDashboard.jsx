import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { getApplications, getJobs, getLoggedInUser, getUsers, initializeStorage, saveApplications, saveJobs, saveUsers } from '../services/storage';

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');
  const user = getLoggedInUser();

  useEffect(() => {
    initializeStorage();
    if (!user || user.role !== 'admin') {
      navigate('/candidate-login');
      return;
    }
    setUsers(getUsers());
    setJobs(getJobs());
    setApplications(getApplications());
  }, [navigate, user]);

  const deleteUser = (userId) => {
    const nextUsers = users.filter((item) => item.id !== userId);
    setUsers(nextUsers);
    saveUsers(nextUsers);
    setMessage('User deleted.');
  };

  const deleteJob = (jobId) => {
    const nextJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(nextJobs);
    saveJobs(nextJobs);
    const nextApplications = applications.filter((app) => app.jobId !== jobId);
    setApplications(nextApplications);
    saveApplications(nextApplications);
    setMessage('Job deleted.');
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="dashboard">
        <h3>Welcome, {user?.name}</h3>
        <p className="muted">Monitor users, jobs, and applications from one place.</p>
        {message ? <div className="message success">{message}</div> : null}

        <div className="stats">
          <div className="stat-card">
            <h3>{users.filter((item) => item.role === 'candidate').length}</h3>
            <p>Total Candidates</p>
          </div>
          <div className="stat-card">
            <h3>{users.filter((item) => item.role === 'recruiter').length}</h3>
            <p>Total Recruiters</p>
          </div>
          <div className="stat-card">
            <h3>{jobs.length}</h3>
            <p>Total Jobs</p>
          </div>
          <div className="stat-card">
            <h3>{applications.length}</h3>
            <p>Total Applications</p>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="list-card">
            <h3>Users</h3>
            {users.map((item) => (
              <div key={item.id} className="row" style={{ padding: '0.7rem 0', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <strong>{item.name}</strong>
                  <p className="job-meta">{item.email} • <span className="profile-chip">{item.role}</span></p>
                </div>
                {item.role !== 'admin' ? <button className="btn small danger" onClick={() => deleteUser(item.id)}>Delete</button> : null}
              </div>
            ))}
          </div>

          <div className="list-card">
            <h3>Jobs</h3>
            {jobs.map((job) => (
              <div key={job.id} className="row" style={{ padding: '0.7rem 0', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <strong>{job.title}</strong>
                  <p className="job-meta">{job.company} • {job.location}</p>
                </div>
                <button className="btn small danger" onClick={() => deleteJob(job.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
