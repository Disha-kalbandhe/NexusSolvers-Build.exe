'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { TrendingUp, Users, Building2, Award } from 'lucide-react';

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(target * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    {
      icon: TrendingUp,
      value: 247,
      suffix: '+',
      label: 'Biases Detected',
      color: 'from-accent-cyan to-blue-500',
      iconColor: 'text-accent-cyan',
      bgGlow: 'group-hover:shadow-accent-cyan/50',
    },
    {
      icon: Award,
      value: 95,
      suffix: '%',
      label: 'Detection Accuracy',
      color: 'from-accent-green to-green-500',
      iconColor: 'text-accent-green',
      bgGlow: 'group-hover:shadow-accent-green/50',
    },
    {
      icon: Building2,
      value: 12,
      suffix: '+',
      label: 'Colleges Joined',
      color: 'from-accent-pink to-pink-500',
      iconColor: 'text-accent-pink',
      bgGlow: 'group-hover:shadow-accent-pink/50',
    },
    {
      icon: Users,
      value: 1200,
      suffix: '+',
      label: 'Students Protected',
      color: 'from-purple-500 to-purple-400',
      iconColor: 'text-purple-400',
      bgGlow: 'group-hover:shadow-purple-500/50',
    },
  ];

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary to-primary-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Real Impact, <span className="gradient-text">Real Numbers</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of students fighting for fair placements
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
              className="group"
            >
              <div className={`glass-effect rounded-3xl p-8 border border-white/10 group-hover:border-white/30 transition-all duration-300 backdrop-blur-xl shadow-xl ${stat.bgGlow} transform group-hover:-translate-y-2 group-hover:scale-105`}>
                {/* Icon with proper visibility */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>

                {/* Value */}
                <div className={`text-5xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  <AnimatedCounter target={stat.value} />
                  {stat.suffix}
                </div>

                {/* Label */}
                <div className="text-gray-300 font-semibold text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
