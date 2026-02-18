import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiMail, FiCalendar, FiArrowLeft, FiSend, FiUser, FiMessageSquare, FiX, FiClock, FiCheckCircle, FiAlertCircle, FiPaperclip, FiSmile, FiThumbsUp } from 'react-icons/fi';
import Swal from 'sweetalert2';
import messageService from '../services/messageService';
import { AuthContext } from '../contexts/AuthContext';

const MessageConversationPage = () => {
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
      const response = await messageService.getUserMessages(1, 100);
      const foundMessage = response.data.messages.find(msg => msg.id === parseInt(id));
      
      if (foundMessage) {
        setMessage(foundMessage);
        
        // Only show replies if there's an actual university response
        if (foundMessage.response) {
          setReplies([
            {
              id: 1,
              message_id: foundMessage.id,
              sender: 'university',
              content: foundMessage.response,
              created_at: foundMessage.responded_at || foundMessage.created_at,
              parent_id: null,
              replies: []
            }
          ]);
        } else {
          setReplies([]);
        }
      } else {
        throw new Error('Message not found');
      }
    } catch (error) {
      console.error('Failed to fetch message details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load message details.',
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
        title: 'Validation Error',
        text: 'Please enter your reply.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    try {
      setSendingReply(true);
      
      // In a real implementation, this would save to database with parent_id
      const newReplyData = {
        id: Date.now(),
        message_id: message.id,
        sender: 'user',
        content: newReply,
        created_at: new Date().toISOString(),
        parent_id: replyingTo?.id || null,
        replies: []
      };

      // Add reply to the appropriate parent
      if (replyingTo) {
        // Add as nested reply
        const addToParent = (replies, targetId, newReply) => {
          return replies.map(reply => {
            if (reply.id === targetId) {
              return {
                ...reply,
                replies: [...reply.replies, newReply]
              };
            } else if (reply.replies && reply.replies.length > 0) {
              return {
                ...reply,
                replies: addToParent(reply.replies, targetId, newReply)
              };
            }
            return reply;
          });
        };
        
        setReplies(prevReplies => addToParent(prevReplies, replyingTo.id, newReplyData));
      } else {
        // Add as top-level reply
        setReplies([...replies, newReplyData]);
      }

      setNewReply('');
      setReplyingTo(null);

      Swal.fire({
        icon: 'success',
        title: 'Reply Sent!',
        text: 'Your reply has been sent successfully.',
        timer: 2000,
        timerProgressBar: true
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send reply. Please try again.',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setSendingReply(false);
    }
  };

  const handleReplyTo = (reply) => {
    setReplyingTo(reply);
    setNewReply('');
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
    
    // University profile image - using a simple SVG icon as fallback for now
    // You can replace this with an actual university logo path
    const universityProfileImage = null; // Set to actual path when available
    
    return (
      <div className={`flex items-start gap-4 ${depth > 0 ? 'ml-8' : ''}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
          reply.sender === 'user' 
            ? 'border-2 border-gray-300 bg-gray-100' 
            : 'border-2 border-green-600 bg-green-50'
        }`}>
          {reply.sender === 'user' ? (
            <>
              {/* Check for actual uploaded profile image first */}
              {user?.profile_image ? (
                <img 
                  src={user.profile_image} 
                  alt="User Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If profile image fails, try UI avatar
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&size=200`;
                  }}
                />
              ) : (
                // Fallback to UI avatar if no profile image
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&size=200`}
                  alt="User Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              )}
              <div className="w-full h-full flex items-center justify-center" style={{display: 'none'}}>
                <FiUser className="text-gray-400 text-lg" />
              </div>
            </>
          ) : (
            // University profile - use icon with university styling
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
              <div className="text-green-700 font-bold text-xs flex flex-col items-center">
                <div className="text-lg mb-1">🏛️</div>
                <div className="text-xs leading-tight text-center">KPU</div>
              </div>
            </div>
          )}
        </div>
        <div className={`flex-1 max-w-2xl ${reply.sender === 'user' ? 'flex-row-reverse' : ''}`}>
          <div className={`inline-block px-4 py-3 rounded-2xl ${
            reply.sender === 'user'
              ? 'bg-gray-100 border-gray-300 text-black'
              : 'bg-green-50 border-green-200 text-green-800'
          } shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold">
                {reply.sender === 'user' ? 'You' : 'University'}
              </p>
              <span className="text-xs text-gray-600">
                {new Date(reply.created_at).toLocaleDateString()} at {new Date(reply.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
            
            {/* Reply button */}
            {reply.sender === 'university' && (
              <div className="flex items-end">
                <button
                  onClick={() => onReplyTo(reply)}
                  className={`text-xs px-1 py-0.5 rounded transition-all duration-200 ${
                    isReplying 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-white hover:bg-blue-600'
                  }`}
                >
                  {isReplying ? 'Cancel' : 'Reply'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ConversationThread = ({ replies, onReplyTo, replyingTo, depth = 0 }) => {
    return (
      <>
        {replies.map((reply) => (
          <div key={reply.id}>
            <ReplyItem 
              reply={reply} 
              depth={depth}
              onReplyTo={onReplyTo}
              replyingTo={replyingTo}
            />
            {reply.replies && reply.replies.length > 0 && (
              <ConversationThread 
                replies={reply.replies}
                onReplyTo={onReplyTo}
                replyingTo={replyingTo}
                depth={depth + 1}
              />
            )}
          </div>
        ))}
      </>
    );
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'received': return 'Received';
      case 'responded': return 'Responded';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Layout>
        {/* Hero Section Skeleton */}
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

        {/* Main Content Skeleton */}
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
                Message Not Found
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                The message you're looking for could not be found.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Not Found</h3>
            <p className="text-gray-600 mb-8 text-lg">The message you're looking for could not be found.</p>
            <Link 
              to="/messages"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FiArrowLeft className="text-xl" />
              Back to Messages
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
              Message Conversation
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              View your complete conversation with the university
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
            Back to Messages
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
                        {new Date(message.created_at).toLocaleDateString()} at {new Date(message.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-100">
                      <>
                      {/* Check for actual uploaded profile image first */}
                      {user?.profile_image ? (
                        <img 
                          src={user.profile_image} 
                          alt="User Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If profile image fails, try UI avatar
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&size=200`;
                          }}
                        />
                      ) : (
                        // Fallback to UI avatar if no profile image
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&size=200`}
                          alt="User Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      )}
                      <div className="w-full h-full flex items-center justify-center" style={{display: 'none'}}>
                        <FiUser className="text-gray-400 text-xl" />
                      </div>
                    </>
                    </div>
                    <div className="flex-1">
                      <p className="text-black font-medium mb-2">Your Message:</p>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-black whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversation Thread - Always show */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-black flex items-center gap-2">
                    <FiMessageSquare className="text-black" />
                    Conversation Thread
                  </h4>
                  <span className="text-sm text-gray-600">
                    {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                  </span>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  <ConversationThread 
                    replies={replies}
                    onReplyTo={handleReplyTo}
                    replyingTo={replyingTo}
                    depth={0}
                  />
                </div>

                {/* Reply Input - Always show */}
                <div className="border-t border-gray-200 p-3">
                  {replyingTo && (
                    <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200">
                      <p className="text-xs text-black mb-1">
                        Replying to <span className="font-semibold">{replyingTo.sender === 'user' ? 'your message' : "university's message"}</span>:
                      </p>
                      <p className="text-xs text-gray-600 italic">
                        "{replyingTo.content.substring(0, 100)}..."
                      </p>
                      <button
                        onClick={cancelReply}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder={replyingTo ? `Reply to ${replyingTo.sender === 'user' ? 'your message' : "university's message"}...` : "Type your reply here..."}
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
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend />
                          Reply
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
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-black">Status:</span>
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
                  <span className="text-sm text-black">Replies:</span>
                  <span className="text-sm font-semibold text-black">{replies.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-black">Date:</span>
                  <span className="text-sm font-semibold text-black">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <FiMail className="text-black" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/contact"
                  className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
                >
                  <FiMail />
                  Send New Message
                </Link>
                <Link
                  to="/messages"
                  className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
                >
                  <FiArrowLeft />
                  Back to Messages
                </Link>
              </div>
            </div>

            {/* University Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <FiMessageSquare className="text-black" />
                University Info
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-black font-medium">
                    <span className="text-green-600 font-bold">Response Time:</span> Usually within 24-48 hours
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-black font-medium">
                    <span className="text-black font-bold">Contact Hours:</span> Mon-Fri, 9AM-5PM
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-black font-medium">
                    <span className="text-black font-bold">Email:</span> it.director@kpu.edu.af
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
