import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiLink, FiMail, FiPhone, FiMapPin, FiEdit, FiShare2, FiUser, FiBriefcase, FiBookOpen, FiSettings, FiAward, FiTrendingUp, FiStar, FiTarget, FiTrash2, FiPlus, FiCamera } from 'react-icons/fi';
import alumniService from '../services/alumniService';
import authService from '../services/authService';
import Modal from '../components/ui/Modal';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeModal, setActiveModal] = useState(null); // basic | experience | education | skill | achievement
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const [experienceAttachment, setExperienceAttachment] = useState(null);
  const [educationAttachment, setEducationAttachment] = useState(null);
  const [skillAttachment, setSkillAttachment] = useState(null);
  const [achievementAttachment, setAchievementAttachment] = useState(null);

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

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

  const [experienceForm, setExperienceForm] = useState(emptyExperience);
  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [achievementForm, setAchievementForm] = useState(emptyAchievement);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');

        if (!authService.isAuthenticated()) {
          navigate('/login');
          return;
        }

        const response = await alumniService.getMe();
        setProfile(response.data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load profile.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const refreshProfile = async () => {
    const response = await alumniService.getMe();
    setProfile(response.data);
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
      year: item.year ?? '',
      category: item.category || '',
      description: item.description || ''
    } : emptyAchievement);
    setActiveModal('achievement');
  };

  const handleSaveBasic = async () => {
    try {
      setSaving(true);
      setModalError('');
      await alumniService.updateMe(basicForm);
      await refreshProfile();
      closeModal();
    } catch (e) {
      setModalError(e.response?.data?.message || 'Failed to save changes.');
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
      setModalError(e.response?.data?.message || 'Failed to save experience.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await alumniService.deleteExperience(id);
      await refreshProfile();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete experience.');
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
      setModalError(e.response?.data?.message || 'Failed to save education.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (id) => {
    if (!window.confirm('Delete this education?')) return;
    try {
      await alumniService.deleteEducation(id);
      await refreshProfile();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete education.');
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
      setModalError(e.response?.data?.message || 'Failed to save skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await alumniService.deleteSkill(id);
      await refreshProfile();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete skill.');
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
      setModalError(e.response?.data?.message || 'Failed to save achievement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAchievement = async (id) => {
    if (!window.confirm('Delete this achievement?')) return;
    try {
      await alumniService.deleteAchievement(id);
      await refreshProfile();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete achievement.');
    }
  };

  const handleProfileFileSelected = async (file) => {
    if (!file) return;
    try {
      setSaving(true);
      await alumniService.uploadProfileImage(file);
      await refreshProfile();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to upload profile image.');
    } finally {
      setSaving(false);
    }
  };

  const handleCoverFileSelected = async (file) => {
    if (!file) return;
    try {
      setSaving(true);
      await alumniService.uploadCoverImage(file);
      await refreshProfile();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to upload cover image.');
    } finally {
      setSaving(false);
    }
  };

  const experiences = profile?.experiences || [];
  const educations = profile?.educations || [];
  const skills = profile?.skills || [];
  const achievements = profile?.achievements || [];

  const coverImage = profile?.cover_image || 'https://picsum.photos/seed/cover/1200/400.jpg';
  const avatarImage = profile?.profile_image || 'https://picsum.photos/seed/avatar/200/200.jpg';

  return (
    <Layout>
      {/* Background Gradient Section */}
      <div className="fixed top-0 left-0 right-0 h-screen bg-gradient-to-b from-[#002759]/80 via-[#002759]/40 to-[#002759]/10 -z-10"></div>
      
      {/* Hero Section */}
      

      <div className="min-h-screen bg-gray-50">
        <div className=" h-12 bg-cover bg-center " >
          <div className="absolute inset-0 bg-gradient-to-b from-[#002759]/95  to-blue-500 to-transparent"></div>
          <div className="relative flex items-center justify-center ">
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12">
          {loading && (
            <div className="p-6 rounded-xl border border-[#dcdee5] shadow-sm bg-white mb-6">
              <p className="text-black">Loading profile...</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-6 rounded-xl border border-red-200 shadow-sm bg-red-50 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Profile Header Card */}
          <div className="bg-primary rounded-xl border border-primary shadow-sm overflow-hidden mb-6">
            {/* Cover Image */}
            <div className="w-full bg-center bg-no-repeat bg-cover min-h-64 relative" style={{backgroundImage: `url("${coverImage}")`}}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900 rounded-lg px-3 py-2 text-sm font-semibold shadow flex items-center gap-2"
                disabled={saving}
              >
                <FiCamera />
                Update Cover
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleCoverFileSelected(e.target.files?.[0] || null)}
              />
            </div>
            <div className="bg-primary px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-16 relative z-10">
              <div className="relative">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full border-4 border-white size-40 shadow-lg" style={{backgroundImage: `url("${avatarImage}")`}}></div>
                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white text-gray-900 shadow flex items-center justify-center hover:bg-gray-50"
                  title="Update profile image"
                  disabled={saving}
                >
                  <FiCamera />
                </button>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleProfileFileSelected(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex-1 flex flex-col md:flex-row justify-between items-end pb-2">
                <div className="flex flex-col pt-20">
                  <div className="flex items-center gap-2">
                    <h1 className="text-black text-3xl font-bold leading-tight">{profile?.name || '-'}</h1>
                    <span className="material-symbols-outlined text-black fill-1" title="Verified Alumnus">verified</span>
                  </div>
                  <p className="text-black text-lg font-medium">Class of {profile?.graduation_year || '-'} • {profile?.faculty || '-'}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      Verified Alumnus
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button type="button" onClick={openBasicModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                    <FiEdit className="text-sm" />
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    <FiShare2 />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white px-8 pb-8 pt-8">
              {/* Main content will go here */}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column (Sidebar) */}
            <aside className="md:col-span-4 flex flex-col gap-6">
              {/* Contact Info Card */}
              <div className="p-6 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-lg font-bold mb-4">Contact Information</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="size-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
                      <FiMail className="text-white" />
                    </div>
                    <span className="text-black text-sm font-medium">{profile?.email || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="size-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
                      <FiPhone className="text-white" />
                    </div>
                    <span className="text-black text-sm font-medium">{profile?.phone || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="size-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md">
                      <FiMapPin className="text-white" />
                    </div>
                    <span className="text-black text-sm font-medium">{profile?.location || '-'}</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button type="button" className="size-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border border-blue-400" title="Website">
                      <FiLink className="text-xl" />
                    </button>
                    <button type="button" className="size-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border border-emerald-400" title="Email">
                      <FiMail className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>

            </aside>

            {/* Right Column (Main Content) */}
            <div className="md:col-span-8 flex flex-col gap-6">
              {/* About Me */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-xl font-bold mb-6 flex items-center gap-2">
                  <FiUser className="text-primary" />
                  About Me
                </h3>
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-black leading-relaxed text-base">
                    {profile?.bio || 'No bio added yet.'}
                  </p>
                </div>
              </section>

              {/* Professional Experience */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-black text-xl font-bold flex items-center gap-2">
                    <FiBriefcase className="text-primary" />
                    Professional Experience
                  </h3>
                  <button type="button" onClick={() => openExperienceModal(null)} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2">
                    <FiPlus />
                    Add
                  </button>
                </div>
                <div className="space-y-8">
                  {experiences.length === 0 ? (
                    <button type="button" onClick={() => openExperienceModal(null)} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2 cursor-pointer">
                      <FiPlus />
                      Add Experience
                    </button>
                  ) : (
                    experiences.map((exp, idx) => (
                      <div key={exp.id} className="relative pl-12 pb-8 border-l-2 border-gray-200 last:border-l-0">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 ${idx === 0 ? 'bg-primary border-gray-100' : 'bg-gray-400 border-white'} rounded-full border-4 shadow-sm`}></div>
                        <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 relative">
                          <div className="absolute top-3 right-3 flex gap-2">
                            <button type="button" onClick={() => openExperienceModal(exp)} className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 flex items-center justify-center" title="Edit">
                              <FiEdit />
                            </button>
                            <button type="button" onClick={() => handleDeleteExperience(exp.id)} className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-red-600 hover:bg-red-50 flex items-center justify-center" title="Delete">
                              <FiTrash2 />
                            </button>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                            <h4 className="text-black font-bold text-lg mb-1 sm:mb-0">{exp.job_title}</h4>
                            <span className="text-primary font-medium text-sm">{exp.company || '-'}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{exp.location || '-'}</p>
                          <p className="text-black text-sm leading-relaxed">{exp.description || ''}</p>
                          {exp.attachment && (
                            <a className="inline-block mt-3 text-sm font-semibold text-blue-700 hover:text-blue-900" href={exp.attachment} target="_blank" rel="noreferrer">
                              View Attachment
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Education */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-black text-xl font-bold flex items-center gap-2">
                    <FiBookOpen className="text-primary" />
                    Education
                  </h3>
                  <button type="button" onClick={() => openEducationModal(null)} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2">
                    <FiPlus />
                    Add
                  </button>
                </div>
                <div className="space-y-8">
                  {educations.length === 0 ? (
                    <button type="button" onClick={() => openEducationModal(null)} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2 cursor-pointer">
                      <FiPlus />
                      Add Education
                    </button>
                  ) : (
                    educations.map((edu, idx) => (
                      <div key={edu.id} className="relative pl-12 pb-8 border-l-2 border-gray-200 last:border-l-0">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 ${idx === 0 ? 'bg-primary border-gray-100' : 'bg-gray-400 border-white'} rounded-full border-4 shadow-sm`}></div>
                        <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 relative">
                          <div className="absolute top-3 right-3 flex gap-2">
                            <button type="button" onClick={() => openEducationModal(edu)} className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 flex items-center justify-center" title="Edit">
                              <FiEdit />
                            </button>
                            <button type="button" onClick={() => handleDeleteEducation(edu.id)} className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-red-600 hover:bg-red-50 flex items-center justify-center" title="Delete">
                              <FiTrash2 />
                            </button>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                            <h4 className="text-black font-bold text-lg mb-1 sm:mb-0">{edu.institution}</h4>
                            <span className="text-primary font-medium text-sm">{edu.field_of_study || edu.degree || '-'}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{edu.start_year || ''}{edu.end_year ? ` — ${edu.end_year}` : ''}</p>
                          {edu.attachment && (
                            <a className="inline-block mt-3 text-sm font-semibold text-blue-700 hover:text-blue-900" href={edu.attachment} target="_blank" rel="noreferrer">
                              View Attachment
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Skills & Expertise */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-black text-xl font-bold flex items-center gap-2">
                    <FiSettings className="text-primary" />
                    Skills & Expertise
                  </h3>
                  <button type="button" onClick={() => openSkillModal(null)} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2">
                    <FiPlus />
                    Add
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {skills.length === 0 ? (
                    <button type="button" onClick={() => openSkillModal(null)} className="col-span-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2 cursor-pointer">
                      <FiPlus />
                      Add Skill
                    </button>
                  ) : (
                    skills.map((skill) => (
                      <div key={skill.id} className="relative bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-300 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button type="button" onClick={() => openSkillModal(skill)} className="w-7 h-7 rounded-md bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 flex items-center justify-center" title="Edit">
                            <FiEdit size={14} />
                          </button>
                          <button type="button" onClick={() => handleDeleteSkill(skill.id)} className="w-7 h-7 rounded-md bg-white border border-gray-200 text-red-600 hover:bg-red-50 flex items-center justify-center" title="Delete">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                        <span className="text-black text-sm font-medium block text-center">{skill.name}</span>
                        {skill.attachment && (
                          <a className="block mt-2 text-xs font-semibold text-blue-700 hover:text-blue-900 text-center" href={skill.attachment} target="_blank" rel="noreferrer">
                            View
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Achievements & Awards */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-black text-xl font-bold flex items-center gap-2">
                    <FiAward className="text-primary" />
                    Achievements & Awards
                  </h3>
                  <button type="button" onClick={() => openAchievementModal(null)} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2">
                    <FiPlus />
                    Add
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <FiTrendingUp className="text-yellow-600 text-2xl" />
                      <span className="text-2xl font-bold text-gray-900">{achievements.length}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Total Achievements</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <FiStar className="text-blue-600 text-2xl" />
                      <span className="text-2xl font-bold text-gray-900">{achievements[0]?.year || '-'}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Latest Year</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <FiTarget className="text-green-600 text-2xl" />
                      <span className="text-2xl font-bold text-gray-900">{achievements[0]?.category || '-'}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Latest Category</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {achievements.length === 0 ? (
                    <button type="button" onClick={() => openAchievementModal(null)} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2 cursor-pointer">
                      <FiPlus />
                      Add Achievement
                    </button>
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
                                View Attachment
                              </a>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => openAchievementModal(a)} className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 flex items-center justify-center" title="Edit">
                              <FiEdit />
                            </button>
                            <button type="button" onClick={() => handleDeleteAchievement(a.id)} className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-red-600 hover:bg-red-50 flex items-center justify-center" title="Delete">
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={activeModal === 'basic'}
        title="Edit Profile"
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800" onClick={closeModal} disabled={saving}>Cancel</button>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2" onClick={handleSaveBasic} disabled={saving}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        }
      >
        {modalError && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{modalError}</div>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Phone</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={basicForm.phone} onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Current Job Title</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={basicForm.current_job_title} onChange={(e) => setBasicForm({ ...basicForm, current_job_title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Current Company</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={basicForm.current_company} onChange={(e) => setBasicForm({ ...basicForm, current_company: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Location</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={basicForm.location} onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">LinkedIn</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={basicForm.linkedin_profile} onChange={(e) => setBasicForm({ ...basicForm, linkedin_profile: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Bio</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 min-h-[120px]" value={basicForm.bio} onChange={(e) => setBasicForm({ ...basicForm, bio: e.target.value })} />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'experience'}
        title={editingItem?.id ? 'Edit Experience' : 'Add Experience'}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800" onClick={closeModal} disabled={saving}>Cancel</button>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2" onClick={handleSaveExperience} disabled={saving}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        }
      >
        {modalError && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{modalError}</div>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Job Title *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={experienceForm.job_title} onChange={(e) => setExperienceForm({ ...experienceForm, job_title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Company</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Location</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={experienceForm.location} onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Start Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={experienceForm.start_date} onChange={(e) => setExperienceForm({ ...experienceForm, start_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">End Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={experienceForm.end_date} onChange={(e) => setExperienceForm({ ...experienceForm, end_date: e.target.value })} disabled={experienceForm.is_current} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-800 font-semibold">
            <input type="checkbox" checked={experienceForm.is_current} onChange={(e) => setExperienceForm({ ...experienceForm, is_current: e.target.checked, end_date: e.target.checked ? '' : experienceForm.end_date })} />
            I currently work here
          </label>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Description</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 min-h-[100px]" value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Attachment</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-black font-semibold hover:bg-gray-50 cursor-pointer w-fit">
                Choose File
                <input type="file" className="hidden" onChange={(e) => setExperienceAttachment(e.target.files?.[0] || null)} />
              </label>
              <span className="text-sm text-gray-900 truncate">
                {experienceAttachment?.name || 'No file selected'}
              </span>
            </div>
            {editingItem?.attachment && (
              <a className="inline-block mt-2 text-sm font-semibold text-blue-700 hover:text-blue-900" href={editingItem.attachment} target="_blank" rel="noreferrer">
                View Current Attachment
              </a>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'education'}
        title={editingItem?.id ? 'Edit Education' : 'Add Education'}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800" onClick={closeModal} disabled={saving}>Cancel</button>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2" onClick={handleSaveEducation} disabled={saving}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        }
      >
        {modalError && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{modalError}</div>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Institution *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={educationForm.institution} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Degree</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Field of Study</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={educationForm.field_of_study} onChange={(e) => setEducationForm({ ...educationForm, field_of_study: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Start Year</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={educationForm.start_year} onChange={(e) => setEducationForm({ ...educationForm, start_year: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">End Year</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={educationForm.end_year} onChange={(e) => setEducationForm({ ...educationForm, end_year: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Grade</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={educationForm.grade} onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Description</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 min-h-[100px]" value={educationForm.description} onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Attachment</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-black font-semibold hover:bg-gray-50 cursor-pointer w-fit">
                Choose File
                <input type="file" className="hidden" onChange={(e) => setEducationAttachment(e.target.files?.[0] || null)} />
              </label>
              <span className="text-sm text-gray-900 truncate">
                {educationAttachment?.name || 'No file selected'}
              </span>
            </div>
            {editingItem?.attachment && (
              <a className="inline-block mt-2 text-sm font-semibold text-blue-700 hover:text-blue-900" href={editingItem.attachment} target="_blank" rel="noreferrer">
                View Current Attachment
              </a>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'skill'}
        title={editingItem?.id ? 'Edit Skill' : 'Add Skill'}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800" onClick={closeModal} disabled={saving}>Cancel</button>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2" onClick={handleSaveSkill} disabled={saving}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        }
      >
        {modalError && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{modalError}</div>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Skill Name *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Category</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Proficiency (1-5)</label>
            <input type="number" min="1" max="5" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Attachment</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-black font-semibold hover:bg-gray-50 cursor-pointer w-fit">
                Choose File
                <input type="file" className="hidden" onChange={(e) => setSkillAttachment(e.target.files?.[0] || null)} />
              </label>
              <span className="text-sm text-gray-900 truncate">
                {skillAttachment?.name || 'No file selected'}
              </span>
            </div>
            {editingItem?.attachment && (
              <a className="inline-block mt-2 text-sm font-semibold text-blue-700 hover:text-blue-900" href={editingItem.attachment} target="_blank" rel="noreferrer">
                View Current Attachment
              </a>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'achievement'}
        title={editingItem?.id ? 'Edit Achievement' : 'Add Achievement'}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800" onClick={closeModal} disabled={saving}>Cancel</button>
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2" onClick={handleSaveAchievement} disabled={saving}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        }
      >
        {modalError && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{modalError}</div>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Title *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={achievementForm.title} onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Issuer</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={achievementForm.issuer} onChange={(e) => setAchievementForm({ ...achievementForm, issuer: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Year</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={achievementForm.year} onChange={(e) => setAchievementForm({ ...achievementForm, year: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Category</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" value={achievementForm.category} onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Description</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 min-h-[100px]" value={achievementForm.description} onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Attachment</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-black font-semibold hover:bg-gray-50 cursor-pointer w-fit">
                Choose File
                <input type="file" className="hidden" onChange={(e) => setAchievementAttachment(e.target.files?.[0] || null)} />
              </label>
              <span className="text-sm text-gray-900 truncate">
                {achievementAttachment?.name || 'No file selected'}
              </span>
            </div>
            {editingItem?.attachment && (
              <a className="inline-block mt-2 text-sm font-semibold text-blue-700 hover:text-blue-900" href={editingItem.attachment} target="_blank" rel="noreferrer">
                View Current Attachment
              </a>
            )}
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default ProfilePage;
