'use client'
import { useState } from 'react';
import StudentNavbar from '@/components/StudentNavbar';
import StudentProtectedRoute from '@/components/StudentProtectedRoute';
import { ref, push, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import toast from 'react-hot-toast';

export default function ReportBiasPage() {
  const { user } = useAuth();
  const [emailText, setEmailText] = useState('');
  const [biasTypes, setBiasTypes] = useState([]);
  const [additionalContext, setAdditionalContext] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');

  const biasOptions = [
    { id: 'gender', label: 'Gender discrimination', icon: '👥', desc: 'Male-only language, gender assumptions' },
    { id: 'branch', label: 'Branch/Department preference', icon: '🎓', desc: 'Only CS/IT students, branch restrictions' },
    { id: 'cgpa', label: 'CGPA barrier', icon: '📚', desc: 'Unreasonably high CGPA requirements' },
    { id: 'financial', label: 'Financial requirement', icon: '💰', desc: 'Laptop, vehicle, or wealth requirements' },
    { id: 'community', label: 'Community/Caste bias', icon: '🏛️', desc: 'Caste or religion based discrimination' },
    { id: 'other', label: 'Other (explain below)', icon: '📝', desc: 'Any other form of bias' },
  ];

  const toggleBiasType = (id) => {
    setBiasTypes(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const generateReportId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 7; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailText.trim()) {
      toast.error('Please paste the biased email content');
      return;
    }
    
    if (biasTypes.length === 0) {
      toast.error('Please select at least one bias type');
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading('📤 Submitting your anonymous report...');

    try {
      const newReportId = generateReportId();
      const reportData = {
        reportId: newReportId,
        emailContent: emailText,
        biasTypes: biasTypes,
        biasType: biasTypes.map(id => biasOptions.find(b => b.id === id)?.label).join(', '),
        additionalContext: additionalContext.trim(),
        status: 'pending',
        submittedAt: new Date().toISOString(),
        studentUid: user.uid, // For student's own view
        isAnonymous: true,
        actionTaken: null,
        tpoNotes: null,
      };

      // Save to student's reports
      const studentReportRef = push(ref(db, `student_reports/${user.uid}`));
      await set(studentReportRef, reportData);

      // Save to TPO's incoming reports (without user identification)
      const tpoReportRef = push(ref(db, 'tpo_reports'));
      await set(tpoReportRef, {
        ...reportData,
        studentUid: null, // Remove student identity for TPO
        studentReportKey: studentReportRef.key, // Keep reference for status updates
      });

      setReportId(newReportId);
      setSubmitted(true);
      toast.success('✅ Report submitted anonymously!', { id: loadingToast });
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.', { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmailText('');
    setBiasTypes([]);
    setAdditionalContext('');
    setSubmitted(false);
    setReportId('');
  };

  if (submitted) {
    return (
      <StudentProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <StudentNavbar />
          
          <main className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg">
                ✅
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Report Submitted Successfully!</h1>
              <p className="text-gray-600 mb-6">Your identity is completely protected.</p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-500 mb-2">Your Report ID</p>
                <p className="text-3xl font-mono font-bold text-green-600">#{reportId}</p>
                <p className="text-xs text-gray-400 mt-2">Save this ID to track your report status</p>
              </div>

              <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <span>🔒</span> What happens next?
                </h3>
                <ul className="text-sm text-green-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Your report has been encrypted and submitted to the Placement Cell</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>TPO will review and take appropriate action</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>You can check the status in "My Reports"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Your identity will NEVER be revealed</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition"
                >
                  Submit Another Report
                </button>
                <a
                  href="/student/my-reports"
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-center"
                >
                  View My Reports
                </a>
              </div>
            </div>
          </main>
        </div>
      </StudentProtectedRoute>
    );
  }

  return (
    <StudentProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <StudentNavbar />
        
        <main className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Report Biased Email Anonymously</h1>
            <p className="text-gray-600">Your identity is 100% protected. Help create fairer placements.</p>
          </div>

          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold text-green-800">Your Privacy is Guaranteed</h3>
                <p className="text-sm text-green-700 mt-1">
                  This report is completely anonymous. Your identity cannot be traced. Only the email content and bias type are shared with the Placement Cell.
                </p>
              </div>
            </div>
          </div>

          {/* Report Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                📧 Paste the Biased Email
              </label>
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Paste the complete email text here that you believe contains bias..."
                className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-700"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                ℹ️ Include the complete email for accurate analysis
              </p>
            </div>

            {/* Bias Type Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                🎯 Select Bias Type(s) You Noticed
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {biasOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleBiasType(option.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      biasTypes.includes(option.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                      biasTypes.includes(option.id)
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {biasTypes.includes(option.id) && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span className="font-medium text-gray-800">{option.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Context */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                📝 Additional Context (Optional)
              </label>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Add any additional context or explanation that might help (optional)..."
                className="w-full h-24 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-700"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || !emailText.trim() || biasTypes.length === 0}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    <span>Submit Report Anonymously</span>
                  </>
                )}
              </button>
            </div>

            {/* Security Note */}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">
                ⚠️ <strong>Your identity is 100% protected.</strong> This report cannot be traced back to you.
              </p>
            </div>
          </form>
        </main>
      </div>
    </StudentProtectedRoute>
  );
}
