import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import JobBoard from './pages/JobBoard';
import JobDetailsPage from './pages/JobDetailsPage';
import MentorshipPage from './pages/MentorshipPage';
import MentorDetailPage from './pages/MentorDetailPage';
import MentorMenteesPage from './pages/MentorMenteesPage';
import MentorApplicationsPage from './pages/MentorApplicationsPage';
import MentorRequestsPage from './pages/MentorRequestsPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import RegisteredEventsPage from './pages/RegisteredEventsPage';
import VerifyCardPage from './pages/VerifyCardPage';
import GivingPage from './pages/LegalPage';
import CompletedDonorsPage from './pages/CompletedDonorsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ApplicationsPage from './pages/ApplicationsPage';
import MessagesPage from './pages/MessagesPage';
import MessageConversationPage from './pages/MessageConversationPage';
import AdminDashboard from './pages/AdminDashboard';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import VerifiedAlumniRegistration from './components/VerifiedAlumniRegistration';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <SettingsProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          {/* Career, Mentorship & Events require login */}
          <Route path="/jobs" element={<ProtectedRoute><JobBoard /></ProtectedRoute>} />
          <Route path="/job/:id" element={<ProtectedRoute><JobDetailsPage /></ProtectedRoute>} />
          <Route path="/mentorship" element={<ProtectedRoute><MentorshipPage /></ProtectedRoute>} />
          <Route path="/mentorship/:id" element={<ProtectedRoute><MentorDetailPage /></ProtectedRoute>} />
          <Route path="/mentorship/my/mentees" element={<ProtectedRoute><MentorMenteesPage /></ProtectedRoute>} />
          <Route path="/mentorship/my/requests" element={<ProtectedRoute><MentorRequestsPage /></ProtectedRoute>} />
          <Route path="/mentorship/my/applications" element={<ProtectedRoute><MentorApplicationsPage /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
          <Route path="/events/registered" element={<ProtectedRoute><RegisteredEventsPage /></ProtectedRoute>} />
          <Route path="/events/:id" element={<ProtectedRoute><EventDetailPage /></ProtectedRoute>} />
          <Route path="/verify-card/:eventId/:userId" element={<VerifyCardPage />} />
          <Route path="/legal" element={<GivingPage />} />
          <Route path="/donors" element={<CompletedDonorsPage />} />
          <Route path="/privacy" element={<GivingPage />} />
          <Route path="/terms" element={<GivingPage />} />
          <Route path="/guidelines" element={<GivingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<VerifiedAlumniRegistration />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/message/:id" element={<MessageConversationPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        </SettingsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
