import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiArrowLeft, FiCalendar,
  FiUser, FiCheck, FiTarget, FiAward, FiList, FiAlertCircle, FiArrowRight
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../utils/date';
import Swal from 'sweetalert2';
import jobService from '../services/jobService';
import ApplyModal from '../components/job/ApplyModal';

// ─── Brand palette ──────────────────────────────────────────────
const BRAND = '#194ce6';
const BRAND_DARK = '#0f2d8a';
const BRAND_DARKER = '#091d5e';
const BRAND_BG = '#eef1fd';
const BRAND_BORDER = '#c5ccf7';

const JobDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    checkIfApplied();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(id);
      if (response.status === 'success' && response.data) {
        setJob(response.data);
      } else {
        setError(t('jobs.details.notFoundError'));
      }
    } catch (err) {
      console.error('Error fetching job:', err);
      setError(t('jobs.details.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    if (!isAuthenticated()) return;
    try {
      const res = await jobService.getUserApplications(1, 100);
      const apps = res?.data?.applications || [];
      setHasApplied(apps.some(a => String(a.job_id) === String(id)));
    } catch {}
  };

  const handleApplyClick = () => {
    if (!isAuthenticated()) {
      Swal.fire({
        title: t('jobs.details.loginRequiredTitle'),
        text: t('jobs.details.loginRequiredText'),
        icon: 'warning',
        confirmButtonColor: BRAND,
        confirmButtonText: t('jobs.details.loginConfirm'),
        showCancelButton: true,
        cancelButtonText: t('jobs.details.loginCancel')
      }).then((result) => {
        if (result.isConfirmed) window.location.href = '/login';
      });
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplicationSuccess = () => {
    setHasApplied(true);
    Swal.fire({
      icon: 'success',
      title: t('jobs.details.successTitle'),
      text: t('jobs.details.successText'),
      confirmButtonColor: BRAND,
      confirmButtonText: t('jobs.details.successConfirm'),
      timer: 3000,
      timerProgressBar: true
    });
  };

  // ─── Loading ───
  if (loading) {
    return (
      <Layout>
        <section className="relative w-full h-56 overflow-hidden bg-gray-900" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-8 relative z-10">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 animate-pulse">
            <div className="flex gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-2/3 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="flex gap-3 flex-wrap mb-4">
              <div className="h-6 w-20 bg-gray-100 rounded-full" />
              <div className="h-6 w-24 bg-gray-100 rounded-full" />
              <div className="h-6 w-28 bg-gray-100 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-48" />
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-32" />
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-40" />
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-32" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ─── Error ───
  if (error || !job) {
    return (
      <Layout>
        <section className="relative w-full h-56 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.85) 100%), url("/depositphotos_205029014-stock-photo-asian-man-civil-engineer-woman.jpg")' }} />
          <div className="relative z-10 h-full flex items-center justify-center px-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{t('jobs.details.notFoundHero')}</h1>
          </div>
        </section>
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: BRAND_BG }}>
            <FiAlertCircle className="text-2xl" style={{ color: BRAND }} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">{t('jobs.details.notAvailableTitle')}</h2>
          <p className="text-sm text-gray-500 mb-6">{error || t('jobs.details.notAvailableText')}</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Link to="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors"
              style={{ background: BRAND_DARK }}
              onMouseEnter={e => e.currentTarget.style.background = BRAND_DARKER}
              onMouseLeave={e => e.currentTarget.style.background = BRAND_DARK}>
              <FiArrowLeft /> {t('jobs.details.backToJobs')}
            </Link>
            <Link to="/applications"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors border"
              style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
              {t('jobs.details.myApplications')}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // ─── Job Type chip ───
  const TypeChip = ({ type }) => {
    if (!type) return null;
    const isPrimary = type === 'Full-time';
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
        style={isPrimary
          ? { background: BRAND_DARK, color: '#fff' }
          : { background: BRAND_BG, color: BRAND, border: `1px solid ${BRAND_BORDER}` }
        }>
        {type}
      </span>
    );
  };

  // ─── Section card ───
  const Section = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
        <Icon className="text-sm" style={{ color: BRAND }} />
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-700">{title}</h3>
      </div>
      <div className="p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Hero — short dark band */}
      <section className="relative w-full h-56 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.85) 100%), url("/depositphotos_463234794-stock-photo-engineer-use-digital-tablet-construction.jpg")' }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 mb-3">
            <FiBriefcase className="text-[10px]" />
            {t('jobs.details.opportunityBadge')}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight max-w-3xl line-clamp-2">
            {job.title}
          </h1>
          <p className="text-sm text-white/70 mt-1.5 font-medium">{job.company}</p>
        </div>
      </section>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12 relative z-10">
        {/* Back link */}
        <Link to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline mb-3">
          <FiArrowLeft className="text-xs" /> {t('jobs.details.backToJobs')}
        </Link>

        {/* Header card — overlaps hero */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-5 sm:p-6 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: BRAND_BG }}>
              <FiBriefcase className="text-2xl" style={{ color: BRAND }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap mb-1.5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight tracking-tight">{job.title}</h2>
                <TypeChip type={job.type} />
                {job.posted_by_alumnus && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: BRAND_BG, color: BRAND, border: `1px solid ${BRAND_BORDER}` }}>
                    <FiCheck className="text-[10px]" /> {t('jobs.details.alumnus')}
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold mb-3" style={{ color: BRAND_DARK }}>{job.company}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
                {job.location && (
                  <span className="flex items-center gap-1"><FiMapPin className="w-3.5 h-3.5 text-gray-400" />{job.location}</span>
                )}
                {job.salary && (
                  <span className="flex items-center gap-1"><FiDollarSign className="w-3.5 h-3.5 text-gray-400" />{job.salary}</span>
                )}
                {(job.posted_at || job.created_at) && (
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                    {t('jobs.details.postedOn', { date: formatDateTime(job.posted_at || job.created_at) })}
                  </span>
                )}
                {job.posted_time_ago && (
                  <span className="flex items-center gap-1"><FiClock className="w-3.5 h-3.5 text-gray-400" />{job.posted_time_ago}</span>
                )}
              </div>
            </div>

            {/* Apply button — desktop visible inline */}
            <div className="hidden md:flex flex-col gap-2 flex-shrink-0">
              {hasApplied ? (
                <button disabled
                  className="px-5 py-2.5 bg-gray-100 text-gray-500 text-sm font-bold rounded-lg cursor-not-allowed flex items-center justify-center gap-1.5">
                  <FiCheck /> {t('jobs.details.applied')}
                </button>
              ) : (
                <button onClick={handleApplyClick}
                  className="px-5 py-2.5 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  style={{ background: BRAND_DARK }}
                  onMouseEnter={e => e.currentTarget.style.background = BRAND_DARKER}
                  onMouseLeave={e => e.currentTarget.style.background = BRAND_DARK}>
                  {t('jobs.details.applyNow')} <FiArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main content — 2-col grid for sections */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 self-start">
            <div className={(!job.requirements && !job.benefits) ? 'sm:col-span-2' : ''}>
              <Section icon={FiList} title={t('jobs.details.jobDescription')}>
                {job.description || t('jobs.details.noDescription')}
              </Section>
            </div>

            {job.requirements && (
              <div>
                <Section icon={FiTarget} title={t('jobs.details.requirements')}>
                  {job.requirements}
                </Section>
              </div>
            )}

            {job.benefits && (
              <div className={!job.requirements ? '' : ''}>
                <Section icon={FiAward} title={t('jobs.details.benefits')}>
                  {job.benefits}
                </Section>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Job info */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <FiBriefcase className="text-sm" style={{ color: BRAND }} />
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-700">{t('jobs.details.jobInformation')}</h3>
              </div>
              <div className="p-5 space-y-3">
                {job.experience_level && (
                  <InfoRow label={t('jobs.details.infoExperienceLevel')} value={job.experience_level} />
                )}
                {job.industry && (
                  <InfoRow label={t('jobs.details.infoIndustry')} value={job.industry} />
                )}
                {job.type && (
                  <InfoRow label={t('jobs.details.infoJobType')} value={job.type} />
                )}
                {job.location && (
                  <InfoRow label={t('jobs.details.infoLocation')} value={job.location} />
                )}
                {job.salary && (
                  <InfoRow label={t('jobs.details.infoSalary')} value={job.salary} />
                )}
                {job.application_deadline && (
                  <InfoRow label={t('jobs.details.infoApplyBy')}
                    value={new Date(job.application_deadline).toLocaleDateString()} />
                )}
                {job.posted_by_alumnus && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold" style={{ color: BRAND }}>
                    <FiUser className="w-3.5 h-3.5" />
                    {t('jobs.details.postedByAlumnus')}
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <FiArrowRight className="text-sm" style={{ color: BRAND }} />
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-700">{t('jobs.details.actions')}</h3>
              </div>
              <div className="p-4 space-y-2">
                {hasApplied ? (
                  <button disabled
                    className="w-full px-4 py-2.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg cursor-not-allowed flex items-center justify-center gap-1.5">
                    <FiCheck /> {t('jobs.details.alreadyApplied')}
                  </button>
                ) : (
                  <button onClick={handleApplyClick}
                    className="w-full px-4 py-2.5 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    style={{ background: BRAND_DARK }}
                    onMouseEnter={e => e.currentTarget.style.background = BRAND_DARKER}
                    onMouseLeave={e => e.currentTarget.style.background = BRAND_DARK}>
                    {t('jobs.details.applyForThisJob')} <FiArrowRight className="text-xs" />
                  </button>
                )}
                <Link to="/jobs"
                  className="block w-full px-4 py-2.5 text-xs font-bold rounded-lg text-center transition-colors border"
                  style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
                  {t('jobs.details.browseSimilar')}
                </Link>
                <Link to="/applications"
                  className="block w-full px-4 py-2.5 text-xs font-bold text-gray-600 rounded-lg text-center transition-colors border border-gray-200 hover:bg-gray-50">
                  {t('jobs.details.myApplications')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky mobile apply bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-2 z-40">
          <Link to="/jobs"
            className="flex-shrink-0 px-3 py-2.5 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center justify-center">
            <FiArrowLeft />
          </Link>
          {hasApplied ? (
            <button disabled
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg cursor-not-allowed flex items-center justify-center gap-1.5">
              <FiCheck /> {t('jobs.details.alreadyApplied')}
            </button>
          ) : (
            <button onClick={handleApplyClick}
              className="flex-1 px-4 py-2.5 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
              style={{ background: BRAND_DARK }}>
              {t('jobs.details.applyNow')} <FiArrowRight />
            </button>
          )}
        </div>
      </div>

      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        job={job}
        onApplicationSuccess={handleApplicationSuccess}
      />
    </Layout>
  );
};

// ─── Info row helper ───
const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
    <p className="text-xs font-semibold text-gray-800">{value}</p>
  </div>
);

export default JobDetailsPage;
