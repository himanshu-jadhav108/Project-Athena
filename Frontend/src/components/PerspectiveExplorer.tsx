'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Compass, CheckCircle2, AlertCircle, HelpCircle, Sparkles, Info } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface PerspectiveProps {
  data: any;
  isDemo?: boolean;
  provenance?: any;
}

// Source credibility tier labels — honest about source types, not implying equal validity
const CREDIBILITY_TIERS: Record<string, { label: string; color: string; bg: string }> = {
  'Scientific & Academic': { label: 'High Credibility', color: 'text-teal-300', bg: 'border-teal-500/20 bg-teal-950/10' },
  'Fact-Checking Community': { label: 'High Credibility', color: 'text-teal-300', bg: 'border-teal-500/20 bg-teal-950/10' },
  'International Organizations': { label: 'High Credibility', color: 'text-teal-300', bg: 'border-teal-500/20 bg-teal-950/10' },
  'Social Media Community': { label: 'Low Credibility', color: 'text-amber-300', bg: 'border-amber-500/20 bg-amber-950/10' },
  'Tech Blog / Clickbait': { label: 'Low Credibility', color: 'text-rose-300', bg: 'border-rose-500/20 bg-rose-950/10' },
};

function getCategoryTier(category: string) {
  return CREDIBILITY_TIERS[category] ?? { label: 'Varies', color: 'text-slate-400', bg: 'border-slate-700 bg-slate-900/40' };
}

const stanceStyle = (stance: string) => {
  const s = stance?.toLowerCase() || '';
  if (s.includes('skeptical') || s.includes('debunked') || s.includes('contradicted')) {
    return 'bg-rose-500/10 text-rose-300 border border-rose-500/20';
  }
  if (s.includes('educational') || s.includes('corroborated') || s.includes('supporting')) {
    return 'bg-teal-500/10 text-teal-300 border border-teal-500/20';
  }
  if (s.includes('mixed') || s.includes('viral') || s.includes('unknown')) {
    return 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
  }
  return 'bg-slate-800 text-slate-300 border border-slate-700';
};

export default function PerspectiveExplorer({ data, isDemo = false, provenance }: PerspectiveProps) {
  const { t } = useI18n();
  const isCuratedDemo = Boolean(isDemo || provenance?.mode === 'demo' || data?.is_demo);

  if (!data) return null;

  const { perspectives, common_ground, key_differences, remaining_uncertainties } = data;

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────── */}
      <div className="glass-card p-6 rounded-2xl border border-teal-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/30 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-100 text-editorial">{t('peTitle')}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-teal-400">
                  02 • COMPARE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">How is the same claim framed differently across sources?</p>
            </div>
          </div>
          {isCuratedDemo ? (
            <span className="demo-badge">
              <Sparkles className="w-3 h-3" />
              CURATED DEMONSTRATION
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border border-teal-500/30 bg-teal-500/10 text-teal-300">
              AI Perspective Synthesis
            </span>
          )}
        </div>

        {/* Core Educational Principle */}
        <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-500/30 flex items-start gap-3">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-teal-300 uppercase tracking-wide font-mono-code">
              &ldquo;Different perspectives do not imply equal evidence.&rdquo;
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Source credibility is not equal across categories. Academic, scientific, and certified fact-checking sources adhere to rigorous evidentiary standards, while viral posts and clickbait amplify sensational claims without substantiation.
            </p>
          </div>
        </div>
      </div>

      {/* ── Category Credibility Hierarchy Note ────────── */}
      <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-400">
            Source Credibility Hierarchy
          </span>
          <span className="text-[10px] text-slate-500 italic">
            Not all sources carry equal evidentiary weight
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
          <div className="p-2 rounded-lg border border-teal-500/30 bg-teal-950/20 text-center">
            <div className="text-[10px] text-teal-400 font-bold">Scientific / Academic</div>
            <div className="text-[9px] text-teal-300 font-mono-code">High Credibility</div>
          </div>
          <div className="p-2 rounded-lg border border-teal-500/30 bg-teal-950/20 text-center">
            <div className="text-[10px] text-teal-400 font-bold">Fact-Checking Orgs</div>
            <div className="text-[9px] text-teal-300 font-mono-code">High Credibility</div>
          </div>
          <div className="p-2 rounded-lg border border-teal-500/30 bg-teal-950/20 text-center">
            <div className="text-[10px] text-teal-400 font-bold">Intl Organizations</div>
            <div className="text-[9px] text-teal-300 font-mono-code">High Credibility</div>
          </div>
          <div className="p-2 rounded-lg border border-amber-500/30 bg-amber-950/20 text-center">
            <div className="text-[10px] text-amber-400 font-bold">Social Communities</div>
            <div className="text-[9px] text-amber-300 font-mono-code">Low / Variable</div>
          </div>
          <div className="p-2 rounded-lg border border-rose-500/30 bg-rose-950/20 text-center">
            <div className="text-[10px] text-rose-400 font-bold">Tech / Clickbait</div>
            <div className="text-[9px] text-rose-300 font-mono-code">Low Credibility</div>
          </div>
        </div>
      </div>

      {/* ── Perspectives Grid ─────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono-code font-bold whitespace-nowrap">
            Same Claim Across Different Source Lenses
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {perspectives?.map((item: any, idx: number) => {
            const tier = getCategoryTier(item.category);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ scale: 1.01 }}
                className={`p-5 rounded-xl border space-y-3 ${tier.bg} transition-colors cursor-default`}
              >
                {/* Category + Credibility Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="badge-cyan px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-mono-code font-bold uppercase tracking-wider ${tier.color}`}>
                    {tier.label}
                  </span>
                </div>

                {/* Source name + stance */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-slate-100 text-sm leading-snug break-words">{item.source_name}</h4>
                  <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded shrink-0 ${stanceStyle(item.stance)}`}>
                    {item.stance}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed break-words">{item.summary}</p>

                {/* Quote */}
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs italic text-slate-400 leading-relaxed break-words">
                  &ldquo;{item.quote}&rdquo;
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Multi-Perspective Synthesis & Discrepancies ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 px-1">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono-code font-bold whitespace-nowrap">
            Multi-Perspective Synthesis & Discrepancies
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Common Ground */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-5 rounded-xl border border-teal-500/25 bg-teal-950/15 space-y-2.5"
          >
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider font-mono-code">
              <CheckCircle2 className="w-4 h-4" />
              1. Common Ground
            </div>
            <p className="text-xs text-slate-200 leading-relaxed break-words">{common_ground}</p>
          </motion.div>

          {/* Difference in Framing & Evidence */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="glass-card p-5 rounded-xl border border-amber-500/25 bg-amber-950/15 space-y-2.5"
          >
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider font-mono-code">
              <AlertCircle className="w-4 h-4" />
              2. Differences in Framing & Evidence
            </div>
            <p className="text-xs text-slate-200 leading-relaxed break-words">{key_differences}</p>
          </motion.div>

          {/* Remaining Uncertainty */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.39 }}
            className="glass-card p-5 rounded-xl border border-purple-500/25 bg-purple-950/15 space-y-2.5"
          >
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider font-mono-code">
              <HelpCircle className="w-4 h-4" />
              3. Remaining Uncertainty
            </div>
            <p className="text-xs text-slate-200 leading-relaxed break-words">{remaining_uncertainties}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
