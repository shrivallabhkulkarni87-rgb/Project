import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { initializeStorage, getJobs } from '../services/storage';

function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    initializeStorage();
    setJobs(getJobs().slice(0, 3));
  }, []);

  return (
    <Layout title="Welcome to JobPortal">
      <section className="hero">
        <div className="container">
          <div className="hero-card">
            <h1>Find your next opportunity with confidence</h1>
            <p>Browse modern jobs, manage applications, upload your resume, and grow your career from one simple dashboard.</p>
            <div className="nav-links" style={{ justifyContent: 'flex-start', marginTop: '1rem' }}>
              <Link className="btn" to="/search-jobs">Explore Jobs</Link>
              <Link className="btn secondary" to="/candidate-login">Candidate Login</Link>
            </div>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3>Why candidates love JobPortal</h3>
            <ul>
              <li>Simple and responsive experience</li>
              <li>Instant job search and filters</li>
              <li>Easy resume uploads and applications</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Featured Jobs</h2>
          <Link to="/search-jobs">View all</Link>
        </div>
        <div className="grid grid-3">
          {jobs.map((job) => (
            <div className="job-card" key={job.id}>
              <span className="badge">{job.type}</span>
              <h3>{job.title}</h3>
              <p className="job-meta">{job.company} • {job.location}</p>
              <p className="muted">{job.description}</p>
              <Link className="btn small" to={`/jobs/${job.id}`} style={{ marginTop: '0.5rem' }}>View Details</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="container row">
          <span>© 2026 JobPortal. Built for beginners and modern teams.</span>
          <span>Blue and white • responsive • simple</span>
        </div>
      </footer>
    </Layout>
  );
}

export default Home;
