'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Home, Search, ShieldCheck, HelpCircle } from 'lucide-react';

function AthenaOwlIcon({ className = "w-8 h-8 text-sky-400" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="2.5" />
      <circle cx="15" cy="9" r="2.5" />
      <circle cx="9" cy="9" r="0.75" fill="currentColor" />
      <circle cx="15" cy="9" r="0.75" fill="currentColor" />
      <path d="M12 11.5l-1 1.5h2z" fill="currentColor" />
      <path d="M4.5 7.5C3.5 9.5 3.5 12 5 14c1.5 2 3.5 3.5 7 5 3.5-1.5 5.5-3 7-5 1.5-2 1.5-4.5.5-6.5" />
      <path d="M12 3c-2.5 0-4.5 1.5-5.5 3.5 1.5.5 3.5 0 4.5-1C12 6.5 14 7 15.5 6.5 14.5 4.5 12.5 3 12 3z" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg-primary)] text-[var(--color-text-main)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-xl w-full space-y-8 text-center">
        
        {/* Creative Athena Visual Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-sky-500 via-teal-500 to-amber-400 p-1 shadow-2xl shadow-sky-500/20 mx-auto">
            <div className="w-full h-full rounded-[22px] bg-[var(--color-bg-primary)] flex flex-col items-center justify-center gap-1">
              <AthenaOwlIcon className="w-10 h-10 text-sky-400" />
              <span className="text-xs font-mono-code font-bold text-amber-400">404</span>
            </div>
          </div>
        </motion.div>

        {/* Narrative Content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-cyan text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            Uncharted Information Territory
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 text-editorial tracking-tight">
            Narrative Path Not Found
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg mx-auto">
            The page or narrative artifact you are seeking does not exist in the ATHENA memory archives. It may have been moved, updated, or unverified.
          </p>
        </motion.div>

        {/* Action Cards & Redirect to Main Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4"
        >
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Re-orient Your Media Literacy Navigation
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary Main Page Redirect */}
            <Link
              href="/"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Return to Main Page
            </Link>

            {/* Investigation Workspace Redirect */}
            <Link
              href="/investigate"
              className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-sky-400" />
              Launch Workspace
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-4 text-xs text-slate-400">
            <Link href="/investigate?demo=true" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <Play className="w-3.5 h-3.5" /> Try Demo
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-sky-400 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Home
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
