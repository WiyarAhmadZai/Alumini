import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  FiArrowLeft, FiDownload, FiShare2, FiEye, FiCalendar, FiUser, FiTag,
  FiFileText, FiImage, FiVideo, FiMusic, FiArchive, FiFile, FiStar, FiPaperclip,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import mediaService from '../services/mediaService';

const BRAND = '#194ce6';

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

const Preview = ({ item, t }) => {
  const cat = (item.fileCategory || '').toLowerCase();
  const mt = (item.mediaType || '').toLowerCase();
  const url = item.previewUrl || item.url;

  if (cat === 'image' || mt === 'image') {
    return <img src={url} alt={item.title} className="max-h-[70vh] w-full object-contain bg-black/5" />;
  }
  if (cat === 'video' || mt === 'video') {
    return <video src={url} controls className="max-h-[70vh] w-full bg-black" />;
  }
  if (cat === 'audio' || mt === 'audio') {
    return <div className="p-10 flex justify-center"><audio src={url} controls className="w-full max-w-xl" /></div>;
  }
  if (mt === 'pdf' || (item.type || '').includes('pdf')) {
    return <iframe title={item.title} src={url} className="h-[70vh] w-full" />;
  }
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
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    mediaService.getMediaById(id)
      .then((res) => { if (active) setItem(res.data); })
      .catch(() => { if (active) setItem(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await mediaService.download(item.fileId || item.id, item.name || item.title || 'download');
      setItem((prev) => prev ? { ...prev, downloadCount: (prev.downloadCount || 0) + 1 } : prev);
    } catch {
      Swal.fire(t('media.detail.download'), t('media.detail.downloadFailed'), 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        Swal.fire({ icon: 'success', title: t('media.detail.copied'), timer: 1400, showConfirmButton: false });
      }
    } catch { /* user cancelled */ }
  };

  if (loading) {
    return (
      <Layout>
        <section className="pt-28 pb-16 min-h-screen bg-[#f7f9ff]">
          <div className="max-w-5xl mx-auto px-4">
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200 mb-6" />
            <div className="h-[60vh] w-full animate-pulse rounded-2xl bg-gray-200" />
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

  return (
    <Layout>
      <section className="relative pt-28 pb-16 min-h-screen bg-[#f7f9ff]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-br from-[#002759] via-[#0a3a86] to-[#194ce6]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate('/media-center')} className="mb-5 inline-flex items-center gap-2 text-white/90 hover:text-white">
            <FiArrowLeft /> {t('media.detail.back')}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* main */}
            <div className="lg:col-span-2 space-y-5">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <Preview item={item} t={t} />
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  {item.category && <span className="rounded-md bg-[#eef1fd] px-2.5 py-1 text-xs font-semibold text-[#194ce6]">{item.category}</span>}
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{typeIcon(item, 'w-3.5 h-3.5')} {item.mediaType || item.fileCategory}</span>
                  {item.featured && <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600"><FiStar className="w-3.5 h-3.5 fill-amber-400" /> {t('media.featured')}</span>}
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#002759]">{item.title}</h1>
                {item.subtitle && <p className="mt-1 text-gray-500">{item.subtitle}</p>}

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                  {(item.publishDate || item.uploadedAt) && <span className="inline-flex items-center gap-1.5"><FiCalendar /> {fmtDate(item.publishDate || item.uploadedAt)}</span>}
                  {item.authorName && <span className="inline-flex items-center gap-1.5"><FiUser /> {item.authorName}</span>}
                  <span className="inline-flex items-center gap-1.5"><FiEye /> {item.viewCount ?? 0} {t('media.views')}</span>
                  <span className="inline-flex items-center gap-1.5"><FiDownload /> {item.downloadCount ?? 0} {t('media.downloads')}</span>
                </div>

                <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-700">{item.description}</p>

                {item.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tg) => <span key={tg} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"><FiTag className="w-3 h-3" /> {tg}</span>)}
                  </div>
                )}

                {/* attachments */}
                {item.attachments?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-800"><FiPaperclip /> {t('media.detail.attachments')}</h3>
                    <ul className="space-y-2">
                      {item.attachments.map((a, i) => (
                        <li key={i}>
                          <a href={a.url} target="_blank" rel="noreferrer"
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
                  {item.department && <div className="flex justify-between gap-3"><dt className="text-gray-400">{t('media.detail.department')}</dt><dd className="font-medium text-gray-700 text-right">{item.department}</dd></div>}
                  {item.category && <div className="flex justify-between gap-3"><dt className="text-gray-400">{t('media.detail.category')}</dt><dd className="font-medium text-gray-700 text-right">{item.category}</dd></div>}
                  <div className="flex justify-between gap-3"><dt className="text-gray-400">{t('media.detail.type')}</dt><dd className="font-medium text-gray-700 text-right">{item.mediaType || item.fileCategory}</dd></div>
                  {(item.publishDate || item.uploadedAt) && <div className="flex justify-between gap-3"><dt className="text-gray-400">{t('media.detail.published')}</dt><dd className="font-medium text-gray-700 text-right">{fmtDate(item.publishDate || item.uploadedAt)}</dd></div>}
                </dl>
              </div>

              {/* related */}
              {related.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 font-semibold text-gray-800">{t('media.detail.related')}</h3>
                  <div className="space-y-3">
                    {related.map((r) => (
                      <Link key={r.fileId || r.id} to={`/media/${r.fileId || r.id}`} className="group flex gap-3">
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
    </Layout>
  );
};

export default MediaDetailPage;
