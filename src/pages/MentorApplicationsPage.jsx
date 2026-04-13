import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiArrowLeft, FiSend, FiCheckCircle, FiXCircle, FiClock, FiTrash2, FiMail } from 'react-icons/fi';
import Swal from 'sweetalert2';
import mentorService from '../services/mentorService';

const StatusBadge = ({ status }) => {
  const map = {
    pending:  { bg: 'bg-yellow-100 text-yellow-700', icon: FiClock,       label: 'Pending' },
    accepted: { bg: 'bg-green-100 text-green-700',   icon: FiCheckCircle, label: 'Accepted' },
    rejected: { bg: 'bg-red-100 text-red-700',       icon: FiXCircle,     label: 'Rejected' },
  };
  const cfg = map[status] || map.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.bg}`}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
};

const MentorApplicationsPage = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = () => {
    setLoading(true);
    mentorService.getMyApplications()
      .then(res => setApps(res.data || []))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleCancel = async (app) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Cancel Request?',
      text: `Cancel your mentorship request to ${app.name}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel',
      confirmButtonColor: '#dc2626',
    });
    if (!confirm.isConfirmed) return;
    try {
      await mentorService.cancelRequest(app.id);
      Swal.fire({ icon: 'success', title: 'Cancelled', timer: 2000, showConfirmButton: false });
      fetchApps();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to cancel.' });
    }
  };

  const statusCounts = {
    all: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  };

  return (
    <Layout>
      {/* Hero with darkened background image */}
      <section className="relative w-full h-72 sm:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.7) 100%), url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80")',
          }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 pt-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/20">
            <FiSend size={11} /> My Applications
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3 max-w-3xl">
            Mentorship Applications
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl">
            Track the mentorship requests you've sent to alumni mentors
          </p>
        </div>
      </section>

      {/* Back button */}
      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-6">
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 font-semibold bg-white px-4 py-2 rounded-full border border-gray-200 hover:border-blue-300 shadow-sm transition"
          >
            <FiArrowLeft size={14} /> Back to Profile
          </button>
        </div>
      </div>

      {/* Stats row */}
      {!loading && apps.length > 0 && (
        <div className="bg-gray-50 pt-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="text-3xl font-black text-gray-900">{statusCounts.all}</p>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total</p>
              </div>
              <div className="bg-white border border-yellow-100 rounded-2xl p-4 shadow-sm">
                <p className="text-3xl font-black text-yellow-600">{statusCounts.pending}</p>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Pending</p>
              </div>
              <div className="bg-white border border-green-100 rounded-2xl p-4 shadow-sm">
                <p className="text-3xl font-black text-green-600">{statusCounts.accepted}</p>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Accepted</p>
              </div>
              <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
                <p className="text-3xl font-black text-red-600">{statusCounts.rejected}</p>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Rejected</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-2 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <FiSend size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-semibold">No applications yet</p>
            <Link to="/mentorship" className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">
              Browse Mentors
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {apps.map(app => (
              <div key={app.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition">
                <div className="flex items-start gap-3">
                  <Link to={`/mentorship/${app.mentor_id}`} className="flex-shrink-0">
                    {app.profile_image ? (
                      <img src={app.profile_image} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-blue-100" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {app.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <Link to={`/mentorship/${app.mentor_id}`} className="font-bold text-gray-900 hover:text-blue-600">{app.name}</Link>
                      <StatusBadge status={app.status} />
                    </div>
                    {app.title && <p className="text-xs text-blue-600 font-semibold mt-0.5">{app.title}</p>}
                    {app.company && <p className="text-[11px] text-gray-500">at {app.company}</p>}

                    {app.message && (
                      <div className="mt-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-700 italic line-clamp-3">"{app.message}"</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <span className="text-[10px] text-gray-400">{new Date(app.created_at).toLocaleDateString()}</span>
                      <div className="flex gap-1.5">
                        {app.status === 'accepted' && app.mentor_whatsapp && (
                          <a
                            href={`https://wa.me/${app.mentor_whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-[10px] font-bold rounded-lg hover:bg-green-600 shadow transition"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            WhatsApp
                          </a>
                        )}
                        {app.status === 'pending' && (
                          <button onClick={() => handleCancel(app)} className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded hover:bg-red-100">
                            <FiTrash2 size={10} /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MentorApplicationsPage;
