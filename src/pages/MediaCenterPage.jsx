import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  FiSearch, FiFilter, FiX, FiGrid, FiList, FiColumns, FiEye, FiDownload,
  FiImage, FiVideo, FiFileText, FiMusic, FiArchive, FiFile, FiStar, FiCalendar, FiUser,
} from 'react-icons/fi';
import mediaService from '../services/mediaService';

const BRAND = '#194ce6';
const PER_PAGE = 12;

const typeIcon = (item, cls = 'w-5 h-5') => {
  const t = (item.mediaType || item.fileCategory || '').toLowerCase();
  if (t.includes('image')) return <FiImage className={cls} />;
  if (t.includes('video')) return <FiVideo className={cls} />;
  if (t.includes('audio')) return <FiMusic className={cls} />;
  if (t.includes('pdf') || t.includes('document') || t.includes('presentation')) return <FiFileText className={cls} />;
  if (t.includes('archive')) return <FiArchive className={cls} />;
  return <FiFile className={cls} />;
};

const thumbOf = (item) =>
  item.coverImageUrl || item.thumbnailUrl ||
  ((item.fileCategory === 'image' || (item.mediaType || '').toLowerCase() === 'image') ? item.previewUrl : null);

const fmtDate = (iso) => {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString(); } catch { return ''; }
};

const MediaCenterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: 'all', media_type: 'all', department: 'all', featured: false });
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState('grid'); // grid | list | card
  const [options, setOptions] = useState({ categories: [], mediaTypes: [], departments: [] });

  const isFirstLoad = useRef(true);

  // debounce search
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(id);
  }, [search]);

  // load filter options once
  useEffect(() => {
    mediaService.getFilterOptions()
      .then((res) => setOptions(res.data || { categories: [], mediaTypes: [], departments: [] }))
      .catch(() => {});
  }, []);

  // reset to page 1 when query/filters/sort change
  useEffect(() => { setPage(1); }, [debounced, filters, sort]);

  const fetchMedia = useCallback(async (targetPage) => {
    setLoading(true);
    setError(false);
    try {
      const params = { page: targetPage, per_page: PER_PAGE, sort };
      if (debounced) params.search = debounced;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.media_type !== 'all') params.media_type = filters.media_type;
      if (filters.department !== 'all') params.department = filters.department;
      if (filters.featured) params.featured = true;

      const res = await mediaService.getMedia(params);
      const data = res.data || {};
      const list = data.media || [];
      setPagination(data.pagination || null);
      setItems((prev) => (targetPage > 1 ? [...prev, ...list] : list));
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
      isFirstLoad.current = false;
    }
  }, [debounced, filters, sort]);

  useEffect(() => { fetchMedia(page); }, [page, fetchMedia]);

  const clearFilters = () => {
    setFilters({ category: 'all', media_type: 'all', department: 'all', featured: false });
    setSearch('');
    setSort('newest');
  };

  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.media_type !== 'all' ? 1 : 0) +
    (filters.department !== 'all' ? 1 : 0) +
    (filters.featured ? 1 : 0);

  const hasMore = pagination && pagination.current_page < pagination.last_page;

  /* ---------- card renderers ---------- */
  const Thumb = ({ item, h }) => {
    const src = thumbOf(item);
    return (
      <div className={`relative ${h} w-full overflow-hidden bg-gradient-to-br from-[#eef1fd] to-[#dce3fb] flex items-center justify-center`}>
        {src
          ? <img src={src} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
          : <span className="text-[#194ce6]/60">{typeIcon(item, 'w-12 h-12')}</span>}
        {item.featured && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-amber-400/95 px-2 py-0.5 text-[11px] font-semibold text-white">
            <FiStar className="w-3 h-3" /> {t('media.featured')}
          </span>
        )}
        {item.category && (
          <span className="absolute top-2 right-2 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white">
            {item.category}
          </span>
        )}
      </div>
    );
  };

  const Meta = ({ item }) => (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
      {item.publishDate || item.uploadedAt ? (
        <span className="inline-flex items-center gap-1"><FiCalendar className="w-3.5 h-3.5" /> {fmtDate(item.publishDate || item.uploadedAt)}</span>
      ) : null}
      {item.authorName && <span className="inline-flex items-center gap-1"><FiUser className="w-3.5 h-3.5" /> {item.authorName}</span>}
      <span className="inline-flex items-center gap-1"><FiEye className="w-3.5 h-3.5" /> {item.viewCount ?? 0}</span>
      <span className="inline-flex items-center gap-1"><FiDownload className="w-3.5 h-3.5" /> {item.downloadCount ?? 0}</span>
    </div>
  );

  const GridCard = ({ item }) => (
    <button onClick={() => navigate(`/media/${item.fileId || item.id}`)}
      className="group text-left bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition">
      <Thumb item={item} h="h-44" />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-[#194ce6]">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.shortSummary || item.description}</p>
        <Meta item={item} />
      </div>
    </button>
  );

  const ListRow = ({ item }) => (
    <button onClick={() => navigate(`/media/${item.fileId || item.id}`)}
      className="group flex w-full text-left bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
      <div className="w-40 shrink-0"><Thumb item={item} h="h-full min-h-28" /></div>
      <div className="p-4 flex-1">
        <div className="flex items-center gap-2 text-[#194ce6]">{typeIcon(item, 'w-4 h-4')}<span className="text-xs font-medium uppercase tracking-wide">{item.mediaType || item.fileCategory}</span></div>
        <h3 className="mt-1 font-semibold text-gray-900 line-clamp-1 group-hover:text-[#194ce6]">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.shortSummary || item.description}</p>
        <Meta item={item} />
      </div>
    </button>
  );

  const BigCard = ({ item }) => (
    <button onClick={() => navigate(`/media/${item.fileId || item.id}`)}
      className="group text-left bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition">
      <Thumb item={item} h="h-56" />
      <div className="p-5">
        <div className="flex items-center gap-2 text-[#194ce6]">{typeIcon(item, 'w-4 h-4')}<span className="text-xs font-medium uppercase tracking-wide">{item.mediaType || item.fileCategory}</span></div>
        <h3 className="mt-1 text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#194ce6]">{item.title}</h3>
        {item.subtitle && <p className="text-sm text-gray-400 line-clamp-1">{item.subtitle}</p>}
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.shortSummary || item.description}</p>
        {item.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 4).map((tg) => <span key={tg} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">#{tg}</span>)}
          </div>
        )}
        <Meta item={item} />
      </div>
    </button>
  );

  const Skeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="h-44 w-full animate-pulse bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );

  const gridCols = view === 'card'
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    : view === 'list'
      ? 'grid-cols-1'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <Layout>
      {/* short hero with image (dark overlay also gives the fixed navbar a readable backdrop) */}
      <section className="relative overflow-hidden pt-28 pb-20">
        <img
          src="/depositphotos_258235060-stock-photo-books-notebooks-academic-cap-laptop.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#002759]/95 via-[#0a3a86]/90 to-[#194ce6]/80" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur">
            <FiImage className="w-4 h-4" /> {t('nav.media')}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">{t('media.title')}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-blue-100">{t('media.subtitle')}</p>
        </div>
      </section>

      <section className="pb-16 min-h-screen bg-[#f7f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          {/* search + controls */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 mb-6 shadow-sm relative">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {/* search */}
              <div className="relative flex-1">
                <FiSearch className="absolute top-1/2 -translate-y-1/2 ltr:left-3.5 rtl:right-3.5 text-gray-400 w-4 h-4" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('media.searchPlaceholder')}
                  className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4 text-sm text-gray-800 outline-none transition focus:border-[#194ce6] focus:bg-white focus:ring-2 focus:ring-[#194ce6]/20"
                />
              </div>
              {/* controls */}
              <div className="flex items-center gap-2">
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="h-11 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#194ce6] focus:ring-2 focus:ring-[#194ce6]/20">
                  <option value="newest">{t('media.sortNewest')}</option>
                  <option value="oldest">{t('media.sortOldest')}</option>
                  <option value="most_viewed">{t('media.sortMostViewed')}</option>
                  <option value="most_downloaded">{t('media.sortMostDownloaded')}</option>
                </select>
                <button onClick={() => setShowFilters((s) => !s)}
                  className={`relative inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition ${
                    showFilters || activeFilterCount > 0
                      ? 'border-[#194ce6] bg-[#eef1fd] text-[#194ce6]'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}>
                  <FiFilter className="w-4 h-4" /> {t('media.filters')}
                  {activeFilterCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#194ce6] px-1 text-[11px] font-bold text-white">{activeFilterCount}</span>}
                </button>
                {/* segmented view toggle */}
                <div className="hidden sm:flex h-11 items-center gap-1 rounded-xl border border-gray-300 bg-gray-50 p-1">
                  {[['grid', FiGrid], ['list', FiList], ['card', FiColumns]].map(([v, Icon]) => (
                    <button key={v} onClick={() => setView(v)} title={v}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                        view === v ? 'bg-[#194ce6] text-white shadow-sm' : 'text-gray-500 hover:bg-white hover:text-gray-700'
                      }`}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* advanced filters */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">{t('media.detail.category')}</label>
                  <select value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#194ce6] focus:ring-2 focus:ring-[#194ce6]/20">
                    <option value="all">{t('media.allCategories')}</option>
                    {options.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">{t('media.detail.type')}</label>
                  <select value={filters.media_type} onChange={(e) => setFilters((f) => ({ ...f, media_type: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#194ce6] focus:ring-2 focus:ring-[#194ce6]/20">
                    <option value="all">{t('media.allTypes')}</option>
                    {options.mediaTypes.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">{t('media.detail.department')}</label>
                  <select value={filters.department} onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#194ce6] focus:ring-2 focus:ring-[#194ce6]/20">
                    <option value="all">{t('media.allDepartments')}</option>
                    {options.departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <button type="button" onClick={() => setFilters((f) => ({ ...f, featured: !f.featured }))}
                    className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-medium transition ${
                      filters.featured ? 'border-[#194ce6] bg-[#eef1fd] text-[#194ce6]' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}>
                    <FiStar className={`w-4 h-4 ${filters.featured ? 'fill-amber-400 text-amber-400' : ''}`} /> {t('media.featuredOnly')}
                  </button>
                </div>
              </div>
            )}

            {/* active filter chips */}
            {activeFilterCount > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                {filters.category !== 'all' && (
                  <button onClick={() => setFilters((f) => ({ ...f, category: 'all' }))} className="inline-flex items-center gap-1 rounded-full bg-[#eef1fd] px-3 py-1 text-xs font-medium text-[#194ce6] hover:bg-[#dce3fb]">
                    {filters.category} <FiX className="w-3 h-3" />
                  </button>
                )}
                {filters.media_type !== 'all' && (
                  <button onClick={() => setFilters((f) => ({ ...f, media_type: 'all' }))} className="inline-flex items-center gap-1 rounded-full bg-[#eef1fd] px-3 py-1 text-xs font-medium text-[#194ce6] hover:bg-[#dce3fb]">
                    {filters.media_type} <FiX className="w-3 h-3" />
                  </button>
                )}
                {filters.department !== 'all' && (
                  <button onClick={() => setFilters((f) => ({ ...f, department: 'all' }))} className="inline-flex items-center gap-1 rounded-full bg-[#eef1fd] px-3 py-1 text-xs font-medium text-[#194ce6] hover:bg-[#dce3fb]">
                    {filters.department} <FiX className="w-3 h-3" />
                  </button>
                )}
                {filters.featured && (
                  <button onClick={() => setFilters((f) => ({ ...f, featured: false }))} className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 hover:bg-amber-100">
                    <FiStar className="w-3 h-3 fill-amber-400" /> {t('media.featuredOnly')} <FiX className="w-3 h-3" />
                  </button>
                )}
                <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#194ce6]">
                  <FiX className="w-3 h-3" /> {t('media.clearFilters')}
                </button>
              </div>
            )}
          </div>

          {/* results count */}
          {!loading && pagination && (
            <p className="mb-4 text-sm text-gray-500">{t('media.results', { count: pagination.total })}</p>
          )}

          {/* grid */}
          {error ? (
            <div className="text-center py-16">
              <p className="text-gray-500">{t('media.errorLoading')}</p>
              <button onClick={() => fetchMedia(1)} className="mt-3 px-4 py-2 rounded-lg bg-[#194ce6] text-white text-sm">↻</button>
            </div>
          ) : loading && items.length === 0 ? (
            <div className={`grid ${gridCols} gap-5`}>{[...Array(8)].map((_, i) => <Skeleton key={i} />)}</div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef1fd] text-[#194ce6]"><FiImage className="w-7 h-7" /></div>
              <h3 className="text-lg font-semibold text-gray-800">{t('media.noResultsTitle')}</h3>
              <p className="text-gray-500">{t('media.noResultsDesc')}</p>
            </div>
          ) : (
            <>
              <div className={`grid ${gridCols} gap-5`}>
                {items.map((item) => {
                  const key = item.fileId || item.id;
                  if (view === 'list') return <ListRow key={key} item={item} />;
                  if (view === 'card') return <BigCard key={key} item={item} />;
                  return <GridCard key={key} item={item} />;
                })}
              </div>

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button onClick={() => setPage((p) => p + 1)} disabled={loading}
                    className="px-6 py-2.5 rounded-lg bg-[#194ce6] text-white text-sm font-medium hover:bg-[#0f2d8a] disabled:opacity-60">
                    {loading ? '…' : t('media.loadMore')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MediaCenterPage;
