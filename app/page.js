'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';

// Animated Counter Component
function AnimatedCounter({ value, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const numValue = parseInt(value) || 0;
      if (numValue === 0) return;
      let start = 0;
      const end = numValue;
      const incrementTime = Math.max((duration * 1000) / end, 20);
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {value === 'Free' ? 'Free' : value === '100%' ? `${count}%` : count}
    </span>
  );
}

// Magnetic Button Component
function MagneticButton({ children, className, href }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.15);
      y.set((e.clientY - centerY) * 0.15);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}

// Text Reveal on Scroll
function TextReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Stagger Container
function StaggerContainer({ children, className, staggerDelay = 0.1 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger Item
function StaggerItem({ children, className }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
    >
      {children}
    </motion.div>
  );
}

// Hover Card with subtle lift
function HoverCard({ children, className }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {children}
    </motion.div>
  );
}

// Typewriter Effect
function Typewriter({ words, className }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(word.substring(0, text.length + 1));
        if (text === word) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setText(word.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, words]);

  return (
    <span className={className}>
      {text}
      <span className="animate-pulse text-blue-500">|</span>
    </span>
  );
}

// Scroll Progress
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
      style={{ scaleX }}
    />
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 100]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { value: '34', label: 'AI Models', icon: '🤖', color: 'bg-purple-100 text-purple-600' },
    { value: '100%', label: 'Accuracy', icon: '🎯', color: 'bg-green-100 text-green-600' },
    { value: '5', label: 'Bias Types', icon: '📊', color: 'bg-blue-100 text-blue-600' },
    { value: 'Free', label: 'Forever', icon: '💝', color: 'bg-pink-100 text-pink-600' }
  ];

  const features = [
    {
      icon: '📧',
      title: 'Upload Emails',
      desc: 'Simply paste or upload placement emails from your college. Our AI analyzes text for hidden bias patterns.',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50 border-blue-200',
    },
    {
      icon: '🤖',
      title: 'AI Analysis',
      desc: 'Gemini 2.5 Flash detects gender bias, department discrimination, and socioeconomic indicators.',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 border-purple-200',
    },
    {
      icon: '📊',
      title: 'Get Insights',
      desc: 'View detailed reports with confidence scores, bias patterns, and actionable recommendations.',
      color: 'bg-green-500',
      lightColor: 'bg-green-50 border-green-200',
    }
  ];

  const biasTypes = [
    { name: 'Gender Bias', icon: '👥', desc: 'Pronouns & role assumptions', color: 'bg-pink-50 border-pink-200 hover:border-pink-400', textColor: 'text-pink-600' },
    { name: 'Department', icon: '🎓', desc: 'CS/IT branch preference', color: 'bg-blue-50 border-blue-200 hover:border-blue-400', textColor: 'text-blue-600' },
    { name: 'Socioeconomic', icon: '🏠', desc: 'Hostel, fees, background', color: 'bg-orange-50 border-orange-200 hover:border-orange-400', textColor: 'text-orange-600' },
    { name: 'Academic', icon: '📚', desc: 'Unrealistic CGPA cutoffs', color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400', textColor: 'text-yellow-600' },
    { name: 'Community', icon: '🏛️', desc: 'Caste/religion indicators', color: 'bg-green-50 border-green-200 hover:border-green-400', textColor: 'text-green-600' }
  ];

  const powerFeatures = [
    { icon: '⚡', title: 'Real-Time Analysis', desc: 'Get results in under 3 seconds', color: 'from-yellow-400 to-orange-500' },
    { icon: '📊', title: 'Visual Reports', desc: 'Interactive charts and graphs', color: 'from-blue-400 to-cyan-500' },
    { icon: '📁', title: 'Batch Processing', desc: 'Analyze up to 10 emails at once', color: 'from-purple-400 to-pink-500' },
    { icon: '🔍', title: 'Deep Insights', desc: 'Detailed pattern explanations', color: 'from-green-400 to-teal-500' },
    { icon: '📄', title: 'Export Reports', desc: 'PDF & CSV downloads', color: 'from-red-400 to-rose-500' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Your data stays protected', color: 'from-indigo-400 to-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ScrollProgress />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
            animate={{ 
              x: [0, 30, 0], 
              y: [0, -30, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-20 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
            animate={{ 
              x: [0, -20, 0], 
              y: [0, 40, 0],
              scale: [1, 1.15, 1] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div 
            className="absolute -bottom-20 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
            animate={{ 
              x: [0, 40, 0], 
              y: [0, -20, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <motion.div 
          className="max-w-6xl mx-auto relative z-10"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-lg border border-gray-100">
              <motion.span 
                className="text-xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
              <span className="text-sm font-semibold text-gray-700">Powered by Google Gemini AI</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              Detect Bias in
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                Campus Placements
              </span>
            </h1>
            
            {/* Typewriter */}
            <div className="h-10 flex items-center justify-center mb-4">
              {mounted && (
                <span className="text-lg md:text-xl text-gray-500">
                  Fighting against{' '}
                  <Typewriter
                    words={['Gender Discrimination', 'Department Bias', 'Socioeconomic Barriers', 'Unfair Cutoffs', 'Community Prejudice']}
                    className="font-semibold text-gray-800"
                  />
                </span>
              )}
            </div>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              AI-powered analysis to identify discrimination patterns in placement emails, 
              ensuring <span className="font-semibold text-gray-800">fair opportunities</span> for all students.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <MagneticButton
              href="/upload"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <span className="flex items-center gap-2">
                Start Analysis
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </MagneticButton>

            <MagneticButton
              href="/about"
              className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
            >
              Learn More
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto" staggerDelay={0.1}>
            {stats.map((stat, index) => (
              <StaggerItem key={index}>
                <HoverCard className={`${stat.color.split(' ')[0]} rounded-2xl p-6 border border-gray-100 shadow-md cursor-pointer`}>
                  <motion.div 
                    className="text-4xl mb-2"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className={`text-3xl font-black ${stat.color.split(' ')[1]} mb-1`}>
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-5 h-8 rounded-full border-2 border-gray-300 flex items-start justify-center p-1.5">
              <motion.div
                className="w-1 h-1.5 bg-gray-400 rounded-full"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <TextReveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                HOW IT WORKS
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Three Simple Steps
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Advanced AI analysis to detect subtle discrimination patterns
              </p>
            </div>
          </TextReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <HoverCard className={`relative p-8 rounded-2xl border-2 ${feature.lightColor} shadow-sm hover:shadow-lg transition-all duration-300`}>
                  {/* Step Number */}
                  <div className={`absolute -top-4 -left-4 w-10 h-10 ${feature.color} text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg`}>
                    {index + 1}
                  </div>

                  <motion.div 
                    className="text-5xl mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* What We Detect */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <TextReveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
                BIAS DETECTION
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                What We Detect
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Five types of discrimination patterns our AI identifies
              </p>
            </div>
          </TextReveal>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4" staggerDelay={0.08}>
            {biasTypes.map((bias, index) => (
              <StaggerItem key={index}>
                <HoverCard className={`p-6 rounded-2xl border-2 ${bias.color} bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer text-center`}>
                  <motion.div 
                    className="text-4xl mb-3"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {bias.icon}
                  </motion.div>
                  <h3 className={`text-lg font-bold ${bias.textColor} mb-1`}>{bias.name}</h3>
                  <p className="text-sm text-gray-500">{bias.desc}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Powerful Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <TextReveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
                FEATURES
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need for comprehensive bias detection
              </p>
            </div>
          </TextReveal>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {powerFeatures.map((feature, index) => (
              <StaggerItem key={index}>
                <HoverCard className="group p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <motion.div 
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 shadow-md`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <TextReveal>
            <motion.div 
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-12 md:p-16 text-center"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
              </div>

              <div className="relative z-10">
                <motion.div
                  className="text-6xl mb-6"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎯
                </motion.div>
                
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                  Ready to Ensure Fair Placements?
                </h2>
                <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
                  Join students fighting for equal opportunities in campus placements
                </p>
                
                <MagneticButton
                  href="/upload"
                  className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Get Started for Free
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </MagneticButton>
              </div>
            </motion.div>
          </TextReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <StaggerContainer className="grid md:grid-cols-4 gap-10" staggerDelay={0.1}>
            {/* Brand */}
            <StaggerItem className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-xl shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  🎯
                </motion.div>
                <span className="text-xl font-bold text-white">BiasBreaker</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                AI-powered campus placement bias detection using Google Gemini. 
                Fighting for equal opportunities in education.
              </p>
            </StaggerItem>

            {/* Quick Links */}
            <StaggerItem>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {['Dashboard', 'Upload', 'Reports', 'About'].map((link) => (
                  <motion.div key={link} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <Link href={`/${link.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                      <span className="text-blue-500 text-xs">→</span>
                      {link}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </StaggerItem>

            {/* Tech Stack */}
            <StaggerItem>
              <h3 className="text-white font-bold mb-4">Tech Stack</h3>
              <div className="space-y-1.5 text-sm text-gray-400">
                <p>⚡ Next.js 15</p>
                <p>🤖 Google Gemini 2.5 Flash</p>
                <p>🔥 Firebase</p>
                <p>🎨 Tailwind CSS</p>
                <p>✨ Framer Motion</p>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <motion.div 
            className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p>Built for Google Technologies Hackathon 2025 • Made with ❤️ by Team NexusSolvers</p>
            <p className="mt-1 text-gray-600">Nagpur, India</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
