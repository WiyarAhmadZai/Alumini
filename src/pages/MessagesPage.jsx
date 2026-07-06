import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiMail, FiCalendar, FiTrash2, FiArrowLeft, FiMessageSquare, FiChevronLeft, FiChevronRight, FiSearch, FiFilter, FiEye, FiX, FiExternalLink } from 'react-icons/fi';
import Swal from 'sweetalert2';
import messageService from '../services/messageService';

const MessagesPage = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(true);

  // Debounced search
  const debouncedSearch = useCallback(
    (value) => {
      const timeoutId = setTimeout(() => {
        setSearchTerm(value);
        setMessagesLoading(true);
      }, 300);
      return () => clearTimeout(timeoutId);
    },
    []
  );

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounced search effect
  useEffect(() => {
    const cleanup = debouncedSearch(debouncedSearchTerm);
    return cleanup;
  }, [debouncedSearchTerm, debouncedSearch]);

  useEffect(() => {
    // Set main loading to false immediately so search/filter section shows
    setLoading(false);
    fetchMessages();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [currentPage, recordsPerPage, searchTerm, statusFilter]);

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      const response = await messageService.getUserMessages(currentPage, recordsPerPage, searchTerm, statusFilter);
      setMessages(response.data.messages || []);
      setPagination(response.data.pagination || null);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing records per page
  };

  const handleSearchChange = (value) => {
    setDebouncedSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setShowMessageDetail(true);
  };

  const closeMessageDetail = () => {
    setShowMessageDetail(false);
    setSelectedMessage(null);
  };

  const handleDeleteMessage = async (messageId, subject) => {
    try {
      const result = await Swal.fire({
        title: t('messages.deleteConfirmTitle'),
        html: t('messages.deleteConfirmHtml', { subject }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: t('messages.deleteConfirmButton'),
        cancelButtonText: t('common.cancel')
      });

      if (result.isConfirmed) {
        await messageService.deleteMessage(messageId);
        await fetchMessages();
        
        Swal.fire({
          icon: 'success',
          title: t('messages.deletedTitle'),
          text: t('messages.deletedText'),
          timer: 2000,
          timerProgressBar: true,
          position: 'center',
          backdrop: 'rgba(0, 0, 0, 0.4)'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('messages.errorTitle'),
        text: t('messages.deleteErrorText'),
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'received': return 'bg-blue-100 text-blue-700';
      case 'responded': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return t('messages.statusPending');
      case 'received': return t('messages.statusReceived');
      case 'responded': return t('messages.statusResponded');
      default: return t('messages.statusUnknown');
    }
  };

  const getStatusEmptyMessage = (status, hasSearchTerm) => {
    if (hasSearchTerm) {
      const scope = statusFilter === 'all' ? t('messages.searchScopeAll') : t('messages.searchScopeStatus', { status: statusFilter });
      return {
        title: t('messages.emptySearchTitle'),
        message: t('messages.emptySearchMessage', { scope }),
        icon: '🔍'
      };
    }

    switch(status) {
      case 'pending':
        return {
          title: t('messages.emptyPendingTitle'),
          message: t('messages.emptyPendingMessage'),
          icon: '📝'
        };
      case 'received':
        return {
          title: t('messages.emptyReceivedTitle'),
          message: t('messages.emptyReceivedMessage'),
          icon: '📥'
        };
      case 'responded':
        return {
          title: t('messages.emptyRespondedTitle'),
          message: t('messages.emptyRespondedMessage'),
          icon: '📤'
        };
      default:
        return {
          title: t('messages.emptyDefaultTitle'),
          message: t('messages.emptyDefaultMessage'),
          icon: '📧'
        };
    }
  };

  if (loading) {
    return (
      <Layout>
        {/* Hero Section Skeleton */}
        <section className="relative w-full h-64 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%), url("/depositphotos_463234794-stock-photo-engineer-use-digital-tablet-construction.jpg")',
              backgroundAttachment: 'fixed',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          </div>
          <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
            <div className="text-center">
              <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Main Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button Skeleton */}
          <div className="mb-6">
            <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
          </div>
          
          {/* Messages Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse">
                <div className="h-full flex flex-col">
                  {/* Header Skeleton */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Details Skeleton */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>

                  {/* Status Skeleton */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>

                  {/* Message Skeleton */}
                  <div className="mb-3 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                  </div>

                  {/* Actions Skeleton */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="bg-white rounded-2xl shadow-xl p-5 mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full h-64 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%), url("/depositphotos_463234794-stock-photo-engineer-use-digital-tablet-construction.jpg")',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
              {t('messages.heroTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              {t('messages.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/profile"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <FiArrowLeft className="text-lg" />
            {t('messages.backToProfile')}
          </Link>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 md:flex-1">
              <div className="flex w-full items-stretch rounded-xl h-12 bg-gray-50 border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <div className="text-gray-400 flex items-center justify-center pl-4">
                  <FiSearch className="text-lg" />
                </div>
                <input 
                  className="w-full border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-500 px-4 text-sm font-medium"
                  placeholder={t('messages.searchPlaceholder')}
                  value={debouncedSearchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  disabled={messagesLoading}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <div className="flex w-full items-stretch rounded-xl h-12 bg-gray-50 border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <div className="text-gray-400 flex items-center justify-center pl-4">
                  <FiFilter className="text-lg" />
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="w-full border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 px-4 text-sm font-medium"
                  disabled={messagesLoading}
                >
                  <option value="all">{t('messages.filterAllStatus')}</option>
                  <option value="pending">{t('messages.statusPending')}</option>
                  <option value="received">{t('messages.statusReceived')}</option>
                  <option value="responded">{t('messages.statusResponded')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {messages.length === 0 && !messagesLoading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              {getStatusEmptyMessage(statusFilter, !!debouncedSearchTerm).icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {getStatusEmptyMessage(statusFilter, !!debouncedSearchTerm).title}
            </h3>
            <p className="text-gray-600 mb-6">
              {getStatusEmptyMessage(statusFilter, !!debouncedSearchTerm).message}
            </p>
            {statusFilter === 'all' && !debouncedSearchTerm && (
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <FiMessageSquare className="text-lg" />
                {t('messages.sendAMessage')}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {messages.map((message) => (
              <div key={message.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden w-full cursor-pointer" onClick={() => handleMessageClick(message)}>
                <div className="p-4 h-full flex flex-col">
                  {/* Header with fixed height */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <FiMail className="text-white text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                        {message.subject}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Status and date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FiCalendar className="text-gray-400" />
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(message.status)}`}>
                      {getStatusText(message.status)}
                    </span>
                  </div>

                  {/* Message preview with fixed height */}
                  <div className="mb-3 flex-1">
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {message.message.substring(0, 80)}...
                    </p>
                    {message.message.length > 80 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessageClick(message);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {t('common.seeMore')}
                      </button>
                    )}
                  </div>

                  {/* Response section */}
                  {message.response ? (
                    <div className="mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-800 font-medium mb-1">{t('messages.universityResponseLabel')}</p>
                      <p className="text-xs text-green-700 line-clamp-2">
                        {message.response.substring(0, 80)}...
                      </p>
                      {message.response.length > 80 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessageClick(message);
                          }}
                          className="text-xs text-green-600 hover:text-green-800 hover:underline font-medium"
                        >
                          {t('common.seeMore')}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 font-medium mb-1">{t('messages.universityResponseLabel')}</p>
                      <p className="text-xs text-gray-400 italic">
                        {message.status === 'received'
                          ? t('messages.responseReceivedPlaceholder')
                          : t('messages.responsePendingPlaceholder')
                        }
                      </p>
                    </div>
                  )}

                  {/* Actions section with fixed positioning */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/message/${message.id}`}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiExternalLink className="text-sm" />
                        {t('messages.viewComplete')}
                      </Link>
                      <Link
                        to="/contact"
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t('messages.sendNewMessage')}
                      </Link>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(message.id, message.subject);
                      }}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('messages.deleteMessageTitle')}
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-5 mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  {t('messages.showingPrefix')} <span className="font-bold text-gray-900 text-lg">{pagination.total}</span> {t('messages.showingSuffix')}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-black font-medium">{t('messages.showLabel')}</span>
                  <select 
                    value={recordsPerPage}
                    onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={999999}>{t('messages.recordsAll')}</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-50 transition-all duration-300 hover:scale-105"
                  disabled={pagination.current_page === 1 || messagesLoading}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  <FiChevronLeft className="text-xl" />
                </button>
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={messagesLoading}
                    className={`flex h-10 px-5 items-center justify-center rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 ${
                      page === pagination.current_page
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-50 transition-all duration-300 hover:scale-105"
                  disabled={pagination.current_page === pagination.last_page || messagesLoading}
                  onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                >
                  <FiChevronRight className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message Detail Modal */}
        {showMessageDetail && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{t('messages.modalDetailsTitle')}</h3>
                  <button
                    onClick={closeMessageDetail}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('messages.subjectLabel')}</h4>
                  <p className="text-gray-700">{selectedMessage.subject}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('messages.messageLabel')}</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('messages.statusLabel')}</h4>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                    {getStatusText(selectedMessage.status)}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('messages.dateLabel')}</h4>
                  <p className="text-gray-700">
                    {new Date(selectedMessage.created_at).toLocaleDateString()} {t('messages.dateTimeSeparator')} {new Date(selectedMessage.created_at).toLocaleTimeString()}
                  </p>
                </div>

                {selectedMessage.response && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-lg font-semibold text-green-800 mb-2">{t('messages.universityResponseHeading')}</h4>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.response}</p>
                    </div>
                    <div className="text-xs text-green-600 mt-2">
                      {t('messages.respondedOnLabel')} {selectedMessage.responded_at ? new Date(selectedMessage.responded_at).toLocaleDateString() : t('messages.notYetResponded')}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={closeMessageDetail}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    {t('common.close')}
                  </button>
                  <Link
                    to={`/message/${selectedMessage.id}`}
                    onClick={closeMessageDetail}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <FiExternalLink className="text-sm" />
                    {t('messages.viewComplete')}
                  </Link>
                  <Link
                    to="/contact"
                    onClick={closeMessageDetail}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    {t('messages.sendNewMessage')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MessagesPage;
