import React, { useState, useRef } from 'react';
import { FiX, FiDownload, FiAlertTriangle } from 'react-icons/fi';
import Swal from 'sweetalert2';
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
    selectLang: 'ژبه وټاکئ',
    download: 'ډاونلوډ / چاپ',
    warning: 'خبرداری',
    warningText: 'د کارت ډاونلوډ وروسته د ثبت نام لغوه نشي کیدای',
    confirm: 'هو، ډاونلوډ یې کړئ',
    cancel: 'لغوه',
    online: 'آنلاین', offline: 'حضوري', hybrid: 'هایبرېډ',
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
    selectLang: 'زبان را انتخاب کنید',
    download: 'دانلود / چاپ',
    warning: 'هشدار',
    warningText: 'پس از دانلود کارت، لغو ثبت‌نام ممکن نیست',
    confirm: 'بله، دانلود شود',
    cancel: 'لغو',
    online: 'آنلاین', offline: 'حضوری', hybrid: 'هایبرید',
  },
};

const dayNames = {
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
  const dayName = dayNames[lang][eventDate.getDay()];
  const formattedDate = eventDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const profileImg = resolveImage(user.profile_image || user.student_photo);

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
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="${lang}">
<head>
<meta charset="utf-8">
<title>${t.title}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Vazirmatn','Segoe UI',sans-serif;background:#e8ecf1;display:flex;justify-content:center;align-items:center;min-height:100vh}
.card{width:400px;background:#fff;border-radius:12px;overflow:hidden;border:2px solid #1e293b}
.hdr{background:linear-gradient(135deg,#002759,#0052cc);padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
.hdr-left{display:flex;align-items:center;gap:8px}
.hdr-left img{width:32px;height:32px;border-radius:6px;background:#fff;padding:2px}
.hdr-left .uni{color:#fff;font-size:11px;font-weight:700;line-height:1.2}
.hdr-left .sub{color:rgba(255,255,255,.6);font-size:8px;letter-spacing:.5px}
.hdr .badge{color:rgba(255,255,255,.85);font-size:9px;background:rgba(255,255,255,.15);padding:3px 10px;border-radius:10px}
.evt{background:#f0f4ff;padding:10px 16px;border-bottom:1px solid #e2e8f0}
.evt h2{font-size:13px;font-weight:800;color:#002759;margin-bottom:2px}
.evt .tag{display:inline-block;background:#002759;color:#fff;padding:1px 8px;border-radius:8px;font-size:8px;font-weight:600}
.body{padding:14px 16px;display:flex;gap:14px}
.photo{flex-shrink:0;text-align:center}
.photo img{width:72px;height:72px;border-radius:10px;object-fit:cover;border:2px solid #e2e8f0}
.photo .ph{width:72px;height:72px;border-radius:10px;background:linear-gradient(135deg,#002759,#0052cc);display:flex;align-items:center;justify-content:center;color:#fff;font-size:26px;font-weight:700}
.photo .nm{font-size:10px;font-weight:700;color:#1e293b;margin-top:5px}
.photo .uid{font-size:8px;color:#64748b;margin-top:1px}
.info{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:6px}
.info .box{background:#f8fafc;border-radius:6px;padding:6px 8px;border:1px solid #e2e8f0}
.info .box.wide{grid-column:span 2}
.info .lbl{font-size:7px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.3px}
.info .val{font-size:10px;font-weight:600;color:#1e293b;margin-top:1px}
.ftr{background:#f8fafc;border-top:1px solid #e2e8f0;padding:8px 16px;display:flex;align-items:center;justify-content:space-between}
.ftr span{font-size:8px;color:#64748b}
.ftr .dt{color:#002759;font-weight:600}
@page{size:420px auto;margin:0}
@media print{body{background:#fff;padding:0;min-height:auto;width:420px;margin:0}.card{border:2px solid #1e293b;box-shadow:none;border-radius:12px}}
</style>
</head>
<body>
<div class="card">
<div class="hdr">
<div class="hdr-left">
<img src="/logo_kpu.png" alt="KPU"/>
<div><div class="uni">${t.university}</div><div class="sub">KPU University</div></div>
</div>
<span class="badge">${t.title}</span>
</div>
<div class="evt">
<h2>${event.title}</h2>
<span class="tag">${(event.event_type || '').replace('_', ' ')}</span>
</div>
<div class="body" dir="rtl">
<div class="photo">
${profileImg ? `<img src="${profileImg}" alt=""/>` : `<div class="ph">${(user.name || user.full_name || '?')[0]}</div>`}
<div class="nm">${user.full_name || user.name}</div>
<div class="uid">${user.university_id || ''}</div>
</div>
<div class="info">
<div class="box"><div class="lbl">${t.facultyLabel}</div><div class="val">${user.faculty_name || user.faculty || '-'}</div></div>
<div class="box"><div class="lbl">${t.departmentLabel}</div><div class="val">${user.department_name || '-'}</div></div>
<div class="box"><div class="lbl">${t.dateLabel}</div><div class="val">${formattedDate}</div></div>
<div class="box"><div class="lbl">${t.dayLabel} / ${t.timeLabel}</div><div class="val">${dayName} - ${formattedTime}</div></div>
<div class="box wide"><div class="lbl">${t.locationLabel}</div><div class="val">${event.location}</div></div>
</div>
</div>
<div class="ftr" dir="rtl">
<span>${t.cardNote}</span>
<span class="dt">${formattedDate}</span>
</div>
</div>
<script>window.onload=function(){window.print()}</script>
</body>
</html>`);
      printWindow.document.close();
      if (onCardDownloaded) onCardDownloaded();
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed', 'error');
    } finally { setDownloading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
        <div className="p-4 bg-gray-50 flex justify-center">
          <div ref={cardRef} style={{ width: '400px' }}>
            <div style={{ width: '400px', background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '2px solid #1e293b' }}>
              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, #002759, #0052cc)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src="/logo_kpu.png" alt="KPU" style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#fff', padding: '2px' }} />
                  <div>
                    <div style={{ color: '#fff', fontSize: '11px', fontWeight: '700', lineHeight: '1.2' }}>{t.university}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', letterSpacing: '0.5px' }}>KPU University</div>
                  </div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '9px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '10px' }}>{t.title}</span>
              </div>

              {/* Event */}
              <div style={{ background: '#f0f4ff', padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#002759', marginBottom: '2px' }}>{event.title}</h2>
                <span style={{ display: 'inline-block', background: '#002759', color: '#fff', padding: '1px 8px', borderRadius: '8px', fontSize: '8px', fontWeight: '600' }}>{(event.event_type || '').replace('_', ' ')}</span>
              </div>

              {/* Body */}
              <div style={{ padding: '14px 16px', display: 'flex', gap: '14px' }} dir="rtl">
                <div style={{ flexShrink: 0, textAlign: 'center' }}>
                  {profileImg ? (
                    <img src={profileImg} alt="" style={{ width: '72px', height: '72px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                  ) : (
                    <div style={{ width: '72px', height: '72px', borderRadius: '10px', background: 'linear-gradient(135deg, #002759, #0052cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '26px', fontWeight: '700' }}>
                      {(user.name || user.full_name || '?')[0]}
                    </div>
                  )}
                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#1e293b', marginTop: '5px' }}>{user.full_name || user.name}</div>
                  <div style={{ fontSize: '8px', color: '#64748b', marginTop: '1px' }}>{user.university_id}</div>
                </div>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <MiniBox label={t.facultyLabel} value={user.faculty_name || user.faculty || '-'} />
                  <MiniBox label={t.departmentLabel} value={user.department_name || '-'} />
                  <MiniBox label={t.dateLabel} value={formattedDate} />
                  <MiniBox label={`${t.dayLabel} / ${t.timeLabel}`} value={`${dayName} - ${formattedTime}`} />
                  <MiniBox label={t.locationLabel} value={event.location} wide />
                </div>
              </div>

              {/* Footer */}
              <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} dir="rtl">
                <span style={{ fontSize: '8px', color: '#64748b' }}>{t.cardNote}</span>
                <span style={{ fontSize: '8px', color: '#002759', fontWeight: '600' }}>{formattedDate}</span>
              </div>
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
  <div style={{ background: '#f8fafc', borderRadius: '6px', padding: '6px 8px', border: '1px solid #e2e8f0', ...(wide ? { gridColumn: 'span 2' } : {}) }}>
    <div style={{ fontSize: '7px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</div>
    <div style={{ fontSize: '10px', fontWeight: '600', color: '#1e293b', marginTop: '1px' }}>{value}</div>
  </div>
);

export default EventCardModal;
