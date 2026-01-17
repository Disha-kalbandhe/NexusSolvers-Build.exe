'use client'
import { useState, useEffect } from 'react';
import StudentNavbar from '@/components/StudentNavbar';
import StudentProtectedRoute from '@/components/StudentProtectedRoute';
import { ref, get, set, increment } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import toast from 'react-hot-toast';

export default function BiasCheckerPage() {
  const { user } = useAuth();
  const [emailText, setEmailText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [checksRemaining, setChecksRemaining] = useState(3);
  const [todayChecks, setTodayChecks] = useState(0);

  useEffect(() => {
    if (!user) return;
    checkRateLimit();
  }, [user]);

  const checkRateLimit = async () => {
    const today = new Date().toISOString().split('T')[0];
    const rateLimitRef = ref(db, `rate_limits/${user.uid}/${today}`);
    
    try {
      const snapshot = await get(rateLimitRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setTodayChecks(data.checks || 0);
        setChecksRemaining(Math.max(0, 3 - (data.checks || 0)));
      } else {
        setTodayChecks(0);
        setChecksRemaining(3);
      }
    } catch (error) {
      console.error('Error checking rate limit:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!emailText.trim()) {
      toast.error('Please paste email content to analyze');
      return;
    }

    if (checksRemaining <= 0) {
      toast.error('Daily limit reached. Try again tomorrow or submit a report.');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      // Call the analyze API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          emailText,
          quickCheck: true // Flag for lighter analysis
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        
        // Update rate limit
        const today = new Date().toISOString().split('T')[0];
        const rateLimitRef = ref(db, `rate_limits/${user.uid}/${today}`);
        await set(rateLimitRef, {
          checks: todayChecks + 1,
          lastCheck: new Date().toISOString()
        });
        
        setTodayChecks(prev => prev + 1);
        setChecksRemaining(prev => prev - 1);
        
        toast.success('Analysis complete!');
      } else {
        toast.error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const clearResult = () => {
    setResult(null);
    setEmailText('');
  };

  return (
    <StudentProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <StudentNavbar />
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quick Bias Checker</h1>
            <p className="text-gray-600">Check any placement email for potential bias patterns</p>
          </div>

          {/* Rate Limit Info */}
          <div className={`rounded-xl p-4 mb-6 flex items-center justify-between ${
            checksRemaining > 0 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{checksRemaining > 0 ? '🔍' : '⏳'}</span>
              <div>
                <p className={`font-semibold ${checksRemaining > 0 ? 'text-green-800' : 'text-red-800'}`}>
                  {checksRemaining > 0 
                    ? `${checksRemaining} checks remaining today`
                    : 'Daily limit reached'
                  }
                </p>
                <p className={`text-sm ${checksRemaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {checksRemaining > 0 
                    ? 'Use wisely! For serious concerns, submit a report instead.'
                    : 'Come back tomorrow or submit an anonymous report.'
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    i <= checksRemaining ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {!result ? (
            /* Input Section */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                📧 Paste Email Content
              </label>
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Paste the placement email you want to check for bias..."
                className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-700"
                disabled={checksRemaining <= 0}
              />
              
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {emailText.length} characters
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !emailText.trim() || checksRemaining <= 0}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      Check for Bias
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="space-y-6">
              {/* Result Header */}
              <div className={`rounded-xl p-6 ${
                result.biasDetected 
                  ? 'bg-red-50 border-2 border-red-200' 
                  : 'bg-green-50 border-2 border-green-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
                      result.biasDetected ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      {result.biasDetected ? '⚠️' : '✅'}
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${
                        result.biasDetected ? 'text-red-800' : 'text-green-800'
                      }`}>
                        {result.biasDetected ? 'Bias Detected' : 'No Bias Detected'}
                      </h2>
                      <p className={`${result.biasDetected ? 'text-red-600' : 'text-green-600'}`}>
                        Confidence: {result.confidence || 85}%
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearResult}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Bias Patterns */}
              {result.biasDetected && result.patterns && result.patterns.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Detected Bias Patterns</h3>
                  <div className="space-y-4">
                    {result.patterns.map((pattern, index) => (
                      <div key={index} className={`rounded-lg p-4 border ${getSeverityColor(pattern.severity)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold capitalize">
                            {pattern.type?.replace('_', ' ') || 'Bias Type'}
                          </span>
                          <span className="text-sm font-medium px-2 py-1 rounded-full bg-white/50">
                            {pattern.severity || 'Medium'} Severity
                          </span>
                        </div>
                        {pattern.evidence && (
                          <p className="text-sm mb-2">
                            <span className="font-medium">Evidence:</span> "{pattern.evidence}"
                          </p>
                        )}
                        {pattern.reasoning && (
                          <p className="text-sm opacity-80">{pattern.reasoning}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              {result.biasDetected && (
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h3 className="font-semibold text-blue-800">What should you do?</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        If you believe this email is genuinely biased and affects placement opportunities, 
                        consider submitting an anonymous report to the Placement Cell. Your identity will be protected.
                      </p>
                      <a
                        href="/student/report"
                        className="inline-flex items-center gap-2 mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        <span>📝</span>
                        Submit Anonymous Report
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Check Another */}
              <div className="flex justify-center">
                <button
                  onClick={clearResult}
                  disabled={checksRemaining <= 0}
                  className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <span>🔄</span>
                  Check Another Email ({checksRemaining} remaining)
                </button>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>ℹ️</span> About Quick Bias Check
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-700 mb-1">What we check for:</p>
                <ul className="space-y-1">
                  <li>• Gender-coded language</li>
                  <li>• Department/branch discrimination</li>
                  <li>• Unreasonable CGPA requirements</li>
                  <li>• Socioeconomic barriers</li>
                  <li>• Community/caste indicators</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Why 3 checks per day?</p>
                <ul className="space-y-1">
                  <li>• Prevents system abuse</li>
                  <li>• Encourages meaningful use</li>
                  <li>• For serious concerns, submit a report</li>
                  <li>• Unlimited reports are always free</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </StudentProtectedRoute>
  );
}
