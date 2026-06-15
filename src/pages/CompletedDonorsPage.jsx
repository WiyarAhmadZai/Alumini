import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiArrowLeft, FiHeart, FiSearch, FiX, FiChevronLeft, FiChevronRight, FiAward, FiUser, FiTarget } from 'react-icons/fi';
import fundraisingService from '../services/fundraisingService';

const BRAND = '#002759';
const BRAND_LIGHT = '#0a519b';

const resolveImg = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('/storage/')) return `http://localhost:8000${img}`;
  if (img.startsWith('storage/')) return `http://localhost:8000/${img}`;
  return `http://localhost:8000/storage/${img}`;
};

const CompletedDonorsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 20 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, per_page: 20 };
      if (search) params.search = search;
      const res = await fundraisingService.getCompletedDonors(params);
      setDonors(res.data?.data || []);
      setPagination({
        current_page: res.data?.current_page || 1,
        last_page: res.data?.last_page || 1,
        total: res.data?.total || 0,
        per_page: res.data?.per_page || 20,
      });
    } catch {
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative w-full h-64 sm:h-72 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&q=80")',
          }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 pt-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4 border border-white/20">
            <FiHeart size={11} /> {t('donors.hero.badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-2">{t('donors.hero.title')}</h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl">
            {t('donors.hero.subtitle')}
          </p>
        </div>
      </section>

      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-6">
          <button
            onClick={() => navigate('/legal')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#002759] font-semibold bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-[#002759] shadow-sm transition"
          >
            <FiArrowLeft size={14} /> {t('donors.backToGiving')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FiAward style={{ color: BRAND }} /> {pagination.total === 1 ? t('donors.donorCountOne', { count: pagination.total }) : t('donors.donorCountOther', { count: pagination.total })}
                </h2>
                <p className="text-xs text-gray-500">{t('donors.listedBy')}</p>
              </div>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('donors.searchPlaceholder')}
                  className="pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-1 focus:ring-[#002759] focus:border-[#002759] w-64"
                />
                {searchInput && (
                  <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <FiX size={13} />
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="divide-y divide-gray-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="h-2 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="w-24 h-6 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : donors.length === 0 ? (
              <div className="text-center py-16">
                <FiHeart size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-semibold">{t('donors.noDonors')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-[11px] uppercase font-bold text-gray-500 tracking-wider">{t('donors.table.rank')}</th>
                      <th className="text-left px-4 py-3 text-[11px] uppercase font-bold text-gray-500 tracking-wider">{t('donors.table.donor')}</th>
                      <th className="text-left px-4 py-3 text-[11px] uppercase font-bold text-gray-500 tracking-wider hidden lg:table-cell">{t('donors.table.faculty')}</th>
                      <th className="text-right px-4 py-3 text-[11px] uppercase font-bold text-gray-500 tracking-wider hidden sm:table-cell">{t('donors.table.projects')}</th>
                      <th className="text-right px-4 py-3 text-[11px] uppercase font-bold text-gray-500 tracking-wider hidden sm:table-cell">{t('donors.table.quickGift')}</th>
                      <th className="text-right px-4 py-3 text-[11px] uppercase font-bold text-gray-500 tracking-wider">{t('donors.table.total')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {donors.map((donor, index) => {
                      const rank = (pagination.current_page - 1) * pagination.per_page + index + 1;
                      const profileImg = resolveImg(donor.profile_image);
                      const ProfileLink = donor.alumni_student_id
                        ? ({ children, className }) => <Link to={`/profile/${donor.alumni_student_id}`} className={className}>{children}</Link>
                        : ({ children, className }) => <span className={className}>{children}</span>;
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-gray-500 font-semibold w-12">
                            {rank <= 3 ? (
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-white text-xs ${
                                rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-orange-500'
                              }`}>{rank}</span>
                            ) : (
                              <span className="text-gray-400">#{rank}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <ProfileLink className="flex items-center gap-3 group">
                              {profileImg ? (
                                <img src={profileImg} alt={donor.donor_name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                              ) : (
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: BRAND }}>
                                  {donor.donor_name?.charAt(0)?.toUpperCase() || <FiUser size={14} />}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className={`font-bold text-gray-900 truncate ${donor.alumni_student_id ? 'group-hover:text-[#002759]' : ''}`}>
                                  {donor.donor_name}
                                </p>
                                {donor.last_message && (
                                  <p className="text-[11px] text-gray-500 italic line-clamp-1 max-w-[280px]">"{donor.last_message}"</p>
                                )}
                              </div>
                            </ProfileLink>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 hidden lg:table-cell">
                            <div>
                              <p>{donor.faculty || '—'}</p>
                              {donor.donor_graduation_year && (
                                <p className="text-[10px] text-gray-400">{t('donors.classOf', { year: donor.donor_graduation_year })}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right hidden sm:table-cell">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-[#002759] border border-blue-100 rounded text-xs font-bold">
                              <FiTarget size={9} />
                              ${Number(donor.projects_amount || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right hidden sm:table-cell">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded text-xs font-bold">
                              <FiHeart size={9} />
                              ${Number(donor.quick_gift_amount || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <p className="font-bold text-base" style={{ color: BRAND }}>${Number(donor.total_amount).toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400">{donor.donation_count > 1 ? t('donors.donationOther', { count: donor.donation_count }) : t('donors.donationOne', { count: donor.donation_count })}</p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination.last_page > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {t('donors.pageOf', { current: pagination.current_page, last: pagination.last_page })}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.current_page === 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <FiChevronLeft size={14} />
                  </button>
                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1).slice(0, 7).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg font-semibold text-xs ${
                        p === pagination.current_page ? 'text-white' : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                      style={p === pagination.current_page ? { backgroundColor: BRAND } : {}}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                    disabled={pagination.current_page === pagination.last_page}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <FiChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompletedDonorsPage;
