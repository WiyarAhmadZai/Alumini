import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import JobBoard from './pages/JobBoard';
import MentorshipPage from './pages/MentorshipPage';
import EventsPage from './pages/EventsPage';
import GivingPage from './pages/LegalPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/jobs" element={<JobBoard />} />
        <Route path="/mentorship" element={<MentorshipPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/legal" element={<GivingPage />} />
        <Route path="/privacy" element={<GivingPage />} />
        <Route path="/terms" element={<GivingPage />} />
        <Route path="/guidelines" element={<GivingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </div>
  );
}

export default App;