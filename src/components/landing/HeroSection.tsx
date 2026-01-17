'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Sparkles, Zap } from 'lucide-react';
import Hero3D from './Hero3D';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Animated Background */}
      <Hero3D />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-primary pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center space-x-2 px-6 py-3 glass-effect rounded-full border border-accent-cyan/30 shadow-lg shadow-accent-cyan/20 backdrop-blur-md"
          >
            <Sparkles className="h-5 w-5 text-accent-cyan animate-pulse" />
            <span className="text-sm font-bold text-white">AI-Powered Bias Detection</span>
            <Zap className="h-5 w-5 text-accent-green" />
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
              <motion.span
                className="block text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                animate={{ 
                  textShadow: [
                    '0 0 20px rgba(255,255,255,0.3)',
                    '0 0 40px rgba(255,255,255,0.5)',
                    '0 0 20px rgba(255,255,255,0.3)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Detect Bias.
              </motion.span>
              <motion.span
                className="block gradient-text drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(0,212,255,0.5)',
                    '0 0 40px rgba(0,212,255,0.7)',
                    '0 0 20px rgba(0,212,255,0.5)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                Demand Fairness.
              </motion.span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-100 max-w-4xl mx-auto font-medium leading-relaxed px-4"
          >
            India's first AI-powered platform to identify and eliminate bias in campus placement 
            communications using advanced machine learning.
          </motion.p>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8"
          >
            {[
              { value: '247+', label: 'Biases Detected', color: 'from-accent-cyan to-blue-400', icon: '🎯' },
              { value: '95%', label: 'Accuracy Rate', color: 'from-accent-green to-green-400', icon: '⚡' },
              { value: '12+', label: 'Colleges Joined', color: 'from-accent-pink to-pink-400', icon: '🏛️' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`glass-effect px-8 py-6 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md bg-gradient-to-br ${stat.color} bg-opacity-10`}
              >
                <div className="text-5xl mb-2">{stat.icon}</div>
                <div className="text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-200 font-semibold tracking-wide uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-5 justify-center pt-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center px-12 py-5 bg-gradient-to-r from-accent-cyan via-accent-pink to-accent-green rounded-2xl font-black text-xl overflow-hidden shadow-2xl shadow-accent-cyan/50"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <Shield className="h-6 w-6" />
                  <span>Start Free Analysis</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-12 py-5 glass-effect rounded-2xl font-black text-xl hover:bg-white/20 transition-all duration-300 border-2 border-white/30 shadow-xl backdrop-blur-md"
              >
                Login
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center space-y-2"
        >
          <div className="w-8 h-14 border-2 border-white/50 rounded-full p-2 shadow-lg backdrop-blur-sm">
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-3 h-4 bg-gradient-to-b from-accent-cyan to-accent-pink rounded-full mx-auto shadow-lg shadow-accent-cyan/50"
            />
          </div>
          <span className="text-xs text-gray-300 font-medium">Scroll Down</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
