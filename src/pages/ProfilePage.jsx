import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiLink, FiMail, FiPhone, FiMapPin, FiEdit, FiShare2, FiUser, FiBriefcase, FiBookOpen, FiSettings, FiAward, FiTrendingUp, FiStar, FiTarget } from 'react-icons/fi';
import alumniService from '../services/alumniService';
import authService from '../services/authService';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');

        if (!authService.isAuthenticated()) {
          navigate('/login');
          return;
        }

        const response = await alumniService.getMe();
        setProfile(response.data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load profile.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const experiences = profile?.experiences || [];
  const educations = profile?.educations || [];
  const skills = profile?.skills || [];
  const achievements = profile?.achievements || [];

  const coverImage = profile?.cover_image || 'https://picsum.photos/seed/cover/1200/400.jpg';
  const avatarImage = profile?.profile_image || 'https://picsum.photos/seed/avatar/200/200.jpg';

  return (
    <Layout>
      {/* Background Gradient Section */}
      <div className="fixed top-0 left-0 right-0 h-screen bg-gradient-to-b from-[#002759]/80 via-[#002759]/40 to-[#002759]/10 -z-10"></div>
      
      {/* Hero Section */}
      

      <div className="min-h-screen bg-gray-50">
        <div className=" h-12 bg-cover bg-center " >
          <div className="absolute inset-0 bg-gradient-to-b from-[#002759]/95  to-blue-500 to-transparent"></div>
          <div className="relative flex items-center justify-center ">
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12">
          {loading && (
            <div className="p-6 rounded-xl border border-[#dcdee5] shadow-sm bg-white mb-6">
              <p className="text-black">Loading profile...</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-6 rounded-xl border border-red-200 shadow-sm bg-red-50 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Profile Header Card */}
          <div className="bg-primary rounded-xl border border-primary shadow-sm overflow-hidden mb-6">
            {/* Cover Image */}
            <div className="w-full bg-center bg-no-repeat bg-cover min-h-64 relative" style={{backgroundImage: `url("${coverImage}")`}}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div className="bg-primary px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-16 relative z-10">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full border-4 border-white size-40 shadow-lg" style={{backgroundImage: `url("${avatarImage}")`}}></div>
              <div className="flex-1 flex flex-col md:flex-row justify-between items-end pb-2">
                <div className="flex flex-col pt-20">
                  <div className="flex items-center gap-2">
                    <h1 className="text-black text-3xl font-bold leading-tight">{profile?.name || '-'}</h1>
                    <span className="material-symbols-outlined text-black fill-1" title="Verified Alumnus">verified</span>
                  </div>
                  <p className="text-black text-lg font-medium">Class of {profile?.graduation_year || '-'} • {profile?.faculty || '-'}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      Verified Alumnus
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <FiEdit className="text-sm mr-2" />
                    
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    <FiShare2 />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white px-8 pb-8 pt-8">
              {/* Main content will go here */}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column (Sidebar) */}
            <aside className="md:col-span-4 flex flex-col gap-6">
              {/* Contact Info Card */}
              <div className="p-6 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-lg font-bold mb-4">Contact Information</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="size-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
                      <FiMail className="text-white" />
                    </div>
                    <span className="text-black text-sm font-medium">{profile?.email || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="size-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
                      <FiPhone className="text-white" />
                    </div>
                    <span className="text-black text-sm font-medium">{profile?.phone || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="size-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md">
                      <FiMapPin className="text-white" />
                    </div>
                    <span className="text-black text-sm font-medium">{profile?.location || '-'}</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button type="button" className="size-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border border-blue-400" title="Website">
                      <FiLink className="text-xl" />
                    </button>
                    <button type="button" className="size-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border border-emerald-400" title="Email">
                      <FiMail className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>

            </aside>

            {/* Right Column (Main Content) */}
            <div className="md:col-span-8 flex flex-col gap-6">
              {/* About Me */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-xl font-bold mb-6 flex items-center gap-2">
                  <FiUser className="text-primary" />
                  About Me
                </h3>
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-black leading-relaxed text-base">
                    {profile?.bio || 'No bio added yet.'}
                  </p>
                </div>
              </section>

              {/* Professional Experience */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-xl font-bold mb-6 flex items-center gap-2">
                  <FiBriefcase className="text-primary" />
                  Professional Experience
                </h3>
                <div className="space-y-8">
                  {experiences.length === 0 ? (
                    <p className="text-black">No experience added yet.</p>
                  ) : (
                    experiences.map((exp, idx) => (
                      <div key={exp.id} className="relative pl-12 pb-8 border-l-2 border-gray-200 last:border-l-0">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 ${idx === 0 ? 'bg-primary border-gray-100' : 'bg-gray-400 border-white'} rounded-full border-4 shadow-sm`}></div>
                        <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                            <h4 className="text-black font-bold text-lg mb-1 sm:mb-0">{exp.job_title}</h4>
                            <span className="text-primary font-medium text-sm">{exp.company || '-'}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{exp.location || '-'}</p>
                          <p className="text-black text-sm leading-relaxed">{exp.description || ''}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Education */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-xl font-bold mb-6 flex items-center gap-2">
                  <FiBookOpen className="text-primary" />
                  Education
                </h3>
                <div className="space-y-8">
                  {educations.length === 0 ? (
                    <p className="text-black">No education added yet.</p>
                  ) : (
                    educations.map((edu, idx) => (
                      <div key={edu.id} className="relative pl-12 pb-8 border-l-2 border-gray-200 last:border-l-0">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 ${idx === 0 ? 'bg-primary border-gray-100' : 'bg-gray-400 border-white'} rounded-full border-4 shadow-sm`}></div>
                        <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                            <h4 className="text-black font-bold text-lg mb-1 sm:mb-0">{edu.institution}</h4>
                            <span className="text-primary font-medium text-sm">{edu.field_of_study || edu.degree || '-'}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{edu.start_year || ''}{edu.end_year ? ` — ${edu.end_year}` : ''}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Skills & Expertise */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-xl font-bold mb-6 flex items-center gap-2">
                  <FiSettings className="text-primary" />
                  Skills & Expertise
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {skills.length === 0 ? (
                    <p className="text-black col-span-full">No skills added yet.</p>
                  ) : (
                    skills.map((skill) => (
                      <div key={skill.id} className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-300 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
                        <span className="text-black text-sm font-medium block text-center">{skill.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Achievements & Awards */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-xl font-bold mb-6 flex items-center gap-2">
                  <FiAward className="text-primary" />
                  Achievements & Awards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <FiTrendingUp className="text-yellow-600 text-2xl" />
                      <span className="text-2xl font-bold text-gray-900">{achievements.length}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Total Achievements</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <FiStar className="text-blue-600 text-2xl" />
                      <span className="text-2xl font-bold text-gray-900">{achievements[0]?.year || '-'}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Latest Year</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <FiTarget className="text-green-600 text-2xl" />
                      <span className="text-2xl font-bold text-gray-900">{achievements[0]?.category || '-'}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Latest Category</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {achievements.length === 0 ? (
                    <p className="text-black">No achievements added yet.</p>
                  ) : (
                    achievements.map((a) => (
                      <div key={a.id} className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiAward className="text-blue-600 text-xl" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-1">{a.title}</h5>
                            {a.description && <p className="text-sm text-gray-600 mb-2">{a.description}</p>}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{a.year || '-'}</span>
                              <span>•</span>
                              <span>{a.issuer || '-'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
