import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import JobBoard from './pages/JobBoard';
import MentorshipPage from './pages/MentorshipPage';
import EventsPage from './pages/EventsPage';
import LegalPage from './pages/LegalPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/jobs" element={<JobBoard />} />
        <Route path="/mentorship" element={<MentorshipPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/privacy" element={<LegalPage />} />
        <Route path="/terms" element={<LegalPage />} />
        <Route path="/guidelines" element={<LegalPage />} />
      </Routes>
    </div>
  );
}

export default App;