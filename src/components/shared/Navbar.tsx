'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LogOut, User, LayoutDashboard, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-accent-cyan" />
            <span className="text-xl font-bold gradient-text">BiasBreaker</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href={user.role === 'super_admin' || user.role === 'college_admin' ? '/admin' : '/dashboard'}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/5 transition"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                
                <div className="flex items-center space-x-2 px-4 py-2 glass-effect rounded-lg">
                  <User className="h-5 w-5" />
                  <span className="text-sm">{user.name}</span>
                  {user.role !== 'student' && (
                    <span className="text-xs bg-accent-pink px-2 py-1 rounded">
                      {user.role.replace('_', ' ').toUpperCase()}
                    </span>
                  )}
                </div>

                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {!isPublicPage && (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 hover:bg-white/5 rounded-lg transition"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-2 bg-gradient-hero rounded-lg hover:opacity-90 transition"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
