'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { useScrollReveal } from '@/lib/hooks/useScrollReveal';

// Scroll Reveal Component
function ScrollReveal({ children, animation = 'fade-up', delay = 0 }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1, once: true });
  
  const animations = {
    'fade-up': 'translate-y-10 opacity-0',
    'fade-down': '-translate-y-10 opacity-0',
    'fade-left': 'translate-x-10 opacity-0',
    'fade-right': '-translate-x-10 opacity-0',
    'zoom-in': 'scale-90 opacity-0',
    'zoom-out': 'scale-110 opacity-0'
  };

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 translate-x-0 scale-100 opacity-100' : animations[animation]
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Demo student reports data
const demoStudentReports = [
  {
    reportId: 'STU7X9K2',
    emailContent: `Subject: Software Engineer Opening - TechCorp
    
Dear Sir,

TechCorp is hiring for Software Engineer positions. We are looking for young men who can handle challenging work environments. Only CS and IT students with 9.0+ CGPA from premium hostels are eligible.

The candidate must own a personal laptop and vehicle. He should be ready to work long hours without family constraints.

Requirements:
- Male candidates only
- CS/IT branch mandatory
- CGPA above 9.0
- Premium hostel residents preferred
- Must own vehicle and laptop

Regards,
HR Team`,
    biasTypes: ['gender', 'branch', 'cgpa', 'financial'],
    biasType: 'Gender discrimination, Branch/Department preference, CGPA barrier, Financial requirement',
    additionalContext: 'This email was sent to our college placement group. It clearly discriminates against female students and students from other branches.',
    status: 'pending',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isAnonymous: true,
    actionTaken: null,
    tpoNotes: null,
  },
  {
    reportId: 'STU3M5P8',
    emailContent: `Subject: Management Trainee Program - FinanceHub

Hello Students,

FinanceHub is conducting recruitment for Management Trainees. 

Eligibility:
- Students from AC hostels only
- Must have family business background
- Training bond: Rs. 75,000 (non-refundable)
- Own vehicle mandatory for client visits

Selected candidates will need to provide family income certificate and property documents.

Best regards,
Recruitment Team`,
    biasTypes: ['financial', 'community'],
    biasType: 'Financial requirement, Community/Caste bias',
    additionalContext: 'This clearly discriminates against students from lower economic backgrounds. The family business requirement and property documents demand is unfair.',
    status: 'reviewing',
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isAnonymous: true,
    actionTaken: null,
    tpoNotes: 'Reviewing company policies. Will contact HR.',
  },
  {
    reportId: 'STU9R2L4',
    emailContent: `Subject: Data Analyst Position - DataPro

Dear Students,

We invite applications for Data Analyst role.

Strict Requirements:
- Only IIT/NIT graduates
- CGPA minimum 9.5 (absolutely no exceptions)
- Must have published research papers
- Foreign education experience preferred

Note: Students from state universities and tier-2 colleges need not apply.

HR Department`,
    biasTypes: ['cgpa', 'other'],
    biasType: 'CGPA barrier, Other (explain below)',
    additionalContext: 'This is academic elitism. Discriminating based on college tier is unfair to talented students from other institutions.',
    status: 'resolved',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isAnonymous: true,
    actionTaken: 'Company has been contacted and agreed to remove institute-based restrictions. Updated email sent to students.',
    tpoNotes: 'Issue resolved after discussion with company HR.',
  },
  {
    reportId: 'STU6K1N7',
    emailContent: `Subject: Marketing Executive - BrandBoost

Hi,

Looking for Marketing Executives. The ideal candidate should be an outgoing gentleman with excellent communication.

He should be comfortable with late-night client meetings and weekend travel. Family persons may find this role challenging.

Only male candidates between 22-25 years preferred.

Thanks,
BrandBoost HR`,
    biasTypes: ['gender'],
    biasType: 'Gender discrimination',
    additionalContext: 'Clear gender bias - explicitly mentions "gentleman" and "male candidates only". Also age discrimination.',
    status: 'pending',
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    isAnonymous: true,
    actionTaken: null,
    tpoNotes: null,
  },
  {
    reportId: 'STU2W8Q5',
    emailContent: `Subject: Internship - LocalStartup

Dear Students,

6-month unpaid internship available. 

Requirements:
- Must have own laptop (minimum i7 processor, 16GB RAM)
- Personal WiFi connection required
- Should be able to work from premium coworking space (cost to be borne by intern)
- Security deposit of Rs. 25,000 required

This is a great opportunity to learn!

Regards`,
    biasTypes: ['financial'],
    biasType: 'Financial requirement',
    additionalContext: 'Unpaid internship with so many financial requirements is exploitation. Many students cannot afford these things.',
    status: 'reviewing',
    submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    isAnonymous: true,
    actionTaken: null,
    tpoNotes: 'Flagged for review. Checking if company meets our placement policy.',
  },
];

function StudentReportsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [tpoNotes, setTpoNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('');

  useEffect(() => {
    // Load from Firebase tpo_reports
    const reportsRef = ref(db, 'tpo_reports');
    
    const unsubscribe = onValue(reportsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const reportsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        setReports(reportsArray);
      } else {
        // If no reports in Firebase, use demo data
        setReports(demoStudentReports.map((r, i) => ({ ...r, id: `demo_${i}` })));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addDemoReports = async () => {
    const loadingToast = toast.loading('Adding demo reports...');
    try {
      const reportsRef = ref(db, 'tpo_reports');
      
      for (const report of demoStudentReports) {
        const newReportRef = ref(db, `tpo_reports/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        await update(newReportRef, report);
      }
      
      toast.success(`✅ Added ${demoStudentReports.length} demo reports!`, { id: loadingToast });
    } catch (error) {
      console.error('Error adding demo reports:', error);
      toast.error('Failed to add demo reports', { id: loadingToast });
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const reportRef = ref(db, `tpo_reports/${reportId}`);
      await update(reportRef, { 
        status: newStatus,
        tpoNotes: tpoNotes || null,
        actionTaken: actionTaken || null,
        updatedAt: new Date().toISOString()
      });
      
      toast.success(`Report status updated to ${newStatus}`);
      setSelectedReport(null);
      setTpoNotes('');
      setActionTaken('');
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold border border-yellow-300 flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            Pending Review
          </span>
        );
      case 'reviewing':
        return (
          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-300 flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Under Review
          </span>
        );
      case 'resolved':
        return (
          <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-300 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Resolved
          </span>
        );
      case 'dismissed':
        return (
          <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-xs font-bold border border-gray-300 flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            Dismissed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  const getBiasIcon = (type) => {
    const icons = {
      'gender': '👥',
      'branch': '🎓',
      'cgpa': '📚',
      'financial': '💰',
      'community': '🏛️',
      'other': '📝'
    };
    return icons[type] || '⚠️';
  };

  const filteredReports = filterStatus === 'all' 
    ? reports 
    : reports.filter(r => r.status === filterStatus);

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    reviewing: reports.filter(r => r.status === 'reviewing').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading student reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-down">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              <div className="relative flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-black">Student Bias Reports</h1>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                      📋 TPO Panel
                    </span>
                  </div>
                  <p className="text-red-100 text-lg">
                    Anonymous bias reports submitted by students. Review and take action.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-xl">
                    <span className="text-5xl">🚨</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Cards */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
                  📊
                </div>
                <span className="text-3xl font-black text-gray-900">{stats.total}</span>
              </div>
              <p className="text-sm font-semibold text-gray-600">Total Reports</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-200 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-xl shadow-lg">
                  ⏳
                </div>
                <span className="text-3xl font-black text-yellow-600">{stats.pending}</span>
              </div>
              <p className="text-sm font-semibold text-gray-600">Pending Review</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl shadow-lg">
                  🔍
                </div>
                <span className="text-3xl font-black text-blue-600">{stats.reviewing}</span>
              </div>
              <p className="text-sm font-semibold text-gray-600">Under Review</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
                  ✅
                </div>
                <span className="text-3xl font-black text-green-600">{stats.resolved}</span>
              </div>
              <p className="text-sm font-semibold text-gray-600">Resolved</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Filters & Actions */}
        <ScrollReveal animation="fade-up" delay={150}>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-600">Filter:</span>
              {['all', 'pending', 'reviewing', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && (
                    <span className="ml-1 opacity-75">
                      ({status === 'pending' ? stats.pending : status === 'reviewing' ? stats.reviewing : stats.resolved})
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <button
              onClick={addDemoReports}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
            >
              ➕ Add Demo Reports
            </button>
          </div>
        </ScrollReveal>

        {/* Reports List */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Reports Found</h3>
                <p className="text-gray-600 mb-6">
                  {filterStatus === 'all' 
                    ? 'No student reports have been submitted yet.' 
                    : `No ${filterStatus} reports found.`}
                </p>
                <button
                  onClick={addDemoReports}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                >
                  ➕ Add Demo Reports for Testing
                </button>
              </div>
            ) : (
              filteredReports.map((report, index) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Report Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                          🚨
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-lg font-bold text-gray-900">
                              #{report.reportId}
                            </span>
                            {getStatusBadge(report.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Submitted: {new Date(report.submittedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-bold border border-purple-200">
                          🔒 Anonymous
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bias Types */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">REPORTED BIAS TYPES:</p>
                    <div className="flex flex-wrap gap-2">
                      {report.biasTypes?.map((type) => (
                        <span
                          key={type}
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-1.5 shadow-sm"
                        >
                          {getBiasIcon(type)}
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Email Content Preview */}
                  <div className="p-6">
                    <p className="text-xs font-semibold text-gray-500 mb-2">REPORTED EMAIL CONTENT:</p>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-48 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                        {report.emailContent}
                      </pre>
                    </div>
                    
                    {report.additionalContext && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2">STUDENT'S CONTEXT:</p>
                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                          "{report.additionalContext}"
                        </p>
                      </div>
                    )}
                    
                    {report.tpoNotes && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2">TPO NOTES:</p>
                        <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          {report.tpoNotes}
                        </p>
                      </div>
                    )}
                    
                    {report.actionTaken && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2">ACTION TAKEN:</p>
                        <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                          ✅ {report.actionTaken}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-3">
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            updateReportStatus(report.id, 'reviewing');
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                        >
                          🔍 Start Review
                        </button>
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
                        >
                          ✍️ Add Notes
                        </button>
                      </>
                    )}
                    
                    {report.status === 'reviewing' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                        >
                          ✅ Mark Resolved
                        </button>
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
                        >
                          ✍️ Update Notes
                        </button>
                      </>
                    )}
                    
                    {report.status === 'resolved' && (
                      <span className="text-sm text-green-600 font-medium">
                        ✅ This report has been resolved
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollReveal>

        {/* Update Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    Update Report #{selectedReport.reportId}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedReport(null);
                      setTpoNotes('');
                      setActionTaken('');
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    TPO Notes (Internal)
                  </label>
                  <textarea
                    value={tpoNotes}
                    onChange={(e) => setTpoNotes(e.target.value)}
                    placeholder="Add your internal notes here..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Action Taken (Visible to Student)
                  </label>
                  <textarea
                    value={actionTaken}
                    onChange={(e) => setActionTaken(e.target.value)}
                    placeholder="Describe the action taken..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition text-gray-900"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  {selectedReport.status !== 'resolved' && (
                    <button
                      onClick={() => updateReportStatus(selectedReport.id, 'resolved')}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                      ✅ Mark as Resolved
                    </button>
                  )}
                  <button
                    onClick={() => updateReportStatus(selectedReport.id, selectedReport.status)}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    💾 Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentReportsPage() {
  return (
    <ProtectedRoute>
      <StudentReportsContent />
    </ProtectedRoute>
  );
}
