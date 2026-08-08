import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  FiSearch, FiGrid, FiList, FiColumns, FiEye, FiDownload,
  FiImage, FiVideo, FiFileText, FiMusic, FiArchive, FiFile, FiStar, FiCalendar, FiUser,
} from 'react-icons/fi';
import mediaService from '../services/mediaService';
import { mediaPath } from '../utils/mediaUrl';

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
  const [filters, setFilters] = useState({ media_type: 'all', categories: [], department: 'all', featured: false, date_from: '', date_to: '' });
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState('grid'); // grid | list | card
  const [cols, setCols] = useState(5);       // cards per row in grid view (user-adjustable)
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
      if (filters.categories.length) params.category = filters.categories.join(',');
      if (filters.media_type !== 'all') params.media_type = filters.media_type;
      if (filters.department !== 'all') params.department = filters.department;
      if (filters.featured) params.featured = true;
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;

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

  // Self-heal: re-load the first page when the tab becomes visible again after
  // being idle/backgrounded, so an emptied or stale grid restores itself without
  // the user having to refresh the page manually.
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') fetchMedia(1); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [fetchMedia]);

  const clearFilters = () => {
    setFilters({ media_type: 'all', categories: [], department: 'all', featured: false, date_from: '', date_to: '' });
    setSearch('');
    setSort('newest');
  };

  const toggleCategory = (c) =>
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(c) ? f.categories.filter((x) => x !== c) : [...f.categories, c],
    }));

  const activeFilterCount =
    filters.categories.length +
    (filters.media_type !== 'all' ? 1 : 0) +
    (filters.department !== 'all' ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.date_from ? 1 : 0) +
    (filters.date_to ? 1 : 0);

  const hasMore = pagination && pagination.current_page < pagination.last_page;

  /* ---------- card renderers ---------- */
  const Thumb = ({ item, h }) => {
    const src = thumbOf(item);
    return (
      <div className={`relative ${h} w-full overflow-hidden bg-gradient-to-br from-[#eef1fd] to-[#dce3fb] flex items-center justify-center`}>
        {/* Type icon sits behind the image; if the image is missing or fails to
            load it stays visible (alt="" so a broken image never leaks the title
            text over the thumbnail). */}
        <span className="absolute inset-0 flex items-center justify-center text-[#194ce6]/60">
          {typeIcon(item, 'w-10 h-10')}
        </span>
        {src && (
          <img
            src={src}
            alt=""
            loading="lazy"
            className="relative h-full w-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {/* Badges share one padded top row and truncate, so a Featured + category
            pair never overlaps on narrow (many-column) cards. */}
        {(item.featured || item.category) && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-1 p-2">
            {item.featured ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/95 px-1.5 py-0.5 text-[10px] font-semibold text-white max-w-[55%]">
                <FiStar className="w-3 h-3 shrink-0" /> <span className="truncate">{t('media.featured')}</span>
              </span>
            ) : <span />}
            {item.category && (
              <span className="rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white truncate max-w-[45%]">
                {item.category}
              </span>
            )}
          </div>
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
    <button onClick={() => navigate(mediaPath(item))}
      className="group text-left bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-[#194ce6]/40 transition">
      <Thumb item={item} h="h-28 sm:h-32" />
      <div className="p-2.5">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-[#194ce6]">{item.title}</h3>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-gray-400">
          <span className="inline-flex items-center gap-1"><FiEye className="w-3 h-3" /> {item.viewCount ?? 0}</span>
          <span className="inline-flex items-center gap-1"><FiDownload className="w-3 h-3" /> {item.downloadCount ?? 0}</span>
          {(item.publishDate || item.uploadedAt) && (
            <span className="ltr:ml-auto rtl:mr-auto inline-flex items-center gap-1 truncate"><FiCalendar className="w-3 h-3" /> {fmtDate(item.publishDate || item.uploadedAt)}</span>
          )}
        </div>
      </div>
    </button>
  );

  const ListRow = ({ item }) => (
    <button onClick={() => navigate(mediaPath(item))}
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
    <button onClick={() => navigate(mediaPath(item))}
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
      <div className="h-28 sm:h-32 w-full animate-pulse bg-gray-200" />
      <div className="p-2.5 space-y-2">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );

  // Static class maps so Tailwind can see every column count at build time.
  const gridColMap = {
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };
  const gridCols = view === 'card'
    ? 'grid-cols-1 md:grid-cols-2'
    : view === 'list'
      ? 'grid-cols-1'
      : (gridColMap[cols] || gridColMap[5]);

  const SectionLabel = ({ children }) => (
    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400">{children}</p>
  );

  const mediaTypeOptions = [
    { key: 'all', label: t('media.allMedia') },
    { key: 'Image', label: t('media.images') },
    { key: 'Video', label: t('media.videos') },
    { key: 'Document', label: t('media.documents') },
  ];

  return (
    <Layout>
      {/* compact hero: KPU campus image with a dark overlay */}
      <section className="relative overflow-hidden pt-24 pb-10">
        <img
          src="/kpu.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        {/* dark (black) overlay above the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur">
            <FiImage className="w-3.5 h-3.5" /> {t('nav.media')}
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow">{t('media.title')}</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-200">{t('media.subtitle')}</p>
        </div>
      </section>

      <section className="pb-16 min-h-screen bg-[#f7f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          {/* top bar: search + sort + view + density */}
          <div className="bg-white/90 backdrop-blur rounded-2xl border border-gray-200 p-3 sm:p-4 mb-6 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {/* search */}
              <div className="relative flex-1">
                <FiSearch className="pointer-events-none absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 w-4 h-4" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('media.searchPlaceholder')}
                  className="h-11 w-full rounded-full border border-gray-200 bg-gray-50 ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4 text-sm text-gray-800 outline-none transition focus:border-[#194ce6] focus:bg-white focus:ring-2 focus:ring-[#194ce6]/20"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* sort */}
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="h-11 cursor-pointer rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 outline-none transition focus:border-[#194ce6] focus:ring-2 focus:ring-[#194ce6]/20">
                  <option value="newest">{t('media.sortNewest')}</option>
                  <option value="oldest">{t('media.sortOldest')}</option>
                  <option value="most_viewed">{t('media.sortMostViewed')}</option>
                  <option value="most_downloaded">{t('media.sortMostDownloaded')}</option>
                </select>

                {/* per-row density (grid view only) */}
                {view === 'grid' && (
                  <div className="hidden md:flex h-11 items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-1.5" title={t('media.perRow', 'Cards per row')}>
                    {[3, 4, 5, 6].map((n) => (
                      <button key={n} onClick={() => setCols(n)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${
                          cols === n ? 'bg-[#194ce6] text-white shadow-sm' : 'text-gray-500 hover:bg-white hover:text-gray-700'
                        }`}>
                        {n}
                      </button>
                    ))}
                  </div>
                )}

                {/* view mode */}
                <div className="flex h-11 items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1">
                  {[['grid', FiGrid], ['list', FiList], ['card', FiColumns]].map(([v, Icon]) => (
                    <button key={v} onClick={() => setView(v)} title={v}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                        view === v ? 'bg-[#194ce6] text-white shadow-sm' : 'text-gray-500 hover:bg-white hover:text-gray-700'
                      }`}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* two-column: filters sidebar + results */}
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Sidebar (left in LTR / right in RTL) */}
            <aside className="w-full shrink-0 lg:w-64">
              <div className="lg:sticky lg:top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">{t('media.filters')}</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs font-semibold text-[#194ce6] hover:underline">
                      {t('media.clearAll')}
                    </button>
                  )}
                </div>

                {/* MEDIA TYPE — segmented pills */}
                <div className="mb-5">
                  <SectionLabel>{t('media.mediaType')}</SectionLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {mediaTypeOptions.map((opt) => {
                      const on = filters.media_type === opt.key;
                      return (
                        <button key={opt.key} type="button"
                          onClick={() => setFilters((f) => ({ ...f, media_type: opt.key }))}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                            on ? 'border-[#194ce6] bg-[#194ce6] text-white shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-[#194ce6]/40 hover:bg-gray-50'
                          }`}>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CATEGORIES — toggle chips */}
                {options.categories.length > 0 && (
                  <div className="mb-5">
                    <SectionLabel>{t('media.categories')}</SectionLabel>
                    <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto ltr:pr-1 rtl:pl-1">
                      {options.categories.map((c) => {
                        const on = filters.categories.includes(c);
                        return (
                          <button key={c} type="button" onClick={() => toggleCategory(c)}
                            className={`max-w-full truncate rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                              on ? 'border-[#194ce6] bg-[#eef1fd] text-[#194ce6]' : 'border-gray-200 bg-white text-gray-600 hover:border-[#194ce6]/40 hover:bg-gray-50'
                            }`}>
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* DATE RANGE */}
                <div className="mb-5">
                  <SectionLabel>{t('media.dateRange')}</SectionLabel>
                  <label className="mb-1 block text-xs text-gray-500">{t('media.from')}</label>
                  <input type="date" value={filters.date_from}
                    onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))}
                    className="mb-3 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#194ce6] focus:ring-2 focus:ring-[#194ce6]/20" />
                  <label className="mb-1 block text-xs text-gray-500">{t('media.to')}</label>
                  <input type="date" value={filters.date_to}
                    onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#194ce6] focus:ring-2 focus:ring-[#194ce6]/20" />
                </div>

                {/* DEPARTMENT */}
                {options.departments.length > 0 && (
                  <div className="mb-5">
                    <SectionLabel>{t('media.detail.department')}</SectionLabel>
                    <select value={filters.department} onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
                      className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#194ce6] focus:ring-2 focus:ring-[#194ce6]/20">
                      <option value="all">{t('media.allDepartments')}</option>
                      {options.departments.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                )}

                {/* FEATURED */}
                <button type="button" onClick={() => setFilters((f) => ({ ...f, featured: !f.featured }))}
                  className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${
                    filters.featured ? 'border-[#194ce6] bg-[#eef1fd] text-[#194ce6]' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}>
                  <FiStar className={`h-4 w-4 ${filters.featured ? 'fill-amber-400 text-amber-400' : ''}`} /> {t('media.featuredOnly')}
                </button>
              </div>
            </aside>

            {/* Results */}
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-gray-900">
                  {pagination ? t('media.results', { count: pagination.total }) : ' '}
                </h2>
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef1fd] px-3 py-1 text-xs font-semibold text-[#194ce6]">
                    {t('media.currentSelection')}
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#194ce6] px-1 text-[11px] text-white">{activeFilterCount}</span>
                  </span>
                )}
              </div>

              {error ? (
                <div className="py-16 text-center">
                  <p className="text-gray-500">{t('media.errorLoading')}</p>
                  <button onClick={() => fetchMedia(1)} className="mt-3 rounded-lg bg-[#194ce6] px-4 py-2 text-sm text-white">↻</button>
                </div>
              ) : loading && items.length === 0 ? (
                <div className={`grid ${gridCols} gap-4`}>{[...Array(10)].map((_, i) => <Skeleton key={i} />)}</div>
              ) : items.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef1fd] text-[#194ce6]"><FiImage className="w-7 h-7" /></div>
                  <h3 className="text-lg font-semibold text-gray-800">{t('media.noResultsTitle')}</h3>
                  <p className="text-gray-500">{t('media.noResultsDesc')}</p>
                </div>
              ) : (
                <>
                  <div className={`grid ${gridCols} gap-4`}>
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
                        className="rounded-lg bg-[#194ce6] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0f2d8a] disabled:opacity-60">
                        {loading ? '…' : t('media.loadMore')}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MediaCenterPage;
