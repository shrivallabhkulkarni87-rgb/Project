import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getApplications, getJobs, getLoggedInUser, getResumes, initializeStorage, saveApplications, saveResumes } from '../services/storage';

function CandidateDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [applications, setApplications] = useState([]);
  const [resumeMessage, setResumeMessage] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [uploadedName, setUploadedName] = useState('');
  const [loading, setLoading] = useState(true);

  const user = getLoggedInUser();

  useEffect(() => {
    initializeStorage();
    if (!user || user.role !== 'candidate') {
      navigate('/candidate-login');
      return;
    }
    const storedJobs = getJobs();
    const storedApplications = getApplications();
    const storedResumes = getResumes();
    setJobs(storedJobs);
    setApplications(storedApplications.filter((item) => item.candidateEmail === user.email));
    const latestResume = storedResumes.find((item) => item.userEmail === user.email);
    if (latestResume) setUploadedName(latestResume.fileName);
    setLoading(false);
  }, [navigate, user]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = `${job.title} ${job.company}`.toLowerCase().includes(search.toLowerCase());
      const matchesLocation = !location || job.location.toLowerCase() === location.toLowerCase();
      return matchesSearch && matchesLocation;
    });
  }, [jobs, search, location]);

  const handleApply = (jobId) => {
    const alreadyApplied = applications.some((app) => app.jobId === jobId);
    if (alreadyApplied) {
      setApplyMessage('You already applied for this job.');
      return;
    }
    const newApplication = { id: Date.now(), jobId, candidateEmail: user.email, candidateName: user.name, appliedAt: new Date().toLocaleString() };
    const nextApplications = [...applications, newApplication];
    setApplications(nextApplications);
    saveApplications([...getApplications(), newApplication]);
    setApplyMessage('Application submitted successfully!');
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setResumeMessage('Only PDF or DOC/DOCX files are allowed.');
      return;
    }
    const nextResume = { id: Date.now(), userEmail: user.email, fileName: file.name, uploadedAt: new Date().toLocaleString() };
    saveResumes([...getResumes(), nextResume]);
    setUploadedName(file.name);
    setResumeMessage('Resume uploaded successfully.');
  };

  return (
    <Layout title="Candidate Dashboard">
      <div className="dashboard">
        {loading ? <p>Loading...</p> : (
          <>
            <div className="row" style={{ marginBottom: '1rem' }}>
              <div>
                <h3>Welcome, {user?.name}</h3>
                <p className="muted">Search jobs, apply, and keep track of your applications.</p>
              </div>
              <Link className="btn" to="/resume-upload">Upload Resume</Link>
            </div>

            {applyMessage ? <div className="message success">{applyMessage}</div> : null}
            {resumeMessage ? <div className="message success">{resumeMessage}</div> : null}

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

            <div className="section-title">
              <h3>Available Jobs</h3>
            </div>
            <div className="grid grid-3">
              {filteredJobs.map((job) => (
                <div className="job-card" key={job.id}>
                  <span className="badge">{job.type}</span>
                  <h3>{job.title}</h3>
                  <p className="job-meta">{job.company} • {job.location}</p>
                  <p className="muted">{job.description}</p>
                  <div className="row" style={{ marginTop: '0.75rem' }}>
                    <Link className="btn small" to={`/jobs/${job.id}`}>Details</Link>
                    <button className="btn small" onClick={() => handleApply(job.id)}>Apply</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="section" style={{ marginTop: '1rem' }}>
              <h3>Your Applied Jobs</h3>
              {applications.length === 0 ? <p className="muted">No applications yet.</p> : (
                <div className="grid grid-2">
                  {applications.map((app) => {
                    const job = jobs.find((item) => item.id === app.jobId);
                    return (
                      <div className="list-card" key={app.id}>
                        <strong>{job?.title || 'Job'}</strong>
                        <p className="job-meta">Applied on {app.appliedAt}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="section">
              <h3>Resume Upload</h3>
              <div className="card" style={{ padding: '1rem' }}>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                {uploadedName ? <p className="small-text">Uploaded file: {uploadedName}</p> : <p className="small-text">No resume uploaded yet.</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default CandidateDashboard;
