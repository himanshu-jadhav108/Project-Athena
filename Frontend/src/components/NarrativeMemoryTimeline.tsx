'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, FileText, Zap, Sparkles, ArrowDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface NarrativeProps {
  data: any;
  isDemo?: boolean;
  provenance?: any;
}

// Event type visual config — tells the story visually
const EVENT_TYPES: Record<string, {
  icon: React.ReactNode;
  label: string;
  borderColor: string;
  bgColor: string;
  dotColor: string;
  labelColor: string;
}> = {
  ORIGINAL_PAPER_CONCEPT: {
    icon: <FileText className="w-4 h-4 text-sky-400" />,
    label: 'Original',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-950/15',
    dotColor: 'border-sky-400 bg-sky-950',
    labelColor: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
  },
  HEADLINE_MANIPULATION: {
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    label: 'Reframed',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-950/15',
    dotColor: 'border-amber-400 bg-amber-950',
    labelColor: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
  },
  VIRAL_AMPLIFICATION: {
    icon: <Zap className="w-4 h-4 text-rose-400" />,
    label: 'Amplified',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-950/15',
    dotColor: 'border-rose-400 bg-rose-950',
    labelColor: 'text-rose-300 bg-rose-500/10 border-rose-500/25',
  },
  FACT_CHECK_CORRECTION: {
    icon: <CheckCircle className="w-4 h-4 text-teal-400" />,
    label: 'Fact-Checked',
    borderColor: 'border-teal-500/30',
    bgColor: 'bg-teal-950/15',
    dotColor: 'border-teal-400 bg-teal-950',
    labelColor: 'text-teal-300 bg-teal-500/10 border-teal-500/25',
  },
};

function getEventConfig(type: string) {
  return EVENT_TYPES[type] ?? {
    icon: <Clock className="w-4 h-4 text-slate-400" />,
    label: 'Event',
    borderColor: 'border-slate-700',
    bgColor: 'bg-slate-900/40',
    dotColor: 'border-slate-500 bg-slate-900',
    labelColor: 'text-slate-400 bg-slate-800 border-slate-700',
  };
}

export default function NarrativeMemoryTimeline({ data, isDemo = false, provenance }: NarrativeProps) {
  const { t } = useI18n();
  const isCuratedDemo = Boolean(isDemo || provenance?.mode === 'demo' || provenance?.historical_status === 'curated' || data?.is_demo);
  const isGrounded = provenance?.historical_status === 'grounded';

  if (!data) return null;

  const { title, timeline } = data;

  return (
    <div className="space-y-6">

      {/* ── Header Banner ─────────────────────────────── */}
      <div className="glass-card p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-100 text-editorial">{t('nmTitle')}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-amber-400">
                  03 • TRACE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">How did the narrative change as it spread?</p>
            </div>
          </div>
          {isCuratedDemo ? (
            <span className="demo-badge px-3 py-1 text-xs font-bold shadow-lg shadow-amber-950/40">
              <Sparkles className="w-3.5 h-3.5" />
              CURATED DEMONSTRATION
            </span>
          ) : isGrounded ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border border-teal-500/30 bg-teal-500/10 text-teal-300">
              AI-Traced Timeline
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border border-slate-700 bg-slate-800 text-slate-400">
              Timeline Unavailable
            </span>
          )}
        </div>

        {/* Prominent Provenance Notice */}
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-300 uppercase tracking-wide font-mono-code">
              Demonstration Concept Notice
            </p>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              {isCuratedDemo
                ? 'This timeline illustrates the narrative-tracing concept using curated data. It is not a live internet history.'
                : 'This timeline reconstructs narrative progression using automated context analysis. It does not perform active real-time platform tracking.'}
            </p>
          </div>
        </div>

        {title && (
          <div className="px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <p className="text-xs text-slate-300 font-medium break-words">&ldquo;{title}&rdquo;</p>
          </div>
        )}
      </div>

      {/* ── Progression Guide: Original → Reframed → Amplified → Corrected ── */}
      <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-400">
            Narrative Mutation Lifecycle
          </span>
          <span className="text-[10px] font-mono-code text-slate-500">
            4-Stage Misinformation Pattern
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-lg border border-sky-500/30 bg-sky-950/20 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <div>
              <div className="text-[10px] text-sky-300 font-bold font-mono-code">1. Original</div>
              <div className="text-[9px] text-slate-400">Primary concept</div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-950/20 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-amber-300 font-bold font-mono-code">2. Reframed</div>
              <div className="text-[9px] text-slate-400">Headline bias</div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-950/20 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <div>
              <div className="text-[10px] text-rose-300 font-bold font-mono-code">3. Amplified</div>
              <div className="text-[9px] text-slate-400">Viral distortion</div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg border border-teal-500/30 bg-teal-950/20 flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <div>
              <div className="text-[10px] text-teal-300 font-bold font-mono-code">4. Corrected</div>
              <div className="text-[9px] text-slate-400">Fact-check review</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Empty State ────────────────────────────────── */}
      {(!timeline || timeline.length === 0) ? (
        <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center space-y-2">
          <Clock className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Timeline unavailable for this claim.</p>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            No historical evolution sequence was recorded or reconstructed for this claim.
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {timeline.map((event: any, idx: number) => {
            const config = getEventConfig(event.event_type);
            const isLast = idx === timeline.length - 1;

            return (
              <React.Fragment key={idx}>
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.35 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className={`p-5 rounded-xl border space-y-3 ${config.borderColor} ${config.bgColor}`}>
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.labelColor} flex items-center gap-1.5 font-mono-code`}>
                          {config.icon}
                          {config.label}
                        </span>
                        <span className="text-xs font-mono-code text-slate-400">Step {event.step}</span>
                        {event.date && (
                          <span className="text-[10px] font-mono-code text-slate-500">{event.date}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium break-words">{event.source}</span>
                    </div>

                    {/* Headline */}
                    <h4 className="text-sm font-bold text-slate-100 leading-snug break-words">
                      &ldquo;{event.headline}&rdquo;
                    </h4>

                    {/* What changed — the key educational insight */}
                    <div className="flex items-start gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold font-mono-code shrink-0 mt-0.5">
                        Mutation:
                      </span>
                      <p className="text-xs text-amber-200/90 leading-relaxed break-words">{event.what_changed}</p>
                    </div>

                    {/* Details */}
                    {event.details && (
                      <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2 break-words">
                        {event.details}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Connector arrow between steps */}
                {!isLast && (
                  <div className="flex justify-center py-2.5">
                    <ArrowDown className="w-4 h-4 text-slate-600 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ── Key Takeaway ───────────────────────────────── */}
      {timeline && timeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2"
        >
          <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono-code">
            Key Insight: Escalation of Certainty Without Evidence
          </h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            Notice how the narrative transitioned through <strong className="text-slate-300">Original → Reframed → Amplified → Corrected</strong>. 
            Early tentative research language was systematically replaced with unhedged, sensationalized claims as it reached viral distribution. 
            Recognizing this mutation lifecycle is essential to resisting synthetic misinformation.
          </p>
        </motion.div>
      )}
    </div>
  );
}
