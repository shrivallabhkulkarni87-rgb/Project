import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CandidateLogin from './pages/CandidateLogin.jsx';
import RecruiterLogin from './pages/RecruiterLogin.jsx';
import CandidateDashboard from './pages/CandidateDashboard.jsx';
import RecruiterDashboard from './pages/RecruiterDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import JobDetails from './pages/JobDetails.jsx';
import ApplyJob from './pages/ApplyJob.jsx';
import ResumeUpload from './pages/ResumeUpload.jsx';
import SearchJobs from './pages/SearchJobs.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/candidate-login" element={<CandidateLogin />} />
      <Route path="/recruiter-login" element={<RecruiterLogin />} />
      <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
      <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/apply/:id" element={<ApplyJob />} />
      <Route path="/resume-upload" element={<ResumeUpload />} />
      <Route path="/search-jobs" element={<SearchJobs />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
