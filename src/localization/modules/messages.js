// Localization module for the Messages feature.
// Covers: src/pages/MessagesPage.jsx and src/pages/MessageConversationPage.jsx
// Shape: { en: { messages: {...} }, da: { messages: {...} }, ps: { messages: {...} } }

const messages = {
  en: {
    messages: {
      // MessagesPage - hero & navigation
      heroTitle: "My Messages",
      heroSubtitle: "Track your messages and university responses",
      backToProfile: "Back to Profile",

      // Search & filter
      searchPlaceholder: "Search messages...",
      filterAllStatus: "All Status",

      // Status labels
      statusPending: "Pending",
      statusReceived: "Received",
      statusResponded: "Responded",
      statusUnknown: "Unknown",

      // Empty states
      emptySearchTitle: "No Messages Found",
      emptySearchMessage: "No messages found related to your search \"{{scope}}\". Try different keywords or filters.",
      searchScopeAll: "all messages",
      searchScopeStatus: "{{status}} messages",
      emptyPendingTitle: "No Pending Messages",
      emptyPendingMessage: "You don't have any pending messages. All your messages have been received or responded to.",
      emptyReceivedTitle: "No Received Messages",
      emptyReceivedMessage: "You don't have any received messages. Your messages are either pending or have been responded to.",
      emptyRespondedTitle: "No Responded Messages",
      emptyRespondedMessage: "You don't have any responded messages yet. The university hasn't responded to any of your messages.",
      emptyDefaultTitle: "No Messages Yet",
      emptyDefaultMessage: "You haven't sent any messages yet. Send us a message and we'll respond to you soon!",
      sendAMessage: "Send a Message",

      // Message card
      universityResponseLabel: "University Response:",
      responseReceivedPlaceholder: "We received your message and we will respond you as soon as possible.",
      responsePendingPlaceholder: "Response will appear here once the university responds to your message.",
      viewComplete: "View Complete",
      sendNewMessage: "Send New Message",
      deleteMessageTitle: "Delete message",

      // Delete dialog
      deleteConfirmTitle: "Delete Message?",
      deleteConfirmHtml: "Are you sure you want to delete your message \"<strong>{{subject}}</strong>\"?",
      deleteConfirmButton: "Yes, delete it",
      deletedTitle: "Message Deleted",
      deletedText: "Your message has been deleted successfully.",
      errorTitle: "Error",
      deleteErrorText: "Failed to delete message. Please try again.",

      // Pagination
      showingPrefix: "Showing",
      showingSuffix: "messages",
      showLabel: "Show:",
      recordsAll: "All",

      // Detail modal
      modalDetailsTitle: "Message Details",
      subjectLabel: "Subject",
      messageLabel: "Message",
      statusLabel: "Status",
      dateLabel: "Date",
      dateTimeSeparator: "at",
      universityResponseHeading: "University Response",
      respondedOnLabel: "Responded on:",
      notYetResponded: "Not yet responded",

      // MessageConversationPage - hero & not found
      conversationTitle: "Message Conversation",
      conversationSubtitle: "View your complete conversation with the university",
      notFoundTitle: "Message Not Found",
      notFoundSubtitle: "The message you're looking for could not be found.",
      backToMessages: "Back to Messages",

      // Conversation main
      yourMessageLabel: "Your Message:",
      conversationThread: "Conversation Thread",
      replySingular: "reply",
      replyPlural: "replies",
      noRepliesYet: "No replies yet. The university will respond soon.",

      // Reply identities
      you: "You",
      universityName: "University",
      userProfileAlt: "User Profile",
      reply: "Reply",
      sending: "Sending...",

      // Reply input
      replyingToPrefix: "Replying to",
      replyingToSuffix: ":",
      yourMessageTarget: "your message",
      universityMessageTarget: "university's message",
      replyToPlaceholder: "Reply to {{target}}...",
      typeReplyPlaceholder: "Type your reply here...",

      // Conversation dialogs
      loadErrorText: "Failed to load message details.",
      validationErrorTitle: "Validation Error",
      enterReplyText: "Please enter your reply.",
      replySentTitle: "Reply Sent!",
      replySentText: "Your reply has been sent successfully.",
      sendReplyErrorText: "Failed to send reply. Please try again.",

      // Sidebar
      quickStats: "Quick Stats",
      statusColon: "Status:",
      repliesColon: "Replies:",
      dateColon: "Date:",
      quickActions: "Quick Actions",
      universityInfo: "University Info",
      responseTimeLabel: "Response Time:",
      responseTimeValue: "Usually within 24-48 hours",
      contactHoursLabel: "Contact Hours:",
      contactHoursValue: "Mon-Fri, 9AM-5PM",
      emailLabel: "Email:",
    },
  },

  da: {
    messages: {
      heroTitle: "پیام‌های من",
      heroSubtitle: "پیام‌ها و پاسخ‌های پوهنتون خود را پیگیری کنید",
      backToProfile: "بازگشت به پروفایل",

      searchPlaceholder: "جستجوی پیام‌ها...",
      filterAllStatus: "همه وضعیت‌ها",

      statusPending: "در حال انتظار",
      statusReceived: "دریافت‌شده",
      statusResponded: "پاسخ‌داده‌شده",
      statusUnknown: "نامعلوم",

      emptySearchTitle: "هیچ پیامی یافت نشد",
      emptySearchMessage: "هیچ پیامی مرتبط با جستجوی شما «{{scope}}» یافت نشد. کلمات کلیدی یا فلترهای دیگری را امتحان کنید.",
      searchScopeAll: "همه پیام‌ها",
      searchScopeStatus: "پیام‌های {{status}}",
      emptyPendingTitle: "هیچ پیام در حال انتظاری نیست",
      emptyPendingMessage: "شما هیچ پیام در حال انتظاری ندارید. همه پیام‌های شما دریافت یا پاسخ داده شده‌اند.",
      emptyReceivedTitle: "هیچ پیام دریافت‌شده‌ای نیست",
      emptyReceivedMessage: "شما هیچ پیام دریافت‌شده‌ای ندارید. پیام‌های شما یا در حال انتظار اند یا پاسخ داده شده‌اند.",
      emptyRespondedTitle: "هیچ پیام پاسخ‌داده‌شده‌ای نیست",
      emptyRespondedMessage: "شما هنوز هیچ پیام پاسخ‌داده‌شده‌ای ندارید. پوهنتون به هیچ‌یک از پیام‌های شما پاسخ نداده است.",
      emptyDefaultTitle: "هنوز هیچ پیامی نیست",
      emptyDefaultMessage: "شما هنوز هیچ پیامی نفرستاده‌اید. برای ما پیام بفرستید تا هرچه زودتر به شما پاسخ دهیم!",
      sendAMessage: "ارسال پیام",

      universityResponseLabel: "پاسخ پوهنتون:",
      responseReceivedPlaceholder: "ما پیام شما را دریافت کردیم و هرچه زودتر به شما پاسخ خواهیم داد.",
      responsePendingPlaceholder: "به محض اینکه پوهنتون به پیام شما پاسخ دهد، پاسخ در اینجا نمایش داده می‌شود.",
      viewComplete: "مشاهده کامل",
      sendNewMessage: "ارسال پیام جدید",
      deleteMessageTitle: "حذف پیام",

      deleteConfirmTitle: "پیام حذف شود؟",
      deleteConfirmHtml: "آیا مطمئن هستید که می‌خواهید پیام خود «<strong>{{subject}}</strong>» را حذف کنید؟",
      deleteConfirmButton: "بله، حذف شود",
      deletedTitle: "پیام حذف شد",
      deletedText: "پیام شما با موفقیت حذف شد.",
      errorTitle: "خطا",
      deleteErrorText: "حذف پیام ناکام شد. لطفاً دوباره تلاش کنید.",

      showingPrefix: "نمایش",
      showingSuffix: "پیام",
      showLabel: "نمایش:",
      recordsAll: "همه",

      modalDetailsTitle: "جزئیات پیام",
      subjectLabel: "موضوع",
      messageLabel: "پیام",
      statusLabel: "وضعیت",
      dateLabel: "تاریخ",
      dateTimeSeparator: "ساعت",
      universityResponseHeading: "پاسخ پوهنتون",
      respondedOnLabel: "پاسخ داده شده در:",
      notYetResponded: "هنوز پاسخ داده نشده",

      conversationTitle: "گفتگوی پیام",
      conversationSubtitle: "گفتگوی کامل خود را با پوهنتون مشاهده کنید",
      notFoundTitle: "پیام یافت نشد",
      notFoundSubtitle: "پیامی که به دنبال آن هستید یافت نشد.",
      backToMessages: "بازگشت به پیام‌ها",

      yourMessageLabel: "پیام شما:",
      conversationThread: "رشته گفتگو",
      replySingular: "پاسخ",
      replyPlural: "پاسخ",
      noRepliesYet: "هنوز پاسخی نیست. پوهنتون به‌زودی پاسخ خواهد داد.",

      you: "شما",
      universityName: "پوهنتون",
      userProfileAlt: "پروفایل کاربر",
      reply: "پاسخ",
      sending: "در حال ارسال...",

      replyingToPrefix: "در پاسخ به",
      replyingToSuffix: ":",
      yourMessageTarget: "پیام شما",
      universityMessageTarget: "پیام پوهنتون",
      replyToPlaceholder: "پاسخ به {{target}}...",
      typeReplyPlaceholder: "پاسخ خود را اینجا بنویسید...",

      loadErrorText: "بارگیری جزئیات پیام ناکام شد.",
      validationErrorTitle: "خطای اعتبارسنجی",
      enterReplyText: "لطفاً پاسخ خود را وارد کنید.",
      replySentTitle: "پاسخ ارسال شد!",
      replySentText: "پاسخ شما با موفقیت ارسال شد.",
      sendReplyErrorText: "ارسال پاسخ ناکام شد. لطفاً دوباره تلاش کنید.",

      quickStats: "آمار سریع",
      statusColon: "وضعیت:",
      repliesColon: "پاسخ‌ها:",
      dateColon: "تاریخ:",
      quickActions: "اقدامات سریع",
      universityInfo: "معلومات پوهنتون",
      responseTimeLabel: "زمان پاسخ‌دهی:",
      responseTimeValue: "معمولاً در ظرف ۲۴ تا ۴۸ ساعت",
      contactHoursLabel: "ساعات تماس:",
      contactHoursValue: "شنبه تا پنجشنبه، ۹ صبح تا ۵ عصر",
      emailLabel: "ایمیل:",
    },
  },

  ps: {
    messages: {
      heroTitle: "زما پیغامونه",
      heroSubtitle: "خپل پیغامونه او د پوهنتون ځوابونه تعقیب کړئ",
      backToProfile: "بیرته پروفایل ته",

      searchPlaceholder: "د پیغامونو لټون...",
      filterAllStatus: "ټولې حالتونه",

      statusPending: "په انتظار کې",
      statusReceived: "ترلاسه‌شوی",
      statusResponded: "ځواب‌شوی",
      statusUnknown: "نامعلوم",

      emptySearchTitle: "هیڅ پیغام و نه موندل شو",
      emptySearchMessage: "ستاسو د لټون «{{scope}}» پورې اړوند هیڅ پیغام و نه موندل شو. نورې کلیدي کلمې یا فلټرونه وآزمویئ.",
      searchScopeAll: "ټول پیغامونه",
      searchScopeStatus: "د {{status}} پیغامونه",
      emptyPendingTitle: "هیڅ په انتظار پیغام نشته",
      emptyPendingMessage: "تاسو هیڅ په انتظار پیغام نه لرئ. ستاسو ټول پیغامونه یا ترلاسه شوي یا ځواب شوي دي.",
      emptyReceivedTitle: "هیڅ ترلاسه‌شوی پیغام نشته",
      emptyReceivedMessage: "تاسو هیڅ ترلاسه‌شوی پیغام نه لرئ. ستاسو پیغامونه یا په انتظار کې دي یا ځواب شوي دي.",
      emptyRespondedTitle: "هیڅ ځواب‌شوی پیغام نشته",
      emptyRespondedMessage: "تاسو لا تر اوسه هیڅ ځواب‌شوی پیغام نه لرئ. پوهنتون ستاسو هیڅ یوه پیغام ته ځواب نه دی ورکړی.",
      emptyDefaultTitle: "لا تر اوسه هیڅ پیغام نشته",
      emptyDefaultMessage: "تاسو لا تر اوسه هیڅ پیغام نه دی لیږلی. موږ ته پیغام ولیږئ تر څو ژر تر ژره تاسو ته ځواب درکړو!",
      sendAMessage: "پیغام ولیږئ",

      universityResponseLabel: "د پوهنتون ځواب:",
      responseReceivedPlaceholder: "موږ ستاسو پیغام ترلاسه کړ او ژر تر ژره به تاسو ته ځواب درکړو.",
      responsePendingPlaceholder: "کله چې پوهنتون ستاسو پیغام ته ځواب ورکړي، ځواب به دلته ښکاره شي.",
      viewComplete: "بشپړ وګورئ",
      sendNewMessage: "نوی پیغام ولیږئ",
      deleteMessageTitle: "پیغام ړنګ کړئ",

      deleteConfirmTitle: "پیغام ړنګ شي؟",
      deleteConfirmHtml: "ایا تاسو ډاډه یاست چې غواړئ خپل پیغام «<strong>{{subject}}</strong>» ړنګ کړئ؟",
      deleteConfirmButton: "هو، ړنګ یې کړئ",
      deletedTitle: "پیغام ړنګ شو",
      deletedText: "ستاسو پیغام په بریالیتوب سره ړنګ شو.",
      errorTitle: "تېروتنه",
      deleteErrorText: "د پیغام ړنګول ناکام شو. مهرباني وکړئ بیا هڅه وکړئ.",

      showingPrefix: "ښودنه",
      showingSuffix: "پیغامونه",
      showLabel: "ښودنه:",
      recordsAll: "ټول",

      modalDetailsTitle: "د پیغام جزئیات",
      subjectLabel: "موضوع",
      messageLabel: "پیغام",
      statusLabel: "حالت",
      dateLabel: "نېټه",
      dateTimeSeparator: "ساعت",
      universityResponseHeading: "د پوهنتون ځواب",
      respondedOnLabel: "ځواب ورکړل شو پر:",
      notYetResponded: "لا تر اوسه ځواب نه دی شوی",

      conversationTitle: "د پیغام خبرې اترې",
      conversationSubtitle: "د پوهنتون سره خپلې بشپړې خبرې اترې وګورئ",
      notFoundTitle: "پیغام و نه موندل شو",
      notFoundSubtitle: "هغه پیغام چې تاسو یې لټوئ و نه موندل شو.",
      backToMessages: "بیرته پیغامونو ته",

      yourMessageLabel: "ستاسو پیغام:",
      conversationThread: "د خبرو اترو لړۍ",
      replySingular: "ځواب",
      replyPlural: "ځوابونه",
      noRepliesYet: "لا تر اوسه هیڅ ځواب نشته. پوهنتون به ژر ځواب ورکړي.",

      you: "تاسو",
      universityName: "پوهنتون",
      userProfileAlt: "د کاروونکي پروفایل",
      reply: "ځواب",
      sending: "په لیږلو کې...",

      replyingToPrefix: "په ځواب کې",
      replyingToSuffix: ":",
      yourMessageTarget: "ستاسو پیغام",
      universityMessageTarget: "د پوهنتون پیغام",
      replyToPlaceholder: "{{target}} ته ځواب...",
      typeReplyPlaceholder: "خپل ځواب دلته ولیکئ...",

      loadErrorText: "د پیغام د جزئیاتو بارول ناکام شو.",
      validationErrorTitle: "د اعتبار تېروتنه",
      enterReplyText: "مهرباني وکړئ خپل ځواب دننه کړئ.",
      replySentTitle: "ځواب ولیږل شو!",
      replySentText: "ستاسو ځواب په بریالیتوب سره ولیږل شو.",
      sendReplyErrorText: "د ځواب لیږل ناکام شو. مهرباني وکړئ بیا هڅه وکړئ.",

      quickStats: "چټک احصایې",
      statusColon: "حالت:",
      repliesColon: "ځوابونه:",
      dateColon: "نېټه:",
      quickActions: "چټک اقدامات",
      universityInfo: "د پوهنتون معلومات",
      responseTimeLabel: "د ځواب وخت:",
      responseTimeValue: "معمولاً د ۲۴ تر ۴۸ ساعتونو په جریان کې",
      contactHoursLabel: "د اړیکې ساعتونه:",
      contactHoursValue: "شنبه تر پنجشنبې، ۹ سهار تر ۵ ماښام",
      emailLabel: "بریښنالیک:",
    },
  },
};

export default messages;
