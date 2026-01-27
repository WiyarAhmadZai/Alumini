import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const ProfilePage = () => {
  return (
    <Layout>
      <div className="layout-container flex flex-col">
        {/* Main Content Wrapper */}
        <main className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 px-4 md:px-10">
          {/* Profile Header Card */}
          <div className="bg-primary rounded-xl border border-primary shadow-sm overflow-hidden">
            {/* Cover Image */}
            <div className="w-full bg-center bg-no-repeat bg-cover min-h-64 relative" style={{backgroundImage: 'url("https://picsum.photos/seed/cover/1200/400.jpg")'}}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div className="bg-primary px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-16 relative z-10">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full border-4 border-white size-40 shadow-lg" style={{backgroundImage: 'url("https://picsum.photos/seed/avatar/200/200.jpg")'}}></div>
              <div className="flex-1 flex flex-col md:flex-row justify-between items-end pb-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h1 className="text-black text-3xl font-bold leading-tight">Ahmad Wali</h1>
                    <span className="material-symbols-outlined text-black fill-1" title="Verified Alumnus">verified</span>
                  </div>
                  <p className="text-black text-lg font-medium">Class of 2015 • Faculty of Civil Engineering</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      Verified Alumnus
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <span className="material-symbols-outlined text-sm mr-2">edit</span>
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    <span className="material-symbols-outlined">share</span>
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
                    <span className="material-symbols-outlined text-primary">mail</span>
                    <span className="text-black text-sm font-medium">ahmad.wali@example.com</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-primary">call</span>
                    <span className="text-black text-sm font-medium">+93 70 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <span className="text-black text-sm font-medium">Kabul, Afghanistan</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-black text-sm font-bold mb-3">Social Links</h4>
                  <div className="flex gap-3">
                    <a className="size-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 text-primary hover:from-blue-100 hover:to-indigo-100 transition-all border border-blue-200" href="#">
                      <span className="material-symbols-outlined">link</span>
                    </a>
                    <a className="size-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 text-primary hover:from-green-100 hover:to-emerald-100 transition-all border border-green-200" href="#">
                      <span className="material-symbols-outlined">alternate_email</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="p-6 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-lg font-bold mb-4">Quick Stats</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow">
                    <p className="text-primary text-2xl font-bold">450</p>
                    <p className="text-black text-xs font-medium uppercase tracking-wider">Connections</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow">
                    <p className="text-primary text-2xl font-bold">12</p>
                    <p className="text-black text-xs font-medium uppercase tracking-wider">Events Attended</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow">
                    <p className="text-primary text-2xl font-bold">5</p>
                    <p className="text-black text-xs font-medium uppercase tracking-wider">Active Mentorships</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Column (Main Content) */}
            <div className="md:col-span-8 flex flex-col gap-6">
              {/* About Me */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  About Me
                </h3>
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-black leading-relaxed text-base">
                    Dedicated Civil Engineer with over 8 years of experience in structural design and urban planning. Since graduating from KPU in 2015, I have worked on numerous infrastructure projects across Kabul and beyond. I am passionate about sustainable building practices and mentoring the next generation of Polytechnic engineers.
                  </p>
                </div>
              </section>

              {/* Professional Experience */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">work</span>
                  Professional Experience
                </h3>
                <div className="space-y-8">
                  {/* Experience Item 1 */}
                  <div className="relative pl-12 pb-8 border-l-2 border-gray-200 last:border-l-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full border-4 border-gray-100 shadow-sm"></div>
                    <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h4 className="text-black font-bold text-lg mb-1 sm:mb-0">Senior Structural Engineer</h4>
                        <span className="text-primary font-medium text-sm">Afghanistan Urban Development Authority</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Jan 2019 — Present • Kabul, AF</p>
                      <p className="text-black text-sm leading-relaxed">Leading structural assessments for municipal buildings and overseeing a team of 12 junior engineers.</p>
                    </div>
                  </div>

                  {/* Experience Item 2 */}
                  <div className="relative pl-12 pb-8 border-l-2 border-gray-200 last:border-l-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gray-400 rounded-full border-4 border-white shadow-sm"></div>
                    <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h4 className="text-black font-bold text-lg mb-1 sm:mb-0">Junior Site Engineer</h4>
                        <span className="text-primary font-medium text-sm">National Bridge Construction Co.</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Aug 2015 — Dec 2018 • Kabul, AF</p>
                      <p className="text-black text-sm leading-relaxed">Assisted in site supervision and quality control for major highway bridge reconstruction projects.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Education */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">school</span>
                  Education
                </h3>
                <div className="space-y-8">
                  {/* KPU Entry */}
                  <div className="relative pl-12 pb-8 border-l-2 border-gray-200 last:border-l-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full border-4 border-gray-100 shadow-sm"></div>
                    <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h4 className="text-black font-bold text-lg mb-1 sm:mb-0">Kabul Polytechnic University (KPU)</h4>
                        <span className="text-primary font-medium text-sm">Bachelor of Science in Civil Engineering</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Class of 2015</p>
                    </div>
                  </div>

                  {/* Certification Entry */}
                  <div className="relative pl-12 pb-8 border-l-2 border-gray-200 last:border-l-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gray-400 rounded-full border-4 border-white shadow-sm"></div>
                    <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h4 className="text-black font-bold text-lg mb-1 sm:mb-0">Certification in Project Management</h4>
                        <span className="text-primary font-medium text-sm">Global Engineering Institute</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">2017</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Skills & Expertise */}
              <section className="p-8 rounded-xl border border-[#dcdee5] shadow-sm">
                <h3 className="text-black text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">settings_suggest</span>
                  Skills & Expertise
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
                    <span className="text-black text-sm font-medium block text-center">Structural Analysis</span>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
                    <span className="text-black text-sm font-medium block text-center">AutoCAD Civil 3D</span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
                    <span className="text-black text-sm font-medium block text-center">Urban Planning</span>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
                    <span className="text-black text-sm font-medium block text-center">Project Management</span>
                  </div>
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
                    <span className="text-black text-sm font-medium block text-center">Environmental Impact</span>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
                    <span className="text-black text-sm font-medium block text-center">Bridge Design</span>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-300 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
                    <span className="text-black text-sm font-medium block text-center">Concrete Construction</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
          </div>
        </main>
    </div>
    </Layout>
  );
};

export default ProfilePage;
