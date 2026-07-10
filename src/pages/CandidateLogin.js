import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getUsers, initializeStorage, setLoggedInUser, getLoggedInUser } from '../services/storage';

function CandidateLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    initializeStorage();
    if (getLoggedInUser()?.role === 'candidate') navigate('/candidate-dashboard');
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    const users = getUsers();
    const user = users.find((item) => item.role === 'candidate' && item.email === email && item.password === password);
    setTimeout(() => {
      if (user) {
        setLoggedInUser(user);
        navigate('/candidate-dashboard');
      } else {
        setError('Invalid candidate credentials. Try candidate@jobportal.com / candidate123');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <Layout title="Candidate Login">
      <div className="auth-page">
        <div className="form-card">
          <h2>Candidate Access</h2>
          <p className="muted">Sign in to view jobs, apply, and upload your resume.</p>
          {error ? <div className="message error">{error}</div> : null}
          <form className="form" onSubmit={handleSubmit}>
            <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? <><span className="spinner"></span>Signing in...</> : 'Login'}
            </button>
          </form>
          <p className="small-text" style={{ marginTop: '1rem' }}>
            Need recruiter access? <Link to="/recruiter-login">Go to recruiter login</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default CandidateLogin;
