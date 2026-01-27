import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FiHeart, FiTarget, FiAward, FiUsers, FiTrendingUp, FiCalendar, FiDollarSign } from 'react-icons/fi';

const LegalPage = () => {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const fundraisingProjects = [
    {
      id: 1,
      title: "Student Scholarship Fund",
      description: "Support deserving students with financial assistance for their education at KPU.",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      raised: 45000,
      goal: 75000,
      donors: 156
    },
    {
      id: 2,
      title: "Laboratory Equipment Upgrade",
      description: "Modernize our engineering labs with state-of-the-art equipment for practical learning.",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      raised: 120000,
      goal: 200000,
      donors: 89
    },
    {
      id: 3,
      title: "Alumni Career Center",
      description: "Establish a dedicated career center to help students and alumni with job placement.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      raised: 67000,
      goal: 100000,
      donors: 234
    }
  ];

  const wallOfHonor = [
    {
      name: "Ahmad Zahir",
      class: "Class of 1995",
      contribution: "Engineering Lab Equipment",
      amount: 25000,
      date: "2024"
    },
    {
      name: "Sara Hassan",
      class: "Class of 2008",
      contribution: "Student Scholarship",
      amount: 15000,
      date: "2024"
    },
    {
      name: "Mohammad Karim",
      class: "Class of 2002",
      contribution: "Library Resources",
      amount: 10000,
      date: "2023"
    },
    {
      name: "Fatima Noori",
      class: "Class of 2015",
      contribution: "Sports Complex",
      amount: 20000,
      date: "2023"
    }
  ];

  const quickGiftAmounts = [25, 50, 100, 250, 500, 1000];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value) => {
    setCustomAmount(value);
    setSelectedAmount('');
  };

  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-[500px] bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
              alt="Students studying"
              className="w-full h-full object-cover opacity-30"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Support the Future of KPU
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
                Your generous contributions help us maintain excellence in education and provide opportunities for the next generation of engineers and innovators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-yellow-400 text-blue-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors text-lg">
                  Explore Projects
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-lg">
                  Quick Donation
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
          {/* Fundraising Projects Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Fundraising Projects</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join us in supporting these important initiatives that will benefit current and future KPU students.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fundraisingProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Raised: ${project.raised.toLocaleString()}</span>
                        <span>Goal: ${project.goal.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercentage(project.raised, project.goal)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{project.donors} donors</span>
                        <span>{getProgressPercentage(project.raised, project.goal).toFixed(0)}% funded</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Donate Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Make a Quick Gift Section */}
          <section className="mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Make a Quick Gift</h2>
                <p className="text-lg text-gray-600">
                  Every contribution, no matter the size, makes a difference in our students' lives.
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  {quickGiftAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-3 px-4 rounded-lg font-bold transition-all ${
                        selectedAmount === amount
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder="Enter custom amount"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>
                
                <button className="w-full bg-yellow-400 text-blue-900 font-bold py-4 rounded-lg hover:bg-yellow-300 transition-colors text-lg">
                  Process Donation
                </button>
              </div>
            </div>
          </section>

          {/* Wall of Honor Section */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Wall of Honor</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We gratefully acknowledge the generous alumni who have made significant contributions to KPU.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wallOfHonor.map((donor, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiHeart className="text-blue-600 text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{donor.name}</h4>
                      <p className="text-sm text-gray-600">{donor.class}</p>
                      <p className="text-sm text-gray-500">{donor.contribution}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">${donor.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{donor.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <button className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  View All Donors
                  <FiTrendingUp className="text-lg" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default LegalPage;
