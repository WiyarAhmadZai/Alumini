// Shared chrome: navigation, footer, user menu, notifications, common buttons.
const common = {
  en: {
    common: {
      brand: "KPU University",
      tagline: "Excellence in Education",
      login: "Login",
      logout: "Logout",
      profile: "Profile",
      account: "Account",
      manageProfile: "Manage profile",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      search: "Search",
      submit: "Submit",
      apply: "Apply",
      back: "Back",
      viewAll: "View All",
      readMore: "Read More",
      seeMore: "See More",
      noResults: "No results found",
    },
    nav: {
      directory: "Directory",
      about: "About",
      contact: "Contact",
      career: "Career",
      mentorship: "Mentorship",
      events: "Events",
      giving: "Giving & Impact",
      home: "Home",
      dashboard: "Dashboard",
      alumniDirectory: "Alumni Directory",
      aboutKpu: "About KPU",
      contactUs: "Contact Us",
      careerOpportunities: "Career Opportunities",
      mentorshipHub: "Mentorship Hub",
      eventsCalendar: "Events Calendar",
    },
    notifications: {
      title: "Notifications",
      empty: "No notifications",
      reason: "Reason:",
      markAllRead: "Mark all as read",
      viewAll: "View all notifications",
      // Notification bodies, keyed by the `meta.title_key` / `meta.message_key`
      // the backend stores on each row. The server writes English into
      // title/message for e-mail and logs; the portal re-renders from these so
      // the bell reads in the visitor's language. Anything an administrator
      // typed (broadcasts, donation e-mails, review feedback) carries no key
      // and is shown exactly as written — see notificationText.js.
      items: {
        successStoryLive: {
          title: "Your success story is live",
          message: "Your success story is now shown on the alumni home page. Thank you for sharing!",
        },
        successStoryApproved: {
          title: "Your success story was approved",
          message: "Your success story has been approved by the admin.",
        },
        successStoryUpdate: { title: "Update on your success story" },
        eventRegistration: {
          title: "Event Registration",
          message: "You have been registered for the event: {{title}}. Date: {{date}}. Location: {{location}}.",
        },
        mentorRequest: {
          title: "New Mentorship Request",
          message: "{{name}} has requested mentorship.",
        },
        mentorRequestAccepted: {
          title: "Mentorship Accepted",
          message: "{{name}} has accepted your mentorship request. You can now contact each other.",
        },
        mentorRequestRejected: {
          title: "Mentorship Declined",
          message: "{{name}} has declined your mentorship request.",
        },
        mentorReview: {
          title: "New Review",
          message: "{{name}} has reviewed your mentorship ({{rating}}/5).",
        },
        mentorProfileCreated: {
          title: "You are now a mentor",
          message: "{{admin}} has added you as a mentor on the KPU Alumni platform. Your mentor profile is now live and alumni can request mentorship from you.",
        },
        mentorStatusVerified: {
          title: "Mentor Profile Verified",
          message: "Your mentor profile has been verified by the administrator.",
        },
        mentorStatusRejected: {
          title: "Mentor Profile Rejected",
          message: "Your mentor profile has been rejected by the administrator.",
        },
        mentorStatusPending: {
          title: "Mentor Profile Pending",
          message: "Your mentor profile has been set to pending by the administrator.",
        },
        mentorRequestAdminAccepted: {
          title: "Mentorship Request Accepted",
          message: "Your mentorship request has been accepted by the administrator.",
        },
        mentorRequestAdminRejected: {
          title: "Mentorship Request Rejected",
          message: "Your mentorship request has been rejected by the administrator.",
        },
        mentorRequestAdminPending: {
          title: "Mentorship Request Pending",
          message: "Your mentorship request has been set to pending by the administrator.",
        },
        messageReply: {
          title: "Reply to your message",
          message: 'You received a reply to your message: "{{subject}}"',
        },
        profileApproved: {
          title: "Profile Approved",
          message: "Your alumni profile has been verified and approved.",
        },
        profileRejected: {
          title: "Profile Rejected",
          message: "Your alumni profile has been rejected.",
        },
        profilePending: {
          title: "Profile Set to Pending",
          message: "Your alumni profile has been set to pending review.",
        },
      },
    },
    userMenu: {
      signedInAs: "Signed in as",
      dashboard: "Dashboard",
      myProfile: "My Profile",
      myApplications: "My Applications",
      myEvents: "Registered Events",
      myMessages: "Messages",
      mentorship: "Mentorship",
      logout: "Logout",
    },
    footer: {
      about:
        "Fostering excellence, community, and lifelong learning for all Kabul Polytechnic University graduates.",
      quickLinks: "Quick Links",
      jobBoard: "Job Board",
      mentorshipProgram: "Mentorship Program",
      campusNews: "Campus News",
      university: "University",
      faculties: "Faculties",
      researchLabs: "Research Labs",
      contactOffice: "Contact Office",
      followUs: "Follow Us",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      eventGuidelines: "Event Guidelines",
      rights:
        "© 2023 Kabul Polytechnic University Alumni Association. All Rights Reserved.",
    },
  },

  da: {
    common: {
      brand: "پوهنتون پولیتخنیک کابل",
      tagline: "تعالی در آموزش",
      login: "ورود",
      logout: "خروج",
      profile: "پروفایل",
      account: "حساب",
      manageProfile: "مدیریت پروفایل",
      loading: "در حال بارگذاری...",
      save: "ذخیره",
      cancel: "لغو",
      delete: "حذف",
      edit: "ویرایش",
      close: "بستن",
      search: "جستجو",
      submit: "ثبت",
      apply: "درخواست",
      back: "بازگشت",
      viewAll: "مشاهده همه",
      readMore: "بیشتر بخوانید",
      seeMore: "بیشتر ببینید",
      noResults: "نتیجه‌ای یافت نشد",
    },
    nav: {
      directory: "دایرکتوری",
      about: "درباره ما",
      contact: "تماس",
      career: "کاریابی",
      mentorship: "رهنمایی",
      events: "رویدادها",
      giving: "کمک و تأثیر",
      home: "خانه",
      dashboard: "داشبورد",
      alumniDirectory: "دایرکتوری فارغان",
      aboutKpu: "درباره KPU",
      contactUs: "با ما در تماس شوید",
      careerOpportunities: "فرصت‌های شغلی",
      mentorshipHub: "مرکز رهنمایی",
      eventsCalendar: "تقویم رویدادها",
    },
    notifications: {
      title: "اطلاعیه‌ها",
      empty: "اطلاعیه‌ای نیست",
      reason: "دلیل:",
      markAllRead: "همه را خوانده‌شده علامت بزن",
      viewAll: "مشاهده‌ی همه‌ی اطلاعیه‌ها",
      items: {
        successStoryLive: {
          title: "داستان موفقیت شما منتشر شد",
          message: "داستان موفقیت شما اکنون در صفحه‌ی اصلی فارغ‌التحصیلان نمایش داده می‌شود. از اشتراک‌گذاری شما سپاسگزاریم!",
        },
        successStoryApproved: {
          title: "داستان موفقیت شما تأیید شد",
          message: "داستان موفقیت شما توسط اداره تأیید شد.",
        },
        successStoryUpdate: { title: "به‌روزرسانی در مورد داستان موفقیت شما" },
        eventRegistration: {
          title: "ثبت‌نام در رویداد",
          message: "شما در رویداد {{title}} ثبت‌نام شدید. تاریخ: {{date}}. مکان: {{location}}.",
        },
        mentorRequest: {
          title: "درخواست رهنمایی جدید",
          message: "{{name}} درخواست رهنمایی کرده است.",
        },
        mentorRequestAccepted: {
          title: "رهنمایی پذیرفته شد",
          message: "{{name}} درخواست رهنمایی شما را پذیرفت. اکنون می‌توانید با یکدیگر در تماس شوید.",
        },
        mentorRequestRejected: {
          title: "رهنمایی رد شد",
          message: "{{name}} درخواست رهنمایی شما را رد کرد.",
        },
        mentorReview: {
          title: "نظر جدید",
          message: "{{name}} به رهنمایی شما نظر داد ({{rating}}/۵).",
        },
        mentorProfileCreated: {
          title: "شما اکنون رهنما هستید",
          message: "{{admin}} شما را به عنوان رهنما در پلتفرم فارغ‌التحصیلان KPU اضافه کرد. پروفایل رهنمایی شما فعال است و فارغ‌التحصیلان می‌توانند از شما درخواست رهنمایی کنند.",
        },
        mentorStatusVerified: {
          title: "پروفایل رهنما تأیید شد",
          message: "پروفایل رهنمایی شما توسط اداره تأیید شد.",
        },
        mentorStatusRejected: {
          title: "پروفایل رهنما رد شد",
          message: "پروفایل رهنمایی شما توسط اداره رد شد.",
        },
        mentorStatusPending: {
          title: "پروفایل رهنما در حال بررسی",
          message: "پروفایل رهنمایی شما توسط اداره در حالت بررسی قرار گرفت.",
        },
        mentorRequestAdminAccepted: {
          title: "درخواست رهنمایی پذیرفته شد",
          message: "درخواست رهنمایی شما توسط اداره پذیرفته شد.",
        },
        mentorRequestAdminRejected: {
          title: "درخواست رهنمایی رد شد",
          message: "درخواست رهنمایی شما توسط اداره رد شد.",
        },
        mentorRequestAdminPending: {
          title: "درخواست رهنمایی در حال بررسی",
          message: "درخواست رهنمایی شما توسط اداره در حالت بررسی قرار گرفت.",
        },
        messageReply: {
          title: "پاسخ به پیام شما",
          message: "به پیام شما پاسخ داده شد: «{{subject}}»",
        },
        profileApproved: {
          title: "پروفایل تأیید شد",
          message: "پروفایل فارغ‌التحصیلی شما تأیید و فعال شد.",
        },
        profileRejected: {
          title: "پروفایل رد شد",
          message: "پروفایل فارغ‌التحصیلی شما رد شد.",
        },
        profilePending: {
          title: "پروفایل در حال بررسی",
          message: "پروفایل فارغ‌التحصیلی شما در حالت بررسی قرار گرفت.",
        },
      },
    },
    userMenu: {
      signedInAs: "وارد شده به نام",
      dashboard: "داشبورد",
      myProfile: "پروفایل من",
      myApplications: "درخواست‌های من",
      myEvents: "رویدادهای ثبت‌شده",
      myMessages: "پیام‌ها",
      mentorship: "رهنمایی",
      logout: "خروج",
    },
    footer: {
      about:
        "تقویت تعالی، همبستگی و آموزش مادام‌العمر برای تمام فارغان پوهنتون پولیتخنیک کابل.",
      quickLinks: "لینک‌های سریع",
      jobBoard: "تابلوی کاریابی",
      mentorshipProgram: "برنامه رهنمایی",
      campusNews: "اخبار پوهنتون",
      university: "پوهنتون",
      faculties: "پوهنځی‌ها",
      researchLabs: "آزمایشگاه‌های تحقیقاتی",
      contactOffice: "دفتر تماس",
      followUs: "ما را دنبال کنید",
      privacyPolicy: "سیاست حفظ حریم خصوصی",
      termsOfService: "شرایط استفاده",
      eventGuidelines: "رهنمود رویدادها",
      rights:
        "© ۲۰۲۳ انجمن فارغان پوهنتون پولیتخنیک کابل. تمام حقوق محفوظ است.",
    },
  },

  ps: {
    common: {
      brand: "د کابل پولیټخنیک پوهنتون",
      tagline: "په زده‌کړه کې عالي توب",
      login: "ننوتل",
      logout: "وتل",
      profile: "پروفایل",
      account: "حساب",
      manageProfile: "د پروفایل سمبالول",
      loading: "بارېدل...",
      save: "ثبت",
      cancel: "لغوه",
      delete: "ړنګول",
      edit: "سمول",
      close: "بندول",
      search: "لټون",
      submit: "ثبت",
      apply: "غوښتنه",
      back: "شاته",
      viewAll: "ټول وګورئ",
      readMore: "نور ولولئ",
      seeMore: "نور وګورئ",
      noResults: "هیڅ پایله ونه موندل شوه",
    },
    nav: {
      directory: "لارښود",
      about: "زموږ په اړه",
      contact: "اړیکه",
      career: "دندې",
      mentorship: "لارښوونه",
      events: "پیښې",
      giving: "مرسته او اغېز",
      home: "کور",
      dashboard: "ډشبورډ",
      alumniDirectory: "د فارغانو لارښود",
      aboutKpu: "د KPU په اړه",
      contactUs: "زموږ سره اړیکه",
      careerOpportunities: "د دندو فرصتونه",
      mentorshipHub: "د لارښوونې مرکز",
      eventsCalendar: "د پیښو جنتري",
    },
    notifications: {
      title: "خبرتیاوې",
      empty: "هیڅ خبرتیا نشته",
      reason: "دلیل:",
      markAllRead: "ټول لوستل‌شوي وګڼئ",
      viewAll: "ټولې خبرتیاوې وګورئ",
      items: {
        successStoryLive: {
          title: "ستاسو د بریا کیسه خپره شوه",
          message: "ستاسو د بریا کیسه اوس د فارغانو په کوردیز مخ کې ښودل کیږي. د شریکولو لپاره مننه!",
        },
        successStoryApproved: {
          title: "ستاسو د بریا کیسه تصویب شوه",
          message: "ستاسو د بریا کیسه د ادارې لخوا تصویب شوه.",
        },
        successStoryUpdate: { title: "ستاسو د بریا کیسې په اړه تازه معلومات" },
        eventRegistration: {
          title: "په غونډه کې نوملیکنه",
          message: "تاسو د {{title}} غونډې لپاره نوملیکنه شوئ. نیټه: {{date}}. ځای: {{location}}.",
        },
        mentorRequest: {
          title: "د لارښوونې نوې غوښتنه",
          message: "{{name}} د لارښوونې غوښتنه کړې ده.",
        },
        mentorRequestAccepted: {
          title: "لارښوونه ومنل شوه",
          message: "{{name}} ستاسو د لارښوونې غوښتنه ومنله. اوس کولی شئ یو له بل سره اړیکه ونیسئ.",
        },
        mentorRequestRejected: {
          title: "لارښوونه رد شوه",
          message: "{{name}} ستاسو د لارښوونې غوښتنه رد کړه.",
        },
        mentorReview: {
          title: "نوې کتنه",
          message: "{{name}} ستاسو په لارښوونې نظر ورکړ ({{rating}}/۵).",
        },
        mentorProfileCreated: {
          title: "تاسو اوس لارښود یاست",
          message: "{{admin}} تاسو د KPU د فارغانو په پلیټ‌فارم کې د لارښود په توګه اضافه کړئ. ستاسو د لارښود پروفایل فعال دی او فارغان کولی شي له تاسو څخه د لارښوونې غوښتنه وکړي.",
        },
        mentorStatusVerified: {
          title: "د لارښود پروفایل تصدیق شو",
          message: "ستاسو د لارښود پروفایل د ادارې لخوا تصدیق شو.",
        },
        mentorStatusRejected: {
          title: "د لارښود پروفایل رد شو",
          message: "ستاسو د لارښود پروفایل د ادارې لخوا رد شو.",
        },
        mentorStatusPending: {
          title: "د لارښود پروفایل تر بیاکتنې لاندې",
          message: "ستاسو د لارښود پروفایل د ادارې لخوا تر بیاکتنې لاندې ونیول شو.",
        },
        mentorRequestAdminAccepted: {
          title: "د لارښوونې غوښتنه ومنل شوه",
          message: "ستاسو د لارښوونې غوښتنه د ادارې لخوا ومنل شوه.",
        },
        mentorRequestAdminRejected: {
          title: "د لارښوونې غوښتنه رد شوه",
          message: "ستاسو د لارښوونې غوښتنه د ادارې لخوا رد شوه.",
        },
        mentorRequestAdminPending: {
          title: "د لارښوونې غوښتنه تر بیاکتنې لاندې",
          message: "ستاسو د لارښوونې غوښتنه د ادارې لخوا تر بیاکتنې لاندې ونیول شوه.",
        },
        messageReply: {
          title: "ستاسو پیغام ته ځواب",
          message: "ستاسو پیغام ته ځواب ورکړل شو: «{{subject}}»",
        },
        profileApproved: {
          title: "پروفایل تصویب شو",
          message: "ستاسو د فارغ التحصیل پروفایل تصدیق او تصویب شو.",
        },
        profileRejected: {
          title: "پروفایل رد شو",
          message: "ستاسو د فارغ التحصیل پروفایل رد شو.",
        },
        profilePending: {
          title: "پروفایل تر بیاکتنې لاندې",
          message: "ستاسو د فارغ التحصیل پروفایل تر بیاکتنې لاندې ونیول شو.",
        },
      },
    },
    userMenu: {
      signedInAs: "ننوتلی په نوم",
      dashboard: "ډشبورډ",
      myProfile: "زما پروفایل",
      myApplications: "زما غوښتنلیکونه",
      myEvents: "ثبت‌شوې پیښې",
      myMessages: "پیغامونه",
      mentorship: "لارښوونه",
      logout: "وتل",
    },
    footer: {
      about:
        "د کابل پولیټخنیک پوهنتون د ټولو فارغانو لپاره د عالي توب، ټولنې او د عمر اوږدې زده‌کړې وده.",
      quickLinks: "چټک لینکونه",
      jobBoard: "د دندو بورد",
      mentorshipProgram: "د لارښوونې برنامه",
      campusNews: "د پوهنتون خبرونه",
      university: "پوهنتون",
      faculties: "پوهنځي",
      researchLabs: "د څېړنې لابراتوارونه",
      contactOffice: "د اړیکې دفتر",
      followUs: "موږ تعقیب کړئ",
      privacyPolicy: "د محرمیت تګلاره",
      termsOfService: "د کارونې شرایط",
      eventGuidelines: "د پیښو لارښود",
      rights:
        "© ۲۰۲۳ د کابل پولیټخنیک پوهنتون د فارغانو ټولنه. ټول حقوق خوندي دي.",
    },
  },
};

export default common;
