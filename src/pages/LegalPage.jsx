import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FiShield, FiFileText, FiCalendar, FiChevronRight, FiLock, FiUser, FiMail, FiGlobe, FiAlertCircle } from 'react-icons/fi';

const LegalPage = () => {
  const [activeSection, setActiveSection] = useState('privacy');

  const sections = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: FiLock,
      color: 'bg-blue-600'
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      icon: FiFileText,
      color: 'bg-green-600'
    },
    {
      id: 'guidelines',
      title: 'Event Guidelines',
      icon: FiCalendar,
      color: 'bg-purple-600'
    }
  ];

  const content = {
    privacy: {
      hero: {
        title: 'Privacy Policy',
        subtitle: 'Your privacy is our priority',
        description: 'Learn how we collect, use, and protect your personal information'
      },
      sections: [
        {
          title: 'Information We Collect',
          content: 'We collect information you provide directly to us, such as when you create an account, update your profile, contact us, or participate in alumni events. This may include your name, email address, phone number, professional information, and other details you choose to provide.',
          icon: FiUser
        },
        {
          title: 'How We Use Your Information',
          content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, communicate with you about events, and personalize your experience on our platform.',
          icon: FiMail
        },
        {
          title: 'Information Sharing',
          content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with alumni event organizers and other members for networking purposes.',
          icon: FiGlobe
        },
        {
          title: 'Data Security',
          content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.',
          icon: FiShield
        }
      ]
    },
    terms: {
      hero: {
        title: 'Terms of Service',
        subtitle: 'Rules and guidelines for using our platform',
        description: 'Please read these terms carefully before using the KPU Alumni Association platform'
      },
      sections: [
        {
          title: 'Acceptance of Terms',
          content: 'By accessing and using the KPU Alumni Association platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
          icon: FiFileText
        },
        {
          title: 'User Responsibilities',
          content: 'Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. You agree to provide accurate, current, and complete information as prompted by our registration form.',
          icon: FiUser
        },
        {
          title: 'Prohibited Activities',
          content: 'You may not use our platform for any illegal or unauthorized purpose. You may not use our platform to harass, abuse, or harm other users, or to post or transmit any content that is unlawful, harmful, or objectionable.',
          icon: FiAlertCircle
        },
        {
          title: 'Intellectual Property',
          content: 'All content, features, and functionality of the platform are owned by Kabul Polytechnic University Alumni Association and are protected by international copyright, trademark, and other intellectual property laws.',
          icon: FiShield
        }
      ]
    },
    guidelines: {
      hero: {
        title: 'Event Guidelines',
        subtitle: 'Making every alumni event memorable and respectful',
        description: 'Guidelines to ensure positive and productive alumni gatherings'
      },
      sections: [
        {
          title: 'Event Registration',
          content: 'Please register for events in advance to help us plan accordingly. Registration deadlines are typically one week before the event. Cancellations should be made at least 48 hours prior to the event.',
          icon: FiCalendar
        },
        {
          title: 'Code of Conduct',
          content: 'All attendees are expected to behave professionally and respectfully. Harassment, discrimination, or any form of inappropriate behavior will not be tolerated and may result in removal from the event and future events.',
          icon: FiUser
        },
        {
          title: 'Dress Code',
          content: 'Most events require business casual or formal attire. Specific dress requirements will be mentioned in event invitations. When in doubt, it\'s better to be slightly overdressed than underdressed.',
          icon: FiAlertCircle
        },
        {
          title: 'Networking Etiquette',
          content: 'Be respectful of others\' time and boundaries. Exchange contact information appropriately, follow up within 24-48 hours after meeting someone, and always be genuine in your networking approach.',
          icon: FiMail
        }
      ]
    }
  };

  const currentContent = content[activeSection];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-[400px] bg-blue-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-white w-fit mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
                </span>
                Legal Information
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                {currentContent.hero.title}
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                {currentContent.hero.description}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Navigation</h2>
                  <div className="space-y-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                            activeSection === section.id
                              ? `${section.color} text-white shadow-md`
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="text-xl" />
                          <span className="font-medium">{section.title}</span>
                          {activeSection === section.id && (
                            <FiChevronRight className="ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-blue-600 rounded-lg p-6 mt-6 text-white">
                  <FiMail className="text-2xl mb-3" />
                  <h3 className="font-bold text-lg mb-2">Have Questions?</h3>
                  <p className="text-sm text-white/80 mb-4">
                    If you have any questions about our policies or guidelines, please don't hesitate to contact us.
                  </p>
                  <a 
                    href="mailto:legal@kpualumni.af" 
                    className="inline-flex items-center gap-2 text-white font-medium hover:text-yellow-300 transition-colors"
                  >
                    legal@kpualumni.af
                    <FiChevronRight className="text-sm" />
                  </a>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="space-y-8">
                  {currentContent.sections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                      <div key={index} className="border-b border-gray-200 pb-8 last:border-0 last:pb-0">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="text-blue-600 text-xl" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              {section.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {section.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Last Updated */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span>© 2024 Kabul Polytechnic University Alumni Association</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default LegalPage;
