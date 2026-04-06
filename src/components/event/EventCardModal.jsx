import React, { useState, useRef } from 'react';
import { FiX, FiDownload, FiPrinter, FiAlertTriangle } from 'react-icons/fi';
import Swal from 'sweetalert2';
import eventService from '../../services/eventService';

const translations = {
  ps: {
    title: 'د پیښې ګډون کارت',
    university: 'د کابل پولی تخنیک پوهنتون',
    subtitle: 'KPU University',
    eventLabel: 'د پیښې نوم',
    dateLabel: 'نېټه',
    dayLabel: 'ورځ',
    timeLabel: 'وخت',
    locationLabel: 'ځای',
    modeLabel: 'طریقه',
    nameLabel: 'نوم',
    idLabel: 'پیژندنه',
    facultyLabel: 'پوهنځی',
    departmentLabel: 'څانګه',
    registeredAt: 'د ثبت نېټه',
    cardNote: 'دا کارت د پیښې کې د ګډون لپاره اعتبار لري',
    selectLang: 'ژبه وټاکئ',
    download: 'ډاونلوډ / چاپ',
    warning: 'خبرداری',
    warningText: 'کله چې تاسو دا کارت ډاونلوډ کړئ، نو تاسو به نشئ کولای خپل ثبت نام لغوه کړئ.',
    confirm: 'هو، ډاونلوډ یې کړئ',
    cancel: 'لغوه',
    online: 'آنلاین',
    offline: 'حضوري',
    hybrid: 'هایبرېډ',
  },
  fa: {
    title: 'کارت اشتراک رویداد',
    university: 'پوهنتون پولی تخنیک کابل',
    subtitle: 'KPU University',
    eventLabel: 'نام رویداد',
    dateLabel: 'تاریخ',
    dayLabel: 'روز',
    timeLabel: 'ساعت',
    locationLabel: 'موقعیت',
    modeLabel: 'شیوه',
    nameLabel: 'نام',
    idLabel: 'شناسه',
    facultyLabel: 'پوهنځی',
    departmentLabel: 'دیپارتمنت',
    registeredAt: 'تاریخ ثبت‌نام',
    cardNote: 'این کارت برای اشتراک در رویداد معتبر است',
    selectLang: 'زبان را انتخاب کنید',
    download: 'دانلود / چاپ',
    warning: 'هشدار',
    warningText: 'پس از دانلود این کارت، امکان لغو ثبت‌نام وجود ندارد.',
    confirm: 'بله، دانلود شود',
    cancel: 'لغو',
    online: 'آنلاین',
    offline: 'حضوری',
    hybrid: 'هایبرید',
  },
};

const days = {
  ps: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  fa: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
};

const resolveImage = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('/storage/')) return `http://localhost:8000${img}`;
  if (img.startsWith('storage/')) return `http://localhost:8000/${img}`;
  return `http://localhost:8000/storage/${img}`;
};

const EventCardModal = ({ isOpen, onClose, event, user, registration, onCardDownloaded }) => {
  const [lang, setLang] = useState('fa');
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);
  const t = translations[lang];

  if (!isOpen || !event || !user) return null;

  const eventDate = new Date(event.start_date);
  const dayName = days[lang][eventDate.getDay()];
  const formattedDate = eventDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const regDate = registration?.registered_at
    ? new Date(registration.registered_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : formattedDate;

  const profileImg = resolveImage(user.profile_image || user.student_photo);
  const modeLabel = t[event.mode] || event.mode;

  const handleDownload = async () => {
    // Show warning first
    const result = await Swal.fire({
      icon: 'warning',
      title: t.warning,
      text: t.warningText,
      showCancelButton: true,
      confirmButtonColor: '#002759',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t.confirm,
      cancelButtonText: t.cancel,
    });

    if (!result.isConfirmed) return;

    setDownloading(true);
    try {
      // Mark as downloaded on backend
      await eventService.markCardDownloaded(event.id);

      // Print the card
      const printContent = cardRef.current;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="${lang}">
        <head>
          <meta charset="utf-8">
          <title>${t.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Vazirmatn', 'Segoe UI', Tahoma, sans-serif; background: #f0f4f8; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
            .card { width: 700px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
            .card-header { background: linear-gradient(135deg, #002759 0%, #003d8f 50%, #0052cc 100%); padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; }
            .logo-section { display: flex; align-items: center; gap: 14px; }
            .logo-img { width: 52px; height: 52px; border-radius: 12px; background: white; padding: 4px; object-fit: contain; }
            .logo-text h2 { color: white; font-size: 17px; font-weight: 700; line-height: 1.3; }
            .logo-text p { color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 400; letter-spacing: 1px; }
            .card-title { color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 500; background: rgba(255,255,255,0.12); padding: 6px 16px; border-radius: 20px; }
            .event-banner { background: linear-gradient(135deg, #f0f7ff 0%, #e8f0fe 100%); padding: 24px 32px; border-bottom: 2px solid #e2e8f0; }
            .event-name { font-size: 22px; font-weight: 800; color: #002759; margin-bottom: 4px; }
            .event-type { display: inline-block; background: #002759; color: white; padding: 3px 14px; border-radius: 12px; font-size: 11px; font-weight: 600; }
            .card-body { padding: 28px 32px; display: flex; gap: 28px; }
            .profile-section { flex-shrink: 0; text-align: center; }
            .profile-img { width: 110px; height: 110px; border-radius: 16px; object-fit: cover; border: 3px solid #e2e8f0; background: #f1f5f9; }
            .profile-placeholder { width: 110px; height: 110px; border-radius: 16px; background: linear-gradient(135deg, #002759, #0052cc); display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: 700; }
            .profile-name { margin-top: 10px; font-size: 14px; font-weight: 700; color: #1e293b; }
            .profile-id { font-size: 11px; color: #64748b; margin-top: 2px; }
            .info-section { flex: 1; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
            .info-item { background: #f8fafc; border-radius: 10px; padding: 12px 14px; border: 1px solid #e2e8f0; }
            .info-label { font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
            .info-value { font-size: 13px; font-weight: 600; color: #1e293b; }
            .card-footer { background: #f8fafc; border-top: 2px solid #e2e8f0; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; }
            .footer-note { font-size: 11px; color: #64748b; max-width: 400px; }
            .footer-reg { font-size: 11px; color: #002759; font-weight: 600; }
            @media print { body { background: white; padding: 0; } .card { box-shadow: none; width: 100%; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
      `);
      printWindow.document.close();

      if (onCardDownloaded) onCardDownloaded();
    } catch (err) {
      console.error('Failed to download card:', err);
      Swal.fire('Error', err.message || 'Failed to download card', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{t.title}</h3>
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setLang('ps')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${lang === 'ps' ? 'bg-[#002759] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                پښتو
              </button>
              <button
                onClick={() => setLang('fa')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${lang === 'fa' ? 'bg-[#002759] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                دری
              </button>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Card Preview */}
        <div className="p-6 bg-gray-50">
          <div ref={cardRef}>
            <div className="card" style={{ width: '100%', background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
              {/* Card Header */}
              <div style={{ background: 'linear-gradient(135deg, #002759 0%, #003d8f 50%, #0052cc 100%)', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src="/logo_kpu.png" alt="KPU" style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'white', padding: '4px', objectFit: 'contain' }} />
                  <div>
                    <h2 style={{ color: 'white', fontSize: '17px', fontWeight: '700', lineHeight: '1.3', margin: 0 }}>{t.university}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '400', letterSpacing: '1px', margin: 0 }}>KPU University</p>
                  </div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', fontWeight: '500', background: 'rgba(255,255,255,0.12)', padding: '6px 16px', borderRadius: '20px' }}>{t.title}</span>
              </div>

              {/* Event Name Banner */}
              <div style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f0fe 100%)', padding: '24px 32px', borderBottom: '2px solid #e2e8f0' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#002759', marginBottom: '6px' }}>{event.title}</h1>
                <span style={{ display: 'inline-block', background: '#002759', color: 'white', padding: '3px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
                  {event.event_type?.replace('_', ' ')}
                </span>
              </div>

              {/* Body: Profile + Info */}
              <div style={{ padding: '28px 32px', display: 'flex', gap: '28px' }} dir="rtl">
                {/* Profile */}
                <div style={{ flexShrink: 0, textAlign: 'center' }}>
                  {profileImg ? (
                    <img src={profileImg} alt={user.name} style={{ width: '110px', height: '110px', borderRadius: '16px', objectFit: 'cover', border: '3px solid #e2e8f0' }} />
                  ) : (
                    <div style={{ width: '110px', height: '110px', borderRadius: '16px', background: 'linear-gradient(135deg, #002759, #0052cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '36px', fontWeight: '700' }}>
                      {(user.name || user.full_name || '?')[0]}
                    </div>
                  )}
                  <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{user.full_name || user.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{user.university_id}</div>
                </div>

                {/* Info Grid */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <InfoBox label={t.facultyLabel} value={user.faculty_name || user.faculty || '-'} />
                    <InfoBox label={t.departmentLabel} value={user.department_name || '-'} />
                    <InfoBox label={t.dateLabel} value={formattedDate} />
                    <InfoBox label={t.dayLabel} value={dayName} />
                    <InfoBox label={t.timeLabel} value={formattedTime} />
                    <InfoBox label={t.modeLabel} value={modeLabel} />
                    <InfoBox label={t.locationLabel} value={event.location} style={{ gridColumn: 'span 2' }} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} dir="rtl">
                <span style={{ fontSize: '11px', color: '#64748b', maxWidth: '400px' }}>{t.cardNote}</span>
                <span style={{ fontSize: '11px', color: '#002759', fontWeight: '600' }}>{t.registeredAt}: {regDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2 text-xs text-amber-600">
            <FiAlertTriangle size={14} />
            <span>{t.warningText}</span>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#002759] text-white text-sm font-semibold rounded-xl hover:bg-[#003580] disabled:opacity-50 transition-colors shadow-lg"
          >
            {downloading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiDownload size={16} />
                {t.download}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value, style = {} }) => (
  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px 14px', border: '1px solid #e2e8f0', ...style }}>
    <div style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{value}</div>
  </div>
);

export default EventCardModal;
