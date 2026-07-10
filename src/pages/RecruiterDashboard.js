import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getApplications, getJobs, getLoggedInUser, getUsers, initializeStorage, saveApplications, saveJobs } from '../services/storage';

function RecruiterDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({ id: '', title: '', company: '', location: '', salary: '', type: 'Full Time', description: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const user = getLoggedInUser();

  useEffect(() => {
    initializeStorage();
    if (!user || user.role !== 'recruiter') {
      navigate('/recruiter-login');
      return;
    }
    const storedJobs = getJobs();
    const storedApplications = getApplications();
    setJobs(storedJobs);
    setApplications(storedApplications);
    setLoading(false);
  }, [navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.description) {
      setMessage('Please complete all required fields.');
      return;
    }

    const jobData = {
      id: form.id ? Number(form.id) : Date.now(),
      title: form.title,
      company: form.company,
      location: form.location,
      salary: form.salary,
      type: form.type,
      description: form.description,
    };

    const nextJobs = form.id ? jobs.map((job) => (job.id === Number(form.id) ? jobData : job)) : [jobData, ...jobs];
    setJobs(nextJobs);
    saveJobs(nextJobs);
    setForm({ id: '', title: '', company: '', location: '', salary: '', type: 'Full Time', description: '' });
    setMessage(form.id ? 'Job updated successfully.' : 'Job added successfully.');
  };

  const handleEdit = (job) => {
    setForm({ id: job.id, title: job.title, company: job.company, location: job.location, salary: job.salary, type: job.type, description: job.description });
  };

  const handleDelete = (jobId) => {
    const nextJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(nextJobs);
    saveJobs(nextJobs);
    const nextApplications = applications.filter((app) => app.jobId !== jobId);
    setApplications(nextApplications);
    saveApplications(nextApplications);
    setMessage('Job deleted successfully.');
  };

  const applicantsForJob = (jobId) => applications.filter((app) => app.jobId === jobId);

  return (
    <Layout title="Recruiter Dashboard">
      <div className="dashboard">
        {loading ? <p>Loading...</p> : (
          <>
            <h3>Welcome, {user?.name}</h3>
            <p className="muted">Create, update, and manage your job postings.</p>
            {message ? <div className="message success">{message}</div> : null}

            <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
              <div className="form-card">
                <h3>{form.id ? 'Edit Job' : 'Add New Job'}</h3>
                <form className="form" onSubmit={handleSubmit}>
                  <input className="input" name="title" placeholder="Job title" value={form.title} onChange={handleChange} />
                  <input className="input" name="company" placeholder="Company" value={form.company} onChange={handleChange} />
                  <input className="input" name="location" placeholder="Location" value={form.location} onChange={handleChange} />
                  <input className="input" name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} />
                  <select className="select" name="type" value={form.type} onChange={handleChange}>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <textarea className="textarea" name="description" rows="4" placeholder="Job description" value={form.description} onChange={handleChange}></textarea>
                  <button className="btn" type="submit">{form.id ? 'Update Job' : 'Add Job'}</button>
                </form>
              </div>

              <div className="list-card">
                <h3>Your Jobs</h3>
                {jobs.map((job) => (
                  <div key={job.id} className="card" style={{ padding: '0.9rem', marginBottom: '0.75rem' }}>
                    <div className="row">
                      <div>
                        <strong>{job.title}</strong>
                        <p className="job-meta">{job.company} • {job.location}</p>
                      </div>
                      <div className="nav-links">
                        <button className="btn small" onClick={() => handleEdit(job)}>Edit</button>
                        <button className="btn small danger" onClick={() => handleDelete(job.id)}>Delete</button>
                      </div>
                    </div>
                    <div className="small-text">Applicants: {applicantsForJob(job.id).length}</div>
                    <ul>
                      {applicantsForJob(job.id).map((app) => <li key={app.id}>{app.candidateName} — {app.candidateEmail}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default RecruiterDashboard;
