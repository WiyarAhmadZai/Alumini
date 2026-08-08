import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../utils/date';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiLink, FiMail, FiPhone, FiMapPin, FiEdit, FiShare2, FiUser, FiUsers, FiBriefcase, FiBookOpen, FiSettings, FiAward, FiTrendingUp, FiStar, FiTarget, FiTrash2, FiPlus, FiCamera, FiX, FiMessageSquare, FiSend, FiPaperclip, FiFacebook, FiTwitter, FiLinkedin, FiClock, FiCalendar, FiExternalLink, FiBell, FiDownload, FiCheckCircle, FiXCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Cropper from 'react-easy-crop';
import Swal from 'sweetalert2';
import alumniService from '../services/alumniService';
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import jobService from '../services/jobService';
import messageService from '../services/messageService';
import eventService from '../services/eventService';
import EventCardModal from '../components/event/EventCardModal';
import Modal from '../components/ui/Modal';
import mentorService from '../services/mentorService';
import notificationService from '../services/notificationService';
import successStoryService from '../services/successStoryService';

const timeAgo = (dateStr, t) => {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return t('profile.time.justNow');
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t('profile.time.minutesAgo', { n: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t('profile.time.hoursAgo', { n: hours });
  const days = Math.floor(hours / 24);
  if (days < 30) return t('profile.time.daysAgo', { n: days });
  const months = Math.floor(days / 30);
  if (months < 12) return t('profile.time.monthsAgo', { n: months });
  const years = Math.floor(months / 12);
  return t('profile.time.yearsAgo', { n: years });
};

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [showEventCard, setShowEventCard] = useState(false);
  const [cardEventData, setCardEventData] = useState(null);
  const [cardRegData, setCardRegData] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const [activeModal, setActiveModal] = useState(null); // basic | experience | education | skill | achievement | share | contact | mentor
  const [activeTab, setActiveTab] = useState('overview'); // overview | jobs | messages | events | mentees | requests | applications | story

  // My success story (with review status + admin message) — editable here.
  const [successStory, setSuccessStory] = useState(null);
  const [editingStory, setEditingStory] = useState(false);
  const [storyDraft, setStoryDraft] = useState('');
  const [savingStory, setSavingStory] = useState(false);

  // Open the requested tab when arriving from a notification (?tab=story).
  // Depends on location.search so it also switches the tab when the query
  // changes WITHOUT a remount — e.g. clicking a notification while already on
  // the profile page (previously this only ran on mount, so the tab wouldn't
  // change until a manual refresh).
  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  const [myMentor, setMyMentor] = useState(null);
  const [viewedProfileMentor, setViewedProfileMentor] = useState(null);
  const [requestingMentorship, setRequestingMentorship] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const [mentorForm, setMentorForm] = useState({
    title: '',
    company: '',
    bio: '',
    expertise: [],
    faculty: '',
    years_of_experience: '',
  });
  const [mentorExpertiseInput, setMentorExpertiseInput] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactForm, setContactForm] = useState({
    location: ''
  });

  const [experienceAttachment, setExperienceAttachment] = useState(null);
  const [educationAttachment, setEducationAttachment] = useState(null);
  const [skillAttachment, setSkillAttachment] = useState(null);
  const [achievementAttachment, setAchievementAttachment] = useState(null);

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const tabsScrollRef = useRef(null);

  const scrollTabs = (direction) => {
    if (!tabsScrollRef.current) return;
    const amount = direction === 'left' ? -200 : 200;
    tabsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');

  const [cropOpen, setCropOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState(null); // 'profile' | 'cover'
  const [cropImageSrc, setCropImageSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [basicForm, setBasicForm] = useState({
    phone: '',
    current_job_title: '',
    current_company: '',
    location: '',
    linkedin_profile: '',
    bio: ''
  });

  const emptyExperience = useMemo(() => ({
    job_title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: ''
  }), []);

  const emptyEducation = useMemo(() => ({
    institution: '',
    degree: '',
    field_of_study: '',
    start_year: '',
    end_year: '',
    grade: '',
    description: ''
  }), []);

  const emptySkill = useMemo(() => ({
    name: '',
    category: '',
    proficiency: ''
  }), []);

  const emptyAchievement = useMemo(() => ({
    title: '',
    issuer: '',
    year: '',
    category: '',
    description: ''
  }), []);

  const shareUrl = useMemo(() => {
    if (!profile) return '';
    return `${window.location.origin}/profile/${profile.id}`;
  }, [profile]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sharePlatforms = useMemo(() => [
    {
      name: 'WhatsApp',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#25D366" />
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(`Check out this profile: ${shareUrl}`)}`
    },
    {
      name: 'IMO',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#1DA1F2" />
          <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      url: `https://imo.im/share?text=${encodeURIComponent(`Check out this profile: ${shareUrl}`)}`
    },
    {
      name: 'Telegram',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#0088cc" />
          <path d="M9.5 14.5l2-2 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out ${profile?.name}'s profile`)}`
    },
    {
      name: 'Messenger',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 11 5.5l2.5 2.5L16 8l-2.5 2.5L16 13.5 13.5 16 11 13.5 8.5 16 6 13.5l2.5-2.5L6 8l2.5-2.5L11 8l2.5-2.5z" fill="#0084FF" />
        </svg>
      ),
      url: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=YOUR_APP_ID`
    },
    {
      name: 'Facebook',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Snapchat',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#FFFC00" />
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" fill="#FFFC00" />
        </svg>
      ),
      url: `https://www.snapchat.com/add?text=${encodeURIComponent(`Check out this profile: ${shareUrl}`)}`
    },
    {
      name: 'Twitter',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill="#1DA1F2" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out ${profile?.name}'s profile`)}`
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Email',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#EA4335" />
        </svg>
      ),
      url: `mailto:?subject=${encodeURIComponent(`Profile of ${profile?.name}`)}&body=${encodeURIComponent(`I thought you might be interested in this profile: ${shareUrl}`)}`
    }
  ], [shareUrl, profile]);

  const [experienceForm, setExperienceForm] = useState(emptyExperience);
  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [achievementForm, setAchievementForm] = useState(emptyAchievement);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');

        if (id) {
          // Viewing a profile by ID — load it first, then determine ownership
          const response = await alumniService.getById(id);
          setProfile(response.data);

          // If authenticated, compare the viewed ID against the logged-in user's ID
          if (authService.isAuthenticated()) {
            const storedUser = localStorage.getItem('alumni_user');
            const currentUser = storedUser ? JSON.parse(storedUser) : null;
            if (currentUser && String(currentUser.id) === String(id)) {
              // This is their own profile accessed by ID — treat as owner
              setIsOwner(true);
            } else {
              setIsOwner(false);
            }
          } else {
            setIsOwner(false);
          }
        } else {
          // No ID in URL — must be authenticated to view own profile
          if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
          }

          const response = await alumniService.getMe();
          setProfile(response.data);
          setIsOwner(true);
        }
      } catch (err) {
        const msg = err.response?.data?.message || t('profile.errors.loadProfile');
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, id]);

  const [mentorRequests, setMentorRequests] = useState([]);
  const [loadingMentorRequests, setLoadingMentorRequests] = useState(false);
  const [myMentees, setMyMentees] = useState([]);
  const [loadingMentees, setLoadingMentees] = useState(false);
  const [totalMentees, setTotalMentees] = useState(0);
  const [profileNotifications, setProfileNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    if (isOwner && profile) {
      fetchAppliedJobs();
      fetchMessages();
      fetchRegisteredEvents();
      // Load own mentor profile
      mentorService.getMyMentor().then(res => {
        if (res.data) {
          setMyMentor(res.data);
          setLoadingMentorRequests(true);
          mentorService.getRequests().then(r => {
            setMentorRequests(r.data || []);
          }).catch(() => { }).finally(() => setLoadingMentorRequests(false));
          // Load preview of mentees (limit 3)
          setLoadingMentees(true);
          mentorService.getMyMentees(3).then(r => {
            setMyMentees(r.data?.mentees || []);
            setTotalMentees(r.data?.total || 0);
          }).catch(() => { }).finally(() => setLoadingMentees(false));
        }
      }).catch(() => { });
      // Load own mentor applications (requests sent to others)
      setLoadingApplications(true);
      mentorService.getMyApplications().then(res => {
        setMyApplications(res.data || []);
      }).catch(() => { }).finally(() => setLoadingApplications(false));
      // Load notifications
      setLoadingNotifications(true);
      notificationService.getAll().then(res => {
        const notifs = (res.data?.data || []).filter(n => n.type === 'status_change' || n.type === 'event_registration');
        setProfileNotifications(notifs);
      }).catch(() => { }).finally(() => setLoadingNotifications(false));
      // Load my success story (status + admin message)
      successStoryService.getMine().then(setSuccessStory).catch(() => { });
    }
  }, [isOwner, profile]);

  const saveStory = async () => {
    if (storyDraft.trim().length < 20) {
      Swal.fire({ icon: 'warning', title: t('profile.alerts.error', 'Error'), text: t('profile.story.tooShort', 'Please write at least 20 characters.') });
      return;
    }
    setSavingStory(true);
    try {
      const res = await successStoryService.updateMine(storyDraft.trim());
      setSuccessStory(res.data);
      setEditingStory(false);
      Swal.fire({ icon: 'success', title: t('profile.story.saved', 'Saved'), text: t('profile.story.savedText', 'Your story was updated and sent for review.') });
    } catch (e) {
      Swal.fire({ icon: 'error', title: t('profile.alerts.error', 'Error'), text: e?.response?.data?.message || t('profile.story.saveError', 'Could not save your story.') });
    } finally {
      setSavingStory(false);
    }
  };

  // When viewing someone else's profile, check if they're a mentor
  useEffect(() => {
    if (!isOwner && profile?.id) {
      mentorService.getByAlumni(profile.id).then(res => {
        if (res.data) setViewedProfileMentor(res.data);
      }).catch(() => { });
    }
  }, [isOwner, profile]);

  const refreshProfile = async () => {
    if (id) {
      const response = await alumniService.getById(id);
      setProfile(response.data);
    } else {
      const response = await alumniService.getMe();
      setProfile(response.data);
      // Keep the navbar avatar in sync — it reads the user from AuthContext, so
      // without this a freshly uploaded profile image (or edited name) wouldn't
      // appear in the navbar until a full page reload.
      updateUser(response.data);
    }
  };

  const fetchAppliedJobs = async () => {
    if (!isOwner) return;

    try {
      setLoadingJobs(true);
      // Note: This would require a new endpoint in the backend
      // For now, we'll use a placeholder - you'll need to create this endpoint
      const response = await jobService.getUserApplications();
      setAppliedJobs(response.data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applied jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleRemoveApplication = async (applicationId, jobTitle) => {
    try {
      const result = await Swal.fire({
        title: t('profile.alerts.removeApplicationTitle'),
        html: t('profile.alerts.removeApplicationHtml', { title: jobTitle }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: t('profile.alerts.yesRemove'),
        cancelButtonText: t('profile.alerts.cancel')
      });

      if (result.isConfirmed) {
        await jobService.removeApplication(applicationId);

        // Refresh applied jobs list
        await fetchAppliedJobs();

        Swal.fire({
          icon: 'success',
          title: t('profile.alerts.applicationRemovedTitle'),
          text: t('profile.alerts.applicationRemovedText'),
          timer: 2000,
          timerProgressBar: true,
          position: 'center',
          backdrop: 'rgba(0, 0, 0, 0.4)'
        });
      }
    } catch (error) {
      console.error('Remove application error:', error?.response?.data || error);
      Swal.fire({
        icon: 'error',
        title: t('profile.alerts.error'),
        text: error?.response?.data?.message || t('profile.alerts.removeApplicationError'),
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const response = await messageService.getUserMessages(1, 3); // Only get first 3 for profile page
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      setLoadingEvents(true);
      const response = await eventService.getMyRegistrations();

      // Filter out cancelled registrations
      const activeRegistrations = (response.data || []).filter(reg => reg.status !== 'cancelled');

      setRegisteredEvents(activeRegistrations);
    } catch (error) {
      console.error('Failed to fetch registered events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingItem(null);
    setModalError('');
    setExperienceAttachment(null);
    setEducationAttachment(null);
    setSkillAttachment(null);
    setAchievementAttachment(null);
    setExperienceForm(emptyExperience);
    setEducationForm(emptyEducation);
    setSkillForm(emptySkill);
    setAchievementForm(emptyAchievement);
  };

  const openLightbox = (src) => {
    if (!src) return;
    setLightboxSrc(src);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setTimeout(() => setLightboxSrc(''), 200);
  };

  const closeCrop = () => {
    setCropOpen(false);
    setCropTarget(null);
    setCropImageSrc('');
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const openCrop = (file, target) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setCropTarget(target);
    setCropImageSrc(objectUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCropOpen(true);
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCenteredCropPixels = (imageWidth, imageHeight, aspect) => {
    const imageAspect = imageWidth / imageHeight;

    if (imageAspect > aspect) {
      const cropHeight = imageHeight;
      const cropWidth = Math.round(cropHeight * aspect);
      const x = Math.round((imageWidth - cropWidth) / 2);
      return { x, y: 0, width: cropWidth, height: cropHeight };
    }

    const cropWidth = imageWidth;
    const cropHeight = Math.round(cropWidth / aspect);
    const y = Math.round((imageHeight - cropHeight) / 2);
    return { x: 0, y, width: cropWidth, height: cropHeight };
  };

  const getCroppedBlob = async (imageSrc, cropPixels) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92);
    });
  };

  const handleCropSave = async () => {
    if (!cropImageSrc || !cropTarget) return;

    try {
      setSaving(true);
      const image = await createImage(cropImageSrc);
      const aspect = cropTarget === 'cover' ? 3 / 1 : 1;
      const cropPixels = croppedAreaPixels || getCenteredCropPixels(image.naturalWidth || image.width, image.naturalHeight || image.height, aspect);

      const blob = await getCroppedBlob(cropImageSrc, cropPixels);
      if (!blob) throw new Error(t('profile.errors.cropImage'));

      const file = new File([blob], `${cropTarget}-image.jpg`, { type: 'image/jpeg' });

      if (cropTarget === 'profile') {
        await alumniService.uploadProfileImage(file);
      } else {
        await alumniService.uploadCoverImage(file);
      }

      await refreshProfile();
      closeCrop();
    } catch (e) {
      setError(e.response?.data?.message || t('profile.errors.uploadImage'));
    } finally {
      setSaving(false);
    }
  };

  const openBasicModal = () => {
    setModalError('');
    setBasicForm({
      phone: profile?.phone || '',
      current_job_title: profile?.current_job_title || '',
      current_company: profile?.current_company || '',
      location: profile?.location || '',
      linkedin_profile: profile?.linkedin_profile || '',
      bio: profile?.bio || ''
    });
    setActiveModal('basic');
  };

  const openExperienceModal = (item = null) => {
    setModalError('');
    setEditingItem(item);
    setExperienceAttachment(null);
    setExperienceForm(item ? {
      job_title: item.job_title || '',
      company: item.company || '',
      location: item.location || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      is_current: !!item.is_current,
      description: item.description || ''
    } : emptyExperience);
    setActiveModal('experience');
  };

  const openEducationModal = (item = null) => {
    setModalError('');
    setEditingItem(item);
    setEducationAttachment(null);
    setEducationForm(item ? {
      institution: item.institution || '',
      degree: item.degree || '',
      field_of_study: item.field_of_study || '',
      start_year: item.start_year ?? '',
      end_year: item.end_year ?? '',
      grade: item.grade || '',
      description: item.description || ''
    } : emptyEducation);
    setActiveModal('education');
  };

  const openSkillModal = (item = null) => {
    setModalError('');
    setEditingItem(item);
    setSkillAttachment(null);
    setSkillForm(item ? {
      name: item.name || '',
      category: item.category || '',
      proficiency: item.proficiency ?? ''
    } : emptySkill);
    setActiveModal('skill');
  };

  const openAchievementModal = (item = null) => {
    setModalError('');
    setEditingItem(item);
    setAchievementAttachment(null);
    setAchievementForm(item ? {
      title: item.title || '',
      issuer: item.issuer || '',
      year: item.year || '',
      category: item.category || '',
      description: item.description || ''
    } : emptyAchievement);
    setActiveModal('achievement');
  };

  const openContactModal = () => {
    setModalError('');
    setContactForm({
      location: profile?.location || ''
    });
    setActiveModal('contact');
  };

  const openMentorModal = () => {
    setModalError('');
    setMentorExpertiseInput('');
    if (myMentor) {
      setMentorForm({
        title: myMentor.title || profile?.current_job_title || '',
        company: myMentor.company || profile?.current_company || '',
        bio: myMentor.bio || profile?.bio || '',
        expertise: myMentor.expertise || [],
        faculty: myMentor.faculty || profile?.faculty || '',
        years_of_experience: myMentor.years_of_experience ?? '',
      });
    } else {
      setMentorForm({
        title: profile?.current_job_title || '',
        company: profile?.current_company || '',
        bio: profile?.bio || '',
        expertise: [],
        faculty: profile?.faculty || '',
        years_of_experience: '',
      });
    }
    setActiveModal('mentor');
  };

  const handleSaveMentor = async () => {
    try {
      setSaving(true);
      setModalError('');
      const res = await mentorService.save({
        ...mentorForm,
        years_of_experience: mentorForm.years_of_experience !== '' ? Number(mentorForm.years_of_experience) : null,
      });
      setMyMentor(res.data);
      closeModal();
      Swal.fire({ icon: 'success', title: t('profile.alerts.mentorSavedTitle'), timer: 1800, showConfirmButton: false });
    } catch (e) {
      setModalError(e.response?.data?.message || t('profile.alerts.saveMentorError'));
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMentor = async () => {
    const result = await Swal.fire({
      title: t('profile.alerts.removeMentorTitle'),
      text: t('profile.alerts.removeMentorText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: t('profile.alerts.yesRemoveShort'),
    });
    if (!result.isConfirmed) return;
    try {
      await mentorService.remove();
      setMyMentor(null);
      closeModal();
    } catch (e) {
      Swal.fire({ icon: 'error', title: t('profile.alerts.error'), text: t('profile.alerts.removeMentorError') });
    }
  };

  const addMentorExpertise = () => {
    const tag = mentorExpertiseInput.trim();
    if (tag && !mentorForm.expertise.includes(tag)) {
      setMentorForm(prev => ({ ...prev, expertise: [...prev.expertise, tag] }));
    }
    setMentorExpertiseInput('');
  };

  const removeMentorExpertise = (tag) => {
    setMentorForm(prev => ({ ...prev, expertise: prev.expertise.filter(e => e !== tag) }));
  };

  const handleRequestMentorshipFromProfile = async () => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: t('profile.alerts.requestMentorshipTitle'),
      html: `<p style="color:#4b5563;font-size:13px;margin-bottom:12px">${t('profile.alerts.requestMentorshipIntro', { name: profile?.name })}</p>
             <input id="swal-wa" class="swal2-input" placeholder="${t('profile.alerts.whatsappPlaceholder')}" style="font-size:13px;" />
             <textarea id="swal-msg" class="swal2-textarea" placeholder="${t('profile.alerts.introducePlaceholder')}" style="font-size:13px;resize:none;height:80px;"></textarea>`,
      showCancelButton: true,
      confirmButtonText: t('profile.alerts.sendRequest'),
      confirmButtonColor: '#2563eb',
      cancelButtonText: t('profile.alerts.cancel'),
      preConfirm: () => ({
        message: document.getElementById('swal-msg')?.value || '',
        whatsapp_number: document.getElementById('swal-wa')?.value || '',
      }),
    });
    if (!isConfirmed) return;
    setRequestingMentorship(true);
    try {
      await mentorService.requestMentorship(viewedProfileMentor.id, formValues?.message, formValues?.whatsapp_number);
      Swal.fire({
        icon: 'success',
        title: t('profile.alerts.requestSentTitle'),
        text: t('profile.alerts.requestSentText', { name: profile?.name }),
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      const alreadySent = err.response?.data?.status === 'already_requested';
      Swal.fire({
        icon: alreadySent ? 'info' : 'error',
        title: alreadySent ? t('profile.alerts.alreadyRequestedTitle') : t('profile.alerts.error'),
        text: err.response?.data?.message || t('profile.alerts.sendRequestError'),
      });
    } finally {
      setRequestingMentorship(false);
    }
  };

  const handleSaveBasic = async () => {
    try {
      setSaving(true);
      setModalError('');
      await alumniService.updateMe(basicForm);
      await refreshProfile();
      closeModal();
    } catch (e) {
      setModalError(e.response?.data?.message || t('profile.alerts.saveChangesError'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveExperience = async () => {
    try {
      setSaving(true);
      setModalError('');
      if (editingItem?.id) {
        await alumniService.updateExperience(editingItem.id, experienceForm, experienceAttachment);
      } else {
        await alumniService.createExperience(experienceForm, experienceAttachment);
      }
      await refreshProfile();
      closeModal();
    } catch (e) {
      setModalError(e.response?.data?.message || t('profile.alerts.saveExperienceError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (id) => {
    const result = await Swal.fire({
      title: t('profile.alerts.areYouSure'),
      text: t('profile.alerts.deleteExperienceText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('profile.alerts.yesDelete'),
      cancelButtonText: t('profile.alerts.cancel')
    });

    if (result.isConfirmed) {
      try {
        await alumniService.deleteExperience(id);
        await refreshProfile();
        Swal.fire(t('profile.alerts.deletedTitle'), t('profile.alerts.experienceDeleted'), 'success');
      } catch (e) {
        Swal.fire(t('profile.alerts.error'), e.response?.data?.message || t('profile.alerts.deleteExperienceError'), 'error');
      }
    }
  };

  const handleSaveEducation = async () => {
    try {
      setSaving(true);
      setModalError('');
      if (editingItem?.id) {
        await alumniService.updateEducation(editingItem.id, educationForm, educationAttachment);
      } else {
        await alumniService.createEducation(educationForm, educationAttachment);
      }
      await refreshProfile();
      closeModal();
    } catch (e) {
      setModalError(e.response?.data?.message || t('profile.alerts.saveEducationError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (id) => {
    const result = await Swal.fire({
      title: t('profile.alerts.areYouSure'),
      text: t('profile.alerts.deleteEducationText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('profile.alerts.yesDelete'),
      cancelButtonText: t('profile.alerts.cancel')
    });

    if (result.isConfirmed) {
      try {
        await alumniService.deleteEducation(id);
        await refreshProfile();
        Swal.fire(t('profile.alerts.deletedTitle'), t('profile.alerts.educationDeleted'), 'success');
      } catch (e) {
        Swal.fire(t('profile.alerts.error'), e.response?.data?.message || t('profile.alerts.deleteEducationError'), 'error');
      }
    }
  };

  const handleSaveSkill = async () => {
    try {
      setSaving(true);
      setModalError('');
      const payload = {
        ...skillForm,
        proficiency: skillForm.proficiency === '' ? null : Number(skillForm.proficiency)
      };
      if (editingItem?.id) {
        await alumniService.updateSkill(editingItem.id, payload, skillAttachment);
      } else {
        await alumniService.createSkill(payload, skillAttachment);
      }
      await refreshProfile();
      closeModal();
    } catch (e) {
      setModalError(e.response?.data?.message || t('profile.alerts.saveSkillError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    const result = await Swal.fire({
      title: t('profile.alerts.areYouSure'),
      text: t('profile.alerts.deleteSkillText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('profile.alerts.yesDelete'),
      cancelButtonText: t('profile.alerts.cancel')
    });

    if (result.isConfirmed) {
      try {
        await alumniService.deleteSkill(id);
        await refreshProfile();
        Swal.fire(t('profile.alerts.deletedTitle'), t('profile.alerts.skillDeleted'), 'success');
      } catch (e) {
        Swal.fire(t('profile.alerts.error'), e.response?.data?.message || t('profile.alerts.deleteSkillError'), 'error');
      }
    }
  };

  const handleSaveAchievement = async () => {
    try {
      setSaving(true);
      setModalError('');
      const payload = {
        ...achievementForm,
        year: achievementForm.year === '' ? null : Number(achievementForm.year)
      };
      if (editingItem?.id) {
        await alumniService.updateAchievement(editingItem.id, payload, achievementAttachment);
      } else {
        await alumniService.createAchievement(payload, achievementAttachment);
      }
      await refreshProfile();
      closeModal();
    } catch (e) {
      setModalError(e.response?.data?.message || t('profile.alerts.saveAchievementError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAchievement = async (id) => {
    const result = await Swal.fire({
      title: t('profile.alerts.areYouSure'),
      text: t('profile.alerts.deleteAchievementText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('profile.alerts.yesDelete'),
      cancelButtonText: t('profile.alerts.cancel')
    });

    if (result.isConfirmed) {
      try {
        await alumniService.deleteAchievement(id);
        await refreshProfile();
        Swal.fire(t('profile.alerts.deletedTitle'), t('profile.alerts.achievementDeleted'), 'success');
      } catch (e) {
        Swal.fire(t('profile.alerts.error'), e.response?.data?.message || t('profile.alerts.deleteAchievementError'), 'error');
      }
    }
  };

  const handleSaveContact = async () => {
    try {
      setSaving(true);
      setModalError('');

      await alumniService.updateProfile(contactForm);
      await refreshProfile();
      setActiveModal(null);
    } catch (err) {
      const msg = err.response?.data?.message || t('profile.alerts.updateContactError');
      setModalError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async (field) => {
    const result = await Swal.fire({
      title: t('profile.alerts.areYouSure'),
      text: t('profile.alerts.deleteContactText', { field }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('profile.alerts.yesRemoveIt'),
      cancelButtonText: t('profile.alerts.cancel')
    });

    if (result.isConfirmed) {
      try {
        await alumniService.updateProfile({ [field]: '' });
        await refreshProfile();
        Swal.fire(t('profile.alerts.removedTitle'), t('profile.alerts.contactRemoved', { field }), 'success');
      } catch (err) {
        Swal.fire(t('profile.alerts.error'), t('profile.alerts.removeContactError'), 'error');
      }
    }
  };

  const handleProfileFileSelected = async (file) => {
    if (!file) return;
    openCrop(file, 'profile');
    if (profileInputRef.current) profileInputRef.current.value = '';
  };

  const handleCoverFileSelected = async (file) => {
    if (!file) return;
    openCrop(file, 'cover');
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const experiences = profile?.experiences || [];
  const educations = profile?.educations || [];
  const skills = profile?.skills || [];
  const achievements = profile?.achievements || [];

  return (
    <Layout>
      {/* Background Gradient Section — original restored */}
      <div className="fixed top-0 left-0 right-0 h-screen bg-gradient-to-b from-[#002759]/80 via-[#002759]/40 to-[#002759]/10 -z-10"></div>

      <div className="min-h-screen">
        <div className={`fixed inset-0 z-[100] ${lightboxOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div
            className={`absolute inset-0 bg-black/80 transition-opacity duration-200 ${lightboxOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeLightbox}
          />
          <div className={`absolute inset-0 flex items-center justify-center p-4 transition-all duration-200 ${lightboxOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              aria-label={t('profile.a11y.close')}
            >
              <FiX size={20} />
            </button>
            {lightboxSrc && (
              <img
                src={lightboxSrc}
                alt={t('profile.header.previewAlt')}
                onClick={closeLightbox}
                className="max-h-[90vh] max-w-[92vw] rounded-xl shadow-2xl object-contain cursor-zoom-out"
              />
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          {loading && (
            <div className="space-y-6">
              {/* Profile Header Skeleton */}
              <div className="bg-white rounded-xl border border-[#dcdee5] shadow-sm overflow-hidden">
                {/* Cover Image Skeleton */}
                <div className="w-full min-h-64 relative bg-gray-100">
                  <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                  <div className="absolute top-4 right-4 w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="bg-white px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-16 relative z-10">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg bg-gray-200 animate-pulse"></div>
                  </div>
                  <div className="flex-1 flex flex-col md:pt-20">
                    <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Column Skeleton */}
                <aside className="md:col-span-4 flex flex-col gap-6">
                  {/* Contact Info Card Skeleton */}
                  <div className="p-6 rounded-xl border border-[#dcdee5] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Right Column Skeleton */}
                <div className="md:col-span-8 flex flex-col gap-6">
                  {/* About Me Skeleton */}
                  <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  </section>

                  {/* Professional Experience Skeleton */}
                  <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                      {[...Array(2)].map((_, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-6">
                          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Education Skeleton */}
                  <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-7 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                      {[...Array(2)].map((_, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-6">
                          <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="p-6 rounded-xl border border-red-200 shadow-sm bg-red-50 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!loading && (
          <>
          {/* Profile Header Card */}
          <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6 bg-white mt-6">
            {/* Cover Image */}
            <div className="w-full h-56 sm:h-64 relative bg-gray-100">
              {profile?.cover_image ? (
                <>
                  <img
                    src={profile.cover_image}
                    alt={t('profile.header.coverAlt')}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => openLightbox(profile.cover_image)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #eef1fd 0%, #c5ccf7 100%)' }}>
                  <FiCamera className="text-3xl mb-2" style={{ color: '#194ce6' }} />
                  <p className="font-medium text-sm" style={{ color: '#0f2d8a' }}>{t('profile.header.addCoverPhoto')}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#194ce6' }}>{t('profile.header.clickToUpload')}</p>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  coverInputRef.current?.click();
                }}
                className="absolute top-4 right-4 bg-white/95 hover:bg-white text-gray-900 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
                disabled={saving}
                onMouseDown={(e) => e.stopPropagation()}
                style={{ display: isOwner ? 'flex' : 'none' }}
              >
                <FiCamera className="text-xs" />
                {profile?.cover_image ? t('profile.header.updateCover') : t('profile.header.addCover')}
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleCoverFileSelected(e.target.files?.[0] || null)}
              />
            </div>

            {/* Profile info row — shorter dark band */}
            <div className="px-6 sm:px-8 pb-3 pt-2 flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-14 relative z-10"
              style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,39,89,0.75) 50%, #002759 100%)' }}>
              <div className="relative flex-shrink-0">
                <div className="relative size-32 sm:size-36 md:size-40">
                  {profile?.profile_image || profile?.student_photo ? (
                    <img
                      src={profile.profile_image || profile.student_photo}
                      alt={t('profile.header.profileAlt')}
                      className="size-32 sm:size-36 md:size-40 rounded-full border-4 border-white shadow-lg object-cover cursor-zoom-in bg-white"
                      onClick={() => openLightbox(profile.profile_image || profile.student_photo)}
                    />
                  ) : (
                    <div className="size-32 sm:size-36 md:size-40 rounded-full border-4 border-white shadow-lg flex flex-col items-center justify-center cursor-pointer transition-colors"
                      style={{ background: 'linear-gradient(135deg, #0f2d8a, #194ce6)' }}
                      onClick={() => isOwner && profileInputRef.current?.click()}>
                      <FiUser className="text-3xl text-white/90 mb-1" />
                      <p className="text-[10px] text-white/80 font-medium">{t('profile.header.addPhoto')}</p>
                    </div>
                  )}
                </div>
                {profile?.profile_image && isOwner && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      profileInputRef.current?.click();
                    }}
                    className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-white text-gray-900 shadow-md flex items-center justify-center hover:bg-gray-50 cursor-pointer border border-gray-200"
                    title={t('profile.header.updateProfileImage')}
                    disabled={saving}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <FiCamera className="text-sm" />
                  </button>
                )}
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleProfileFileSelected(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex-1 flex flex-col md:flex-row justify-between md:items-end gap-4 md:pb-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight drop-shadow-sm">{profile?.name || '-'}</h1>
                    {profile?.is_verified && (
                      <span title={t('profile.header.verifiedAlumnus')} className="inline-flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 bg-white">
                        <svg className="w-3 h-3" style={{ color: '#002759' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                  {profile?.current_job_title && (
                    <p className="text-sm font-semibold mt-1 text-white/95">
                      {profile.current_job_title}{profile?.current_company ? ` · ${profile.current_company}` : ''}
                    </p>
                  )}
                  <p className="text-white/70 text-sm font-medium mt-1">{t('profile.header.classOf', { year: profile?.graduation_year || '-', faculty: profile?.faculty_name || '-' })}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${profile?.is_verified
                        ? 'bg-green-500/20 text-green-200 border border-green-400/30'
                        : 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30'
                      }`}>
                      {profile?.is_verified ? t('profile.header.verified') : t('profile.header.pendingVerification')}
                    </span>
                    {isOwner && !profile?.is_verified && profileNotifications.length > 0 && (() => {
                      const latest = profileNotifications[0];
                      return (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${latest.title?.includes('Rejected') ? 'bg-red-500/20 text-red-200 border border-red-400/30' : 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30'
                          }`}>
                          {latest.title?.includes('Rejected') ? t('profile.header.rejected') : t('profile.header.pending')}
                          {latest.reason && ` — ${latest.reason}`}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {isOwner && (
                    <button type="button" onClick={openBasicModal}
                      className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors bg-white text-gray-900 hover:bg-gray-100">
                      <FiEdit className="text-xs" />
                      {t('profile.header.editProfile')}
                    </button>
                  )}
                  {isOwner && (
                    <button
                      type="button"
                      onClick={openMentorModal}
                      className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors border border-white/30 text-white bg-white/10 hover:bg-white/20"
                      title={myMentor ? t('profile.header.editMentorProfile') : t('profile.header.becomeMentor')}
                    >
                      <FiPlus className="text-xs" />
                      {myMentor ? t('profile.header.editMentor') : t('profile.header.beMentor')}
                    </button>
                  )}
                  {!isOwner && viewedProfileMentor && (
                    <button
                      type="button"
                      onClick={handleRequestMentorshipFromProfile}
                      disabled={requestingMentorship}
                      className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-60 transition-colors bg-white text-gray-900 hover:bg-gray-100"
                    >
                      <FiUsers className="text-xs" />
                      {requestingMentorship ? t('profile.header.sending') : t('profile.header.requestMentorship')}
                    </button>
                  )}
                  <button
                    onClick={() => setActiveModal('share')}
                    className="px-3 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
                    title={t('profile.header.shareProfile')}
                  >
                    <FiShare2 className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Tabs — only for owner */}
          {isOwner && (
            <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm relative">
              {/* Left arrow (mobile only) */}
              <button
                type="button"
                onClick={() => scrollTabs('left')}
                className="md:hidden absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-white via-white to-transparent flex items-center"
                aria-label={t('profile.a11y.scrollLeft')}
              >
                <span className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600">
                  <FiChevronLeft className="text-sm" />
                </span>
              </button>

              {/* Tabs container */}
              <div
                ref={tabsScrollRef}
                className="flex items-center gap-1 p-2 overflow-x-auto md:overflow-visible scrollbar-hide md:px-2 px-9"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
                {[
                  { key: 'overview', label: t('profile.tabs.overview'), icon: <FiUser /> },
                  { key: 'jobs', label: t('profile.tabs.jobs'), icon: <FiBriefcase />, count: appliedJobs.length },
                  { key: 'messages', label: t('profile.tabs.messages'), icon: <FiMail />, count: messages.length },
                  { key: 'events', label: t('profile.tabs.events'), icon: <FiCalendar />, count: registeredEvents.length },
                  ...(myMentor ? [
                    { key: 'mentees', label: t('profile.tabs.mentees'), icon: <FiUsers />, count: totalMentees },
                    { key: 'requests', label: t('profile.tabs.requests'), icon: <FiUsers />, count: (mentorRequests || []).filter(r => r.status === 'pending').length },
                  ] : []),
                  { key: 'applications', label: t('profile.tabs.applications'), icon: <FiTrendingUp />, count: myApplications.length },
                  { key: 'story', label: t('profile.tabs.story', 'Success Story'), icon: <FiStar /> },
                ].map(tab => {
                  const active = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap flex-shrink-0 ${active ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      style={active ? { background: '#002759' } : {}}
                    >
                      <span className="text-sm">{tab.icon}</span>
                      {tab.label}
                      {typeof tab.count === 'number' && tab.count > 0 && (
                        <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right arrow (mobile only) */}
              <button
                type="button"
                onClick={() => scrollTabs('right')}
                className="md:hidden absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-white via-white to-transparent flex items-center"
                aria-label={t('profile.a11y.scrollRight')}
              >
                <span className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600">
                  <FiChevronRight className="text-sm" />
                </span>
              </button>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column (Sidebar) — becomes full width when owner selects a specific tab */}
            <aside className={`${isOwner && activeTab !== 'overview' ? 'md:col-span-12' : 'md:col-span-4'} flex flex-col gap-6`}>
              {/* Contact Info Card — hide on non-overview tabs for owner */}
              {(!isOwner || activeTab === 'overview') && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 text-base font-bold flex items-center gap-2">
                      <FiMail style={{ color: '#194ce6' }} />
                      {t('profile.contact.title')}
                    </h3>
                    {isOwner && (
                      <button type="button" onClick={openContactModal}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border"
                        style={{ background: '#eef1fd', color: '#194ce6', borderColor: '#c5ccf7' }}>
                        <FiEdit size={12} />
                        {t('profile.contact.edit')}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ background: '#eef1fd', color: '#194ce6' }}>
                        <FiMail className="text-sm" />
                      </div>
                      <span className="text-gray-700 text-xs font-medium break-all line-clamp-1">{profile?.email || '-'}</span>
                    </div>
                    <div className="group relative flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ background: '#eef1fd', color: '#194ce6' }}>
                        <FiPhone className="text-sm" />
                      </div>
                      <span className="text-gray-700 text-xs font-medium">{profile?.phone || t('profile.contact.notAdded')}</span>
                    </div>
                    <div className="group relative flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ background: '#eef1fd', color: '#194ce6' }}>
                        <FiMapPin className="text-sm" />
                      </div>
                      <span className="text-gray-700 text-xs font-medium">{profile?.location || t('profile.contact.notAdded')}</span>
                      {profile?.location && isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDeleteContact('location')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-auto"
                          title={t('profile.contact.deleteLocation')}
                        >
                          <FiTrash2 className="text-red-500 hover:text-red-700" size={12} />
                        </button>
                      )}
                    </div>
                    {profile?.linkedin_profile && (
                      <a href={profile.linkedin_profile} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                          style={{ background: '#eef1fd', color: '#194ce6' }}>
                          <FiLink className="text-sm" />
                        </div>
                        <span className="text-gray-700 text-xs font-medium truncate">{t('profile.contact.linkedinProfile')}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Applied Jobs Section - Only for profile owner */}
              {isOwner && (activeTab === 'overview' || activeTab === 'jobs') && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FiBriefcase className="text-blue-600" />
                        {t('profile.jobs.title')}
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {appliedJobs.length}
                      </span>
                    </div>

                    {loadingJobs ? (
                      <div className="space-y-3">
                        {Array.from({ length: 3 }, (_, index) => (
                          <div key={index} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : appliedJobs.length === 0 ? (
                      <div className="text-center py-6">
                        <FiBriefcase className="text-3xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">{t('profile.jobs.empty')}</p>
                        <Link
                          to="/jobs"
                          className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          {t('profile.jobs.browse')}
                          <FiBriefcase className="text-sm" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {appliedJobs.slice(0, 3).map((application) => (
                          <div key={application.id} className="group relative p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 truncate">
                                  {application.job?.title || t('profile.jobs.jobTitleFallback')}
                                </h4>
                                <p className="text-xs text-gray-600 truncate">
                                  {application.job?.company || t('profile.jobs.companyFallback')}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <FiCalendar className="text-xs" />
                                    {formatDate(application.created_at)}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${application.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : application.status === 'reviewed'
                                        ? 'bg-blue-100 text-blue-700'
                                        : application.status === 'accepted'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {application.status || t('profile.jobs.status.pending')}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveApplication(application.id, application.job?.title)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                title={t('profile.jobs.removeApplication')}
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {appliedJobs.length > 3 && (
                          <Link
                            to="/applications"
                            className="block w-full text-center py-2 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            {t('profile.jobs.viewAll', { n: appliedJobs.length })}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messages Section - Only for profile owner */}
              {isOwner && (activeTab === 'overview' || activeTab === 'messages') && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FiMail className="text-blue-600" />
                        {t('profile.messages.title')}
                      </h3>
                      <Link
                        to="/messages"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        {t('profile.messages.viewAll')}
                        <FiExternalLink className="text-sm" />
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {loadingMessages ? (
                        <div className="space-y-3">
                          {Array.from({ length: 3 }, (_, index) => (
                            <div key={index} className="animate-pulse flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0" />
                              <div className="flex-1 space-y-2">
                                <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiMail className="text-gray-400 text-xl" />
                          </div>
                          <p className="text-gray-500 text-sm">{t('profile.messages.empty')}</p>
                          <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FiMail className="text-sm" />
                            {t('profile.messages.send')}
                          </Link>
                        </div>
                      ) : (
                        <>
                          {messages.slice(0, 3).map((message) => (
                            <div key={message.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FiMail className="text-blue-600 text-sm" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                                    {message.subject}
                                  </h4>
                                  <span className={`text-xs px-2 py-1 rounded-full ${message.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : message.status === 'received'
                                        ? 'bg-blue-100 text-blue-700'
                                        : message.status === 'responded'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {message.status === 'pending' ? t('profile.messages.status.pending') :
                                      message.status === 'received' ? t('profile.messages.status.received') :
                                        message.status === 'responded' ? t('profile.messages.status.responded') : t('profile.messages.status.unknown')}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                  {message.message.substring(0, 100)}...
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <FiCalendar className="text-gray-400" />
                                  {formatDate(message.created_at)}
                                </div>
                              </div>
                            </div>
                          ))}
                          {messages.length > 3 && (
                            <Link
                              to="/messages"
                              className="block w-full text-center py-2 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              {t('profile.messages.viewAllCount', { n: messages.length })}
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Registered Events Section - Only for profile owner */}
              {isOwner && (activeTab === 'overview' || activeTab === 'events') && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FiCalendar className="text-blue-600" />
                        {t('profile.events.title')}
                      </h3>
                      <Link
                        to="/events/registered"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        {t('profile.events.viewAll')}
                        <FiExternalLink className="text-sm" />
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {loadingEvents ? (
                        <div className="space-y-3">
                          {Array.from({ length: 3 }, (_, index) => (
                            <div key={index} className="animate-pulse">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          ))}
                        </div>
                      ) : registeredEvents.length === 0 ? (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiCalendar className="text-gray-400 text-xl" />
                          </div>
                          <p className="text-gray-500 text-sm">{t('profile.events.empty')}</p>
                          <Link
                            to="/events"
                            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FiCalendar className="text-sm" />
                            {t('profile.events.browse')}
                          </Link>
                        </div>
                      ) : (
                        <>
                          {registeredEvents.slice(0, 3).map((registration) => (
                            <div key={registration.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FiCalendar className="text-blue-600 text-sm" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                                    {registration.alumni_event?.title || t('profile.events.eventTitleFallback')}
                                  </h4>
                                  <span className={`text-xs px-2 py-1 rounded-full ${registration.status === 'registered'
                                      ? 'bg-blue-100 text-blue-700'
                                      : registration.status === 'confirmed'
                                        ? 'bg-green-100 text-green-700'
                                        : registration.status === 'attended'
                                          ? 'bg-purple-100 text-purple-700'
                                          : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {registration.status || t('profile.events.status.registered')}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                  {registration.alumni_event?.location || t('profile.events.locationFallback')}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <FiCalendar className="text-gray-400" />
                                    {registration.alumni_event?.start_date ? new Date(registration.alumni_event.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : t('profile.events.dateNotSet')}
                                  </div>
                                  <button
                                    onClick={() => {
                                      setCardEventData(registration.alumni_event);
                                      setCardRegData(registration);
                                      setShowEventCard(true);
                                    }}
                                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#002759] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                  >
                                    <FiDownload size={12} />
                                    {registration.card_downloaded ? t('profile.events.viewCard') : t('profile.events.card')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          {registeredEvents.length > 3 && (
                            <Link
                              to="/events/registered"
                              className="block w-full text-center py-2 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              {t('profile.events.viewAllCount', { n: registeredEvents.length })}
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* My Mentees - only shown to mentors (preview, 3 records + see more) */}
              {isOwner && myMentor && (activeTab === 'overview' || activeTab === 'mentees') && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FiUsers className="text-green-600" />
                        {t('profile.mentees.title')}
                      </h3>
                      {totalMentees > 0 && (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {totalMentees}
                        </span>
                      )}
                    </div>
                    {loadingMentees ? (
                      <div className="space-y-3">
                        {Array.from({ length: 3 }, (_, i) => (
                          <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                              <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : myMentees.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiUsers className="text-gray-400 text-xl" />
                        </div>
                        <p className="text-gray-500 text-sm">{t('profile.mentees.empty')}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{t('profile.mentees.emptyHint')}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {myMentees.map(m => (
                          <Link key={m.id} to={`/profile/${m.requester_id}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition group">
                            {m.profile_image ? (
                              <img src={m.profile_image} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow">
                                {m.name?.charAt(0) || '?'}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-blue-600">{m.name}</p>
                              {(m.faculty || m.department) && (
                                <p className="text-[11px] text-gray-500 truncate">{m.faculty}{m.department ? ` — ${m.department}` : ''}</p>
                              )}
                            </div>
                          </Link>
                        ))}
                        {totalMentees > 3 && (
                          <Link to="/mentorship/my/mentees" className="block text-center mt-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs rounded-lg transition">
                            {t('profile.mentees.seeAll', { n: totalMentees })}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mentorship Requests - only shown to mentors */}
              {isOwner && myMentor && (activeTab === 'overview' || activeTab === 'requests') && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FiUsers className="text-blue-600" />
                        {t('profile.requests.title')}
                      </h3>
                      <div className="flex items-center gap-2">
                        {mentorRequests.filter(r => r.status === 'pending').length > 0 && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {t('profile.requests.pendingCount', { n: mentorRequests.filter(r => r.status === 'pending').length })}
                          </span>
                        )}
                        <Link to="/mentorship/my/requests" className="text-blue-600 text-xs font-semibold hover:underline">{t('profile.requests.viewAll')}</Link>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {loadingMentorRequests ? (
                        Array.from({ length: 2 }, (_, i) => (
                          <div key={i} className="animate-pulse flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                            <div className="flex-1 space-y-1">
                              <div className="h-3 bg-gray-200 rounded w-3/4" />
                              <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                          </div>
                        ))
                      ) : mentorRequests.length === 0 ? (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiUser className="text-gray-400 text-xl" />
                          </div>
                          <p className="text-gray-500 text-sm">{t('profile.requests.empty')}</p>
                        </div>
                      ) : (
                        mentorRequests.slice(0, 5).map(req => (
                          <div key={req.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <Link to={`/profile/${req.requester_id}`} className="flex-shrink-0">
                              {req.profile_image ? (
                                <img
                                  src={req.profile_image}
                                  alt={req.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow hover:opacity-90 transition-opacity"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow">
                                  {req.name?.charAt(0)?.toUpperCase()}
                                </div>
                              )}
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link to={`/profile/${req.requester_id}`} className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors">
                                {req.name}
                              </Link>
                              {req.title && <p className="text-xs text-gray-500 truncate">{req.title}</p>}
                              {req.whatsapp_number && (
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5">
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                  {req.whatsapp_number}
                                </p>
                              )}
                              {req.message && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2 italic">"{req.message}"</p>
                              )}
                              <div className="flex items-center justify-between mt-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                      'bg-red-100 text-red-700'
                                  }`}>
                                  {t(`profile.requests.status.${req.status}`)}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {formatDate(req.created_at)}
                                </span>
                              </div>
                              {/* Accept/Reject buttons for pending requests */}
                              {req.status === 'pending' && (
                                <div className="flex gap-1.5 mt-2">
                                  <button
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      // Prompt for mentorship end date
                                      const today = new Date();
                                      const defaultEnd = new Date(today);
                                      defaultEnd.setMonth(defaultEnd.getMonth() + 3);
                                      const defaultEndStr = defaultEnd.toISOString().split('T')[0];
                                      const minEndStr = new Date(today.getTime() + 86400000).toISOString().split('T')[0];
                                      const { value: endDate, isConfirmed } = await Swal.fire({
                                        title: t('profile.alerts.acceptMentorshipTitle'),
                                        html: `<p style="color:#4b5563;font-size:13px;margin-bottom:10px">${t('profile.alerts.acceptMentorshipHtml', { name: req.name })}</p>`,
                                        input: 'date',
                                        inputValue: defaultEndStr,
                                        inputAttributes: { min: minEndStr },
                                        showCancelButton: true,
                                        confirmButtonText: t('profile.alerts.accept'),
                                        confirmButtonColor: '#002759',
                                        cancelButtonText: t('profile.alerts.cancel'),
                                        inputValidator: (value) => {
                                          if (!value) return t('profile.alerts.pickEndDate');
                                          if (value <= today.toISOString().split('T')[0]) return t('profile.alerts.endDateFuture');
                                        },
                                      });
                                      if (!isConfirmed) return;
                                      try {
                                        await mentorService.updateRequestStatus(req.id, 'accepted', endDate);
                                        const r = await mentorService.getRequests();
                                        setMentorRequests(r.data || []);
                                        const m = await mentorService.getMyMentees(3);
                                        setMyMentees(m.data?.mentees || []);
                                        setTotalMentees(m.data?.total || 0);
                                        Swal.fire({ icon: 'success', title: t('profile.alerts.acceptedTitle'), text: t('profile.alerts.mentorshipActiveUntil', { date: endDate }), timer: 2000, showConfirmButton: false });
                                      } catch (err) {
                                        Swal.fire({ icon: 'error', title: t('profile.alerts.error'), text: err.response?.data?.message || t('profile.alerts.failed') });
                                      }
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded hover:bg-green-700 transition"
                                  >
                                    <FiCheckCircle size={10} /> {t('profile.requests.accept')}
                                  </button>
                                  <button
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      try {
                                        await mentorService.updateRequestStatus(req.id, 'rejected');
                                        const r = await mentorService.getRequests();
                                        setMentorRequests(r.data || []);
                                        Swal.fire({ icon: 'success', title: t('profile.alerts.rejectedTitle'), timer: 1500, showConfirmButton: false });
                                      } catch (err) {
                                        Swal.fire({ icon: 'error', title: t('profile.alerts.error'), text: err.response?.data?.message || t('profile.alerts.failed') });
                                      }
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-700 transition"
                                  >
                                    <FiXCircle size={10} /> {t('profile.requests.reject')}
                                  </button>
                                </div>
                              )}
                              {/* WhatsApp contact after acceptance */}
                              {req.status === 'accepted' && req.whatsapp_number && (
                                <a
                                  href={`https://wa.me/${req.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-2 flex items-center justify-center gap-1 px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded hover:bg-green-600 transition"
                                >
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                  {t('profile.requests.contactWhatsapp')}
                                </a>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* My Mentor Applications - requests the owner sent to others */}
              {isOwner && (activeTab === 'overview' || activeTab === 'applications') && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FiTrendingUp className="text-blue-600" />
                        {t('profile.applications.title')}
                      </h3>
                      <div className="flex items-center gap-2">
                        {myApplications.length > 0 && (
                          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {myApplications.length}
                          </span>
                        )}
                        <Link to="/mentorship/my/applications" className="text-blue-600 text-xs font-semibold hover:underline">{t('profile.applications.viewAll')}</Link>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {loadingApplications ? (
                        Array.from({ length: 2 }, (_, i) => (
                          <div key={i} className="animate-pulse flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                            <div className="flex-1 space-y-1">
                              <div className="h-3 bg-gray-200 rounded w-3/4" />
                              <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                          </div>
                        ))
                      ) : myApplications.length === 0 ? (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiTrendingUp className="text-gray-400 text-xl" />
                          </div>
                          <p className="text-gray-500 text-sm">{t('profile.applications.empty')}</p>
                          <Link to="/mentorship" className="text-blue-600 text-xs hover:underline mt-1 inline-block">
                            {t('profile.applications.browse')}
                          </Link>
                        </div>
                      ) : (
                        myApplications.slice(0, 5).map(app => (
                          <div key={app.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <Link to={`/profile/${app.alumni_student_id}`} className="flex-shrink-0">
                              {app.profile_image ? (
                                <img
                                  src={app.profile_image}
                                  alt={app.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow hover:opacity-90 transition-opacity"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow">
                                  {app.name?.charAt(0)?.toUpperCase()}
                                </div>
                              )}
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link to={`/profile/${app.alumni_student_id}`} className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors">
                                {app.name}
                              </Link>
                              {app.title && <p className="text-xs text-gray-500 truncate">{app.title}</p>}
                              {app.company && <p className="text-xs text-gray-400 truncate">{t('profile.applications.at', { company: app.company })}</p>}
                              <div className="flex items-center justify-between mt-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                      'bg-red-100 text-red-700'
                                  }`}>
                                  {t(`profile.applications.status.${app.status}`)}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {formatDate(app.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* My Success Story — status + admin message, editable */}
              {isOwner && (activeTab === 'overview' || activeTab === 'story') && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FiStar className="text-blue-600" />
                        {t('profile.story.title', 'My Success Story')}
                      </h3>
                      {successStory && !editingStory && (
                        <button
                          type="button"
                          onClick={() => { setStoryDraft(successStory.quote || ''); setEditingStory(true); }}
                          className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1"
                        >
                          <FiEdit /> {t('profile.story.edit', 'Edit')}
                        </button>
                      )}
                    </div>

                    {!successStory ? (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiStar className="text-gray-400 text-xl" />
                        </div>
                        <p className="text-gray-500 text-sm">{t('profile.story.empty', "You haven't shared a success story yet.")}</p>
                        <Link to="/" className="text-blue-600 text-xs hover:underline mt-1 inline-block">
                          {t('profile.story.share', 'Share your story on the home page')}
                        </Link>
                      </div>
                    ) : editingStory ? (
                      <div className="space-y-3">
                        <textarea
                          rows={5}
                          value={storyDraft}
                          maxLength={2000}
                          onChange={(e) => setStoryDraft(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                          placeholder={t('profile.story.placeholder', 'Tell us how KPU shaped your journey…')}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-gray-400">{storyDraft.length}/2000</span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setEditingStory(false)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200">
                              {t('profile.story.cancel', 'Cancel')}
                            </button>
                            <button type="button" onClick={saveStory} disabled={savingStory}
                              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-60 flex items-center gap-1" style={{ background: '#002759' }}>
                              <FiSend size={12} /> {savingStory ? t('profile.story.saving', 'Saving…') : t('profile.story.save', 'Save')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {successStory.is_featured ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">{t('profile.story.live', 'Live on site')}</span>
                          ) : successStory.is_approved ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">{t('profile.story.approved', 'Approved')}</span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">{t('profile.story.pending', 'Under review')}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg p-3 border border-gray-100">{successStory.quote}</p>
                        {successStory.admin_message && (
                          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 flex items-start gap-2">
                            <FiMessageSquare className="mt-0.5 shrink-0" />
                            <span><span className="font-semibold">{t('profile.story.adminNote', 'Message from admin:')} </span>{successStory.admin_message}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </aside>

            {/* Right Column (Main Content) — hide on non-overview tabs for owner */}
            {(!isOwner || activeTab === 'overview') && (
              <div className="md:col-span-8 flex flex-col gap-6">
                {/* About Me */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-gray-900 text-lg font-bold mb-4 flex items-center gap-2">
                    <FiUser style={{ color: '#194ce6' }} />
                    {t('profile.about.title')}
                  </h3>
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
                    <p className="text-black leading-relaxed text-base">
                      {profile?.bio || t('profile.about.empty')}
                    </p>
                  </div>
                </section>

                {/* Professional Experience */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900 text-lg font-bold flex items-center gap-2">
                      <FiBriefcase style={{ color: '#194ce6' }} />
                      {t('profile.experience.title')}
                    </h3>
                    {isOwner && (
                      <button type="button" onClick={() => openExperienceModal(null)} className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 transition-colors" style={{ background: '#0f2d8a' }} onMouseEnter={e => e.currentTarget.style.background = '#091d5e'} onMouseLeave={e => e.currentTarget.style.background = '#0f2d8a'}>
                        <FiPlus />
                        {t('profile.experience.add')}
                      </button>
                    )}
                  </div>
                  <div className="space-y-8">
                    {experiences.length === 0 ? (
                      isOwner ? (
                        <button type="button" onClick={() => openExperienceModal(null)} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2 cursor-pointer">
                          <FiPlus />
                          {t('profile.experience.addItem')}
                        </button>
                      ) : (
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-500 text-center">
                          {t('profile.experience.empty')}
                        </div>
                      )
                    ) : (
                      experiences.map((exp, idx) => (
                        <div key={exp.id} className="relative pl-12 pb-8 border-l-2 border-gray-200 last:border-l-0">
                          <div className={`absolute -left-[9px] top-0 w-4 h-4 ${idx === 0 ? 'bg-primary border-gray-100' : 'bg-gray-400 border-white'} rounded-full border-4 shadow-sm`}></div>
                          <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 relative">
                            <div className="absolute top-3 right-3 flex gap-2">
                              {isOwner && (
                                <>
                                  <button type="button" onClick={() => openExperienceModal(exp)} className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 flex items-center justify-center" title={t('profile.common.edit')}>
                                    <FiEdit />
                                  </button>
                                  <button type="button" onClick={() => handleDeleteExperience(exp.id)} className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-red-600 hover:bg-red-50 flex items-center justify-center" title={t('profile.common.delete')}>
                                    <FiTrash2 />
                                  </button>
                                </>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                              <h4 className="text-black font-bold text-lg mb-1 sm:mb-0">{exp.job_title}</h4>
                              <span className="text-primary font-medium text-sm">{exp.company || '-'}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{exp.location || '-'}</p>
                            <p className="text-black text-sm leading-relaxed">{exp.description || ''}</p>
                            {exp.attachment && (
                              <a className="inline-block mt-3 text-sm font-semibold text-blue-700 hover:text-blue-900" href={exp.attachment} target="_blank" rel="noreferrer">
                                {t('profile.experience.viewAttachment')}
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* Education */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-black text-xl font-bold flex items-center gap-2">
                      <FiBookOpen className="text-primary" />
                      {t('profile.education.title')}
                    </h3>
                    {isOwner && (
                      <button type="button" onClick={() => openEducationModal(null)} className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 transition-colors" style={{ background: '#0f2d8a' }} onMouseEnter={e => e.currentTarget.style.background = '#091d5e'} onMouseLeave={e => e.currentTarget.style.background = '#0f2d8a'}>
                        <FiPlus />
                        {t('profile.education.add')}
                      </button>
                    )}
                  </div>
                  <div className="space-y-8">
                    {educations.length === 0 ? (
                      isOwner ? (
                        <button type="button" onClick={() => openEducationModal(null)} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2 cursor-pointer">
                          <FiPlus />
                          {t('profile.education.addItem')}
                        </button>
                      ) : (
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-500 text-center">
                          {t('profile.education.empty')}
                        </div>
                      )
                    ) : (
                      educations.map((edu, idx) => (
                        <div key={edu.id} className="relative pl-12 pb-8 border-l-2 border-gray-200 last:border-l-0">
                          <div className={`absolute -left-[9px] top-0 w-4 h-4 ${idx === 0 ? 'bg-primary border-gray-100' : 'bg-gray-400 border-white'} rounded-full border-4 shadow-sm`}></div>
                          <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 relative">
                            <div className="absolute top-3 right-3 flex gap-2">
                              {isOwner && (
                                <>
                                  <button type="button" onClick={() => openEducationModal(edu)} className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 flex items-center justify-center" title={t('profile.common.edit')}>
                                    <FiEdit />
                                  </button>
                                  <button type="button" onClick={() => handleDeleteEducation(edu.id)} className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-red-600 hover:bg-red-50 flex items-center justify-center" title={t('profile.common.delete')}>
                                    <FiTrash2 />
                                  </button>
                                </>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                              <h4 className="text-black font-bold text-lg mb-1 sm:mb-0">{edu.institution}</h4>
                              <span className="text-primary font-medium text-sm">{edu.field_of_study || edu.degree || '-'}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{edu.start_year || ''}{edu.end_year ? ` — ${edu.end_year}` : ''}</p>
                            {edu.attachment && (
                              <a className="inline-block mt-3 text-sm font-semibold text-blue-700 hover:text-blue-900" href={edu.attachment} target="_blank" rel="noreferrer">
                                {t('profile.education.viewAttachment')}
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* Skills & Expertise */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-black text-xl font-bold flex items-center gap-2">
                      <FiSettings className="text-primary" />
                      {t('profile.skills.title')}
                    </h3>
                    {isOwner && (
                      <button type="button" onClick={() => openSkillModal(null)} className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 transition-colors" style={{ background: '#0f2d8a' }} onMouseEnter={e => e.currentTarget.style.background = '#091d5e'} onMouseLeave={e => e.currentTarget.style.background = '#0f2d8a'}>
                        <FiPlus />
                        {t('profile.skills.add')}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {skills.length === 0 ? (
                      isOwner ? (
                        <button type="button" onClick={() => openSkillModal(null)} className="col-span-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2 cursor-pointer">
                          <FiPlus />
                          {t('profile.skills.addItem')}
                        </button>
                      ) : (
                        <div className="col-span-full px-4 py-3 rounded-lg border border-gray-200 text-gray-500 text-center">
                          {t('profile.skills.empty')}
                        </div>
                      )
                    ) : (
                      skills.map((skill) => (
                        <div key={skill.id} className="relative bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-300 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:scale-105 min-h-[160px] w-full">
                          <div className="absolute top-3 right-3 flex gap-1">
                            {isOwner && (
                              <>
                                <button type="button" onClick={() => openSkillModal(skill)} className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 flex items-center justify-center shadow-sm" title={t('profile.common.edit')}>
                                  <FiEdit size={14} />
                                </button>
                                <button type="button" onClick={() => handleDeleteSkill(skill.id)} className="w-8 h-8 rounded-md bg-white border border-gray-200 text-red-600 hover:bg-red-50 flex items-center justify-center shadow-sm" title={t('profile.common.delete')}>
                                  <FiTrash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <span className="text-black text-sm font-medium block mb-2">{skill.name}</span>
                            {skill.category && (
                              <span className="block text-xs text-gray-600 mb-2">{skill.category}</span>
                            )}
                            {skill.proficiency && (
                              <div className="mb-2">
                                <div className="flex justify-center gap-1 mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full ${i < skill.proficiency ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-600">{t('profile.skills.proficiencyOutOf', { n: skill.proficiency })}</span>
                              </div>
                            )}
                            {skill.attachment && (
                              <a className="inline-block mt-2 text-xs font-semibold text-blue-700 hover:text-blue-900" href={skill.attachment} target="_blank" rel="noreferrer">
                                {t('profile.skills.view')}
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* Achievements & Awards */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-black text-xl font-bold flex items-center gap-2">
                      <FiAward className="text-primary" />
                      {t('profile.achievements.title')}
                    </h3>
                    {isOwner && (
                      <button type="button" onClick={() => openAchievementModal(null)} className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 transition-colors" style={{ background: '#0f2d8a' }} onMouseEnter={e => e.currentTarget.style.background = '#091d5e'} onMouseLeave={e => e.currentTarget.style.background = '#0f2d8a'}>
                        <FiPlus />
                        {t('profile.achievements.add')}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <FiTrendingUp className="text-yellow-600 text-2xl" />
                        <span className="text-2xl font-bold text-gray-900">{achievements.length}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{t('profile.achievements.totalAchievements')}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <FiStar className="text-blue-600 text-2xl" />
                        <span className="text-2xl font-bold text-gray-900">{achievements[0]?.year || '-'}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{t('profile.achievements.latestYear')}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <FiTarget className="text-green-600 text-2xl" />
                        <span className="text-2xl font-bold text-gray-900">{achievements[0]?.category || '-'}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{t('profile.achievements.latestCategory')}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {achievements.length === 0 ? (
                      isOwner ? (
                        <button type="button" onClick={() => openAchievementModal(null)} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2 cursor-pointer">
                          <FiPlus />
                          {t('profile.achievements.addItem')}
                        </button>
                      ) : (
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-500 text-center">
                          {t('profile.achievements.empty')}
                        </div>
                      )
                    ) : (
                      achievements.map((a) => (
                        <div key={a.id} className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FiAward className="text-blue-600 text-xl" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 mb-1">{a.title}</h5>
                              {a.description && <p className="text-sm text-gray-600 mb-2">{a.description}</p>}
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{a.year || '-'}</span>
                                <span>•</span>
                                <span>{a.issuer || '-'}</span>
                              </div>
                              {a.attachment && (
                                <a className="inline-block mt-2 text-sm font-semibold text-blue-700 hover:text-blue-900" href={a.attachment} target="_blank" rel="noreferrer">
                                  {t('profile.achievements.viewAttachment')}
                                </a>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {isOwner && (
                                <>
                                  <button type="button" onClick={() => openAchievementModal(a)} className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 flex items-center justify-center" title={t('profile.common.edit')}>
                                    <FiEdit />
                                  </button>
                                  <button type="button" onClick={() => handleDeleteAchievement(a.id)} className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-red-600 hover:bg-red-50 flex items-center justify-center" title={t('profile.common.delete')}>
                                    <FiTrash2 />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </div>

      <Modal
        isOpen={activeModal === 'basic'}
        title={t('profile.modals.editProfile')}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800" onClick={closeModal} disabled={saving}>{t('profile.common.cancel')}</button>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2" onClick={handleSaveBasic} disabled={saving}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />}
              {saving ? t('profile.common.saving') : t('profile.common.save')}
            </button>
          </div>
        }
      >
        {modalError && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{modalError}</div>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.phone')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={basicForm.phone} onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })} />
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-700">
            {t('profile.fields.nameManagedByAdmin')}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.currentJobTitle')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={basicForm.current_job_title} onChange={(e) => setBasicForm({ ...basicForm, current_job_title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.currentCompany')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={basicForm.current_company} onChange={(e) => setBasicForm({ ...basicForm, current_company: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.location')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={basicForm.location} onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.linkedin')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={basicForm.linkedin_profile} onChange={(e) => setBasicForm({ ...basicForm, linkedin_profile: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.bio')}</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 min-h-[120px]" value={basicForm.bio} onChange={(e) => setBasicForm({ ...basicForm, bio: e.target.value })} />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={cropOpen}
        title={t('profile.modals.cropImage')}
        onClose={() => {
          if (saving) return;
          closeCrop();
        }}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900" onClick={closeCrop} disabled={saving}>{t('profile.common.cancel')}</button>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2" onClick={handleCropSave} disabled={saving}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />}
              {saving ? t('profile.common.saving') : t('profile.modals.cropAndUpload')}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="relative w-full h-[360px] bg-black/90 rounded-xl overflow-hidden">
            {cropImageSrc && (
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={cropTarget === 'cover' ? 3 / 1 : 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                objectFit="cover"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-2">{t('profile.modals.zoom')}</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'experience'}
        title={editingItem?.id ? t('profile.modals.editExperience') : t('profile.modals.addExperience')}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800" onClick={closeModal} disabled={saving}>{t('profile.common.cancel')}</button>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2" onClick={handleSaveExperience} disabled={saving}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />}
              {saving ? t('profile.common.saving') : t('profile.common.save')}
            </button>
          </div>
        }
      >
        {modalError && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{modalError}</div>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.jobTitleRequired')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={experienceForm.job_title} onChange={(e) => setExperienceForm({ ...experienceForm, job_title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.company')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.location')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={experienceForm.location} onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.startDate')}</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={experienceForm.start_date} onChange={(e) => setExperienceForm({ ...experienceForm, start_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.endDate')}</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={experienceForm.end_date} onChange={(e) => setExperienceForm({ ...experienceForm, end_date: e.target.value })} disabled={experienceForm.is_current} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-800 font-semibold">
            <input type="checkbox" checked={experienceForm.is_current} onChange={(e) => setExperienceForm({ ...experienceForm, is_current: e.target.checked, end_date: e.target.checked ? '' : experienceForm.end_date })} />
            {t('profile.fields.currentlyWorkHere')}
          </label>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.description')}</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 min-h-[100px]" value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">{t('profile.fields.attachment')}</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-black font-semibold hover:bg-gray-50 cursor-pointer w-fit">
                {t('profile.common.chooseFile')}
                <input type="file" className="hidden" onChange={(e) => setExperienceAttachment(e.target.files?.[0] || null)} />
              </label>
              <span className="text-sm text-gray-900 truncate">
                {experienceAttachment?.name || t('profile.common.noFileSelected')}
              </span>
            </div>
            {editingItem?.attachment && (
              <a className="inline-block mt-2 text-sm font-semibold text-blue-700 hover:text-blue-900" href={editingItem.attachment} target="_blank" rel="noreferrer">
                {t('profile.common.viewCurrentAttachment')}
              </a>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'education'}
        title={editingItem?.id ? t('profile.modals.editEducation') : t('profile.modals.addEducation')}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800" onClick={closeModal} disabled={saving}>{t('profile.common.cancel')}</button>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2" onClick={handleSaveEducation} disabled={saving}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />}
              {saving ? t('profile.common.saving') : t('profile.common.save')}
            </button>
          </div>
        }
      >
        {modalError && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{modalError}</div>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.institutionRequired')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={educationForm.institution} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.degree')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.fieldOfStudy')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={educationForm.field_of_study} onChange={(e) => setEducationForm({ ...educationForm, field_of_study: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.startYear')}</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={educationForm.start_year} onChange={(e) => setEducationForm({ ...educationForm, start_year: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.endYear')}</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={educationForm.end_year} onChange={(e) => setEducationForm({ ...educationForm, end_year: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.grade')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={educationForm.grade} onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.description')}</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 min-h-[100px]" value={educationForm.description} onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">{t('profile.fields.attachment')}</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-black font-semibold hover:bg-gray-50 cursor-pointer w-fit">
                {t('profile.common.chooseFile')}
                <input type="file" className="hidden" onChange={(e) => setEducationAttachment(e.target.files?.[0] || null)} />
              </label>
              <span className="text-sm text-gray-900 truncate">
                {educationAttachment?.name || t('profile.common.noFileSelected')}
              </span>
            </div>
            {editingItem?.attachment && (
              <a className="inline-block mt-2 text-sm font-semibold text-blue-700 hover:text-blue-900" href={editingItem.attachment} target="_blank" rel="noreferrer">
                {t('profile.common.viewCurrentAttachment')}
              </a>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'skill'}
        title={editingItem?.id ? t('profile.modals.editSkill') : t('profile.modals.addSkill')}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800" onClick={closeModal} disabled={saving}>{t('profile.common.cancel')}</button>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2" onClick={handleSaveSkill} disabled={saving}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />}
              {saving ? t('profile.common.saving') : t('profile.common.save')}
            </button>
          </div>
        }
      >
        {modalError && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{modalError}</div>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.skillNameRequired')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.category')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.proficiency')}</label>
            <input type="number" min="1" max="5" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">{t('profile.fields.attachment')}</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-black font-semibold hover:bg-gray-50 cursor-pointer w-fit">
                {t('profile.common.chooseFile')}
                <input type="file" className="hidden" onChange={(e) => setSkillAttachment(e.target.files?.[0] || null)} />
              </label>
              <span className="text-sm text-gray-900 truncate">
                {skillAttachment?.name || t('profile.common.noFileSelected')}
              </span>
            </div>
            {editingItem?.attachment && (
              <a className="inline-block mt-2 text-sm font-semibold text-blue-700 hover:text-blue-900" href={editingItem.attachment} target="_blank" rel="noreferrer">
                {t('profile.common.viewCurrentAttachment')}
              </a>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'achievement'}
        title={editingItem?.id ? t('profile.modals.editAchievement') : t('profile.modals.addAchievement')}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800" onClick={closeModal} disabled={saving}>{t('profile.common.cancel')}</button>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2" onClick={handleSaveAchievement} disabled={saving}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />}
              {saving ? t('profile.common.saving') : t('profile.common.save')}
            </button>
          </div>
        }
      >
        {modalError && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{modalError}</div>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.titleRequired')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={achievementForm.title} onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.issuer')}</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={achievementForm.issuer} onChange={(e) => setAchievementForm({ ...achievementForm, issuer: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.year')}</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={achievementForm.year} onChange={(e) => setAchievementForm({ ...achievementForm, year: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.category')}</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={achievementForm.category} onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{t('profile.fields.description')}</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 min-h-[100px]" value={achievementForm.description} onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">{t('profile.fields.attachment')}</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-black font-semibold hover:bg-gray-50 cursor-pointer w-fit">
                {t('profile.common.chooseFile')}
                <input type="file" className="hidden" onChange={(e) => setAchievementAttachment(e.target.files?.[0] || null)} />
              </label>
              <span className="text-sm text-gray-900 truncate">
                {achievementAttachment?.name || t('profile.common.noFileSelected')}
              </span>
            </div>
            {editingItem?.attachment && (
              <a className="inline-block mt-2 text-sm font-semibold text-blue-700 hover:text-blue-900" href={editingItem.attachment} target="_blank" rel="noreferrer">
                {t('profile.common.viewCurrentAttachment')}
              </a>
            )}
          </div>
        </div>
      </Modal>

      {/* Contact Modal */}
      <Modal
        isOpen={activeModal === 'contact'}
        title={t('profile.modals.editContact')}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800" onClick={closeModal} disabled={saving}>{t('profile.common.cancel')}</button>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2" onClick={handleSaveContact} disabled={saving}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />}
              {saving ? t('profile.common.saving') : t('profile.common.save')}
            </button>
          </div>
        }
      >
        {modalError && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{modalError}</div>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('profile.fields.location')}</label>
            <input
              type="text"
              value={contactForm.location}
              onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('profile.fields.enterLocation')}
            />
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={activeModal === 'share'}
        title={t('profile.modals.share')}
        onClose={() => setActiveModal(null)}
        footer={null}
        className="max-w-md"
        closeOnClickOutside={true}
      >
        <div className="space-y-5">
          {/* Profile summary row */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            {profile?.profile_image ? (
              <img
                src={profile.profile_image}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-lg font-bold flex-shrink-0">
                {profile?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">{profile?.name || '-'}</p>
              <p className="text-xs text-gray-500 truncate">
                {t('profile.share.classOf', { year: profile?.graduation_year || '-', faculty: profile?.faculty_name || profile?.faculty || '-' })}
              </p>
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">{t('profile.share.profileLink')}</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                onClick={(e) => e.target.select()}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-xs text-gray-700 focus:outline-none focus:border-gray-300"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 flex-shrink-0 ${
                  shareLinkCopied
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {shareLinkCopied ? <FiCheckCircle /> : <FiLink />}
                {shareLinkCopied ? t('profile.share.copied') : t('profile.share.copy')}
              </button>
            </div>
          </div>

          {/* Share Platforms */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-3">{t('profile.share.shareVia')}</label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1">
              {sharePlatforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  title={t('profile.share.shareViaPlatform', { platform: platform.name })}
                >
                  <div className="w-9 h-9 flex items-center justify-center">
                    {platform.icon}
                  </div>
                  <span className="text-[10px] text-gray-600 font-medium line-clamp-1">{platform.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Mentor Modal */}
      <Modal
        isOpen={activeModal === 'mentor'}
        title={myMentor ? t('profile.modals.editMentorProfile') : t('profile.modals.becomeMentor')}
        onClose={() => setActiveModal(null)}
        footer={
          <div className="flex justify-between items-center w-full gap-3">
            {myMentor && (
              <button
                type="button"
                onClick={handleRemoveMentor}
                className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm font-medium"
              >
                {t('profile.mentor.removeProfile')}
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                {t('profile.common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSaveMentor}
                disabled={saving}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold disabled:opacity-60"
              >
                {saving ? t('profile.common.saving') : t('profile.common.save')}
              </button>
            </div>
          </div>
        }
        className="max-w-lg"
      >
        {modalError && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{modalError}</p>
        )}

        {/* Profile image preview (read-only, from profile) */}
        <div className="flex items-center gap-4 mb-5 p-3 bg-blue-50 rounded-xl">
          {profile?.profile_image || profile?.student_photo ? (
            <img
              src={profile.profile_image || profile.student_photo}
              alt={t('profile.header.profileAlt')}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow">
              {profile?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{profile?.name}</p>
            <p className="text-xs text-gray-500">{t('profile.mentor.imageNote')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.fields.jobTitle')}</label>
              <input
                type="text"
                value={mentorForm.title}
                onChange={e => setMentorForm(p => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('profile.placeholders.jobTitle')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.fields.companyOrg')}</label>
              <input
                type="text"
                value={mentorForm.company}
                onChange={e => setMentorForm(p => ({ ...p, company: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('profile.placeholders.company')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.fields.faculty')}</label>
              <select
                value={mentorForm.faculty}
                onChange={e => setMentorForm(p => ({ ...p, faculty: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t('profile.faculties.select')}</option>
                <option value="Civil Engineering">{t('profile.faculties.civil')}</option>
                <option value="Computer Science">{t('profile.faculties.cs')}</option>
                <option value="Electromechanics">{t('profile.faculties.electromechanics')}</option>
                <option value="Geomatics">{t('profile.faculties.geomatics')}</option>
                <option value="Architecture">{t('profile.faculties.architecture')}</option>
                <option value="Other">{t('profile.faculties.other')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.fields.yearsOfExperience')}</label>
              <input
                type="number"
                min="0"
                max="60"
                value={mentorForm.years_of_experience}
                onChange={e => setMentorForm(p => ({ ...p, years_of_experience: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('profile.placeholders.years')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.fields.mentorBio')}</label>
            <textarea
              rows={3}
              value={mentorForm.bio}
              onChange={e => setMentorForm(p => ({ ...p, bio: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder={t('profile.placeholders.mentorBio')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.fields.expertiseAreas')}</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={mentorExpertiseInput}
                onChange={e => setMentorExpertiseInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMentorExpertise(); } }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('profile.placeholders.expertise')}
              />
              <button
                type="button"
                onClick={addMentorExpertise}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                {t('profile.mentor.add')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {mentorForm.expertise.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {tag}
                  <button type="button" onClick={() => removeMentorExpertise(tag)} className="hover:text-red-500">
                    <FiX size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      {/* Event Card Modal */}
      <EventCardModal
        isOpen={showEventCard}
        onClose={() => setShowEventCard(false)}
        event={cardEventData}
        user={profile}
        registration={cardRegData}
        onCardDownloaded={() => {
          setShowEventCard(false);
          fetchRegisteredEvents();
        }}
      />
    </Layout>
  );
};

export default ProfilePage;