'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Building2, UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import { motion } from 'framer-motion';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.name, formData.college);
      toast.success('Account created successfully! 🎉');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'Email already registered'
        : error.message || 'Failed to create account';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-semibold mb-2 text-gray-200">Full Name</label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-accent-cyan transition-colors z-10" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full pl-12 pr-4 py-4 bg-primary/50 border-2 border-white/10 rounded-xl focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan outline-none transition-all placeholder:text-gray-500 text-white backdrop-blur-sm"
            placeholder="John Doe"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-semibold mb-2 text-gray-200">Email Address</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-accent-cyan transition-colors z-10" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full pl-12 pr-4 py-4 bg-primary/50 border-2 border-white/10 rounded-xl focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan outline-none transition-all placeholder:text-gray-500 text-white backdrop-blur-sm"
            placeholder="your.email@college.edu"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-semibold mb-2 text-gray-200">College Name</label>
        <div className="relative group">
          <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-accent-cyan transition-colors z-10" />
          <input
            type="text"
            value={formData.college}
            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            className="w-full pl-12 pr-4 py-4 bg-primary/50 border-2 border-white/10 rounded-xl focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan outline-none transition-all placeholder:text-gray-500 text-white backdrop-blur-sm"
            placeholder="JDCOEM Nagpur (optional)"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-sm font-semibold mb-2 text-gray-200">Password</label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-accent-cyan transition-colors z-10" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
            className="w-full pl-12 pr-12 py-4 bg-primary/50 border-2 border-white/10 rounded-xl focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan outline-none transition-all placeholder:text-gray-500 text-white backdrop-blur-sm"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent-cyan transition-colors z-10"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Minimum 6 characters required</p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-accent-pink via-accent-green to-accent-cyan rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-accent-pink/25 mt-6 relative overflow-hidden group"
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            <UserPlus className="h-5 w-5" />
            <span>Create Account</span>
          </>
        )}
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
      </motion.button>
    </form>
  );
}
