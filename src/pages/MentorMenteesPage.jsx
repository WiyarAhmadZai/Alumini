import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiArrowLeft, FiUsers, FiMail, FiPhone, FiMessageCircle, FiSearch } from 'react-icons/fi';
import mentorService from '../services/mentorService';

const MentorMenteesPage = () => {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    mentorService.getMyMentees()
      .then(res => setMentees(res.data?.mentees || []))
      .catch(() => setMentees([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = mentees.filter(m => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (m.name || '').toLowerCase().includes(s)
        || (m.email || '').toLowerCase().includes(s)
        || (m.faculty || '').toLowerCase().includes(s)
        || (m.department || '').toLowerCase().includes(s)
        || (m.university_id || '').toLowerCase().includes(s);
  });

  return (
    <Layout>
      <section className="relative w-full h-72 sm:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.85) 100%), url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80")',
          }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 pt-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/20">
            <FiUsers size={11} /> My Mentees
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3 max-w-3xl">
            Alumni You Mentor
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl">
            Connect with and guide the next generation of KPU professionals
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
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{filtered.length} {filtered.length === 1 ? 'Mentee' : 'Mentees'}</h2>
              <p className="text-xs text-gray-500">Connect and stay in touch with the alumni you mentor</p>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search mentees…"
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-2 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded mb-2" />
                  <div className="h-2 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <FiUsers size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-semibold">No mentees yet</p>
              <p className="text-xs text-gray-400 mt-1">When you accept mentorship requests, they will appear here.</p>
              <Link to="/mentorship/my/requests" className="inline-block mt-4 text-blue-600 font-semibold text-sm hover:underline">View pending requests →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(m => (
                <div key={m.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-200 transition bg-white">
                  <Link to={`/profile/${m.requester_id}`} className="flex items-center gap-3 mb-3 group">
                    {m.profile_image ? (
                      <img src={m.profile_image} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {m.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600">{m.name}</p>
                      {m.university_id && <p className="text-[10px] text-gray-500">{m.university_id}</p>}
                    </div>
                  </Link>

                  {(m.faculty || m.department) && (
                    <div className="text-[11px] text-gray-600 mb-2">
                      {m.faculty}{m.department ? ` — ${m.department}` : ''}
                    </div>
                  )}

                  {m.title && <p className="text-xs text-blue-600 font-semibold mb-2">{m.title}</p>}

                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded hover:bg-blue-100">
                        <FiMail size={10} /> Email
                      </a>
                    )}
                    {m.whatsapp_number && (
                      <a href={`https://wa.me/${m.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-[10px] font-semibold rounded hover:bg-green-100">
                        <FiPhone size={10} /> WhatsApp
                      </a>
                    )}
                    <Link to={`/messages?to=${m.requester_id}`} className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded hover:bg-purple-100">
                      <FiMessageCircle size={10} /> Message
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MentorMenteesPage;
