'use client';

import Link from 'next/link';
import SignupForm from '@/components/auth/SignupForm';
import { Shield, Sparkles, Star, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-primary">
      {/* Animated Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, -120, 0],
            y: [0, 120, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-20 w-[450px] h-[450px] bg-accent-green/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -120, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-accent-cyan/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent-pink/30 rounded-full blur-3xl"
        />
      </div>

      {/* Dot Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-pink via-accent-green to-accent-cyan mb-6 relative shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-pink via-accent-green to-accent-cyan rounded-3xl blur-xl opacity-50 animate-pulse" />
              <Shield className="h-12 w-12 text-white relative z-10" />
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-2 -right-2"
              >
                <Star className="h-6 w-6 text-accent-cyan" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-1 -left-1"
              >
                <Zap className="h-5 w-5 text-accent-green" />
              </motion.div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-black mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent"
            >
              Get Started Free
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-200 text-lg font-medium"
            >
              Create your account to detect bias in placements
            </motion.p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect rounded-3xl p-10 backdrop-blur-2xl border border-white/20 shadow-2xl relative overflow-hidden"
          >
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-accent-pink via-accent-green to-accent-cyan opacity-20 blur-xl" />
            
            <div className="relative z-10">
              <SignupForm />

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-gray-200 font-medium">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-accent-cyan hover:text-accent-green transition-colors font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Login here
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            {[
              { icon: Sparkles, label: 'AI-Powered', color: 'text-accent-green' },
              { icon: Shield, label: '100% Secure', color: 'text-accent-cyan' },
              { icon: Zap, label: 'Free Forever', color: 'text-accent-pink' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-effect rounded-xl p-4 text-center border border-white/10 backdrop-blur-sm"
              >
                <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                <span className="text-xs text-gray-300 font-semibold">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
