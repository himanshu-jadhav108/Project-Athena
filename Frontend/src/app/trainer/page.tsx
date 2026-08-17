'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw, Info } from 'lucide-react';
import Spinner from '@/components/Spinner';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  category: string;
  difficulty: string;
}

interface Answer {
  question_id: string;
  selected_index: number | null;
  time_taken_seconds: number;
}

export default function Trainer() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/quiz/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 5 }),
      });

      if (!res.ok) {
        throw new Error('Unable to load quiz questions');
      }

      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error('Unable to fetch quiz questions', err);
      toast.error('Using sample questions while the quiz service is unavailable.');
      setQuestions([
        {
          id: 'q1',
          question: 'A headline reads: "SHOCKING: Doctors HIDE This One Secret!" What is the most likely bias indicator?',
          options: ['It cites peer-reviewed research', 'It uses emotional trigger words and implies a conspiracy', 'It presents balanced viewpoints', 'It includes specific medical data'],
          correct_index: 1,
          explanation: 'Words like "SHOCKING" and "HIDE" are fear/urgency triggers. "One secret" implies conspiracy without evidence.',
          category: 'Headline Analysis',
          difficulty: 'easy',
        },
        {
          id: 'q2',
          question: 'You see an image of a politician at a rally. The caption says "Record-breaking attendance!" but the image is a tight crop. What should you check first?',
          options: ['The speech transcript', 'The full uncropped image', 'The photographer affiliation', 'The weather'],
          correct_index: 1,
          explanation: 'Cropped images can create false impressions. Always look for the original, uncropped version.',
          category: 'Image Verification',
          difficulty: 'easy',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (showExplanation || selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    if (index === questions[current].correct_index) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    const currentAnswer: Answer = {
      question_id: questions[current].id,
      selected_index: selected,
      time_taken_seconds: 10,
    };
    const nextAnswers = [...answers, currentAnswer];

    setAnswers(nextAnswers);

    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
      void submitQuiz(nextAnswers);
    }
  };

  const submitQuiz = async (quizAnswers: Answer[]) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      await fetch(`${apiUrl}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: quizAnswers }),
      });
    } catch (err) {
      console.error('Unable to submit quiz answers', err);
    }
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setFinished(false);
    void fetchQuestions();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-main)] flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl border border-slate-800 flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-sm text-slate-400">Loading media literacy questions...</p>
        </div>
      </div>
    );
  }

  if (finished) {
    const correct = score;
    const total = questions.length;
    const qualitativeLabel =
      total === 0 ? 'Quiz Complete'
      : score === total ? 'Excellent critical thinking!'
      : score >= total * 0.7 ? 'Strong performance — keep practicing!'
      : score >= total * 0.4 ? 'Good effort — review the explanations below.'
      : 'Keep learning — media literacy takes practice!';

    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-main)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center space-y-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-100 text-editorial mb-2">Quiz Complete!</h1>
            <p className="text-slate-400">You answered {correct} of {total} questions correctly.</p>
          </motion.div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 text-left space-y-2">
            <p className="text-base font-bold text-teal-300">{qualitativeLabel}</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {correct} of {total} correct
            </p>
          </div>

          {/* Responsible-AI disclaimer — consistent with MediaLiteracyProfile */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-amber-500/20 text-left">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              This quiz score reflects performance on {total} questions — not a measurement of your overall media literacy.
              Real critical thinking develops through repeated practice across many types of content over time.
            </p>
          </div>

          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all shadow-md shadow-purple-600/20"
          >
            <RotateCcw className="w-5 h-5" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = questions.length || 1;
  const q = questions[current];

  if (!q) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-main)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-100 text-editorial mb-4">No questions available</h1>
          <p className="text-slate-400 mb-6">The quiz service did not return any questions right now.</p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all shadow-md shadow-purple-600/20"
          >
            <RotateCcw className="w-5 h-5" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-main)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-100 text-editorial flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" /> Media Trainer
          </h1>
          <span className="text-sm text-slate-400 font-mono-code">Question {current + 1} of {totalQuestions}</span>
        </div>

        <div className="w-full bg-slate-900 rounded-full h-2 mb-8 border border-slate-800">
          <motion.div
            className="bg-purple-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / totalQuestions) * 100}%`}}
          />
        </div>

        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-2xl border border-slate-800 p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">{q.category}</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">{q.difficulty}</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-100 mb-6">{q.question}</h2>

          <div className="space-y-3">
            {q.options.map((option, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correct_index;
              let btnClass = 'p-4 rounded-xl border text-left transition-all text-sm ';
              if (showExplanation) {
                if (isCorrect) btnClass += 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200';
                else if (isSelected) btnClass += 'border-rose-500/50 bg-rose-950/40 text-rose-200';
                else btnClass += 'border-slate-800 bg-slate-950/40 text-slate-500';
              } else {
                btnClass += isSelected ? 'border-purple-500 bg-purple-950/40 text-slate-100' : 'border-slate-800 bg-slate-900/60 hover:border-purple-500/40 text-slate-300';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showExplanation}
                  className={btnClass + ' w-full flex items-center gap-3'}
                >
                  {showExplanation && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  <span className="font-mono-code text-xs text-slate-400 w-6">{String.fromCharCode(65 + i)}</span>
                  {option}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 rounded-xl bg-purple-950/30 border border-purple-500/30"
              >
                <p className="text-sm text-purple-200">{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {showExplanation && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-600/20"
          >
            {current < questions.length - 1 ? <>Next <ArrowRight className="w-5 h-5" /></> : 'Finish Quiz'}
          </motion.button>
        )}
      </div>
    </div>
  );
}