'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, AlertTriangle, HelpCircle, FileText, ChevronDown, ChevronUp,
  CheckCircle, Sparkles, XCircle, MinusCircle, Eye
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface TrustPassportProps {
  data: any;
  isDemo?: boolean;
  provenance?: any;
}

// Renders a single evidence item with semantic color based on type
function EvidenceItem({
  item,
  type,
  index = 0,
  isDemo = false,
}: {
  item: any;
  type: 'supporting' | 'conflicting' | 'unverified';
  index?: number;
  isDemo?: boolean;
}) {
  const styles = {
    supporting: {
      container: 'border-teal-500/25 bg-teal-950/20 hover:border-teal-500/45',
      icon: <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />,
      verdictColor: 'text-teal-200',
      badge: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
      badgeText: 'Supporting Reference',
    },
    conflicting: {
      container: 'border-rose-500/25 bg-rose-950/20 hover:border-rose-500/45',
      icon: <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />,
      verdictColor: 'text-rose-200',
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      badgeText: 'Conflicting Reference',
    },
    unverified: {
      container: 'border-amber-500/25 bg-amber-950/20 hover:border-amber-500/45',
      icon: <MinusCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
      verdictColor: 'text-amber-200',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      badgeText: 'Unverified Context',
    },
  };

  const style = styles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.22 }}
      whileHover={{ scale: 1.01 }}
      className={`p-4 rounded-xl border ${style.container} space-y-2 transition-all cursor-default`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          {style.icon}
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="font-semibold text-slate-100 text-xs leading-snug break-words">
              {item.title || item.publisher}
            </p>
            {item.publisher && item.title && (
              <p className="text-[11px] text-slate-400 break-words">{item.publisher}</p>
            )}
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase tracking-wider border self-start sm:self-center shrink-0 ${style.badge}`}>
          {style.badgeText}
        </span>
      </div>

      <div className="pl-6.5 text-xs leading-relaxed space-y-1">
        <p className={`${style.verdictColor} break-words font-medium`}>{item.verdict}</p>
        {item.url && (
          <p className="text-[10px] text-slate-500 italic break-all">
            {isDemo ? 'Curated UNESCO demonstration reference' : `Citation URL: ${item.url}`}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function TrustPassportCard({ data, isDemo = false, provenance }: TrustPassportProps) {
  const { t } = useI18n();
  const isCuratedDemo = Boolean(isDemo || provenance?.mode === 'demo' || data?.is_demo);

  // All 6 sections open by default for rapid scanability
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['claim', 'evidence', 'context', 'framing', 'uncertainty', 'actions'])
  );

  if (!data) return null;

  const {
    claim,
    source,
    evidence,
    context,
    language_analysis,
    assessment,
    confidence_level,
    uncertainty_notes,
    suggested_actions,
  } = data;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(section) ? next.delete(section) : next.add(section);
      return next;
    });
  };

  const isExpanded = (section: string) => expandedSections.has(section);

  // Calibrated assessment code and visual mapping (non-binary)
  const assessmentCode = data.assessment_code || 'INSUFFICIENT_EVIDENCE';
  const assessmentVisualMap: Record<string, { border: string; bg: string; icon: React.ReactNode; badgeClass: string; title: string }> = {
    CORROBORATED: {
      border: 'border-l-teal-500',
      bg: 'from-teal-950/40 via-slate-900/90 to-slate-950/90',
      icon: <CheckCircle className="w-8 h-8 text-teal-400" />,
      badgeClass: 'text-teal-300 border-teal-500/40 bg-teal-500/10',
      title: 'Corroborated by Verified Sources',
    },
    CONTRADICTED: {
      border: 'border-l-rose-500',
      bg: 'from-rose-950/30 via-slate-900/90 to-slate-950/90',
      icon: <XCircle className="w-8 h-8 text-rose-400" />,
      badgeClass: 'text-rose-300 border-rose-500/40 bg-rose-500/10',
      title: 'Contradicted by Independent Evidence',
    },
    MIXED_EVIDENCE: {
      border: 'border-l-amber-500',
      bg: 'from-amber-950/30 via-slate-900/90 to-slate-950/90',
      icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
      badgeClass: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
      title: 'Mixed Evidence — Conflicting Claims',
    },
    INSUFFICIENT_EVIDENCE: {
      border: 'border-l-amber-500',
      bg: 'from-amber-950/30 via-slate-900/90 to-slate-950/90',
      icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
      badgeClass: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
      title: 'Insufficient Evidence to Verify',
    },
  };

  const assessmentVisual = assessmentVisualMap[assessmentCode] ?? assessmentVisualMap.INSUFFICIENT_EVIDENCE;

  const totalEvidenceItems =
    (evidence?.supporting_items?.length || 0) +
    (evidence?.conflicting_items?.length || 0) +
    (evidence?.unverified_items?.length || 0);

  const hasNoEvidence =
    !evidence ||
    (totalEvidenceItems === 0 &&
      (evidence.supporting_count ?? 0) === 0 &&
      (evidence.conflicting_count ?? 0) === 0 &&
      (evidence.unverified_count ?? 0) === 0);

  // Section Header Component
  const SectionHeader = ({
    id,
    icon,
    stepNum,
    title,
    subtitle,
    iconColor,
  }: {
    id: string;
    icon: React.ReactNode;
    stepNum: string;
    title: string;
    subtitle: string;
    iconColor: string;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      aria-expanded={isExpanded(id)}
      aria-controls={`tp-panel-${id}`}
      className="w-full p-4.5 flex items-center justify-between text-left bg-slate-900/80 hover:bg-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus:outline-none"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className={`p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 ${iconColor} shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
              {stepNum}
            </span>
            <h4 className="font-bold text-slate-100 text-sm tracking-tight">{title}</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{subtitle}</p>
        </div>
      </div>
      <div className="ml-3 shrink-0 text-slate-400">
        {isExpanded(id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
    </button>
  );

  return (
    <div className="space-y-5">

      {/* ── Hero: Assessment & Uncertainty Overview ──────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-card p-6 rounded-2xl border-l-4 ${assessmentVisual.border} bg-gradient-to-r ${assessmentVisual.bg}`}
      >
        <div className="space-y-4">
          {/* Top badges bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${assessmentVisual.badgeClass}`}>
                {assessmentVisual.title}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase tracking-wider bg-slate-900/90 border border-slate-800 text-sky-300">
                ATHENA TRUST PASSPORT
              </span>
            </div>

            {/* Prominent Provenance Badge */}
            {isCuratedDemo ? (
              <span className="demo-badge px-3 py-1 text-xs font-bold shadow-lg shadow-amber-950/40">
                <Sparkles className="w-3.5 h-3.5" />
                CURATED DEMONSTRATION
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border border-sky-500/40 bg-sky-500/10 text-sky-200">
                AI-Assisted Interpretation
              </span>
            )}
          </div>

          {/* Calibrated Assessment Quote */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-mono-code uppercase tracking-wider text-slate-400">
              Calibrated Evaluation Summary
            </p>
            <blockquote className="text-lg sm:text-xl font-bold text-slate-100 text-editorial leading-snug border-l-3 border-sky-400/60 pl-3.5 break-words">
              {assessment}
            </blockquote>
          </div>

          {/* Distinct Evaluation vs Uncertainty Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {/* Confidence Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono-code font-semibold">
                  AI Assessment Confidence
                </span>
                <span className="text-[10px] font-mono-code text-teal-400 font-bold">
                  {confidence_level || 'Moderate'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed break-words">
                AI semantic evaluation based on claim patterns and available signals. Not independently verified database access.
              </p>
            </div>

            {/* Uncertainty Card */}
            <div className="p-3.5 rounded-xl bg-amber-950/25 border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-300 uppercase tracking-widest font-mono-code font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  What Remains Uncertain
                </span>
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed break-words">
                {uncertainty_notes || 'Certain real-world dimensions lack independent corroboration.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 1. WHAT IS BEING CLAIMED? ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card rounded-xl overflow-hidden border border-slate-800"
      >
        <SectionHeader
          id="claim"
          icon={<FileText className="w-4.5 h-4.5" />}
          stepNum="01"
          title="What is Being Claimed?"
          subtitle="The specific core proposition extracted from the submitted material"
          iconColor="text-sky-400"
        />
        {isExpanded('claim') && (
          <div id="tp-panel-claim" className="p-5 bg-slate-950/60 space-y-4 border-t border-slate-800">
            {/* The primary extracted claim */}
            <div className="p-4.5 rounded-xl bg-slate-900/90 border border-sky-500/20 shadow-inner shadow-sky-950/40 space-y-2">
              <span className="text-[10px] font-mono-code text-sky-400 uppercase tracking-wider font-semibold">
                Extracted Primary Claim
              </span>
              <p className="text-base font-semibold text-slate-100 leading-relaxed break-words">
                {claim}
              </p>
            </div>

            {/* Sub-claims & metadata pills */}
            <div className="flex flex-wrap gap-2.5 text-xs">
              {data.claim_summary?.domain && (
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                  <strong className="text-slate-400 font-mono-code">Domain:</strong> {data.claim_summary.domain}
                </span>
              )}
              {data.claim_summary?.virality_risk && (
                <span className="px-3 py-1 bg-rose-950/20 border border-rose-500/25 rounded-lg text-rose-300">
                  <strong className="text-rose-400 font-mono-code">Virality Risk:</strong> {data.claim_summary.virality_risk}
                </span>
              )}
            </div>

            {data.claim_summary?.sub_claims && data.claim_summary.sub_claims.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider font-semibold">
                  Underlying Sub-Claims
                </p>
                <ul className="space-y-1.5">
                  {data.claim_summary.sub_claims.map((sub: string, i: number) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-sky-400 shrink-0 font-mono-code">•</span>
                      <span className="break-words">{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* ── 2. WHAT EVIDENCE EXISTS? ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="glass-card rounded-xl overflow-hidden border border-slate-800"
      >
        <SectionHeader
          id="evidence"
          icon={<ShieldCheck className="w-4.5 h-4.5" />}
          stepNum="02"
          title="What Evidence Exists?"
          subtitle="Independent supporting, conflicting, and unverified source data"
          iconColor="text-teal-400"
        />
        {isExpanded('evidence') && (
          <div id="tp-panel-evidence" className="p-5 bg-slate-950/60 space-y-5 border-t border-slate-800">
            {/* Provenance note */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-slate-800/80">
              <span className="text-[11px] text-slate-400">
                {isCuratedDemo
                  ? 'Curated demonstration evidence dataset (UNESCO pitch benchmark scenario)'
                  : 'AI-assessed evidence signals from known fact-checking databases'}
              </span>
              <span className="text-[10px] font-mono-code text-slate-500 uppercase">
                {totalEvidenceItems} references recorded
              </span>
            </div>

            {hasNoEvidence ? (
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2.5">
                <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">Evidence unavailable</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  No verified external sources matched this specific claim. ATHENA does not fabricate citations.
                </p>
              </div>
            ) : (
              <>
                {/* Evidence Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border text-center space-y-1 border-teal-500/25 bg-teal-950/15">
                    <div className="text-2xl font-extrabold text-teal-400">{evidence?.supporting_count ?? 0}</div>
                    <div className="text-[10px] text-teal-300/90 uppercase tracking-widest font-mono-code font-bold">Supporting</div>
                  </div>
                  <div className="p-3.5 rounded-xl border text-center space-y-1 border-rose-500/25 bg-rose-950/15">
                    <div className="text-2xl font-extrabold text-rose-400">{evidence?.conflicting_count ?? 0}</div>
                    <div className="text-[10px] text-rose-300/90 uppercase tracking-widest font-mono-code font-bold">Conflicting</div>
                  </div>
                  <div className="p-3.5 rounded-xl border text-center space-y-1 border-amber-500/25 bg-amber-950/15">
                    <div className="text-2xl font-extrabold text-amber-400">{evidence?.unverified_count ?? 0}</div>
                    <div className="text-[10px] text-amber-300/90 uppercase tracking-widest font-mono-code font-bold">Unverified</div>
                  </div>
                </div>

                {/* Conflicting items (shown prominently for critical evaluation) */}
                {evidence?.conflicting_items && evidence.conflicting_items.length > 0 && (
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" />
                      Conflicting Sources & Fact-Checks ({evidence.conflicting_items.length})
                    </h5>
                    <div className="space-y-2">
                      {evidence.conflicting_items.map((item: any, idx: number) => (
                        <EvidenceItem key={idx} item={item} type="conflicting" index={idx} isDemo={isCuratedDemo} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Supporting items */}
                {evidence?.supporting_items && evidence.supporting_items.length > 0 && (
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Supporting Sources ({evidence.supporting_items.length})
                    </h5>
                    <div className="space-y-2">
                      {evidence.supporting_items.map((item: any, idx: number) => (
                        <EvidenceItem key={idx} item={item} type="supporting" index={idx} isDemo={isCuratedDemo} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Unverified items */}
                {evidence?.unverified_items && evidence.unverified_items.length > 0 && (
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MinusCircle className="w-3.5 h-3.5" />
                      Unverified Signals & Statements ({evidence.unverified_items.length})
                    </h5>
                    <div className="space-y-2">
                      {evidence.unverified_items.map((item: any, idx: number) => (
                        <EvidenceItem key={idx} item={item} type="unverified" index={idx} isDemo={isCuratedDemo} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </motion.div>

      {/* ── 3. WHAT CONTEXT IS MISSING? ──────────────────────────── */}
      {context && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.11 }}
          className="glass-card rounded-xl overflow-hidden border border-slate-800"
        >
          <SectionHeader
            id="context"
            icon={<HelpCircle className="w-4.5 h-4.5" />}
            stepNum="03"
            title="What Context is Missing?"
            subtitle="Crucial nuances, omitted background, and historical precedents"
            iconColor="text-amber-400"
          />
          {isExpanded('context') && (
            <div id="tp-panel-context" className="p-5 bg-slate-950/60 space-y-4 border-t border-slate-800">
              {context.missing_context && context.missing_context.length > 0 && (
                <div className="space-y-2.5">
                  <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Omitted Nuances & Gaps
                  </h5>
                  <ul className="space-y-2">
                    {context.missing_context.map((item: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-amber-950/15 border border-amber-500/20 text-xs text-slate-200"
                      >
                        <span className="text-amber-400 shrink-0 font-bold font-mono-code mt-0.5">#{idx + 1}</span>
                        <span className="leading-relaxed break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {context.historical_precedent && (
                <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="text-[10px] text-sky-400 uppercase tracking-widest font-mono-code font-bold">
                    Historical Precedent & Recurring Patterns
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed break-words">
                    {context.historical_precedent}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ── 4. HOW IS THE CLAIM FRAMED? ──────────────────────────── */}
      {(language_analysis || source) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="glass-card rounded-xl overflow-hidden border border-slate-800"
        >
          <SectionHeader
            id="framing"
            icon={<Sparkles className="w-4.5 h-4.5" />}
            stepNum="04"
            title="How is the Claim Framed?"
            subtitle="Source transparency, emotional intensity, and sensationalism"
            iconColor="text-purple-400"
          />
          {isExpanded('framing') && (
            <div id="tp-panel-framing" className="p-5 bg-slate-950/60 space-y-5 border-t border-slate-800">
              {/* Source Origin Details */}
              {source && (
                <div className="space-y-2">
                  <p className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider font-semibold">
                    Origin & Transparency
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Origin Format</div>
                      <div className="text-xs font-semibold text-slate-200 break-words">{source.origin}</div>
                    </div>
                    <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Attributed Publisher</div>
                      <div className="text-xs font-semibold text-slate-200 break-words">{source.publisher}</div>
                    </div>
                    <div className="p-3.5 rounded-xl border space-y-1 bg-amber-950/15 border-amber-500/25">
                      <div className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Transparency Score</div>
                      <div className="text-xs font-bold text-amber-300">{source.transparency_score}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sensationalism & Language */}
              {language_analysis && (
                <div className="space-y-4 pt-2 border-t border-slate-800/80">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                        Sensationalism & Emotional Framing Index
                      </span>
                      <span className="text-rose-300 font-mono-code font-bold text-xs">
                        {language_analysis.sensationalism_score}/100
                        {language_analysis.sensationalism_score >= 70
                          ? ' (HIGH SENSATIONALISM)'
                          : language_analysis.sensationalism_score >= 40
                          ? ' (MODERATE)'
                          : ' (CALM / FACTUAL)'}
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${language_analysis.sensationalism_score}%`,
                          background:
                            language_analysis.sensationalism_score >= 70
                              ? 'linear-gradient(90deg, #F43F5E, #FB7185)'
                              : language_analysis.sensationalism_score >= 40
                              ? 'linear-gradient(90deg, #F59E0B, #FCD34D)'
                              : 'linear-gradient(90deg, #14B8A6, #5EEAD4)',
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 italic">
                      Measures emotional amplification and urgency framing — not scientific truth.
                    </p>
                  </div>

                  {language_analysis.loaded_words && language_analysis.loaded_words.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono-code">
                        Trigger Words Detected
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {language_analysis.loaded_words.map((word: string, i: number) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 text-xs border border-rose-500/25 font-mono-code break-words"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {language_analysis.tone && (
                    <div className="p-3 bg-slate-900/70 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400 uppercase font-mono-code text-[10px]">Rhetorical Tone:</span>
                      <span className="text-slate-200 font-semibold break-words">{language_analysis.tone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ── 5. WHAT REMAINS UNCERTAIN? ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.17 }}
        className="glass-card rounded-xl overflow-hidden border border-slate-800"
      >
        <SectionHeader
          id="uncertainty"
          icon={<AlertTriangle className="w-4.5 h-4.5" />}
          stepNum="05"
          title="What Remains Uncertain?"
          subtitle="Specific unknowns that prevent premature certainty"
          iconColor="text-amber-400"
        />
        {isExpanded('uncertainty') && (
          <div id="tp-panel-uncertainty" className="p-5 bg-slate-950/60 space-y-4 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider font-mono-code">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                Epistemic Boundaries & Gaps
              </div>
              <p className="text-xs text-amber-100 leading-relaxed break-words">
                {uncertainty_notes || 'Certain primary source data points remain unverified.'}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              ATHENA does not force a binary verdict when evidence is incomplete. Acknowledging uncertainty is the hallmark of critical media literacy.
            </p>
          </div>
        )}
      </motion.div>

      {/* ── 6. WHAT SHOULD I VERIFY NEXT? ────────────────────────── */}
      {suggested_actions && suggested_actions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl overflow-hidden border border-sky-500/30 bg-sky-950/10 shadow-lg shadow-sky-950/30"
        >
          <SectionHeader
            id="actions"
            icon={<CheckCircle className="w-4.5 h-4.5" />}
            stepNum="06"
            title="What Should I Verify Next?"
            subtitle="Actionable steps for your independent critical evaluation"
            iconColor="text-sky-400"
          />
          {isExpanded('actions') && (
            <div id="tp-panel-actions" className="p-5 bg-slate-950/60 space-y-4 border-t border-slate-800">
              <p className="text-xs text-slate-300">
                Take these concrete steps before sharing or forming a definitive conclusion:
              </p>
              <ol className="space-y-2.5">
                {suggested_actions.map((action: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/90 border border-sky-500/20 text-xs text-slate-200 shadow-sm"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[10px] font-bold font-mono-code flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed break-words font-medium">{action}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
