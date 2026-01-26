import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import JobBoard from './pages/JobBoard';
import MentorshipPage from './pages/MentorshipPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/jobs" element={<JobBoard />} />
        <Route path="/mentorship" element={<MentorshipPage />} />
      </Routes>
    </div>
  );
}

export default App;