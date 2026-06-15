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

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/job/:id" element={<JobDetailsPage />} />
          <Route path="/mentorship" element={<MentorshipPage />} />
          <Route path="/mentorship/:id" element={<MentorDetailPage />} />
          <Route path="/mentorship/my/mentees" element={<MentorMenteesPage />} />
          <Route path="/mentorship/my/requests" element={<MentorRequestsPage />} />
          <Route path="/mentorship/my/applications" element={<MentorApplicationsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/registered" element={<RegisteredEventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
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
      </AuthProvider>
    </div>
  );
}

export default App;
