'use client'
import { useState, useEffect } from 'react';
import StudentNavbar from '@/components/StudentNavbar';
import StudentProtectedRoute from '@/components/StudentProtectedRoute';
import Link from 'next/link';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [checksRemaining, setChecksRemaining] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch student's own reports
    const reportsRef = ref(db, `student_reports/${user.uid}`);
    const unsubscribe = onValue(reportsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const reportsList = Object.entries(data).map(([id, report]) => ({
          id,
          ...report
        })).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        setReports(reportsList);
      } else {
        setReports([]);
      }
      setLoading(false);
    });

    // Check rate limit for bias checker
    const today = new Date().toISOString().split('T')[0];
    const rateLimitRef = ref(db, `rate_limits/${user.uid}/${today}`);
    onValue(rateLimitRef, (snapshot) => {
      if (snapshot.exists()) {
        const checksUsed = snapshot.val().checks || 0;
        setChecksRemaining(Math.max(0, 3 - checksUsed));
      } else {
        setChecksRemaining(3);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const stats = [
    { 
      label: 'Reports Submitted', 
      value: reports.length, 
      icon: '📝', 
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      border: 'border-blue-200'
    },
    { 
      label: 'Under Review', 
      value: reports.filter(r => r.status === 'pending' || r.status === 'reviewing').length, 
      icon: '🔍', 
      color: 'from-yellow-500 to-orange-500',
      bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      border: 'border-yellow-200'
    },
    { 
      label: 'Action Taken', 
      value: reports.filter(r => r.status === 'resolved').length, 
      icon: '✅', 
      color: 'from-green-500 to-emerald-600',
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      border: 'border-green-200'
    },
    { 
      label: 'Checks Today', 
      value: `${checksRemaining}/3`, 
      icon: '🔎', 
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      border: 'border-purple-200'
    },
  ];

  const quickActions = [
    {
      title: 'Report Biased Email',
      description: 'Submit a biased placement email anonymously',
      icon: '📝',
      href: '/student/report',
      color: 'from-blue-600 to-indigo-600',
      priority: true
    },
    {
      title: 'Quick Bias Check',
      description: `Check an email for bias (${checksRemaining} remaining today)`,
      icon: '🔍',
      href: '/student/bias-checker',
      color: 'from-green-600 to-emerald-600',
      disabled: checksRemaining === 0
    },
    {
      title: 'My Reports',
      description: 'View status of your submitted reports',
      icon: '📋',
      href: '/student/my-reports',
      color: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Learn About Bias',
      description: 'Educational resources and your rights',
      icon: '📚',
      href: '/student/learn',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold border border-yellow-200">⏳ Pending</span>;
      case 'reviewing':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-200">🔍 Under Review</span>;
      case 'resolved':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold border border-green-200">✅ Resolved</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold border border-gray-200">📋 Submitted</span>;
    }
  };

  return (
    <StudentProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <StudentNavbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header - Matching Admin Style */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              <div className="relative flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-black">Student Dashboard</h1>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                      🛡️ Protected
                    </span>
                  </div>
                  <p className="text-blue-100 text-lg max-w-xl">
                    Your identity is 100% protected. Report bias, check emails, and learn about your rights.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-xl">
                    <span className="text-6xl">🎓</span>
                  </div>
                </div>
              </div>
              
              {/* Privacy Badge */}
              <div className="relative mt-6 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold">Anonymous Session Active</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
                  <span>🔒</span>
                  <span className="text-sm font-semibold">End-to-End Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Matching Admin Style */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`${stat.bg} rounded-2xl p-6 border-2 ${stat.border} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-700">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions - Matching Admin Style */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>⚡</span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.disabled ? '#' : action.href}
                  className={`group relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 shadow-lg ${
                    action.disabled 
                      ? 'border-gray-200 opacity-50 cursor-not-allowed' 
                      : action.priority 
                        ? 'border-blue-300 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-2' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-2'
                  }`}
                >
                  {action.priority && (
                    <span className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg animate-pulse">
                      ⭐ Important
                    </span>
                  )}
                  <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-xl`}>
                    {action.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                  
                  {/* Arrow indicator */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Reports - Matching Admin Style */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>📋</span>
                Recent Reports
              </h2>
              <Link href="/student/my-reports" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group">
                View All
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {loading ? (
              <div className="p-12 text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500 font-medium">Loading your reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">📝</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Reports Yet</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">You haven't submitted any bias reports yet. Help make placements fair for everyone.</p>
                <Link
                  href="/student/report"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105 shadow-xl"
                >
                  <span>📝</span>
                  Submit Your First Report
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {reports.slice(0, 5).map((report) => (
                  <div key={report.id} className="p-5 hover:bg-gray-50 transition group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm bg-gray-100 px-3 py-1.5 rounded-lg text-gray-800 font-bold">
                            #{report.reportId || report.id.slice(-8).toUpperCase()}
                          </span>
                          {getStatusBadge(report.status)}
                        </div>
                        <p className="text-sm text-gray-700">
                          Bias Type: <span className="font-semibold text-gray-900">{report.biasType || 'Not specified'}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <span>📅</span>
                          Submitted: {new Date(report.submittedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <Link
                        href={`/student/my-reports?id=${report.id}`}
                        className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-200 transition group-hover:scale-110"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips Section - Matching Admin Style */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              💡 Did You Know?
            </h3>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition border border-blue-100 group hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg">
                  <span className="text-2xl">🔒</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Complete Privacy</h4>
                <p className="text-sm text-gray-600">Your reports are encrypted and cannot be traced back to you.</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition border border-blue-100 group hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">UGC 2026 Protection</h4>
                <p className="text-sm text-gray-600">New regulations protect students from placement discrimination.</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition border border-blue-100 group hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Make a Difference</h4>
                <p className="text-sm text-gray-600">Your reports help create fairer placements for everyone.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </StudentProtectedRoute>
  );
}
