import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getUsers, initializeStorage, setLoggedInUser, getLoggedInUser } from '../services/storage';

function RecruiterLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    initializeStorage();
    if (getLoggedInUser()?.role === 'recruiter') navigate('/recruiter-dashboard');
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
    const user = users.find((item) => item.role === 'recruiter' && item.email === email && item.password === password);
    setTimeout(() => {
      if (user) {
        setLoggedInUser(user);
        navigate('/recruiter-dashboard');
      } else {
        setError('Invalid recruiter credentials. Try recruiter@jobportal.com / recruiter123');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <Layout title="Recruiter Login">
      <div className="auth-page">
        <div className="form-card">
          <h2>Recruiter Access</h2>
          <p className="muted">Sign in to post jobs, manage applicants, and update listings.</p>
          {error ? <div className="message error">{error}</div> : null}
          <form className="form" onSubmit={handleSubmit}>
            <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? <><span className="spinner"></span>Signing in...</> : 'Login'}
            </button>
          </form>
          <p className="small-text" style={{ marginTop: '1rem' }}>
            Candidate login? <Link to="/candidate-login">Go to candidate login</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default RecruiterLogin;
