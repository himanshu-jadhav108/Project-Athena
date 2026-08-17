'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Brain, CheckCircle, XCircle, Lightbulb, ArrowRight,
  BookOpen, Target, Eye, Search, GitBranch, ShieldCheck, Sparkles
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface TutorProps {
  data: any;
  claim?: string;
  isDemo?: boolean;
  provenance?: any;
  onCompleteQuiz?: (score: number, total: number) => void;
}

// Learning outcome item
function LearningItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
      <span className="mt-0.5 shrink-0 text-teal-400">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

// Investigation complete — the learning payoff screen
function LearningPayoff({ score, total, claim }: { score: number; total: number; claim?: string }) {
  const allCorrect = score === total;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* ── Completion Hero ───────────────────────────── */}
      <div className="learning-payoff glass-card p-8 rounded-2xl border text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-purple-500/20"
        >
          <GraduationCap className="w-8 h-8 text-white" />
        </motion.div>

        <div>
          <h3 className="text-2xl font-extrabold text-slate-100 text-editorial">
            Investigation Complete
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {allCorrect
              ? 'Excellent critical thinking — you got everything right.'
              : `${score} of ${total} correct — keep practicing.`}
          </p>
        </div>

        {/* Score visual */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-900/60 border border-purple-500/20">
          <span className="text-3xl font-bold text-purple-300">{score}/{total}</span>
          <span className="text-xs text-slate-400">correct</span>
        </div>
      </div>

      {/* ── Skills Practiced ──────────────────── */}
      <div className="glass-card p-6 rounded-2xl border border-teal-500/20 bg-teal-950/10 space-y-4">
        <h4 className="text-sm font-bold text-teal-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          What You Practiced in This Investigation
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <LearningItem icon={<Search className="w-3.5 h-3.5" />} text="Source evaluation — checking where content comes from" />
          <LearningItem icon={<Eye className="w-3.5 h-3.5" />} text="Evidence reasoning — what supports or contradicts the claim" />
          <LearningItem icon={<Target className="w-3.5 h-3.5" />} text="Context checking — what information might be missing" />
          <LearningItem icon={<GitBranch className="w-3.5 h-3.5" />} text="Framing recognition — how language shapes perception" />
        </div>
      </div>

      {/* ── What You Can Apply Next Time ─────────────── */}
      <div className="glass-card p-6 rounded-2xl border border-sky-500/20 bg-sky-950/10 space-y-4">
        <h4 className="text-sm font-bold text-sky-300 flex items-center gap-2">
          <ArrowRight className="w-4 h-4" />
          Next Time You See a Claim Like This
        </h4>
        <ol className="space-y-3">
          {[
            { step: '1', text: 'Check the original source — which institution or person made this claim?' },
            { step: '2', text: 'Look for independent evidence — does a peer-reviewed paper or fact-check exist?' },
            { step: '3', text: 'Ask what context is missing — who benefits from this framing?' },
          ].map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3 text-xs text-slate-300">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                {step}
              </span>
              <span className="leading-relaxed">{text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* ── ATHENA Philosophy ─────────────────────────── */}
      <div className="p-5 rounded-xl border border-slate-700 bg-slate-900/40 text-center space-y-2">
        <p className="text-sm font-bold text-slate-200 text-editorial italic">
          &ldquo;ATHENA doesn&rsquo;t tell you what to believe.<br />
          ATHENA teaches you how to evaluate.&rdquo;
        </p>
        <p className="text-xs text-slate-500">
          Every investigation builds your capacity for the next one.
        </p>
      </div>
    </motion.div>
  );
}

export default function AITutorQuiz({ data, claim, isDemo = false, provenance, onCompleteQuiz }: TutorProps) {
  const { t } = useI18n();
  const isCuratedDemo = isDemo || provenance?.mode === 'demo' || data?.is_demo;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  if (!data) return null;

  const { explanation, quiz } = data;
  const totalQuestions = quiz?.questions?.length || 0;

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    let count = 0;
    quiz?.questions?.forEach((q: any) => {
      if (selectedAnswers[q.id] === q.correct_option) {
        count++;
      }
    });
    setCorrectCount(count);
    setSubmitted(true);
    if (onCompleteQuiz) {
      onCompleteQuiz(count, totalQuestions);
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const canSubmit = answeredCount === totalQuestions;

  return (
    <div className="space-y-6">

      {/* ── Tutor Header ─────────────────────────────── */}
      <div className="glass-card p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-slate-900 to-purple-950/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-100 text-editorial">{t('tutorTitle')}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-purple-400">
                  04 • LEARN
                </span>
              </div>
              <p className="text-xs text-slate-400">What evaluation skill can you apply next time?</p>
            </div>
          </div>
          {isCuratedDemo ? (
            <span className="demo-badge">
              <Sparkles className="w-3 h-3" />
              CURATED LEARNING CHALLENGE
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border border-purple-500/30 bg-purple-500/10 text-purple-300">
              AI-Generated Challenge
            </span>
          )}
        </div>

        {/* Three-part structure: What / Why / Apply */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-400">
              <Eye className="w-3.5 h-3.5" /> What We Found
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {claim
                ? `"${claim.slice(0, 80)}${claim.length > 80 ? '...' : ''}"`
                : 'A viral claim with insufficient evidence and missing context.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
              <Lightbulb className="w-3.5 h-3.5" /> Why It Matters
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{explanation?.why_misleading}</p>
          </div>

          <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-400">
              <Target className="w-3.5 h-3.5" /> Core Skill
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">{explanation?.core_concept}</p>
          </div>
        </div>

        {/* Key literacy lessons */}
        {explanation?.literacy_skills_taught && explanation.literacy_skills_taught.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Key Lessons</h5>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {explanation.literacy_skills_taught.map((skill: string, idx: number) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Quiz Challenge ────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                {quiz?.title || 'Learning Challenge'}
              </h4>
              <span className="text-xs font-mono-code text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                {answeredCount} / {totalQuestions} answered
              </span>
            </div>

            <div className="space-y-6">
              {quiz?.questions?.map((q: any, qIdx: number) => {
                const chosen = selectedAnswers[q.id];

                return (
                  <div key={q.id} className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <h5 className="text-sm font-semibold text-slate-200 leading-relaxed">
                      {qIdx + 1}. {q.question}
                    </h5>

                    <div className="space-y-2">
                      {q.options?.map((opt: string, optIdx: number) => {
                        const isSelected = chosen === optIdx;
                        const optionStyle = isSelected
                          ? 'border-purple-500 bg-purple-950/30 text-purple-200'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900';

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelect(q.id, optIdx)}
                            className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${optionStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {canSubmit
                ? <>Submit Answers <ArrowRight className="w-4 h-4" /></>
                : `Answer all ${totalQuestions} questions to submit`}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* ── Per-question feedback ─────────────────── */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Answer Review
              </h4>
              {quiz?.questions?.map((q: any, qIdx: number) => {
                const chosen = selectedAnswers[q.id];
                const isCorrect = chosen === q.correct_option;

                return (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <p className="text-xs font-semibold text-slate-200 leading-relaxed">
                      {qIdx + 1}. {q.question}
                    </p>
                    <div className="space-y-1.5">
                      {q.options?.map((opt: string, optIdx: number) => {
                        const isSelected = chosen === optIdx;
                        const isCorrectOpt = optIdx === q.correct_option;
                        let style = 'border-slate-800 bg-slate-900/40 text-slate-500';
                        if (isCorrectOpt) style = 'border-teal-500/40 bg-teal-950/20 text-teal-200';
                        else if (isSelected && !isCorrect) style = 'border-rose-500/40 bg-rose-950/20 text-rose-300';

                        return (
                          <div key={optIdx} className={`px-3 py-2 rounded-lg border text-xs ${style}`}>
                            {opt}
                            {isCorrectOpt && <span className="ml-2 text-teal-400 font-semibold">✓ Correct</span>}
                            {isSelected && !isCorrect && <span className="ml-2 text-rose-400 font-semibold">✗ Your answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    <div className={`p-3 rounded-lg text-xs leading-relaxed ${isCorrect ? 'bg-teal-950/20 border border-teal-500/20 text-teal-200' : 'bg-amber-950/20 border border-amber-500/20 text-amber-200'}`}>
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        {isCorrect
                          ? <><CheckCircle className="w-3.5 h-3.5 text-teal-400" /> {t('quizCorrect')}</>
                          : <><XCircle className="w-3.5 h-3.5 text-amber-400" /> {t('quizIncorrect')}</>}
                      </div>
                      <p className="text-slate-300">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Learning Payoff ───────────────────────── */}
            <LearningPayoff score={correctCount} total={totalQuestions} claim={claim} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
