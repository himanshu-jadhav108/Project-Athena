'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AthenaLogo from '@/components/AthenaLogo';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch {
      router.replace('/login');
    }
  };

  const navLinks = [
    { href: '/investigate', label: 'Investigate' },
    { href: '/trainer', label: 'Learn & Train' },
  ];


  const isDark = theme === 'dark';

  return (
    <nav
      className="sticky top-0 z-50 glass-card border-b backdrop-blur-xl"
      style={{ borderColor: 'var(--color-glass-border)', background: 'var(--color-nav-bg)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/">
            <AthenaLogo size="md" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link, idx) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold transition-colors ${
                  idx === 0
                    ? 'text-sky-400 hover:text-sky-300'
                    : 'hover:text-sky-400'
                }`}
                style={idx !== 0 ? { color: 'var(--color-text-muted)' } : {}}
              >
                {link.label}
              </Link>
            ))}
          </div>


          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">

            {/* Language Switcher */}
            <div
              className="flex items-center rounded-lg p-0.5 text-xs border"
              style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}
            >
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  lang === 'en' ? 'bg-sky-500 text-slate-950 font-bold' : 'hover:text-sky-400'
                }`}
                style={lang !== 'en' ? { color: 'var(--color-text-muted)' } : {}}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  lang === 'hi' ? 'bg-sky-500 text-slate-950 font-bold' : 'hover:text-sky-400'
                }`}
                style={lang !== 'hi' ? { color: 'var(--color-text-muted)' } : {}}
              >
                हिन्दी
              </button>
            </div>

            {/* ── Theme Toggle ── */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="relative w-14 h-7 rounded-full border flex items-center px-1 overflow-hidden"
              style={{
                background: isDark ? 'rgba(14,165,233,0.15)' : 'rgba(245,158,11,0.15)',
                borderColor: isDark ? 'rgba(14,165,233,0.35)' : 'rgba(245,158,11,0.35)',
              }}
              aria-label="Toggle theme"
            >
              {/* Track icons */}
              <Moon
                className="absolute left-1.5 w-3.5 h-3.5 text-sky-400"
                style={{ opacity: isDark ? 1 : 0, transition: 'opacity 0.25s' }}
              />
              <Sun
                className="absolute right-1.5 w-3.5 h-3.5 text-amber-400"
                style={{ opacity: isDark ? 0 : 1, transition: 'opacity 0.25s' }}
              />
              {/* Pill thumb */}
              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className="absolute w-5 h-5 rounded-full shadow-md"
                style={{
                  left: isDark ? '3px' : 'calc(100% - 23px)',
                  background: isDark ? '#0EA5E9' : '#F59E0B',
                }}
              />
            </motion.button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2.5">
                <span
                  className="text-xs font-medium flex items-center gap-1 px-2.5 py-1.5 rounded-lg border"
                  style={{
                    color: 'var(--color-text-muted)',
                    background: 'var(--color-bg-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  {user.full_name || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => void handleSignOut()}
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold px-3 py-1.5 hover:text-slate-100 transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Sign In
                </Link>
                <Link
                  href="/investigate"
                  className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-sky-500/20"
                >
                  Investigate Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2"
            style={{ color: 'var(--color-text-muted)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t px-4 py-4 space-y-3 backdrop-blur-xl"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-nav-bg)',
            }}
          >
            {/* Mobile Language + Theme Row */}
            <div
              className="flex items-center justify-between border-b pb-3"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div
                className="flex items-center rounded-lg p-0.5 text-xs border"
                style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}
              >
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-0.5 rounded ${lang === 'en' ? 'bg-sky-500 text-slate-950 font-bold' : ''}`}
                  style={lang !== 'en' ? { color: 'var(--color-text-muted)' } : {}}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('hi')}
                  className={`px-2 py-0.5 rounded ${lang === 'hi' ? 'bg-sky-500 text-slate-950 font-bold' : ''}`}
                  style={lang !== 'hi' ? { color: 'var(--color-text-muted)' } : {}}
                >
                  हिन्दी
                </button>
              </div>

              {/* Mobile Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.9 }}
                className="relative w-14 h-7 rounded-full border flex items-center px-1 overflow-hidden"
                style={{
                  background: isDark ? 'rgba(14,165,233,0.15)' : 'rgba(245,158,11,0.15)',
                  borderColor: isDark ? 'rgba(14,165,233,0.35)' : 'rgba(245,158,11,0.35)',
                }}
                aria-label="Toggle theme"
              >
                <Moon className="absolute left-1.5 w-3.5 h-3.5 text-sky-400" style={{ opacity: isDark ? 1 : 0, transition: 'opacity 0.25s' }} />
                <Sun className="absolute right-1.5 w-3.5 h-3.5 text-amber-400" style={{ opacity: isDark ? 0 : 1, transition: 'opacity 0.25s' }} />
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute w-5 h-5 rounded-full shadow-md"
                  style={{ left: isDark ? '3px' : 'calc(100% - 23px)', background: isDark ? '#0EA5E9' : '#F59E0B' }}
                />
              </motion.button>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-semibold hover:text-sky-400 transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <button
                onClick={() => { void handleSignOut(); setMobileOpen(false); }}
                className="flex items-center gap-2 text-xs font-semibold text-rose-400 pt-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>Sign In</Link>
                <Link href="/investigate" onClick={() => setMobileOpen(false)} className="text-xs font-bold text-sky-400">Investigate Now</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}