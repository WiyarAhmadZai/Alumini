import api from '../config/axios';

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

  /** Download the file as a blob (increments download counter) and save it. */
  download: async (fileId, fileName = 'download') => {
    const response = await api.get(`/alumini/media/${fileId}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  },
};

export default mediaService;
