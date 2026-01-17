'use client';

import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import { Shield, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* FIXED: Proper animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-20 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 100, 0],
            y: [0, 100, -50, 0],
            scale: [1, 1.3, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-40 right-20 w-[500px] h-[500px] bg-accent-pink/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -80, 40, 0],
            scale: [1, 1.1, 1.2, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-20 left-1/2 w-[400px] h-[400px] bg-accent-green/20 rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

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
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-cyan via-accent-pink to-accent-green mb-6 relative shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan via-accent-pink to-accent-green rounded-3xl blur-xl opacity-50 animate-pulse" />
              <Shield className="h-12 w-12 text-white relative z-10" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="h-6 w-6 text-accent-green" />
              </motion.div>
              <Lock className="absolute -bottom-1 -right-1 h-5 w-5 text-accent-cyan" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-black mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent"
            >
              Welcome Back
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-200 text-lg font-medium"
            >
              Login to access your BiasBreaker dashboard
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
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-accent-cyan via-accent-pink to-accent-green opacity-10 blur-xl" />
            
            <div className="relative z-10">
              <LoginForm />

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-gray-200 font-medium">
                  Don't have an account?{' '}
                  <Link 
                    href="/signup" 
                    className="text-accent-cyan hover:text-accent-green transition-colors font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Sign up for free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-300 font-medium">
              <Lock className="h-4 w-4 text-accent-green" />
              <span>Protected by enterprise-grade encryption</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-accent-cyan" />
                AI-Powered
              </span>
              <span>•</span>
              <span>100% Secure</span>
              <span>•</span>
              <span>Free Forever</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
