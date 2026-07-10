import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { getLoggedInUser, getResumes, initializeStorage, saveResumes } from '../services/storage';

function ResumeUpload() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [uploadedName, setUploadedName] = useState('');
  const user = getLoggedInUser();

  useEffect(() => {
    initializeStorage();
    if (!user || user.role !== 'candidate') {
      navigate('/candidate-login');
      return;
    }
    const resumes = getResumes();
    const latestResume = resumes.find((item) => item.userEmail === user.email);
    if (latestResume) setUploadedName(latestResume.fileName);
  }, [navigate, user]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setMessage('Only PDF or DOC/DOCX files are allowed.');
      return;
    }
    const nextResume = { id: Date.now(), userEmail: user.email, fileName: file.name, uploadedAt: new Date().toLocaleString() };
    saveResumes([...getResumes(), nextResume]);
    setUploadedName(file.name);
    setMessage('Resume uploaded successfully.');
  };

  return (
    <Layout title="Resume Upload">
      <div className="form-card">
        <h3>Upload Your Resume</h3>
        <p className="muted">PDF or DOC/DOCX files are supported.</p>
        {message ? <div className="message success">{message}</div> : null}
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} />
        {uploadedName ? <p className="small-text">Current file: {uploadedName}</p> : <p className="small-text">No resume uploaded yet.</p>}
      </div>
    </Layout>
  );
}

export default ResumeUpload;
