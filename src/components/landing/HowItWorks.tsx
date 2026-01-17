'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Upload, Sparkles, FileDown, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Text',
    description: 'Simply paste job descriptions, placement emails, or any recruitment communication into our smart analyzer.',
    color: 'from-accent-cyan to-blue-500',
    textColor: 'text-accent-cyan',
  },
  {
    icon: Sparkles,
    title: 'AI Analysis',
    description: 'Our advanced Gemini AI instantly detects bias patterns, provides evidence quotes, and assigns severity ratings.',
    color: 'from-accent-green to-green-500',
    textColor: 'text-accent-green',
  },
  {
    icon: FileDown,
    title: 'Get Report',
    description: 'Download comprehensive PDF reports with detailed findings, evidence, and recommendations for submission.',
    color: 'from-accent-pink to-pink-500',
    textColor: 'text-accent-pink',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="how-it-works" ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary-light" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Three simple steps to achieve fair placements
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan via-accent-green to-accent-pink opacity-30" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Step card */}
              <div className="relative group">
                {/* Glow effect */}
                <div className={`absolute -inset-4 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-3xl`} />
                
                {/* Card content */}
                <div className="relative glass-effect rounded-3xl p-8 border-2 border-white/10 group-hover:border-white/30 transition-all duration-300 backdrop-blur-xl text-center">
                  {/* Step number */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl font-black text-white shadow-2xl border-4 border-primary`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-8 mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-4 ${step.textColor}`}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Arrow indicator (except last step) */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.2 }}
                  className="hidden md:flex absolute top-1/3 -right-6 transform z-20"
                >
                  <ArrowRight className={`h-8 w-8 ${step.textColor} animate-pulse`} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA below steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <a
            href="/signup"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-cyan via-accent-green to-accent-pink rounded-2xl font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-2xl shadow-accent-cyan/30"
          >
            Try It Now - It's Free
            <ArrowRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
