import { Link, useNavigate } from 'react-router-dom';
import { clearLoggedInUser, getLoggedInUser } from '../services/storage';

function Layout({ children, title }) {
  const navigate = useNavigate();
  const user = getLoggedInUser();

  const handleLogout = () => {
    clearLoggedInUser();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="brand">JobPortal</Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/search-jobs">Search Jobs</Link>
            {user?.role === 'candidate' && <Link to="/candidate-dashboard">Candidate Dashboard</Link>}
            {user?.role === 'recruiter' && <Link to="/recruiter-dashboard">Recruiter Dashboard</Link>}
            {user?.role === 'admin' && <Link to="/admin-dashboard">Admin Dashboard</Link>}
            {!user ? (
              <>
                <Link to="/candidate-login">Candidate Login</Link>
                <Link to="/recruiter-login">Recruiter Login</Link>
              </>
            ) : (
              <button onClick={handleLogout}>Logout</button>
            )}
          </div>
        </div>
      </nav>

      <main className="container" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
        {title && <h2 style={{ marginBottom: '1rem' }}>{title}</h2>}
        {children}
      </main>
    </>
  );
}

export default Layout;
