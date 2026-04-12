import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiArrowLeft, FiInbox, FiCheckCircle, FiXCircle, FiClock, FiMail, FiPhone, FiSearch, FiUser } from 'react-icons/fi';
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

const MentorRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchRequests = () => {
    setLoading(true);
    mentorService.getRequests()
      .then(res => setRequests(res.data || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (req, newStatus) => {
    let endDate = null;
    if (newStatus === 'accepted') {
      const today = new Date();
      const defaultEnd = new Date(today);
      defaultEnd.setMonth(defaultEnd.getMonth() + 3);
      const defaultEndStr = defaultEnd.toISOString().split('T')[0];
      const minEndStr = new Date(today.getTime() + 86400000).toISOString().split('T')[0];
      const { value, isConfirmed } = await Swal.fire({
        title: 'Accept Mentorship',
        html: `<p style="color:#4b5563;font-size:13px;margin-bottom:10px">Set the mentorship end date. After this date, <strong>${req.name}</strong> will need to request again.</p>`,
        input: 'date',
        inputValue: defaultEndStr,
        inputAttributes: { min: minEndStr },
        showCancelButton: true,
        confirmButtonText: 'Accept',
        confirmButtonColor: '#002759',
        inputValidator: (v) => {
          if (!v) return 'Please pick an end date';
          if (v <= today.toISOString().split('T')[0]) return 'End date must be in the future';
        },
      });
      if (!isConfirmed) return;
      endDate = value;
    } else {
      const confirm = await Swal.fire({
        icon: 'question',
        title: 'Reject Request?',
        text: `Reject the mentorship request from ${req.name}?`,
        showCancelButton: true,
        confirmButtonText: 'Reject',
        confirmButtonColor: '#dc2626',
      });
      if (!confirm.isConfirmed) return;
    }
    try {
      await mentorService.updateRequestStatus(req.id, newStatus, endDate);
      Swal.fire({
        icon: 'success',
        title: 'Done',
        text: newStatus === 'accepted' ? `Mentorship active until ${endDate}` : `Request rejected.`,
        timer: 2000,
        showConfirmButton: false,
      });
      fetchRequests();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to update request.' });
    }
  };

  const filtered = requests.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (r.name || '').toLowerCase().includes(s)
        || (r.email || '').toLowerCase().includes(s)
        || (r.message || '').toLowerCase().includes(s);
  });

  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <Layout>
      <section className="relative w-full h-72 sm:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.85) 100%), url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80")',
          }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 pt-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/20">
            <FiInbox size={11} /> Incoming Requests
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3 max-w-3xl">
            Mentorship Requests
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl">
            Review and respond to alumni seeking your guidance
          </p>
        </div>
      </section>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-4 border-b border-gray-200">
            {[
              { key: 'all',      label: 'All' },
              { key: 'pending',  label: 'Pending' },
              { key: 'accepted', label: 'Accepted' },
              { key: 'rejected', label: 'Rejected' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition ${
                  filter === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({counts[tab.key] || 0})
              </button>
            ))}
            <div className="flex-1 min-w-[200px] relative ml-auto">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* List */}
          <div className="p-4">
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 animate-pulse">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-2 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <FiInbox size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-semibold">No requests found</p>
                <p className="text-xs text-gray-400 mt-1">When someone requests mentorship, it will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(req => (
                  <div key={req.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to={`/profile/${req.requester_id}`} className="flex-shrink-0">
                        {req.profile_image ? (
                          <img src={req.profile_image} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-blue-100" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {req.name?.charAt(0) || <FiUser />}
                          </div>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <Link to={`/profile/${req.requester_id}`} className="font-bold text-gray-900 hover:text-blue-600 transition">{req.name}</Link>
                            {(req.faculty || req.department) && (
                              <p className="text-[11px] text-gray-500">{req.faculty}{req.department ? ` — ${req.department}` : ''}</p>
                            )}
                          </div>
                          <StatusBadge status={req.status} />
                        </div>

                        {req.message && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-700 italic">"{req.message}"</p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span className="text-[11px] text-gray-400">{new Date(req.created_at).toLocaleDateString()}</span>
                          {req.email && (
                            <a href={`mailto:${req.email}`} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded hover:bg-blue-100">
                              <FiMail size={10} /> Email
                            </a>
                          )}
                          {req.whatsapp_number && (
                            <a href={`https://wa.me/${req.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-[10px] font-semibold rounded hover:bg-green-100">
                              <FiPhone size={10} /> WhatsApp
                            </a>
                          )}
                        </div>

                        {req.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => handleStatusChange(req, 'accepted')} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition">
                              <FiCheckCircle size={12} /> Accept
                            </button>
                            <button onClick={() => handleStatusChange(req, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition">
                              <FiXCircle size={12} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MentorRequestsPage;
