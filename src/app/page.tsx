import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorks from '@/components/landing/HowItWorks';
import StatsSection from '@/components/landing/StatsSection';
import CTASection from '@/components/landing/CTASection';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
      
      {/* Footer */}
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-primary-light">
  <div className="max-w-7xl mx-auto">
    <div className="grid md:grid-cols-3 gap-8 mb-8">
      <div>
        <h3 className="text-xl font-bold mb-4 gradient-text">BiasBreaker</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          India's first AI-powered platform to detect and eliminate bias in campus placement communications.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>
            <a href="#features" className="hover:text-accent-cyan transition-colors hover:underline">
              Features
            </a>
          </li>
          <li>
            <a href="#how-it-works" className="hover:text-accent-cyan transition-colors hover:underline">
              How It Works
            </a>
          </li>
          <li>
            <a href="/signup" className="hover:text-accent-cyan transition-colors hover:underline">
              Get Started
            </a>
          </li>
          <li>
            <a href="/login" className="hover:text-accent-cyan transition-colors hover:underline">
              Login
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-white">About</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>Built for Build.exe Hackathon</li>
          <li>By NexusSolvers Team</li>
          <li className="text-accent-green font-semibold">🏆 Innovation Award Candidate</li>
        </ul>
      </div>
    </div>
    
    <div className="pt-8 border-t border-white/5 text-center">
      <p className="text-gray-400 text-sm">
        © 2026 BiasBreaker by <span className="text-accent-cyan font-semibold">NexusSolvers</span>. 
        Built for Build.exe Hackathon.
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Empowering fair campus placements through AI ⚡
      </p>
    </div>
  </div>
</footer>

    </div>
  );
}
