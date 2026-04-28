import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiX, FiUpload, FiUser, FiMail, FiPhone, FiFileText, FiFile, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';

// ─── Brand palette ──────────────────────────────────────────────
const BRAND = '#194ce6';
const BRAND_DARK = '#0f2d8a';
const BRAND_DARKER = '#091d5e';
const BRAND_BG = '#eef1fd';
const BRAND_BORDER = '#c5ccf7';

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const ApplyModal = ({ isOpen, onClose, job, onApplicationSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    cover_letter: '',
  });
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Pre-fill form with user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [isOpen, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    setCvFile(file);
    setUploadProgress(0);
    setUploadComplete(false);
    setError('');
  };

  const removeFile = () => {
    setCvFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
    const input = document.getElementById('cv_file');
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUploadProgress(0);
    setUploadComplete(false);

    try {
      const { default: jobService } = await import('../../services/jobService');

      await jobService.applyForJob(
        job.id,
        formData,
        cvFile,
        (percent) => {
          setUploadProgress(percent);
          if (percent === 100) {
            setUploadComplete(true);
          }
        }
      );

      onApplicationSuccess();
      handleClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application';
      const isAlreadyApplied = err.response?.data?.error_code === 'ALREADY_APPLIED';
      handleClose();
      Swal.fire({
        icon: isAlreadyApplied ? 'info' : 'error',
        title: isAlreadyApplied ? 'Already Applied' : 'Error',
        text: msg,
        confirmButtonColor: BRAND,
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ phone: '', email: '', cover_letter: '' });
    setCvFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setError('');
    onClose();
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900 truncate">Apply for Position</h2>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">{job.title} · {job.company}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* User Information Preview */}
          <div className="rounded-xl p-4" style={{ background: BRAND_BG, border: `1px solid ${BRAND_BORDER}` }}>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3 flex items-center gap-1.5" style={{ color: BRAND_DARK }}>
              <FiUser className="w-3 h-3" />
              Your Information
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <InfoRow label="Name" value={user?.name} />
              <InfoRow label="Faculty" value={user?.faculty_name} />
              <InfoRow label="Department" value={user?.department_name} />
              <InfoRow label="Graduation" value={user?.graduation_year} />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1">
                <FiMail className="w-3 h-3" /> Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:border-transparent text-gray-900 transition-all disabled:opacity-50"
                style={{ '--tw-ring-color': BRAND_BORDER }}
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1">
                <FiPhone className="w-3 h-3" /> Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:border-transparent text-gray-900 transition-all disabled:opacity-50"
                style={{ '--tw-ring-color': BRAND_BORDER }}
                placeholder="+93 7XX XXX XXX"
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1">
              <FiFileText className="w-3 h-3" /> Cover Letter <span className="text-gray-400 font-medium normal-case tracking-normal text-[11px]">(optional)</span>
            </label>
            <textarea
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleInputChange}
              rows={3}
              disabled={loading}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:border-transparent text-gray-900 transition-all resize-none disabled:opacity-50"
              style={{ '--tw-ring-color': BRAND_BORDER }}
              placeholder="Tell us why you're a great fit..."
            />
          </div>

          {/* CV Upload */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1">
              <FiUpload className="w-3 h-3" /> CV / Resume <span className="text-gray-400 font-medium normal-case tracking-normal text-[11px]">(optional)</span>
            </label>

            {/* No file yet — drop zone */}
            {!cvFile && (
              <label
                htmlFor="cv_file"
                className="block border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-gray-50"
                onMouseEnter={e => e.currentTarget.style.borderColor = BRAND_BORDER}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-2" style={{ background: BRAND_BG }}>
                  <FiUpload className="text-base" style={{ color: BRAND }} />
                </div>
                <p className="text-xs font-semibold text-gray-700">Click to upload or drag and drop</p>
                <p className="text-[10px] text-gray-400 mt-0.5">PDF, DOC, DOCX · max 5MB</p>
                <input
                  type="file"
                  id="cv_file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            )}

            {/* File selected — info card with progress bar */}
            {cvFile && (
              <div className="border border-gray-200 rounded-xl p-3 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: BRAND_BG }}>
                    {uploadComplete ? (
                      <FiCheckCircle className="text-base text-green-600" />
                    ) : (
                      <FiFile className="text-base" style={{ color: BRAND }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{cvFile.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {formatBytes(cvFile.size)}
                      {loading && uploadProgress > 0 && uploadProgress < 100 && (
                        <> · <span style={{ color: BRAND }}>Uploading… {uploadProgress}%</span></>
                      )}
                      {uploadComplete && (
                        <> · <span className="text-green-600 font-semibold">Upload complete</span></>
                      )}
                    </p>
                  </div>
                  {!loading && (
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                      title="Remove file"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Progress bar — only during upload */}
                {loading && uploadProgress > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{
                          width: `${uploadProgress}%`,
                          background: uploadComplete
                            ? '#16a34a'
                            : `linear-gradient(to right, ${BRAND_DARK}, ${BRAND})`
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[10px] font-semibold" style={{ color: BRAND }}>
                        {uploadComplete ? 'Processing...' : `${uploadProgress}%`}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {Math.round((cvFile.size * uploadProgress) / 100 / 1024)} / {Math.round(cvFile.size / 1024)} KB
                      </span>
                    </div>
                  </div>
                )}

                {/* Replace file action — only when not loading */}
                {!loading && !uploadComplete && (
                  <label
                    htmlFor="cv_file"
                    className="block mt-2 text-[11px] font-semibold cursor-pointer hover:underline"
                    style={{ color: BRAND }}
                  >
                    Replace file
                  </label>
                )}
                <input
                  type="file"
                  id="cv_file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-white rounded-lg transition-colors text-xs font-bold disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: BRAND_DARK }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = BRAND_DARKER)}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = BRAND_DARK)}
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {cvFile && uploadProgress > 0 && uploadProgress < 100 ? `Uploading ${uploadProgress}%` : 'Submitting...'}
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="min-w-0">
    <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">{label}</span>
    <p className="text-gray-900 font-semibold truncate mt-0.5">{value || 'N/A'}</p>
  </div>
);

export default ApplyModal;
