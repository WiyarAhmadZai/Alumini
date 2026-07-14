import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../utils/date';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiMail, FiCalendar, FiArrowLeft, FiSend, FiUser, FiMessageSquare, FiX, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';
import messageService from '../services/messageService';
import { AuthContext } from '../contexts/AuthContext';

const MessageConversationPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchMessageDetails();
  }, [id]);

  const fetchMessageDetails = async () => {
    try {
      setLoading(true);
      // Try to get the message with replies from the show endpoint
      let foundMessage = null;
      let fetchedReplies = [];

      try {
        const response = await messageService.getMessage(id);
        foundMessage = response.data.message;
        fetchedReplies = foundMessage.top_level_replies || [];
      } catch {
        // Fallback: search from list
        const response = await messageService.getUserMessages(1, 100);
        foundMessage = response.data.messages.find(msg => msg.id === parseInt(id));
      }

      if (foundMessage) {
        setMessage(foundMessage);

        // If we got real replies from DB, use them
        if (fetchedReplies.length > 0) {
          setReplies(fetchedReplies);
        } else if (foundMessage.response && (!foundMessage.replies || foundMessage.replies.length === 0)) {
          // Legacy: show old response field as a reply if no real replies exist
          setReplies([
            {
              id: 'legacy-response',
              alumni_message_id: foundMessage.id,
              sender_type: 'admin',
              sender_id: null,
              content: foundMessage.response,
              created_at: foundMessage.responded_at || foundMessage.created_at,
              parent_id: null,
              all_children: [],
              sender_name: t('messages.universityName'),
              sender_image: null,
            }
          ]);
        } else {
          setReplies(foundMessage.replies || []);
        }
      } else {
        throw new Error('Message not found');
      }
    } catch (error) {
      console.error('Failed to fetch message details:', error);
      Swal.fire({
        icon: 'error',
        title: t('messages.errorTitle'),
        text: t('messages.loadErrorText'),
        confirmButtonColor: '#dc2626'
      });
      navigate('/messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!newReply.trim()) {
      Swal.fire({
        icon: 'warning',
        title: t('messages.validationErrorTitle'),
        text: t('messages.enterReplyText'),
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    try {
      setSendingReply(true);
      const parentId = replyingTo?.id && replyingTo.id !== 'legacy-response' ? replyingTo.id : null;
      await messageService.replyToMessage(message.id, newReply, parentId);

      setNewReply('');
      setReplyingTo(null);

      // Refresh replies from DB
      await fetchMessageDetails();

      Swal.fire({
        icon: 'success',
        title: t('messages.replySentTitle'),
        text: t('messages.replySentText'),
        timer: 2000,
        timerProgressBar: true
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('messages.errorTitle'),
        text: t('messages.sendReplyErrorText'),
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setSendingReply(false);
    }
  };

  const handleReplyTo = (reply) => {
    if (replyingTo?.id === reply.id) {
      setReplyingTo(null);
      setNewReply('');
    } else {
      setReplyingTo(reply);
      setNewReply('');
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewReply('');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'received': return 'bg-blue-100 text-blue-700';
      case 'responded': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Nested reply component
  const ReplyItem = ({ reply, depth = 0, onReplyTo, replyingTo }) => {
    const isReplying = replyingTo?.id === reply.id;
    const isAlumni = reply.sender_type === 'alumni';
    const senderName = reply.sender_name || (isAlumni ? t('messages.you') : t('messages.universityName'));
    const senderImage = reply.sender_image;
    const children = reply.all_children || reply.children || [];

    return (
      <div className={`${depth > 0 ? 'ml-8' : ''}`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
            isAlumni
              ? 'border-2 border-gray-300 bg-gray-100'
              : 'border-2 border-green-600 bg-green-50'
          }`}>
            {isAlumni ? (
              <>
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={t('messages.userProfileAlt')}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&size=200`;
                    }}
                  />
                ) : (
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&size=200`}
                    alt={t('messages.userProfileAlt')}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                <div className="text-green-700 font-bold text-xs flex flex-col items-center">
                  <div className="text-lg mb-1">🏛️</div>
                  <div className="text-xs leading-tight text-center">KPU</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 max-w-2xl">
            <div className={`inline-block px-4 py-3 rounded-2xl ${
              isAlumni
                ? 'bg-gray-100 border-gray-300 text-black'
                : 'bg-green-50 border-green-200 text-green-800'
            } shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold">
                  {isAlumni ? t('messages.you') : senderName}
                </p>
                <span className="text-xs text-gray-600 ml-4">
                  {formatDate(reply.created_at)}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{reply.content}</p>

              <div className="flex items-end mt-1">
                <button
                  onClick={() => onReplyTo(reply)}
                  className={`text-xs px-1 py-0.5 rounded transition-all duration-200 ${
                    isReplying
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-white hover:bg-blue-600'
                  }`}
                >
                  {isReplying ? t('common.cancel') : t('messages.reply')}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Render nested children */}
        {children.length > 0 && (
          <div className="mt-2">
            {children.map((child) => (
              <ReplyItem
                key={child.id}
                reply={child}
                depth={depth + 1}
                onReplyTo={onReplyTo}
                replyingTo={replyingTo}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return t('messages.statusPending');
      case 'received': return t('messages.statusReceived');
      case 'responded': return t('messages.statusResponded');
      default: return t('messages.statusUnknown');
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="relative w-full h-80 overflow-hidden">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!message) {
    return (
      <Layout>
        <section className="relative w-full h-80 overflow-hidden">
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
                {t('messages.notFoundTitle')}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                {t('messages.notFoundSubtitle')}
              </p>
            </div>
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('messages.notFoundTitle')}</h3>
            <p className="text-gray-600 mb-8 text-lg">{t('messages.notFoundSubtitle')}</p>
            <Link
              to="/messages"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FiArrowLeft className="text-xl" />
              {t('messages.backToMessages')}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full h-80 overflow-hidden">
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
              {t('messages.conversationTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              {t('messages.conversationSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/messages"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/20 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
          >
            <FiArrowLeft className="text-xl" />
            {t('messages.backToMessages')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Conversation Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Message Header */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">{message.subject}</h3>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                        message.status === 'pending'
                          ? 'bg-yellow-400 text-yellow-900'
                          : message.status === 'received'
                          ? 'bg-orange-400 text-orange-900'
                          : message.status === 'responded'
                          ? 'bg-green-400 text-green-900'
                          : 'bg-gray-400 text-gray-900'
                      }`}>
                        {getStatusText(message.status)}
                      </span>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FiClock className="text-lg" />
                        {formatDate(message.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-100">
                      {user?.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt={t('messages.userProfileAlt')}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&size=200`;
                          }}
                        />
                      ) : (
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&size=200`}
                          alt={t('messages.userProfileAlt')}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-black font-medium mb-2">{t('messages.yourMessageLabel')}</p>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-black whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversation Thread */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-black flex items-center gap-2">
                    <FiMessageSquare className="text-black" />
                    {t('messages.conversationThread')}
                  </h4>
                  <span className="text-sm text-gray-600">
                    {replies.length} {replies.length === 1 ? t('messages.replySingular') : t('messages.replyPlural')}
                  </span>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {replies.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FiMessageSquare className="mx-auto text-3xl mb-2 text-gray-300" />
                      <p className="text-sm">{t('messages.noRepliesYet')}</p>
                    </div>
                  ) : (
                    replies.map((reply) => (
                      <ReplyItem
                        key={reply.id}
                        reply={reply}
                        depth={0}
                        onReplyTo={handleReplyTo}
                        replyingTo={replyingTo}
                      />
                    ))
                  )}
                </div>

                {/* Reply Input */}
                <div className="border-t border-gray-200 p-3 mt-4">
                  {replyingTo && (
                    <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200">
                      <p className="text-xs text-black mb-1">
                        {t('messages.replyingToPrefix')} <span className="font-semibold">{replyingTo.sender_type === 'alumni' ? t('messages.yourMessageTarget') : (replyingTo.sender_name || t('messages.universityMessageTarget'))}</span>{t('messages.replyingToSuffix')}
                      </p>
                      <p className="text-xs text-gray-600 italic">
                        "{(replyingTo.content || '').substring(0, 100)}{(replyingTo.content || '').length > 100 ? '...' : ''}"
                      </p>
                      <button
                        onClick={cancelReply}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && newReply.trim()) {
                            e.preventDefault();
                            handleSendReply();
                          }
                        }}
                        placeholder={replyingTo ? t('messages.replyToPlaceholder', { target: replyingTo.sender_type === 'alumni' ? t('messages.yourMessageTarget') : t('messages.universityMessageTarget') }) : t('messages.typeReplyPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 text-black text-sm"
                      />
                    </div>
                    <button
                      onClick={handleSendReply}
                      disabled={sendingReply || !newReply.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-sm hover:shadow-md whitespace-nowrap"
                    >
                      {sendingReply ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          {t('messages.sending')}
                        </>
                      ) : (
                        <>
                          <FiSend />
                          {t('messages.reply')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <FiMail className="text-black" />
                {t('messages.quickStats')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-black">{t('messages.statusColon')}</span>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                    message.status === 'pending'
                      ? 'bg-yellow-400 text-yellow-900'
                      : message.status === 'received'
                      ? 'bg-orange-400 text-orange-900'
                      : message.status === 'responded'
                      ? 'bg-green-400 text-green-900'
                      : 'bg-gray-400 text-gray-900'
                  }`}>
                    {getStatusText(message.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-black">{t('messages.repliesColon')}</span>
                  <span className="text-sm font-semibold text-black">{replies.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-black">{t('messages.dateColon')}</span>
                  <span className="text-sm font-semibold text-black">
                    {formatDate(message.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <FiMail className="text-black" />
                {t('messages.quickActions')}
              </h3>
              <div className="space-y-3">
                <Link
                  to="/contact"
                  className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
                >
                  <FiMail />
                  {t('messages.sendNewMessage')}
                </Link>
                <Link
                  to="/messages"
                  className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
                >
                  <FiArrowLeft />
                  {t('messages.backToMessages')}
                </Link>
              </div>
            </div>

            {/* University Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <FiMessageSquare className="text-black" />
                {t('messages.universityInfo')}
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-black font-medium">
                    <span className="text-green-600 font-bold">{t('messages.responseTimeLabel')}</span> {t('messages.responseTimeValue')}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-black font-medium">
                    <span className="text-black font-bold">{t('messages.contactHoursLabel')}</span> {t('messages.contactHoursValue')}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-black font-medium">
                    <span className="text-black font-bold">{t('messages.emailLabel')}</span> it.director@kpu.edu.af
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessageConversationPage;
