'use client'
import { useState } from 'react';
import StudentNavbar from '@/components/StudentNavbar';
import StudentProtectedRoute from '@/components/StudentProtectedRoute';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    reportUpdates: true,
    educationalContent: true,
    tipsAndGuides: false,
  });
  const [language, setLanguage] = useState('english');

  const handleLogout = async () => {
    const loadingToast = toast.loading('Logging out...');
    await logout();
    toast.success('Successfully logged out!', { id: loadingToast });
    router.push('/');
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Settings updated!');
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    toast.success(`Language changed to ${lang === 'english' ? 'English' : 'Hindi'}`);
  };

  return (
    <StudentProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <StudentNavbar />
        
        <main className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your preferences and account</p>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>👤</span> Account
            </h2>
            
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-3xl">
                  👤
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Anonymous Student</h3>
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Identity Protected
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Session ID: {user?.uid?.slice(-8) || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  🔒 You are logged in anonymously. Your identity is completely protected 
                  and cannot be traced back to any reports you submit.
                </p>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔔</span> Notification Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-800">Report Status Updates</h3>
                  <p className="text-sm text-gray-500">Get notified when TPO takes action on your reports</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('reportUpdates')}
                  className={`w-14 h-8 rounded-full transition-colors duration-200 relative ${
                    notifications.reportUpdates ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                    notifications.reportUpdates ? 'translate-x-7' : 'translate-x-1'
                  }`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-800">Educational Content</h3>
                  <p className="text-sm text-gray-500">Receive updates about new learning resources</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('educationalContent')}
                  className={`w-14 h-8 rounded-full transition-colors duration-200 relative ${
                    notifications.educationalContent ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                    notifications.educationalContent ? 'translate-x-7' : 'translate-x-1'
                  }`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-800">Tips & Guides</h3>
                  <p className="text-sm text-gray-500">Occasional tips on using BiasBreaker</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('tipsAndGuides')}
                  className={`w-14 h-8 rounded-full transition-colors duration-200 relative ${
                    notifications.tipsAndGuides ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                    notifications.tipsAndGuides ? 'translate-x-7' : 'translate-x-1'
                  }`}></span>
                </button>
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🌐</span> Language
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleLanguageChange('english')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  language === 'english'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl mb-2 block">🇬🇧</span>
                <span className="font-medium text-gray-800">English</span>
                {language === 'english' && (
                  <span className="block text-xs text-green-600 mt-1">Selected</span>
                )}
              </button>
              <button
                onClick={() => handleLanguageChange('hindi')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  language === 'hindi'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl mb-2 block">🇮🇳</span>
                <span className="font-medium text-gray-800">हिंदी</span>
                {language === 'hindi' && (
                  <span className="block text-xs text-green-600 mt-1">Selected</span>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              * Hindi support coming soon!
            </p>
          </div>

          {/* Data & Privacy */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔐</span> Data & Privacy
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-800 mb-2">Download My Data</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Download a copy of your submitted reports and their status.
                </p>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition">
                  📥 Download Report History
                </button>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h3 className="font-medium text-green-800 mb-2">Privacy Information</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✓ Your identity is never stored with reports</li>
                  <li>✓ Email content is encrypted at rest</li>
                  <li>✓ No personal data is shared with companies</li>
                  <li>✓ You can leave anytime without trace</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>💬</span> Support
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="/student/learn"
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition flex items-center gap-3"
              >
                <span className="text-2xl">📚</span>
                <div>
                  <h3 className="font-medium text-gray-800">Help Center</h3>
                  <p className="text-sm text-gray-500">FAQs and guides</p>
                </div>
              </a>
              <a
                href="mailto:support@biasbreaker.com"
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition flex items-center gap-3"
              >
                <span className="text-2xl">✉️</span>
                <div>
                  <h3 className="font-medium text-gray-800">Contact Support</h3>
                  <p className="text-sm text-gray-500">We're here to help</p>
                </div>
              </a>
            </div>
          </div>

          {/* Logout */}
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🚪</span> Session
            </h2>
            
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-sm text-red-700 mb-4">
                Logging out will end your anonymous session. Your submitted reports will remain 
                in the system but you won't be able to view them again unless you save your session ID.
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Out
              </button>
            </div>
          </div>
        </main>
      </div>
    </StudentProtectedRoute>
  );
}
