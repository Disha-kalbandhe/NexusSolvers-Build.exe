'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, BarChart3, FileText, Shield, Zap, Globe, CheckCircle, Sparkles } from 'lucide-react';


const features = [
  {
    icon: Brain,
    title: 'AI-Powered Detection',
    description: 'Advanced Gemini AI analyzes text with 95%+ accuracy to identify subtle bias patterns in job descriptions and emails.',
    color: 'text-accent-cyan',
    bgColor: 'from-accent-cyan/20 to-accent-cyan/5',
    highlights: ['Gemini 2.5 Flash', '95% Accuracy', 'Real-time'],
  },
  {
    icon: Zap,
    title: 'Instant Analysis',
    description: 'Get comprehensive results in under 3 seconds with evidence highlighting and severity classification.',
    color: 'text-accent-green',
    bgColor: 'from-accent-green/20 to-accent-green/5',
    highlights: ['<3s Response', 'Evidence Highlighting', 'Severity Levels'],
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Interactive dashboards with beautiful charts showing bias trends, patterns, and historical data.',
    color: 'text-accent-pink',
    bgColor: 'from-accent-pink/20 to-accent-pink/5',
    highlights: ['Interactive Charts', 'Trend Analysis', 'Exportable'],
  },
  {
    icon: FileText,
    title: 'PDF Reports',
    description: 'Generate professional, submission-ready PDF reports with evidence, analysis, and recommendations.',
    color: 'text-yellow-400',
    bgColor: 'from-yellow-400/20 to-yellow-400/5',
    highlights: ['One-Click Export', 'Professional Format', 'Legal Ready'],
  },
  {
    icon: Shield,
    title: 'Admin Dashboard',
    description: 'Powerful admin portal for colleges to track institution-wide bias reports and analytics.',
    color: 'text-purple-400',
    bgColor: 'from-purple-400/20 to-purple-400/5',
    highlights: ['College Analytics', 'User Management', 'Real-time Alerts'],
  },
  {
    icon: Globe,
    title: 'Multiple Bias Types',
    description: 'Detects gender, age, location, educational background, experience, and socioeconomic biases.',
    color: 'text-blue-400',
    bgColor: 'from-blue-400/20 to-blue-400/5',
    highlights: ['6+ Bias Types', 'Contextual Analysis', 'Explainable AI'],
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative h-full"
    >
      {/* Glow effect on hover */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${feature.bgColor} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-3xl`} />
      
      {/* Card */}
      <div className="relative h-full glass-effect rounded-3xl p-8 border-2 border-white/10 group-hover:border-white/30 transition-all duration-300 backdrop-blur-xl">
        {/* Icon */}
        <div className="flex items-start justify-between mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bgColor} ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <feature.icon className="h-8 w-8" />
          </div>
          
          {/* Index badge */}
          <div className="text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors">
            0{index + 1}
          </div>
        </div>

        {/* Content */}
        <h3 className={`text-2xl font-bold mb-3 ${feature.color} group-hover:text-white transition-colors`}>
          {feature.title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed mb-6">
          {feature.description}
        </p>

        {/* Highlights */}
        <div className="space-y-2">
          {feature.highlights.map((highlight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-2 text-sm text-gray-300"
            >
              <CheckCircle className={`h-4 w-4 ${feature.color}`} />
              <span>{highlight}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="features" ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-light to-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,212,255,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,0,128,0.05),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="glass-effect px-6 py-3 rounded-full border border-accent-cyan/30 inline-flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent-cyan animate-pulse" />
              <span className="text-sm font-bold text-accent-cyan">Powerful Features</span>
            </div>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Everything You Need for
            <br />
            <span className="gradient-text">Fair Placements</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Comprehensive toolkit to detect, analyze, and eliminate bias from campus recruitment communications
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
