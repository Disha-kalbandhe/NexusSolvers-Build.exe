'use client'
import { useState } from 'react';
import StudentNavbar from '@/components/StudentNavbar';
import StudentProtectedRoute from '@/components/StudentProtectedRoute';
import Link from 'next/link';

export default function LearnPage() {
  const [activeSection, setActiveSection] = useState('what-is-bias');

  const sections = [
    { id: 'what-is-bias', title: 'What is Bias?', icon: '🎯' },
    { id: 'gender-bias', title: 'Gender Bias', icon: '👥' },
    { id: 'department-bias', title: 'Department Discrimination', icon: '🎓' },
    { id: 'your-rights', title: 'Your Rights (UGC 2026)', icon: '⚖️' },
    { id: 'how-reporting-works', title: 'How Reporting Works', icon: '📝' },
    { id: 'success-stories', title: 'Success Stories', icon: '🌟' },
    { id: 'faq', title: 'FAQs', icon: '❓' },
  ];

  const content = {
    'what-is-bias': {
      title: 'What is Bias in Placements?',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Placement bias occurs when job opportunities, selection criteria, or communication unfairly favor or exclude students based on factors unrelated to their skills and qualifications.
          </p>
          
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">Common Types of Placement Bias:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <span className="text-2xl">👥</span>
                <h5 className="font-semibold text-gray-800 mt-2">Gender Bias</h5>
                <p className="text-sm text-gray-600 mt-1">Using gendered language, assuming roles based on gender</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <span className="text-2xl">🎓</span>
                <h5 className="font-semibold text-gray-800 mt-2">Department Preference</h5>
                <p className="text-sm text-gray-600 mt-1">Only allowing CS/IT students for general roles</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <span className="text-2xl">📚</span>
                <h5 className="font-semibold text-gray-800 mt-2">CGPA Elitism</h5>
                <p className="text-sm text-gray-600 mt-1">Unreasonably high cutoffs like 9.0+ CGPA</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <span className="text-2xl">💰</span>
                <h5 className="font-semibold text-gray-800 mt-2">Socioeconomic Barriers</h5>
                <p className="text-sm text-gray-600 mt-1">Requiring personal laptops, vehicles, or paid certifications</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Remember</h4>
            <p className="text-yellow-700">
              Bias isn't always intentional. Even well-meaning communications can contain biased language. 
              That's why tools like BiasBreaker help identify and correct these patterns.
            </p>
          </div>
        </div>
      )
    },
    'gender-bias': {
      title: 'Understanding Gender Bias',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Gender bias in placement communications often appears in subtle ways through language choices, 
            assumptions about roles, and expectations about work-life priorities.
          </p>

          <div className="bg-red-50 rounded-xl p-5 border border-red-200">
            <h4 className="font-semibold text-red-800 mb-3">❌ Examples of Gendered Language:</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 bg-white rounded-lg p-3">
                <span className="text-red-500 font-bold">✗</span>
                <div>
                  <p className="font-medium text-gray-800">"Dear Sir"</p>
                  <p className="text-sm text-gray-600">Assumes all applicants are male</p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-lg p-3">
                <span className="text-red-500 font-bold">✗</span>
                <div>
                  <p className="font-medium text-gray-800">"Looking for aggressive go-getters"</p>
                  <p className="text-sm text-gray-600">Male-coded language that discourages female applicants</p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-lg p-3">
                <span className="text-red-500 font-bold">✗</span>
                <div>
                  <p className="font-medium text-gray-800">"Must be willing to work late without family constraints"</p>
                  <p className="text-sm text-gray-600">Implies women with families shouldn't apply</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">✅ Gender-Neutral Alternatives:</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 bg-white rounded-lg p-3">
                <span className="text-green-500 font-bold">✓</span>
                <div>
                  <p className="font-medium text-gray-800">"Dear Student" or "Dear Candidate"</p>
                  <p className="text-sm text-gray-600">Inclusive greeting for all genders</p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-lg p-3">
                <span className="text-green-500 font-bold">✓</span>
                <div>
                  <p className="font-medium text-gray-800">"Looking for motivated team players"</p>
                  <p className="text-sm text-gray-600">Describes qualities without gender coding</p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-lg p-3">
                <span className="text-green-500 font-bold">✓</span>
                <div>
                  <p className="font-medium text-gray-800">"Flexible work arrangements available"</p>
                  <p className="text-sm text-gray-600">Welcoming to all regardless of personal situation</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    'department-bias': {
      title: 'Department Discrimination Explained',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Department discrimination occurs when companies restrict opportunities to specific branches 
            without a valid job-related reason. While some technical roles genuinely require specific 
            skills, many roles can be performed by students from any engineering or science background.
          </p>

          <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-3">Common Discriminatory Practices:</h4>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="font-medium text-gray-800">"Only CS/IT students allowed"</p>
                <p className="text-sm text-gray-600 mt-1">
                  For roles like data entry, customer support, or general management trainee positions 
                  that don't require coding skills.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-medium text-gray-800">"Circuital branches only"</p>
                <p className="text-sm text-gray-600 mt-1">
                  Excluding mechanical, civil, or chemical engineering students from IT companies 
                  without considering their aptitude.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-medium text-gray-800">"Core branches not eligible"</p>
                <p className="text-sm text-gray-600 mt-1">
                  Many successful tech professionals come from non-CS backgrounds and learned 
                  programming independently.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">💡 Know This:</h4>
            <ul className="space-y-2 text-blue-700">
              <li>• UGC guidelines discourage arbitrary branch restrictions</li>
              <li>• Skills-based hiring is more effective than branch-based</li>
              <li>• Many companies now conduct aptitude tests open to all branches</li>
              <li>• If you have the skills, you deserve the opportunity</li>
            </ul>
          </div>
        </div>
      )
    },
    'your-rights': {
      title: 'Your Rights Under UGC 2026 Regulations',
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3">⚖️ UGC Placement Guidelines 2026</h4>
            <p className="text-purple-700">
              The University Grants Commission has issued comprehensive guidelines to ensure fair 
              and unbiased campus placement processes across all higher education institutions.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Key Protections:</h4>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h5 className="font-semibold text-gray-800">Non-Discrimination Clause</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Companies cannot discriminate based on gender, caste, religion, regional 
                    background, or disability status in their hiring communications or criteria.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h5 className="font-semibold text-gray-800">Reasonable CGPA Requirements</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    CGPA cutoffs must be justified and reasonable. Blanket high cutoffs (like 9.0+) 
                    without clear job relevance may be considered discriminatory.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h5 className="font-semibold text-gray-800">Skills-Based Selection</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Companies are encouraged to evaluate candidates based on skills and aptitude 
                    rather than arbitrary demographic filters.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <h5 className="font-semibold text-gray-800">Grievance Mechanism</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Every institution must have a placement grievance committee where students 
                    can report discriminatory practices anonymously.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">✅ What This Means For You</h4>
            <p className="text-green-700">
              You have the right to fair treatment in placements. If you encounter biased 
              communications, you can report them without fear of retaliation. BiasBreaker 
              helps your Placement Cell identify and address these issues.
            </p>
          </div>
        </div>
      )
    },
    'how-reporting-works': {
      title: 'How Anonymous Reporting Works',
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-4">🔄 The Reporting Process</h4>
            
            <div className="space-y-4">
              {[
                { step: 1, title: 'You Submit a Report', desc: 'Paste the biased email and select bias types. Your identity is encrypted.', icon: '📝' },
                { step: 2, title: 'Report Gets Encrypted', desc: 'Your identity is completely removed. Only the content reaches TPO.', icon: '🔒' },
                { step: 3, title: 'TPO Reviews', desc: 'The Placement Cell analyzes the report using AI and manual review.', icon: '🔍' },
                { step: 4, title: 'Action Taken', desc: 'TPO contacts the company to address the issue.', icon: '📞' },
                { step: 5, title: 'You Get Updated', desc: 'You can track your report status in "My Reports" section.', icon: '📊' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        Step {item.step}
                      </span>
                      <h5 className="font-semibold text-gray-800">{item.title}</h5>
                    </div>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">🔒 Privacy Guarantees</h4>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Your name is NEVER stored with the report</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>TPO cannot see who submitted the report</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Companies are never told about individual reporters</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Reports are presented as "systemic feedback"</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>No retaliation is possible because no one knows</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    'success-stories': {
      title: 'Success Stories (Anonymized)',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            These are real examples of how bias reporting has made a difference. 
            Names and specific details have been changed to protect privacy.
          </p>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                  🏢
                </div>
                <div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Resolved
                  </span>
                  <h4 className="font-semibold text-gray-800 mt-2">Tech Company Gender Bias</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    A leading IT company's job posting used "he/him" pronouns throughout and 
                    mentioned preference for candidates "without family obligations." After 
                    multiple anonymous reports, the TPO contacted the company. They revised 
                    their JD and conducted diversity training for their HR team.
                  </p>
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    Impact: 40% increase in female applicants for that role
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                  🎓
                </div>
                <div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Resolved
                  </span>
                  <h4 className="font-semibold text-gray-800 mt-2">Branch Restriction Removed</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    A consulting firm initially restricted applications to CS/IT only for a 
                    business analyst role. Mechanical and ECE students reported this as unfair. 
                    After review, the company opened applications to all branches with an 
                    aptitude test requirement.
                  </p>
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    Impact: 3 non-CS students got selected in that drive
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                  📚
                </div>
                <div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Resolved
                  </span>
                  <h4 className="font-semibold text-gray-800 mt-2">CGPA Cutoff Reduced</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    A company required 9.0+ CGPA for a customer support role. Students pointed 
                    out this was excessive for the position. The TPO discussed with the company, 
                    and they reduced the cutoff to 7.0 CGPA.
                  </p>
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    Impact: 200+ more students became eligible
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💪 Your Voice Matters</h4>
            <p className="text-blue-700">
              Every report contributes to systemic change. Even if a single report doesn't 
              immediately change things, patterns of reports help TPOs identify problem 
              companies and address recurring issues.
            </p>
          </div>
        </div>
      )
    },
    'faq': {
      title: 'Frequently Asked Questions',
      content: (
        <div className="space-y-4">
          {[
            {
              q: 'Will reporting affect my placement?',
              a: 'No. Your identity is completely protected. Neither the TPO nor the company can know who submitted the report. Your placement opportunities remain unaffected.'
            },
            {
              q: 'Can I report multiple emails from the same company?',
              a: 'Yes. Each report is tracked separately. Multiple reports from different students strengthen the case for action.'
            },
            {
              q: 'What if I\'m not sure if something is biased?',
              a: 'Use our Quick Bias Checker first (3 free checks per day). It will analyze the email and tell you if bias patterns exist.'
            },
            {
              q: 'How long does it take for action to be taken?',
              a: 'Typically 1-2 weeks. TPOs review reports, analyze patterns, and then communicate with companies. Complex cases may take longer.'
            },
            {
              q: 'Can the company find out I reported them?',
              a: 'Absolutely not. Reports are presented to companies as "aggregate student feedback" without any individual identification.'
            },
            {
              q: 'What if my report is ignored?',
              a: 'All reports are logged and tracked. Even if immediate action isn\'t taken, the data helps identify patterns over time.'
            },
            {
              q: 'Can I withdraw my report?',
              a: 'Since reports are anonymous, they cannot be withdrawn. However, they can only help, not harm anyone.'
            },
            {
              q: 'Is this legal?',
              a: 'Yes. Reporting discrimination is protected under various employment and education laws. Anonymous feedback mechanisms are encouraged by UGC.'
            },
          ].map((faq, index) => (
            <details key={index} className="bg-white rounded-xl border border-gray-200 group">
              <summary className="p-4 font-semibold text-gray-800 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="text-green-600">Q:</span>
                  {faq.q}
                </span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-4 pt-2 text-gray-600 border-t border-gray-100">
                <span className="text-green-600 font-medium">A:</span> {faq.a}
              </div>
            </details>
          ))}
        </div>
      )
    }
  };

  return (
    <StudentProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <StudentNavbar />
        
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Learn About Bias</h1>
            <p className="text-gray-600">Educational resources to help you understand and identify placement bias</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                <div className="p-4 bg-green-50 border-b border-green-100">
                  <h3 className="font-semibold text-green-800">📚 Topics</h3>
                </div>
                <nav className="p-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                        activeSection === section.id
                          ? 'bg-green-100 text-green-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{section.icon}</span>
                      <span className="text-sm">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {content[activeSection]?.title}
                </h2>
                {content[activeSection]?.content}
              </div>

              {/* CTA */}
              <div className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Ready to Take Action?</h3>
                    <p className="text-green-100">Report biased emails anonymously and make a difference.</p>
                  </div>
                  <Link
                    href="/student/report"
                    className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition flex items-center gap-2"
                  >
                    <span>📝</span>
                    Submit Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </StudentProtectedRoute>
  );
}
