import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import alumniService from '../services/alumniService';
import {
  FiSearch, FiUser, FiLock, FiBriefcase, FiCheck, FiCheckCircle,
  FiAlertCircle, FiX, FiArrowRight, FiShield, FiMail, FiMapPin,
  FiLinkedin, FiImage, FiEdit3, FiAward, FiKey
} from 'react-icons/fi';

// ─── Brand palette ─────────────────────────────────────────────
const BRAND = '#002759';
const BRAND_LIGHT = '#0a519b';
const BRAND_ACCENT = '#194ce6';
const BRAND_BG = '#eef1fd';
const BRAND_BORDER = '#c5ccf7';

// ─── Section card with eyebrow header ───
const SectionCard = ({ icon: Icon, step, title, subtitle, children, complete }) => {
  const { t } = useTranslation();
  return (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
    <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100"
      style={{ background: complete ? '#f0fdf4' : '#fafbff' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-sm"
        style={{ background: complete ? '#16a34a' : BRAND }}>
        {complete ? <FiCheck size={16} /> : step}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} style={{ color: complete ? '#16a34a' : BRAND }} />}
          <h2 className="text-sm font-bold text-gray-900 tracking-tight">{title}</h2>
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {complete && (
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full text-green-700 bg-green-100 border border-green-200">
          {t('auth.register.verified')}
        </span>
      )}
    </div>
    <div className="p-6">{children}</div>
  </div>
  );
};

// ─── Step badge for the progress strip (sits on a WHITE card) ───
const StepBadge = ({ n, label, active, done }) => (
  <div className="flex items-center gap-2.5">
    <span
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition"
      style={done
        ? { background: '#16a34a', color: '#fff' }
        : active
          ? { background: BRAND, color: '#fff', boxShadow: `0 0 0 4px ${BRAND_BG}` }
          : { background: '#f1f3fb', color: '#9aa3c7', border: '1px solid #e2e6f7' }}
    >
      {done ? <FiCheck size={13} /> : n}
    </span>
    <span
      className="text-[11px] font-bold uppercase tracking-[0.12em]"
      style={{ color: done ? '#15803d' : active ? BRAND : '#9ca3af' }}
    >
      {label}
    </span>
  </div>
);

const VerifiedAlumniRegistration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    university_id: '',
    email: '',
    password: '',
    password_confirmation: '',
    current_job_title: '',
    current_company: '',
    location: '',
    linkedin_profile: '',
    bio: ''
  });
  
  const [studentData, setStudentData] = useState(null);
  const [showTazkiraModal, setShowTazkiraModal] = useState(false);
  const [tazkiraNumber, setTazkiraNumber] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [searchError, setSearchError] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear errors when user changes university_id
    if (name === 'university_id') {
      setSearchError('');
      setStudentData(null);
      setSubmitError('');
    }
  };
  
  const handleTazkiraChange = (e) => {
    setTazkiraNumber(e.target.value);
    setVerificationError('');
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };
  
  
  const searchStudent = async () => {
    if (!formData.university_id.trim()) {
      setSearchError(t('auth.errors.universityIdRequired'));
      return;
    }
    
    setSearchLoading(true);
    setSearchError('');
    
    try {
      const response = await alumniService.searchStudent(formData.university_id);
      const student = response.data;
      // Gate: only graduated students may register as alumni.
      if (student && !student.is_graduated) {
        setStudentData(null);
        setSearchError(t('auth.errors.notGraduated'));
        return;
      }
      setStudentData(student);
    } catch (error) {
      setSearchError(error.response?.data?.message || t('auth.errors.studentNotFound'));
      setStudentData(null);
    } finally {
      setSearchLoading(false);
    }
  };
  
  const verifyTazkira = async () => {
    if (!tazkiraNumber.trim()) {
      setVerificationError(t('auth.errors.tazkiraRequired'));
      return;
    }
    
    setVerificationLoading(true);
    setVerificationError('');
    
    try {
      const response = await alumniService.verifyTazkira(formData.university_id, tazkiraNumber);
      
      if (response.verified) {
        setShowTazkiraModal(false);
        // Proceed with registration
        await submitRegistration();
      }
    } catch (error) {
      let errorMessage = t('auth.errors.tazkiraFailed');

      if (error.response?.data?.error_type) {
        switch (error.response.data.error_type) {
          case 'university_id_not_found':
            errorMessage = t('auth.errors.universityIdNotFound');
            break;
          case 'tazkira_not_found':
            errorMessage = t('auth.errors.tazkiraNotFound');
            break;
          case 'mismatch':
            errorMessage = t('auth.errors.mismatch');
            break;
          default:
            errorMessage = error.response?.data?.message || errorMessage;
        }
      } else {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      
      setVerificationError(errorMessage);
    } finally {
      setVerificationLoading(false);
    }
  };
  
  const submitRegistration = async () => {
    const submissionData = new FormData();
    submissionData.append('university_id', formData.university_id);
    submissionData.append('email', formData.email);
    submissionData.append('password', formData.password);
    submissionData.append('password_confirmation', formData.password_confirmation);
    submissionData.append('current_job_title', formData.current_job_title);
    submissionData.append('current_company', formData.current_company);
    submissionData.append('location', formData.location);
    submissionData.append('linkedin_profile', formData.linkedin_profile);
    submissionData.append('bio', formData.bio);
    
    if (formData.profile_image) {
      submissionData.append('profile_image', formData.profile_image);
    }
    
    if (formData.cover_image) {
      submissionData.append('cover_image', formData.cover_image);
    }
    
    setLoading(true);
    setSubmitError('');
    
    try {
      await alumniService.registerVerifiedAlumni(submissionData);
      setSuccess(true);
      
      // Redirect to profile page after successful registration
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setSubmitError(error.response?.data?.message || t('auth.errors.registrationFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!studentData) {
      setSearchError(t('auth.errors.searchProfileFirst'));
      return;
    }
    
    // Show tazkira verification modal
    setShowTazkiraModal(true);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '#ccc' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    const levels = [
      { text: t('auth.register.strengthWeak'), color: '#dc3545' },
      { text: t('auth.register.strengthFair'), color: '#ffc107' },
      { text: t('auth.register.strengthGood'), color: '#20c997' },
      { text: t('auth.register.strengthStrong'), color: '#28a745' }
    ];
    
    return {
      strength: (strength / 4) * 100,
      text: levels[strength - 1]?.text || '',
      color: levels[strength - 1]?.color || '#ccc'
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // ─── Step tracking for the progress strip ───
  const step1Done = !!studentData;
  const step2Done = step1Done && !!formData.email && !!formData.password && formData.password === formData.password_confirmation;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* ─── Hero ─── */}
        <section className="relative w-full h-72 sm:h-80 overflow-hidden" style={{ background: BRAND }}>
          <div className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.88) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6")',
            }} />
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center pb-16">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-4"
              style={{ background: 'rgba(255,255,255,0.10)', color: '#fff', border: '1px solid rgba(255,255,255,0.20)' }}
            >
              <FiShield size={11} /> {t('auth.register.heroBadge')}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3 max-w-3xl">
              {t('auth.register.heroTitle')}
            </h1>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto leading-relaxed font-light">
              {t('auth.register.heroSubtitle')}
            </p>
          </div>
        </section>

        {/* ─── Step progress strip (overlaps hero) ─── */}
        <div className="max-w-3xl mx-auto px-4 lg:px-8 -mt-12 relative z-20">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <StepBadge n="1" label={t('auth.register.stepFindProfile')} active={!step1Done} done={step1Done} />
              <div className="flex-1 h-0.5 rounded-full transition-colors" style={{ background: step1Done ? '#16a34a' : '#e5e7eb' }} />
              <StepBadge n="2" label={t('auth.register.stepAccount')} active={step1Done && !step2Done} done={step2Done} />
              <div className="flex-1 h-0.5 rounded-full transition-colors" style={{ background: step2Done ? '#16a34a' : '#e5e7eb' }} />
              <StepBadge n="3" label={t('auth.register.stepVerify')} active={step2Done} done={false} />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 lg:px-8 pt-8 pb-14">
          {/* Success banner */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <h3 className="text-sm font-bold text-green-800">{t('auth.register.successTitle')}</h3>
                <p className="text-xs text-green-700 mt-0.5">{t('auth.register.successBody')}</p>
              </div>
            </div>
          )}

          {/* Submit error banner */}
          {submitError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={18} />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-800">{t('auth.register.failTitle')}</h3>
                <p className="text-xs text-red-700 mt-0.5">{submitError}</p>
              </div>
              <button type="button" onClick={() => setSubmitError('')} className="text-red-400 hover:text-red-700">
                <FiX size={14} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ─── Step 1: Find Profile ─── */}
            <SectionCard
              icon={FiSearch} step="1" complete={step1Done}
              title={t('auth.register.step1Title')}
              subtitle={t('auth.register.step1Subtitle')}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600 mb-2">
                    {t('auth.register.universityIdLabel')} <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div className="relative">
                    <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="text" name="university_id" value={formData.university_id} onChange={handleChange}
                      placeholder={t('auth.register.universityIdPlaceholder')}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                        errors.university_id ? 'border-red-400' : 'border-gray-200'
                      }`}
                      style={{ '--tw-ring-color': BRAND_BORDER }}
                    />
                  </div>
                  {errors.university_id && <p className="mt-1 text-xs text-red-600">{errors.university_id}</p>}
                </div>
                <div className="sm:flex sm:items-end">
                  <button
                    type="button" onClick={searchStudent}
                    disabled={searchLoading || !formData.university_id.trim()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-bold text-sm rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                    style={{ backgroundColor: BRAND }}
                    onMouseEnter={(e) => !searchLoading && (e.currentTarget.style.backgroundColor = BRAND_LIGHT)}
                    onMouseLeave={(e) => !searchLoading && (e.currentTarget.style.backgroundColor = BRAND)}
                  >
                    {searchLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('auth.register.searching')}</>
                    ) : (
                      <><FiSearch size={14} /> {t('auth.register.searchProfile')}</>
                    )}
                  </button>
                </div>
              </div>

              {searchError && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                  <FiAlertCircle className="text-red-600 flex-shrink-0" size={14} />
                  <p className="text-xs text-red-700">{searchError}</p>
                </div>
              )}

              {/* Student profile result */}
              {studentData && (
                <div className="mt-5 p-5 rounded-xl border" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <FiCheckCircle className="text-green-600" size={16} />
                    <h4 className="text-sm font-bold text-green-800">{t('auth.register.profileFound')}</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {[
                      [t('auth.register.fieldName'), `${studentData.first_name || ''} ${studentData.last_name || ''}`.trim() || t('auth.register.notAvailable')],
                      [t('auth.register.fieldFatherName'), studentData.father_name || t('auth.register.notAvailable')],
                      [t('auth.register.fieldGrandfatherName'), studentData.grandfather_name || t('auth.register.notAvailable')],
                      [t('auth.register.fieldUniversityId'), studentData.student_id],
                      [t('auth.register.fieldFaculty'), studentData.department?.faculty?.name || t('auth.register.notAvailable')],
                      [t('auth.register.fieldDepartment'), studentData.department?.name || t('auth.register.notAvailable')],
                      [t('auth.register.fieldGraduationYear'), studentData.graduation_year || t('auth.register.notAvailable')],
                      [t('auth.register.fieldPhoneNumber'), studentData.phone_number || t('auth.register.notAvailable')],
                    ].map(([label, val], i) => (
                      <div key={i}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500 mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-gray-900">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            {/* ─── Step 2: Account Information ─── */}
            {studentData && (
              <SectionCard
                icon={FiLock} step="2" complete={step2Done}
                title={t('auth.register.step2Title')}
                subtitle={t('auth.register.step2Subtitle')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600 mb-2">
                      {t('auth.register.emailLabel')} <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                      <input
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        placeholder={t('auth.register.emailPlaceholder')}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                          errors.email ? 'border-red-400' : 'border-gray-200'
                        }`}
                        style={{ '--tw-ring-color': BRAND_BORDER }}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600 mb-2">
                      {t('auth.register.passwordLabel')} <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                      <input
                        type="password" name="password" value={formData.password} onChange={handleChange}
                        placeholder={t('auth.register.passwordPlaceholder')}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                          errors.password ? 'border-red-400' : 'border-gray-200'
                        }`}
                        style={{ '--tw-ring-color': BRAND_BORDER }}
                      />
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">{t('auth.register.strength')}</span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: passwordStrength.color }}>
                            {passwordStrength.text}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${passwordStrength.strength}%`, backgroundColor: passwordStrength.color }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600 mb-2">
                      {t('auth.register.confirmPasswordLabel')} <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                      <input
                        type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange}
                        placeholder={t('auth.register.confirmPasswordPlaceholder')}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                          errors.password_confirmation ? 'border-red-400' : 'border-gray-200'
                        }`}
                        style={{ '--tw-ring-color': BRAND_BORDER }}
                      />
                    </div>
                    {errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{errors.password_confirmation}</p>}
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg flex items-start gap-2"
                  style={{ background: BRAND_BG, border: `1px solid ${BRAND_BORDER}` }}>
                  <FiShield className="flex-shrink-0 mt-0.5" style={{ color: BRAND }} size={14} />
                  <p className="text-[11px] leading-relaxed" style={{ color: BRAND }}>
                    <strong>{t('auth.register.passwordRequirementsLabel')}</strong> {t('auth.register.passwordRequirements')}
                  </p>
                </div>
              </SectionCard>
            )}

            {/* ─── Step 3: Professional Info (Optional) ─── */}
            {studentData && (
              <SectionCard
                icon={FiBriefcase} step="3" complete={false}
                title={t('auth.register.step3Title')}
                subtitle={t('auth.register.step3Subtitle')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field icon={FiBriefcase} label={t('auth.register.jobTitleLabel')} name="current_job_title"
                    value={formData.current_job_title} onChange={handleChange} placeholder={t('auth.register.jobTitlePlaceholder')} />
                  <Field icon={FiBriefcase} label={t('auth.register.companyLabel')} name="current_company"
                    value={formData.current_company} onChange={handleChange} placeholder={t('auth.register.companyPlaceholder')} />
                  <Field icon={FiMapPin} label={t('auth.register.locationLabel')} name="location"
                    value={formData.location} onChange={handleChange} placeholder={t('auth.register.locationPlaceholder')} />
                  <Field icon={FiLinkedin} label={t('auth.register.linkedinLabel')} name="linkedin_profile" type="url"
                    value={formData.linkedin_profile} onChange={handleChange} placeholder={t('auth.register.linkedinPlaceholder')}
                    error={errors.linkedin_profile} />

                  {/* File inputs */}
                  <FileField icon={FiImage} label={t('auth.register.profileImageLabel')} name="profile_image" onChange={handleFileChange} />
                  <FileField icon={FiImage} label={t('auth.register.coverImageLabel')} name="cover_image" onChange={handleFileChange} />
                </div>

                <div className="mt-4">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600 mb-2">
                    <FiEdit3 className="inline mr-1" size={12} /> {t('auth.register.bioLabel')}
                  </label>
                  <textarea
                    name="bio" value={formData.bio} onChange={handleChange}
                    rows={4} maxLength="1000"
                    placeholder={t('auth.register.bioPlaceholder')}
                    className="w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition resize-none"
                    style={{ '--tw-ring-color': BRAND_BORDER }}
                  />
                  <p className="text-[10px] text-gray-400 text-right mt-1">{(formData.bio || '').length}/1000</p>
                </div>
              </SectionCard>
            )}

            {/* ─── Submit ─── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                {studentData
                  ? <>{t('auth.register.submitHintReady')} <strong>{t('auth.register.submitHintReadyButton')}</strong>.</>
                  : <>{t('auth.register.submitHintStart')}</>}
              </p>
              <button
                type="submit" disabled={loading || !studentData}
                className="inline-flex items-center justify-center gap-2 text-white font-bold py-3 px-6 rounded-lg transition text-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: BRAND }}
                onMouseEnter={(e) => !loading && studentData && (e.currentTarget.style.backgroundColor = BRAND_LIGHT)}
                onMouseLeave={(e) => !loading && studentData && (e.currentTarget.style.backgroundColor = BRAND)}
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('auth.register.registering')}</>
                ) : (
                  <>{t('auth.register.completeRegistration')} <FiArrowRight size={15} /></>
                )}
              </button>
            </div>

            {/* Bottom link to login */}
            <p className="text-center text-xs text-gray-500 pt-2">
              {t('auth.register.alreadyHaveAccount')}{' '}
              <button type="button" onClick={() => navigate('/login')}
                className="font-bold hover:underline" style={{ color: BRAND_ACCENT }}>
                {t('auth.register.signInInstead')}
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* ─── Tazkira Verification Modal ─── */}
      {showTazkiraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => {
          setShowTazkiraModal(false); setTazkiraNumber(''); setVerificationError('');
        }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-5 flex items-center gap-3" style={{ background: BRAND }}>
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <FiShield className="text-white" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/70 font-bold">{t('auth.tazkira.finalStep')}</p>
                <h3 className="text-base font-bold text-white truncate">{t('auth.tazkira.title')}</h3>
              </div>
              <button onClick={() => { setShowTazkiraModal(false); setTazkiraNumber(''); setVerificationError(''); }}
                className="text-white/80 hover:text-white p-1 flex-shrink-0">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                {t('auth.tazkira.introBefore')} <strong>{t('auth.tazkira.introBold')}</strong> {t('auth.tazkira.introAfter')}
              </p>

              <div className="mb-5">
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600 mb-2">
                  {t('auth.tazkira.label')} <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div className="relative">
                  <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <input
                    type="text" value={tazkiraNumber} onChange={handleTazkiraChange}
                    placeholder={t('auth.tazkira.placeholder')}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                      verificationError ? 'border-red-400' : 'border-gray-200'
                    }`}
                    style={{ '--tw-ring-color': BRAND_BORDER }}
                  />
                </div>
                {verificationError && (
                  <div className="mt-2 p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                    <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={13} />
                    <p className="text-xs text-red-700">{verificationError}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                <button
                  onClick={() => { setShowTazkiraModal(false); setTazkiraNumber(''); setVerificationError(''); }}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  {t('auth.tazkira.cancel')}
                </button>
                <button
                  onClick={verifyTazkira} disabled={verificationLoading || !tazkiraNumber.trim()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                  style={{ backgroundColor: BRAND }}
                  onMouseEnter={(e) => !verificationLoading && (e.currentTarget.style.backgroundColor = BRAND_LIGHT)}
                  onMouseLeave={(e) => !verificationLoading && (e.currentTarget.style.backgroundColor = BRAND)}
                >
                  {verificationLoading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('auth.tazkira.verifying')}</>
                  ) : (
                    <><FiCheckCircle size={14} /> {t('auth.tazkira.verifyAndRegister')}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

// ─── Reusable input field with icon ───
const Field = ({ icon: Icon, label, name, value, onChange, placeholder, type = 'text', error }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600 mb-2">
      {Icon && <Icon className="inline mr-1" size={12} />}{label}
    </label>
    <input
      type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full px-3 py-3 border rounded-lg bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
        error ? 'border-red-400' : 'border-gray-200'
      }`}
      style={{ '--tw-ring-color': BRAND_BORDER }}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const FileField = ({ icon: Icon, label, name, onChange }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600 mb-2">
      {Icon && <Icon className="inline mr-1" size={12} />}{label}
    </label>
    <input
      type="file" name={name} onChange={onChange} accept="image/*"
      className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:cursor-pointer file:transition"
      style={{ '--tw-ring-color': BRAND_BORDER }}
      onFocus={(e) => e.currentTarget.classList.add('ring-2')}
      onBlur={(e) => e.currentTarget.classList.remove('ring-2')}
    />
    <style>{`
      input[name="${name}"]::file-selector-button { background:${BRAND_BG}; color:${BRAND}; }
      input[name="${name}"]::file-selector-button:hover { background:${BRAND_BORDER}; }
    `}</style>
  </div>
);

export default VerifiedAlumniRegistration;
