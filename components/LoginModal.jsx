'use client'
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginModal({ isOpen, onClose }) {
  const { loginAsAdmin, loginAsStudent } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // 'admin' or 'student'

  if (!isOpen) return null;

  // Admin (TPO/Employer) Login with Google
  const handleAdminLogin = async () => {
    setLoading(true);
    setError(null);
    
    const loadingToast = toast.loading('🏛️ Signing in as Admin (TPO)...');
    
    const result = await loginAsAdmin();
    
    if (result.success) {
      toast.success('✅ Welcome, TPO/Admin!', { id: loadingToast });
      onClose();
      router.push('/dashboard');
    } else {
      toast.error(`❌ ${result.error}`, { id: loadingToast });
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Student Login (Anonymous)
  const handleStudentLogin = async () => {
    setLoading(true);
    setError(null);
    
    const loadingToast = toast.loading('👤 Signing in as Student...');
    
    const result = await loginAsStudent();
    
    if (result.success) {
      toast.success('✅ Welcome, Student! Your identity is protected.', { id: loadingToast });
      onClose();
      router.push('/student/dashboard');
    } else {
      toast.error(`❌ ${result.error}`, { id: loadingToast });
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Role Selection Screen
  const RoleSelectionScreen = () => (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🎯</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to BiasBreaker
        </h2>
        <p className="text-gray-600">
          Choose how you want to sign in
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="space-y-4">
        
        {/* Admin/TPO Option */}
        <button
          onClick={() => setSelectedRole('admin')}
          disabled={loading}
          className="w-full p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-left group disabled:opacity-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
              🏛️
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">
                Admin / TPO
              </h3>
              <p className="text-sm text-gray-500">
                Placement Cell, Faculty, Administration
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Full Analytics</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Batch Upload</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Reports</span>
              </div>
            </div>
            <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Student Option */}
        <button
          onClick={() => setSelectedRole('student')}
          disabled={loading}
          className="w-full p-5 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 text-left group disabled:opacity-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
              👤
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition">
                Student
              </h3>
              <p className="text-sm text-gray-500">
                Anonymous & Protected Access
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Report Bias</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Quick Check</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Learn</span>
              </div>
            </div>
            <svg className="w-6 h-6 text-gray-400 group-hover:text-green-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm text-gray-600">
              <strong className="text-gray-800">Admin/TPO:</strong> Sign in with Google for full access to analytics, batch processing, and compliance reports.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong className="text-gray-800">Student:</strong> Anonymous login to report bias, check emails, and access educational content.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  // Admin Login Screen
  const AdminLoginScreen = () => (
    <>
      {/* Back Button */}
      <button
        onClick={() => setSelectedRole(null)}
        disabled={loading}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-xl">
          🏛️
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Admin / TPO Login
        </h2>
        <p className="text-gray-600">
          Sign in with your institutional Google account
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Google Login Button */}
      <button
        onClick={handleAdminLogin}
        disabled={loading}
        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-blue-400 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </button>

      {/* Features Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Full Access Includes:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Complete Analytics Dashboard
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Batch Email Processing
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Compliance Reports & Export
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Company Comparison Tools
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Student Report Management
          </li>
        </ul>
      </div>
    </>
  );

  // Student Login Screen
  const StudentLoginScreen = () => (
    <>
      {/* Back Button */}
      <button
        onClick={() => setSelectedRole(null)}
        disabled={loading}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-xl">
          👤
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Student Login
        </h2>
        <p className="text-gray-600">
          Continue anonymously - your identity is 100% protected
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h4 className="font-semibold text-green-800">Your Privacy is Protected</h4>
            <p className="text-sm text-green-700 mt-1">
              No personal information is collected. Your reports are completely anonymous and cannot be traced back to you.
            </p>
          </div>
        </div>
      </div>

      {/* Anonymous Login Button */}
      <button
        onClick={handleStudentLogin}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Continue Anonymously</span>
          </>
        )}
      </button>

      {/* Features Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2">Student Access Includes:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Report Biased Emails Anonymously
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Quick Bias Checker (3/day)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Track Your Reports Status
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Educational Resources
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Know Your Rights
          </li>
        </ul>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          disabled={loading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Render appropriate screen based on selectedRole */}
        {selectedRole === null && <RoleSelectionScreen />}
        {selectedRole === 'admin' && <AdminLoginScreen />}
        {selectedRole === 'student' && <StudentLoginScreen />}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
