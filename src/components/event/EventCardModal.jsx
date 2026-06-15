import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiDownload, FiAlertTriangle } from 'react-icons/fi';
import { QRCodeCanvas } from 'qrcode.react';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';
import eventService from '../../services/eventService';

const translations = {
  ps: {
    title: 'د ګډون کارت',
    university: 'د کابل پولی تخنیک پوهنتون',
    eventLabel: 'پیښه',
    dateLabel: 'نېټه',
    dayLabel: 'ورځ',
    timeLabel: 'وخت',
    locationLabel: 'ځای',
    nameLabel: 'نوم',
    facultyLabel: 'پوهنځی',
    departmentLabel: 'څانګه',
    idLabel: 'پیژندنه',
    cardNote: 'دا کارت د پیښې کې د ګډون لپاره اعتبار لري',
    download: 'د انځور په توګه ډاونلوډ',
    warning: 'خبرداری',
    warningText: 'د کارت ډاونلوډ وروسته د ثبت نام لغوه نشي کیدای',
    confirm: 'هو، ډاونلوډ یې کړئ',
    cancel: 'لغوه',
    online: 'آنلاین', offline: 'حضوري', hybrid: 'هایبرېډ',
    scanToVerify: 'د تصدیق لپاره سکن کړئ',
  },
  fa: {
    title: 'کارت اشتراک',
    university: 'پوهنتون پولی تخنیک کابل',
    eventLabel: 'رویداد',
    dateLabel: 'تاریخ',
    dayLabel: 'روز',
    timeLabel: 'ساعت',
    locationLabel: 'موقعیت',
    nameLabel: 'نام',
    facultyLabel: 'پوهنځی',
    departmentLabel: 'دیپارتمنت',
    idLabel: 'شناسه',
    cardNote: 'این کارت برای اشتراک در رویداد معتبر است',
    download: 'دانلود به صورت تصویر',
    warning: 'هشدار',
    warningText: 'پس از دانلود کارت، لغو ثبت‌نام ممکن نیست',
    confirm: 'بله، دانلود شود',
    cancel: 'لغو',
    online: 'آنلاین', offline: 'حضوری', hybrid: 'هایبرید',
    scanToVerify: 'برای تأیید اسکن کنید',
  },
};

const dayNames = {
  ps: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  fa: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
};

const resolveImage = (img) => {
  if (!img) return null;
  // Use same-origin paths so Vite's /storage proxy serves the file —
  // this avoids CORS taint when html2canvas captures the card.
  if (img.startsWith('http')) {
    try {
      const u = new URL(img);
      if (u.pathname.startsWith('/storage/')) return u.pathname;
    } catch { /* ignore */ }
    return img;
  }
  if (img.startsWith('/storage/')) return img;
  if (img.startsWith('storage/')) return `/${img}`;
  return `/storage/${img}`;
};

// Fetch any image and convert to a data URL so html2canvas can render it
// without tainting the canvas (works regardless of CORS headers).
const toDataUrl = async (url) => {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: 'cors' });
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    try {
      // Fallback: same-origin proxy attempt via Image element
      return await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          c.getContext('2d').drawImage(img, 0, 0);
          resolve(c.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
      });
    } catch {
      return null;
    }
  }
};

// Use local network IP so QR works from phone on same WiFi
const SITE_URL = window.location.hostname === 'localhost'
  ? `http://172.16.15.198:${window.location.port}`
  : window.location.origin;

const EventCardModal = ({ isOpen, onClose, event, user, registration, onCardDownloaded }) => {
  const { t: tt } = useTranslation();
  const [lang, setLang] = useState('fa');
  const [downloading, setDownloading] = useState(false);
  const [profileDataUrl, setProfileDataUrl] = useState(null);
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const cardRef = useRef(null);
  const t = translations[lang];

  const profileImg = resolveImage(user?.profile_image || user?.student_photo);

  // Pre-load images as data URLs so html2canvas can capture them safely.
  useEffect(() => {
    let alive = true;
    if (profileImg) {
      toDataUrl(profileImg).then((d) => { if (alive) setProfileDataUrl(d); });
    } else {
      setProfileDataUrl(null);
    }
    toDataUrl('/logo_kpu.png').then((d) => { if (alive) setLogoDataUrl(d); });
    return () => { alive = false; };
  }, [profileImg]);

  if (!isOpen || !event || !user) return null;

  const eventDate = new Date(event.start_date);
  const dayName = dayNames[lang][eventDate.getDay()];
  const formattedDate = eventDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const verifyUrl = `${SITE_URL}/verify-card/${event.id}/${user.id}`;

  const handleDownload = async () => {
    const result = await Swal.fire({
      icon: 'warning', title: t.warning, text: t.warningText,
      showCancelButton: true, confirmButtonColor: '#002759', cancelButtonColor: '#6b7280',
      confirmButtonText: t.confirm, cancelButtonText: t.cancel,
    });
    if (!result.isConfirmed) return;

    setDownloading(true);
    try {
      await eventService.markCardDownloaded(event.id);
      if (!cardRef.current) throw new Error(tt('events.cardModal.cardNotReady'));

      // Wait one frame so React commits any pending image swaps
      await new Promise((r) => requestAnimationFrame(r));

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 15000,
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const safeName = (user.full_name || user.name || 'card').replace(/[^a-z0-9\u0600-\u06FF]+/gi, '_');
      const safeEvent = (event.title || 'event').replace(/[^a-z0-9\u0600-\u06FF]+/gi, '_');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${safeEvent}_${safeName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onCardDownloaded) onCardDownloaded();
    } catch (err) {
      Swal.fire(tt('events.cardModal.errorTitle'), err.message || tt('events.cardModal.downloadFailed'), 'error');
    } finally { setDownloading(false); }
  };

  // Card dimensions — larger so the export looks sharp & legible.
  const CARD_W = 640;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900">{t.title}</h3>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setLang('ps')} className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors ${lang === 'ps' ? 'bg-[#002759] text-white shadow' : 'text-gray-600'}`}>پښتو</button>
              <button onClick={() => setLang('fa')} className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors ${lang === 'fa' ? 'bg-[#002759] text-white shadow' : 'text-gray-600'}`}>دری</button>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded"><FiX size={18} /></button>
          </div>
        </div>

        {/* Card Preview */}
        <div className="p-4 bg-gray-50 flex justify-center overflow-x-auto">
          <div
            ref={cardRef}
            style={{
              width: `${CARD_W}px`,
              background: '#ffffff',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '2px solid #1e293b',
              fontFamily: "'Vazirmatn','Segoe UI',Tahoma,sans-serif",
              boxSizing: 'border-box',
            }}
          >
            {/* Header */}
            <div style={{
              background: '#002759',
              backgroundImage: 'linear-gradient(135deg, #002759 0%, #0052cc 100%)',
              padding: '16px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {logoDataUrl && (
                  <img src={logoDataUrl} alt={tt('events.cardModal.logoAlt')} style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#fff', padding: '4px', display: 'block' }} />
                )}
                <div>
                  <div style={{ color: '#fff', fontSize: '16px', fontWeight: 800, lineHeight: 1.2 }}>{t.university}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', letterSpacing: '0.6px', marginTop: '2px' }}>KPU UNIVERSITY</div>
                </div>
              </div>
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700, background: 'rgba(255,255,255,0.18)', padding: '6px 12px', borderRadius: '999px' }}>{t.title}</span>
            </div>

            {/* Event */}
            <div style={{ background: '#f0f4ff', padding: '14px 22px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#002759', margin: 0, marginBottom: '6px', lineHeight: 1.2 }}>{event.title}</h2>
              <span style={{ display: 'inline-block', background: '#002759', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {(event.event_type || '').replace('_', ' ')}
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 22px', display: 'flex', gap: '20px', alignItems: 'flex-start' }} dir="rtl">
              <div style={{ flexShrink: 0, textAlign: 'center', width: '120px' }}>
                {profileDataUrl ? (
                  <img
                    src={profileDataUrl}
                    alt=""
                    style={{ width: '120px', height: '120px', borderRadius: '14px', objectFit: 'cover', border: '3px solid #002759', display: 'block' }}
                  />
                ) : (
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '14px',
                    background: '#002759',
                    backgroundImage: 'linear-gradient(135deg,#002759,#0052cc)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '46px', fontWeight: 800,
                  }}>
                    {(user.full_name || user.name || '?')[0]}
                  </div>
                )}
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '8px', lineHeight: 1.3 }}>{user.full_name || user.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{user.university_id || ''}</div>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <MiniBox label={t.facultyLabel} value={user.faculty_name || user.department?.faculty?.name || user.faculty || '-'} />
                <MiniBox label={t.departmentLabel} value={user.department_name || user.department?.name || '-'} />
                <MiniBox label={t.dateLabel} value={formattedDate} />
                <MiniBox label={`${t.dayLabel} / ${t.timeLabel}`} value={`${dayName} - ${formattedTime}`} />
                <MiniBox label={t.locationLabel} value={event.location} wide />
              </div>
            </div>

            {/* Footer with QR */}
            <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }} dir="rtl">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#fff', padding: '6px', borderRadius: '10px', border: '2px solid #002759', lineHeight: 0 }}>
                  <QRCodeCanvas
                    value={verifyUrl}
                    size={88}
                    level="H"
                    includeMargin={false}
                    style={{ display: 'block', width: '88px', height: '88px' }}
                  />
                </div>
                <span style={{ fontSize: '11px', color: '#002759', fontWeight: 700, lineHeight: 1.3, maxWidth: '90px' }}>{t.scanToVerify}</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', textAlign: 'right', flex: 1, lineHeight: 1.4 }}>{t.cardNote}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-1.5 text-[10px] text-amber-600">
            <FiAlertTriangle size={12} />
            <span>{t.warningText}</span>
          </div>
          <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-1.5 px-4 py-2 bg-[#002759] text-white text-xs font-semibold rounded-lg hover:bg-[#003580] disabled:opacity-50 transition-colors">
            {downloading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiDownload size={14} />{t.download}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const MiniBox = ({ label, value, wide }) => (
  <div style={{
    background: '#ffffff',
    borderRadius: '8px',
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    boxSizing: 'border-box',
    ...(wide ? { gridColumn: 'span 2' } : {}),
  }}>
    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '3px', lineHeight: 1.3 }}>{value}</div>
  </div>
);

export default EventCardModal;
