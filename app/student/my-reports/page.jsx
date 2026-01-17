'use client'
import { useState, useEffect } from 'react';
import StudentNavbar from '@/components/StudentNavbar';
import StudentProtectedRoute from '@/components/StudentProtectedRoute';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';

export default function MyReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;

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

    return () => unsubscribe();
  }, [user]);

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            Pending Review
          </span>
        );
      case 'reviewing':
        return (
          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Under Review
          </span>
        );
      case 'resolved':
        return (
          <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Resolved
          </span>
        );
      case 'action_taken':
        return (
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-1">
            <span>✅</span>
            Action Taken
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            Submitted
          </span>
        );
    }
  };

  const getStatusTimeline = (report) => {
    const statuses = [
      { key: 'submitted', label: 'Submitted', icon: '📝', completed: true },
      { key: 'reviewing', label: 'Under Review', icon: '🔍', completed: ['reviewing', 'resolved', 'action_taken'].includes(report.status) },
      { key: 'resolved', label: 'Resolved', icon: '✅', completed: ['resolved', 'action_taken'].includes(report.status) },
    ];

    return (
      <div className="flex items-center justify-between mt-6">
        {statuses.map((status, index) => (
          <div key={status.key} className="flex items-center flex-1">
            <div className={`flex flex-col items-center ${status.completed ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                status.completed ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {status.icon}
              </div>
              <span className="text-xs mt-1 font-medium">{status.label}</span>
            </div>
            {index < statuses.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded ${
                statuses[index + 1].completed ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <StudentProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <StudentNavbar />
        
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Reports</h1>
              <p className="text-gray-600">Track the status of your submitted bias reports</p>
            </div>
            
            {/* Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'reviewing', 'resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === f
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <p className="text-2xl font-bold text-gray-800">{reports.length}</p>
              <p className="text-sm text-gray-500">Total Reports</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <p className="text-2xl font-bold text-yellow-700">
                {reports.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">
                {reports.filter(r => r.status === 'reviewing').length}
              </p>
              <p className="text-sm text-blue-600">Under Review</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-2xl font-bold text-green-700">
                {reports.filter(r => r.status === 'resolved' || r.status === 'action_taken').length}
              </p>
              <p className="text-sm text-green-600">Resolved</p>
            </div>
          </div>

          {/* Reports List */}
          {loading ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {filter === 'all' ? 'No Reports Yet' : `No ${filter} reports`}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "You haven't submitted any bias reports yet."
                  : `You don't have any reports with "${filter}" status.`
                }
              </p>
              {filter === 'all' && (
                <a
                  href="/student/report"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition"
                >
                  <span>📝</span>
                  Submit Your First Report
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer ${
                    selectedReport?.id === report.id
                      ? 'border-green-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
                >
                  {/* Report Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-lg bg-gray-100 px-3 py-1 rounded-lg text-gray-700 font-bold">
                            #{report.reportId || report.id.slice(-8).toUpperCase()}
                          </span>
                          {getStatusBadge(report.status)}
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">Bias Type:</span> {report.biasType || 'Not specified'}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Submitted: {new Date(report.submittedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <svg
                        className={`w-6 h-6 text-gray-400 transition-transform ${
                          selectedReport?.id === report.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Expanded Details */}
                    {selectedReport?.id === report.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        {/* Status Timeline */}
                        <h4 className="font-semibold text-gray-800 mb-2">Status Timeline</h4>
                        {getStatusTimeline(report)}

                        {/* Email Preview */}
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-800 mb-2">Reported Email Content</h4>
                          <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">
                              {report.emailContent?.substring(0, 500)}
                              {report.emailContent?.length > 500 && '...'}
                            </p>
                          </div>
                        </div>

                        {/* Additional Context */}
                        {report.additionalContext && (
                          <div className="mt-4">
                            <h4 className="font-semibold text-gray-800 mb-2">Your Notes</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                              {report.additionalContext}
                            </p>
                          </div>
                        )}

                        {/* TPO Response (if any) */}
                        {report.tpoResponse && (
                          <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                              <span>📢</span> TPO Response
                            </h4>
                            <p className="text-sm text-green-700">{report.tpoResponse}</p>
                          </div>
                        )}

                        {/* Action Taken */}
                        {report.actionTaken && (
                          <div className="mt-4 bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                            <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                              <span>✅</span> Action Taken
                            </h4>
                            <p className="text-sm text-emerald-700">{report.actionTaken}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Note */}
          <div className="mt-8 bg-blue-50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h3 className="font-semibold text-blue-800">About Your Reports</h3>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Your identity is NEVER shared with the TPO or company</li>
                  <li>• Only you can see your own reports</li>
                  <li>• Status updates are made by TPO after reviewing</li>
                  <li>• "Resolved" means appropriate action has been taken</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </StudentProtectedRoute>
  );
}
