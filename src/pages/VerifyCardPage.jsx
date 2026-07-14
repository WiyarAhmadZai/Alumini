import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiCalendar, FiMapPin, FiClock, FiUser } from 'react-icons/fi';
import eventService from '../services/eventService';

const resolveImage = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('/storage/')) return `http://localhost:8001${img}`;
  if (img.startsWith('storage/')) return `http://localhost:8001/${img}`;
  return `http://localhost:8001/storage/${img}`;
};

const VerifyCardPage = () => {
  const { t } = useTranslation();
  const { eventId, userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        // Try Vite proxy first, fallback to direct backend URL
        let res;
        try {
          res = await fetch(`/api/alumini/events/${eventId}`, {
            headers: { 'Accept': 'application/json' },
          });
        } catch {
          res = await fetch(`http://localhost:8001/api/alumini/events/${eventId}`, {
            headers: { 'Accept': 'application/json' },
          });
        }
        if (!res.ok) throw new Error(t('events.verify.eventNotFound'));
        const eventData = await res.json();
        setEvent(eventData.data);

        // Check registration
        if (eventData.data?.registrations) {
          const reg = eventData.data.registrations.find(
            (r) => String(r.alumni_student_id) === String(userId)
          );
          setRegistration(reg || null);
        }
      } catch (err) {
        setError(t('events.verify.couldNotVerify'));
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [eventId, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const isValid = registration && ['registered', 'confirmed', 'attended'].includes(registration.status);
  const studentInfo = registration?.special_requirements ? (() => { try { return JSON.parse(registration.special_requirements); } catch { return null; } })() : null;
  const alumniStudent = registration?.alumni_student;
  const studentName = alumniStudent?.name || alumniStudent?.student?.full_name || alumniStudent?.student?.first_name || alumniStudent?.full_name || studentInfo?.name || t('events.verify.unknown');
  const facultyName = alumniStudent?.faculty_name || alumniStudent?.student?.department?.faculty?.name || '';
  const departmentName = alumniStudent?.student?.department?.name || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3">
            <img src="/logo_kpu.png" alt="KPU" className="w-12 h-12 rounded-xl bg-white p-1 shadow" />
            <div className="text-right">
              <h1 className="text-lg font-bold text-[#002759]">پوهنتون پولی تخنیک کابل</h1>
              <p className="text-xs text-gray-500">{t('events.verify.cardVerification')}</p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
            <FiXCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-lg font-bold text-red-700 mb-2">{t('events.verify.verificationFailed')}</h2>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Status Banner */}
            <div className={`px-6 py-4 text-center ${isValid ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'}`}>
              {isValid ? (
                <>
                  <FiCheckCircle className="mx-auto text-green-600 mb-2" size={40} />
                  <h2 className="text-lg font-bold text-green-800">{t('events.verify.cardVerified')}</h2>
                  <p className="text-xs text-green-600 mt-1">{t('events.verify.cardVerifiedDesc')}</p>
                </>
              ) : (
                <>
                  <FiXCircle className="mx-auto text-red-500 mb-2" size={40} />
                  <h2 className="text-lg font-bold text-red-700">{t('events.verify.invalidCard')}</h2>
                  <p className="text-xs text-red-600 mt-1">{t('events.verify.invalidCardDesc')}</p>
                </>
              )}
            </div>

            {/* Event Info */}
            {event && (
              <div className="p-6 space-y-4" dir="rtl">
                {event.featured_image && (
                  <img src={resolveImage(event.featured_image)} alt="" className="w-full h-32 object-cover rounded-xl" />
                )}
                <div>
                  <h3 className="text-base font-bold text-[#002759]">{event.title}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded-full">{(event.event_type || '').replace('_', ' ')}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar size={14} className="text-blue-500 shrink-0" />
                    {new Date(event.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiClock size={14} className="text-blue-500 shrink-0" />
                    {new Date(event.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 col-span-2">
                    <FiMapPin size={14} className="text-blue-500 shrink-0" />
                    {event.location}
                  </div>
                </div>

                {/* Participant Info */}
                {isValid && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1"><FiUser size={12} /> {t('events.verify.participant')}</h4>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        {alumniStudent?.profile_image || alumniStudent?.student?.student_photo ? (
                          <img src={resolveImage(alumniStudent.profile_image || alumniStudent.student?.student_photo)} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#002759] to-[#0052cc] flex items-center justify-center text-white font-bold text-lg">
                            {studentName[0]}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">{studentName}</p>
                          {alumniStudent?.university_id && (
                            <p className="text-xs text-gray-500 mt-0.5">{t('events.verify.id')} {alumniStudent.university_id}</p>
                          )}
                        </div>
                      </div>
                      {(facultyName || departmentName) && (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {facultyName && (
                            <div className="bg-white rounded-lg p-2 border border-gray-200">
                              <p className="text-[10px] text-gray-400 uppercase">{t('events.verify.faculty')}</p>
                              <p className="text-xs font-semibold text-gray-700">{facultyName}</p>
                            </div>
                          )}
                          {departmentName && (
                            <div className="bg-white rounded-lg p-2 border border-gray-200">
                              <p className="text-[10px] text-gray-400 uppercase">{t('events.verify.department')}</p>
                              <p className="text-xs font-semibold text-gray-700">{departmentName}</p>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          registration.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          registration.status === 'attended' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{registration.status}</span>
                        {registration.card_downloaded && (
                          <span className="text-[10px] text-green-600 font-medium">{t('events.verify.cardDownloaded')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-center">
              <p className="text-[10px] text-gray-400">{t('events.verify.verifiedFooter')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCardPage;
