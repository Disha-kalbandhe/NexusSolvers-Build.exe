'use client'
import { useState, useEffect } from 'react';
import StudentNavbar from '@/components/StudentNavbar';
import StudentProtectedRoute from '@/components/StudentProtectedRoute';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;

    // Fetch notifications from student's reports (status changes)
    const reportsRef = ref(db, `student_reports/${user.uid}`);
    const unsubscribe = onValue(reportsRef, (snapshot) => {
      const notifs = [];
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.entries(data).forEach(([id, report]) => {
          // Create notification for each status
          if (report.status === 'reviewing') {
            notifs.push({
              id: `${id}_reviewing`,
              type: 'status_update',
              title: 'Report Under Review',
              message: `Your report #${report.reportId || id.slice(-8).toUpperCase()} is being reviewed by the TPO.`,
              timestamp: report.reviewStartedAt || report.submittedAt,
              icon: '🔍',
              color: 'blue',
              read: report.reviewNotifRead || false,
              reportId: id
            });
          }
          
          if (report.status === 'resolved' || report.status === 'action_taken') {
            notifs.push({
              id: `${id}_resolved`,
              type: 'action_taken',
              title: 'Action Taken on Your Report',
              message: `TPO has taken action on report #${report.reportId || id.slice(-8).toUpperCase()}. ${report.actionTaken || 'Company has been notified.'}`,
              timestamp: report.resolvedAt || report.submittedAt,
              icon: '✅',
              color: 'green',
              read: report.resolvedNotifRead || false,
              reportId: id
            });
          }

          // Submission notification
          notifs.push({
            id: `${id}_submitted`,
            type: 'submission',
            title: 'Report Submitted Successfully',
            message: `Your report #${report.reportId || id.slice(-8).toUpperCase()} has been submitted anonymously.`,
            timestamp: report.submittedAt,
            icon: '📝',
            color: 'gray',
            read: true,
            reportId: id
          });
        });
      }

      // Add some static educational notifications
      notifs.push({
        id: 'edu_1',
        type: 'education',
        title: 'Know Your Rights',
        message: 'Learn about UGC 2026 guidelines that protect students from placement discrimination.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        icon: '📚',
        color: 'purple',
        read: false,
        link: '/student/learn'
      });

      notifs.push({
        id: 'edu_2',
        type: 'tip',
        title: 'Quick Tip',
        message: 'Use the Quick Bias Checker to analyze emails before submitting a formal report.',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        icon: '💡',
        color: 'yellow',
        read: false,
        link: '/student/bias-checker'
      });

      // Sort by timestamp (newest first)
      notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setNotifications(notifs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      purple: 'bg-purple-50 border-purple-200',
      gray: 'bg-gray-50 border-gray-200',
      red: 'bg-red-50 border-red-200',
    };
    return colors[color] || colors.gray;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60 * 1000) return 'Just now';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} min ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`;
    if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))} days ago`;
    
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <StudentProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <StudentNavbar />
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-sm px-2.5 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className="text-gray-600">Stay updated on your reports and important announcements</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'all', label: 'All', icon: '📋' },
              { id: 'unread', label: 'Unread', icon: '🔴' },
              { id: 'status_update', label: 'Status Updates', icon: '🔍' },
              { id: 'action_taken', label: 'Actions', icon: '✅' },
              { id: 'education', label: 'Educational', icon: '📚' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  filter === f.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Notifications</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? "You don't have any notifications yet."
                  : `No ${filter === 'unread' ? 'unread' : filter.replace('_', ' ')} notifications.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-xl border-2 p-4 transition-all hover:shadow-md ${getColorClasses(notification.color)} ${
                    !notification.read ? 'ring-2 ring-green-500 ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                      {notification.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            {notification.title}
                            {!notification.read && (
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      
                      {notification.link && (
                        <a
                          href={notification.link}
                          className="inline-flex items-center gap-1 mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          Learn more
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}
                      
                      {notification.reportId && (
                        <a
                          href={`/student/my-reports?id=${notification.reportId}`}
                          className="inline-flex items-center gap-1 mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          View report
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h3 className="font-semibold text-blue-800">About Notifications</h3>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• You'll be notified when TPO reviews your report</li>
                  <li>• Status updates appear when action is taken</li>
                  <li>• Educational tips help you stay informed</li>
                  <li>• Your identity remains protected in all notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </StudentProtectedRoute>
  );
}
