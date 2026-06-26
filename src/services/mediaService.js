import api from '../config/axios';

/** Pull the original filename out of a Content-Disposition response header. */
const filenameFromDisposition = (headers) => {
  try {
    const cd = headers?.['content-disposition'] || headers?.['Content-Disposition'];
    if (!cd) return null;
    const star = cd.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
    if (star?.[1]) return decodeURIComponent(star[1].replace(/^"|"$/g, ''));
    const plain = cd.match(/filename="?([^";]+)"?/i);
    return plain?.[1] || null;
  } catch {
    return null;
  }
};

/**
 * Alumni Media Center service.
 * Talks to the protected `api/alumini/media/*` endpoints. Only media shared
 * with "Alumni Only" or "Both MIS & Alumni" is ever returned by the backend.
 */
const mediaService = {
  /** Paginated, filterable list of alumni-visible media. */
  getMedia: async (params = {}) => {
    try {
      const response = await api.get('/alumini/media', { params });
      return response.data; // { response_code, status, data: { media, pagination } }
    } catch (error) {
      throw error;
    }
  },

  /** Single media item (+ related). Increments the view counter server-side. */
  getMediaById: async (fileId) => {
    try {
      const response = await api.get(`/alumini/media/${fileId}`);
      return response.data; // { data: { ...media, related: [] } }
    } catch (error) {
      throw error;
    }
  },

  /** Filter options derived from alumni-visible media. */
  getFilterOptions: async () => {
    try {
      const response = await api.get('/alumini/media/filter-options');
      return response.data; // { data: { categories, mediaTypes, departments } }
    } catch (error) {
      throw error;
    }
  },

  /** Download the file as a blob (increments download counter) and save it
   *  using the exact name it was uploaded with. */
  download: async (fileId, fileName = 'download') => {
    const response = await api.get(`/alumini/media/${fileId}/download`, {
      responseType: 'blob',
    });
    // Prefer the server's original filename (Content-Disposition), fall back to
    // the passed name (which is also the original_name from the API).
    const name = filenameFromDisposition(response.headers) || fileName;
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  },
};

export default mediaService;
