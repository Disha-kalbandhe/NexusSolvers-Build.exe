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
      bg: 'bg-blue-50'
    },
    { 
      label: 'Under Review', 
      value: reports.filter(r => r.status === 'pending' || r.status === 'reviewing').length, 
      icon: '🔍', 
      color: 'from-yellow-500 to-orange-500',
      bg: 'bg-yellow-50'
    },
    { 
      label: 'Action Taken', 
      value: reports.filter(r => r.status === 'resolved').length, 
      icon: '✅', 
      color: 'from-green-500 to-emerald-600',
      bg: 'bg-green-50'
    },
    { 
      label: 'Checks Today', 
      value: `${checksRemaining}/3`, 
      icon: '🔎', 
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50'
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
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">⏳ Pending</span>;
      case 'reviewing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">🔍 Under Review</span>;
      case 'resolved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">✅ Resolved</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">📋 Submitted</span>;
    }
  };

  return (
    <StudentProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <StudentNavbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome, Student! 👋</h1>
                  <p className="text-green-100">
                    Your identity is 100% protected. Report bias, check emails, and learn about your rights.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <span className="text-5xl">🛡️</span>
                  </div>
                </div>
              </div>
              
              {/* Privacy Badge */}
              <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Anonymous Session Active</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className={`${stat.bg} rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{stat.icon}</span>
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                    {stat.value}
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.disabled ? '#' : action.href}
                  className={`group relative bg-white rounded-xl p-5 border-2 transition-all duration-300 ${
                    action.disabled 
                      ? 'border-gray-200 opacity-50 cursor-not-allowed' 
                      : action.priority 
                        ? 'border-blue-300 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  {action.priority && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                      ⭐ Important
                    </span>
                  )}
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    {action.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Recent Reports</h2>
              <Link href="/student/my-reports" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading your reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Reports Yet</h3>
                <p className="text-gray-500 mb-4">You haven't submitted any bias reports yet.</p>
                <Link
                  href="/student/report"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition"
                >
                  <span>📝</span>
                  Submit Your First Report
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {reports.slice(0, 5).map((report) => (
                  <div key={report.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                            #{report.reportId || report.id.slice(-8).toUpperCase()}
                          </span>
                          {getStatusBadge(report.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Bias Type: <span className="font-medium text-gray-800">{report.biasType || 'Not specified'}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Submitted: {new Date(report.submittedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <Link
                        href={`/student/my-reports?id=${report.id}`}
                        className="text-green-600 hover:text-green-700"
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

          {/* Tips Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              💡 Did You Know?
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-2xl mb-2 block">🔒</span>
                <h4 className="font-semibold text-gray-800 mb-1">Complete Privacy</h4>
                <p className="text-sm text-gray-600">Your reports are encrypted and cannot be traced back to you.</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-2xl mb-2 block">⚖️</span>
                <h4 className="font-semibold text-gray-800 mb-1">UGC 2026 Protection</h4>
                <p className="text-sm text-gray-600">New regulations protect students from placement discrimination.</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-2xl mb-2 block">🎯</span>
                <h4 className="font-semibold text-gray-800 mb-1">Make a Difference</h4>
                <p className="text-sm text-gray-600">Your reports help create fairer placements for everyone.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </StudentProtectedRoute>
  );
}
