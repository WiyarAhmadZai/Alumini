import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  FiArrowLeft, FiDownload, FiShare2, FiEye, FiCalendar, FiUser, FiTag,
  FiFileText, FiImage, FiVideo, FiMusic, FiArchive, FiFile, FiStar, FiPaperclip,
  FiX, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import mediaService from '../services/mediaService';
import { mediaPath, parseMediaId } from '../utils/mediaUrl';

const typeIcon = (item, cls = 'w-5 h-5') => {
  const t = (item?.mediaType || item?.fileCategory || '').toLowerCase();
  if (t.includes('image')) return <FiImage className={cls} />;
  if (t.includes('video')) return <FiVideo className={cls} />;
  if (t.includes('audio')) return <FiMusic className={cls} />;
  if (t.includes('pdf') || t.includes('document') || t.includes('presentation')) return <FiFileText className={cls} />;
  if (t.includes('archive')) return <FiArchive className={cls} />;
  return <FiFile className={cls} />;
};

const fmtDate = (iso) => { try { return iso ? new Date(iso).toLocaleDateString() : ''; } catch { return ''; } };
const isImageType = (s) => (s || '').toLowerCase().includes('image');

/** Player/preview for the main (non-image) file. */
const FilePreview = ({ item, t }) => {
  const mt = (item.mediaType || item.fileCategory || '').toLowerCase();
  const url = item.previewUrl || item.url;
  if (mt.includes('video')) return <video src={url} controls className="max-h-[70vh] w-full bg-black" />;
  if (mt.includes('audio')) return <div className="p-10 flex justify-center"><audio src={url} controls className="w-full max-w-xl" /></div>;
  if (mt.includes('pdf') || (item.type || '').includes('pdf')) return <iframe title={item.title} src={url} className="h-[70vh] w-full" />;
  return (
    <div className="p-12 text-center text-gray-500">
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef1fd] text-[#194ce6]">{typeIcon(item, 'w-7 h-7')}</div>
      <p>{t('media.detail.noPreview')}</p>
    </div>
  );
};

const MediaDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const fileId = parseMediaId(id);
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [active, setActive] = useState(0);     // active gallery image index
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    mediaService.getMediaById(fileId)
      .then((res) => { if (alive) { setItem(res.data); setActive(0); } })
      .catch(() => { if (alive) setItem(null); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [fileId]);

  // All images that belong to this media item: cover, main (if image), thumbnail, image attachments.
  const images = useMemo(() => {
    if (!item) return [];
    const out = [];
    const push = (u) => { if (u && !out.includes(u)) out.push(u); };
    push(item.coverImageUrl);
    if (isImageType(item.fileCategory) || isImageType(item.mediaType)) push(item.previewUrl || item.url);
    push(item.thumbnailUrl);
    (item.attachments || []).forEach((a) => { if (isImageType(a.type)) push(a.url); });
    return out;
  }, [item]);

  const mainIsImage = item && (isImageType(item.fileCategory) || isImageType(item.mediaType));

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // item.name is the original uploaded filename (the service also honours Content-Disposition).
      await mediaService.download(item.fileId || item.id, item.name || item.title || 'download');
      setItem((prev) => prev ? { ...prev, downloadCount: (prev.downloadCount || 0) + 1 } : prev);
    } catch {
      Swal.fire(t('media.detail.download'), t('media.detail.downloadFailed'), 'error');
    } finally {
      setDownloading(false);
    }
  };

  // Robust share that also works on non-secure (http://LAN) origins where
  // navigator.share / navigator.clipboard are unavailable.
  const handleShare = async () => {
    const url = window.location.href;
    const copied = () => Swal.fire({ icon: 'success', title: t('media.detail.copied'), timer: 1400, showConfirmButton: false });

    if (navigator.share) {
      try { await navigator.share({ title: item.title, url }); return; }
      catch (e) { if (e?.name === 'AbortError') return; /* else fall through to copy */ }
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        return copied();
      }
    } catch { /* fall through */ }
    // Legacy fallback (works on http) — temporary textarea + execCommand.
    try {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) return copied();
    } catch { /* fall through */ }
    // Last resort — show the link so the user can copy it manually.
    Swal.fire({ title: t('media.detail.share'), input: 'text', inputValue: url, showConfirmButton: false });
  };

  const openLightbox = (i) => { setActive(i); setLightbox(true); };
  const nextImg = () => setActive((a) => (a + 1) % images.length);
  const prevImg = () => setActive((a) => (a - 1 + images.length) % images.length);

  if (loading) {
    return (
      <Layout>
        <section className="pt-28 pb-16 min-h-screen bg-[#f7f9ff]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="h-56 w-full animate-pulse rounded-2xl bg-gray-200 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-[60vh] animate-pulse rounded-2xl bg-gray-200" />
              <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <section className="pt-28 pb-16 min-h-screen bg-[#f7f9ff]">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-gray-500 mb-4">{t('media.detail.loadFailed')}</p>
            <button onClick={() => navigate('/media-center')} className="inline-flex items-center gap-2 text-[#194ce6] hover:underline">
              <FiArrowLeft /> {t('media.detail.back')}
            </button>
          </div>
        </section>
      </Layout>
    );
  }

  const related = item.related || [];
  const heroBg = item.coverImageUrl || images[0] || null;

  return (
    <Layout>
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden pt-24 pb-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002759] via-[#0a3a86] to-[#194ce6]" />
        {heroBg && (
          <img src={heroBg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7f9ff] via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate('/media-center')} className="mb-5 inline-flex items-center gap-2 text-white/90 hover:text-white">
            <FiArrowLeft /> {t('media.detail.back')}
          </button>
          <div className="flex flex-wrap items-center gap-2">
            {item.category && <span className="rounded-md bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">{item.category}</span>}
            <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/90 backdrop-blur">{typeIcon(item, 'w-3.5 h-3.5')} {item.mediaType || item.fileCategory}</span>
            {item.featured && <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/95 px-2.5 py-1 text-xs font-semibold text-white"><FiStar className="w-3.5 h-3.5 fill-white" /> {t('media.featured')}</span>}
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl sm:text-4xl font-extrabold leading-tight text-white drop-shadow">{item.title}</h1>
          {item.subtitle && <p className="mt-2 max-w-2xl text-white/85">{item.subtitle}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
            {(item.publishDate || item.uploadedAt) && <span className="inline-flex items-center gap-1.5"><FiCalendar /> {fmtDate(item.publishDate || item.uploadedAt)}</span>}
            {item.authorName && <span className="inline-flex items-center gap-1.5"><FiUser /> {item.authorName}</span>}
            <span className="inline-flex items-center gap-1.5"><FiEye /> {item.viewCount ?? 0} {t('media.views')}</span>
            <span className="inline-flex items-center gap-1.5"><FiDownload /> {item.downloadCount ?? 0} {t('media.downloads')}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={handleDownload} disabled={downloading}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-[#194ce6] shadow-sm hover:bg-white/90 disabled:opacity-60">
              <FiDownload /> {downloading ? t('media.detail.downloading') : t('media.detail.download')}
            </button>
            <button onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 font-medium text-white backdrop-blur hover:bg-white/20">
              <FiShare2 /> {t('media.detail.share')}
            </button>
          </div>
        </div>
      </section>

      {/* ───────── BODY ───────── */}
      <section className="bg-[#f7f9ff] pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* main */}
            <div className="lg:col-span-2 space-y-5">
              {/* primary viewer */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {mainIsImage && images.length > 0 ? (
                  <button type="button" onClick={() => openLightbox(active)} className="block w-full">
                    <img src={images[active]} alt={item.title} className="max-h-[70vh] w-full cursor-zoom-in object-contain bg-black/5" />
                  </button>
                ) : (
                  <FilePreview item={item} t={t} />
                )}
              </div>

              {/* all-images gallery */}
              {images.length > (mainIsImage ? 1 : 0) && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800"><FiImage className="text-[#194ce6]" /> {t('media.detail.gallery', 'Images')} <span className="text-sm font-normal text-gray-400">({images.length})</span></h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {images.map((src, i) => (
                      <button key={src} type="button"
                        onClick={() => (mainIsImage ? setActive(i) : openLightbox(i))}
                        className={`group relative aspect-square overflow-hidden rounded-lg border transition ${mainIsImage && i === active ? 'border-[#194ce6] ring-2 ring-[#194ce6]/30' : 'border-gray-200 hover:border-[#194ce6]'}`}>
                        <img src={src} alt={`${item.title} ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* description */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                {item.description && <p className="whitespace-pre-line leading-relaxed text-gray-700">{item.description}</p>}

                {item.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tg) => <span key={tg} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"><FiTag className="w-3 h-3" /> {tg}</span>)}
                  </div>
                )}

                {item.attachments?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-800"><FiPaperclip /> {t('media.detail.attachments')}</h3>
                    <ul className="space-y-2">
                      {item.attachments.map((a, i) => (
                        <li key={i}>
                          <a href={a.url} target="_blank" rel="noreferrer" download={a.name || undefined}
                            className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-[#194ce6] hover:bg-[#eef1fd]/40">
                            <span className="flex items-center gap-2 text-gray-700"><FiFile className="w-4 h-4 text-[#194ce6]" /> {a.name}</span>
                            <FiDownload className="text-gray-400" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* sidebar */}
            <aside className="space-y-5">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <button onClick={handleDownload} disabled={downloading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#194ce6] px-4 py-3 font-semibold text-white hover:bg-[#0f2d8a] disabled:opacity-60">
                  <FiDownload /> {downloading ? t('media.detail.downloading') : t('media.detail.download')}
                </button>
                <button onClick={handleShare}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50">
                  <FiShare2 /> {t('media.detail.share')}
                </button>

                <dl className="mt-5 space-y-3 text-sm">
                  {item.name && <div className="flex justify-between gap-3"><dt className="text-gray-400">{t('media.detail.fileName', 'File')}</dt><dd className="font-medium text-gray-700 text-right break-all">{item.name}</dd></div>}
                  {item.department && <div className="flex justify-between gap-3"><dt className="text-gray-400">{t('media.detail.department')}</dt><dd className="font-medium text-gray-700 text-right">{item.department}</dd></div>}
                  {item.category && <div className="flex justify-between gap-3"><dt className="text-gray-400">{t('media.detail.category')}</dt><dd className="font-medium text-gray-700 text-right">{item.category}</dd></div>}
                  <div className="flex justify-between gap-3"><dt className="text-gray-400">{t('media.detail.type')}</dt><dd className="font-medium text-gray-700 text-right">{item.mediaType || item.fileCategory}</dd></div>
                  {(item.publishDate || item.uploadedAt) && <div className="flex justify-between gap-3"><dt className="text-gray-400">{t('media.detail.published')}</dt><dd className="font-medium text-gray-700 text-right">{fmtDate(item.publishDate || item.uploadedAt)}</dd></div>}
                </dl>
              </div>

              {related.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 font-semibold text-gray-800">{t('media.detail.related')}</h3>
                  <div className="space-y-3">
                    {related.map((r) => (
                      <Link key={r.fileId || r.id} to={mediaPath(r)} className="group flex gap-3">
                        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#eef1fd] flex items-center justify-center text-[#194ce6]">
                          {r.coverImageUrl || r.thumbnailUrl
                            ? <img src={r.coverImageUrl || r.thumbnailUrl} alt={r.title} className="h-full w-full object-cover" />
                            : typeIcon(r, 'w-5 h-5')}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-medium text-gray-700 group-hover:text-[#194ce6]">{r.title}</p>
                          <p className="text-xs text-gray-400">{r.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ───────── LIGHTBOX ───────── */}
      {lightbox && images.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" onClick={() => setLightbox(false)}><FiX className="h-6 w-6" /></button>
          {images.length > 1 && (
            <>
              <button className="absolute left-3 sm:left-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); prevImg(); }}><FiChevronLeft className="h-7 w-7" /></button>
              <button className="absolute right-3 sm:right-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); nextImg(); }}><FiChevronRight className="h-7 w-7" /></button>
            </>
          )}
          <img src={images[active]} alt={item.title} className="max-h-[88vh] max-w-[92vw] object-contain" onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-sm text-white">{active + 1} / {images.length}</span>
          )}
        </div>
      )}
    </Layout>
  );
};

export default MediaDetailPage;
