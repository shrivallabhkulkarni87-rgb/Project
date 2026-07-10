const STORAGE_KEYS = {
  users: 'job-portal-users',
  jobs: 'job-portal-jobs',
  applications: 'job-portal-applications',
  resumes: 'job-portal-resumes',
};

const defaultUsers = [
  { id: 1, name: 'Admin User', email: 'admin@jobportal.com', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Candidate One', email: 'candidate@jobportal.com', password: 'candidate123', role: 'candidate' },
  { id: 3, name: 'Recruiter One', email: 'recruiter@jobportal.com', password: 'recruiter123', role: 'recruiter' },
];

const defaultJobs = [
  { id: 1, title: 'Frontend Developer', company: 'Bright Labs', location: 'Remote', salary: '$80k', type: 'Full Time', description: 'Build modern web interfaces with React and accessibility in mind.' },
  { id: 2, title: 'React Developer', company: 'CodeCraft', location: 'New York', salary: '$95k', type: 'Full Time', description: 'Develop reusable UI components and improve app performance.' },
  { id: 3, title: 'Java Developer', company: 'SoftCore', location: 'Chicago', salary: '$90k', type: 'Hybrid', description: 'Work on enterprise backend systems and integrations.' },
  { id: 4, title: 'Python Developer', company: 'DataWorks', location: 'Austin', salary: '$88k', type: 'Remote', description: 'Create automation tools and data processing services.' },
  { id: 5, title: 'Full Stack Developer', company: 'Nova Tech', location: 'Seattle', salary: '$100k', type: 'Full Time', description: 'Collaborate across frontend and backend features in a fast-paced team.' },
];

export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.jobs)) {
    localStorage.setItem(STORAGE_KEYS.jobs, JSON.stringify(defaultJobs));
  }
  if (!localStorage.getItem(STORAGE_KEYS.applications)) {
    localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.resumes)) {
    localStorage.setItem(STORAGE_KEYS.resumes, JSON.stringify([]));
  }
}

export function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
}

export function getJobs() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.jobs) || '[]');
}

export function getApplications() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.applications) || '[]');
}

export function getResumes() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.resumes) || '[]');
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

export function saveJobs(jobs) {
  localStorage.setItem(STORAGE_KEYS.jobs, JSON.stringify(jobs));
}

export function saveApplications(applications) {
  localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(applications));
}

export function saveResumes(resumes) {
  localStorage.setItem(STORAGE_KEYS.resumes, JSON.stringify(resumes));
}

export function setLoggedInUser(user) {
  localStorage.setItem('job-portal-current-user', JSON.stringify(user));
}

export function getLoggedInUser() {
  return JSON.parse(localStorage.getItem('job-portal-current-user') || 'null');
}

export function clearLoggedInUser() {
  localStorage.removeItem('job-portal-current-user');
}
