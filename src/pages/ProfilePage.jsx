import React from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  return (
    <div className="layout-container flex flex-col">
      {/* Main Content Wrapper */}
      <main className="flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 px-4 md:px-10">
          {/* Profile Header Card */}
          <div className="bg-white dark:bg-[#1a1f2e] rounded-xl overflow-hidden border border-[#dcdee5] dark:border-gray-800 shadow-sm mb-6">
            {/* Cover Image */}
            <div className="w-full bg-center bg-no-repeat bg-cover min-h-64 relative" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB9baFdwUZiFrxu0QtZNqlAkfmleWtllXIwAsn2YZ67ds8Vkueff7JFCv3kIY0M8Xt4e9-vQXZBrlG7WdQZ3M1aRjn7MalJmpSFuVC1YUc8K7Y2U65Dl4ThQHsVMintH06CozjOSJRoJhLhkYqUGqRWXgzTPSZsQCKBnlzf8HrM0X6QVCdweNVr0OEdJQnQQ09WtbDywecNMe3CNIsZnRnwhK0vV7-UlC8RPx1O_VXPTEpd0_DsxOHLosd9qj1OpkQ6jlogJvPGFnwb")'}}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-16 relative z-10">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full border-4 border-white dark:border-[#1a1f2e] size-40 shadow-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDix8TQifu5Mb-_N2MkYqrl2yZ6lA_f7izQ4k1-xQ5frtY_M0zRDnKDl0qvjw_8MqOOdcNHzvfg5peaCKPSfy7AEUDaFKR9ur8PxFdSLd5oHjhUoOwBUQhQBz8GoYRoAyyd3zvOfKn33QW_jBfAYkbUPuevRxHtA0njCtulU1fo4yp64mCUiR4zd7wJQjxpA7AHwJrPUC9Ykt-cvIhxttcofVN5n8BCQvaeyvPsipJomjFV2Y_Zs_RCRKjLvtAT7Xrpd7bErOfRr1mA")'}}></div>
              <div className="flex-1 flex flex-col md:flex-row justify-between items-end pb-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h1 className="text-[#111318] dark:text-white text-3xl font-bold leading-tight">Ahmad Wali</h1>
                    <span className="material-symbols-outlined text-primary fill-1" title="Verified Alumnus">verified</span>
                  </div>
                  <p className="text-[#636c88] dark:text-gray-400 text-lg font-medium">Class of 2015 • Faculty of Civil Engineering</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      Verified Alumnus
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button className="flex min-w-[120px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold tracking-[0.015em] hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined text-sm mr-2">edit</span>
                    Edit Profile
                  </button>
                  <button className="flex min-w-[40px] items-center justify-center rounded-lg h-10 px-4 bg-[#f0f1f4] dark:bg-gray-800 text-[#111318] dark:text-white text-sm font-bold border border-[#dcdee5] dark:border-gray-700">
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column (Sidebar) */}
            <aside className="md:col-span-4 flex flex-col gap-6">
              {/* Contact Info Card */}
              <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-xl border border-[#dcdee5] dark:border-gray-800 shadow-sm">
                <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-4">Contact Information</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-[#636c88] dark:text-gray-400">
                    <span className="material-symbols-outlined text-primary">mail</span>
                    <span className="text-sm">ahmad.wali@example.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#636c88] dark:text-gray-400">
                    <span className="material-symbols-outlined text-primary">call</span>
                    <span className="text-sm">+93 70 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#636c88] dark:text-gray-400">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <span className="text-sm">Kabul, Afghanistan</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-[#f0f1f4] dark:border-gray-800">
                  <h4 className="text-[#111318] dark:text-white text-sm font-bold mb-3">Social Links</h4>
                  <div className="flex gap-3">
                    <a className="size-10 flex items-center justify-center rounded-lg bg-[#f0f1f4] dark:bg-gray-800 text-primary hover:bg-primary hover:text-white transition-all" href="#">
                      <span className="material-symbols-outlined">link</span>
                    </a>
                    <a className="size-10 flex items-center justify-center rounded-lg bg-[#f0f1f4] dark:bg-gray-800 text-primary hover:bg-primary hover:text-white transition-all" href="#">
                      <span className="material-symbols-outlined">alternate_email</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-xl border border-[#dcdee5] dark:border-gray-800 shadow-sm">
                <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-4">Quick Stats</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col gap-1 rounded-lg border border-[#dcdee5] dark:border-gray-800 p-4 bg-background-light dark:bg-background-dark/30">
                    <p className="text-primary tracking-light text-2xl font-bold">450</p>
                    <p className="text-[#636c88] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Connections</p>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border border-[#dcdee5] dark:border-gray-800 p-4 bg-background-light dark:bg-background-dark/30">
                    <p className="text-primary tracking-light text-2xl font-bold">12</p>
                    <p className="text-[#636c88] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Events Attended</p>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border border-[#dcdee5] dark:border-gray-800 p-4 bg-background-light dark:bg-background-dark/30">
                    <p className="text-primary tracking-light text-2xl font-bold">5</p>
                    <p className="text-[#636c88] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Active Mentorships</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Column (Main Content) */}
            <div className="md:col-span-8 flex flex-col gap-6">
              {/* About Me */}
              <section className="bg-white dark:bg-[#1a1f2e] p-8 rounded-xl border border-[#dcdee5] dark:border-gray-800 shadow-sm">
                <h3 className="text-[#111318] dark:text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  About Me
                </h3>
                <p className="text-[#636c88] dark:text-gray-300 leading-relaxed">
                  Dedicated Civil Engineer with over 8 years of experience in structural design and urban planning. Since graduating from KPU in 2015, I have worked on numerous infrastructure projects across Kabul and beyond. I am passionate about sustainable building practices and mentoring the next generation of Polytechnic engineers.
                </p>
              </section>

              {/* Professional Experience */}
              <section className="bg-white dark:bg-[#1a1f2e] p-8 rounded-xl border border-[#dcdee5] dark:border-gray-800 shadow-sm">
                <h3 className="text-[#111318] dark:text-white text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">work</span>
                  Professional Experience
                </h3>
                <div className="space-y-8 relative before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#f0f1f4] dark:before:bg-gray-800">
                  {/* Experience Item 1 */}
                  <div className="relative pl-12">
                    <div className="absolute left-0 top-1 size-10 rounded-full bg-primary flex items-center justify-center border-4 border-white dark:border-[#1a1f2e] z-10">
                      <span className="material-symbols-outlined text-white text-sm">engineering</span>
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-[#111318] dark:text-white font-bold text-lg">Senior Structural Engineer</h4>
                      <p className="text-primary font-medium">Afghanistan Urban Development Authority</p>
                      <p className="text-[#636c88] dark:text-gray-400 text-sm mt-1">Jan 2019 — Present • Kabul, AF</p>
                      <p className="text-[#636c88] dark:text-gray-300 text-sm mt-3 leading-relaxed">Leading structural assessments for municipal buildings and overseeing a team of 12 junior engineers.</p>
                    </div>
                  </div>

                  {/* Experience Item 2 */}
                  <div className="relative pl-12">
                    <div className="absolute left-0 top-1 size-10 rounded-full bg-[#f0f1f4] dark:bg-gray-800 flex items-center justify-center border-4 border-white dark:border-[#1a1f2e] z-10">
                      <span className="material-symbols-outlined text-primary text-sm">architecture</span>
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-[#111318] dark:text-white font-bold text-lg">Junior Site Engineer</h4>
                      <p className="text-primary font-medium">National Bridge Construction Co.</p>
                      <p className="text-[#636c88] dark:text-gray-400 text-sm mt-1">Aug 2015 — Dec 2018 • Kabul, AF</p>
                      <p className="text-[#636c88] dark:text-gray-300 text-sm mt-3 leading-relaxed">Assisted in site supervision and quality control for major highway bridge reconstruction projects.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Education */}
              <section className="bg-white dark:bg-[#1a1f2e] p-8 rounded-xl border border-[#dcdee5] dark:border-gray-800 shadow-sm">
                <h3 className="text-[#111318] dark:text-white text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">school</span>
                  Education
                </h3>
                <div className="flex flex-col gap-6">
                  {/* KPU Entry */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="size-12 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined text-3xl">account_balance</span>
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-[#111318] dark:text-white font-bold">Kabul Polytechnic University (KPU)</h4>
                      <p className="text-[#111318] dark:text-gray-300 font-medium">Bachelor of Science in Civil Engineering</p>
                      <p className="text-[#636c88] dark:text-gray-400 text-sm">Class of 2015</p>
                    </div>
                  </div>

                  {/* Other Entry */}
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-[#f0f1f4] dark:border-gray-800">
                    <div className="size-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[#636c88] shadow-sm">
                      <span className="material-symbols-outlined text-3xl">school</span>
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-[#111318] dark:text-white font-bold">Certification in Project Management</h4>
                      <p className="text-[#111318] dark:text-gray-300 font-medium">Global Engineering Institute</p>
                      <p className="text-[#636c88] dark:text-gray-400 text-sm">2017</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Skills & Expertise */}
              <section className="bg-white dark:bg-[#1a1f2e] p-8 rounded-xl border border-[#dcdee5] dark:border-gray-800 shadow-sm">
                <h3 className="text-[#111318] dark:text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">settings_suggest</span>
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-[#f0f1f4] dark:bg-gray-800 text-[#111318] dark:text-gray-300 text-sm font-medium border border-[#dcdee5] dark:border-gray-700">Structural Analysis</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#f0f1f4] dark:bg-gray-800 text-[#111318] dark:text-gray-300 text-sm font-medium border border-[#dcdee5] dark:border-gray-700">AutoCAD Civil 3D</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#f0f1f4] dark:bg-gray-800 text-[#111318] dark:text-gray-300 text-sm font-medium border border-[#dcdee5] dark:border-gray-700">Urban Planning</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#f0f1f4] dark:bg-gray-800 text-[#111318] dark:text-gray-300 text-sm font-medium border border-[#dcdee5] dark:border-gray-700">Project Management</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#f0f1f4] dark:bg-gray-800 text-[#111318] dark:text-gray-300 text-sm font-medium border border-[#dcdee5] dark:border-gray-700">Environmental Impact</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#f0f1f4] dark:bg-gray-800 text-[#111318] dark:text-gray-300 text-sm font-medium border border-[#dcdee5] dark:border-gray-700">Bridge Design</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#f0f1f4] dark:bg-gray-800 text-[#111318] dark:text-gray-300 text-sm font-medium border border-[#dcdee5] dark:border-gray-700">Concrete Construction</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
