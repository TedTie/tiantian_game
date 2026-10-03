import React, { useState, useEffect } from 'react';
import { Paper, AttemptResult, Question } from '../types/game';
import { soundFx } from '../services/soundEffects';
import { TokiMascot } from './TokiMascot';
import {
  Star,
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

interface ResultReportProps {
  paper: Paper;
  result: AttemptResult;
  onContinueNext: () => void;
  onRetry: () => void;
  onReturnToMap: () => void;
}

export const ResultReport: React.FC<ResultReportProps> = ({
  paper,
  result,
  onContinueNext,
  onRetry,
  onReturnToMap,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'wrong' | 'correct'>('all');
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  // Mini-state for targeted reinforcement practice
  const [reinforceAnswer, setReinforceAnswer] = useState<Record<string, string>>({});
  const [reinforceFeedback, setReinforceFeedback] = useState<Record<string, boolean>>({});

  // Sound effects on mount
  useEffect(() => {
    if (result.stars > 0) {
      soundFx.playVictoryFanfare();
      const t = setTimeout(() => {
        soundFx.playSparkle();
      }, 900);
      return () => clearTimeout(t);
    } else {
      soundFx.playGentleBoing();
    }
  }, [result.stars]);

  const questions = paper.questions;
  const filteredQuestions = questions.filter((q) => {
    const isCorrect = result.answers[q.id]?.isCorrect;
    if (filterMode === 'wrong') return !isCorrect;
    if (filterMode === 'correct') return isCorrect;
    return true;
  });

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}分${s}秒`;
  };

  const handleReinforceSubmit = (qId: string, opt: string, correct: string) => {
    soundFx.playSnap();
    setReinforceAnswer((prev) => ({ ...prev, [qId]: opt }));
    const isRight = opt === correct;
    setReinforceFeedback((prev) => ({ ...prev, [qId]: isRight }));
    if (isRight) {
      soundFx.playCorrect();
    } else {
      soundFx.playGentleBoing();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 select-none overflow-y-auto">
      {/* Top Banner Celebration */}
      <div className="relative p-6 bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-400 text-amber-950 flex flex-col items-center text-center shadow-md">
        {/* Celebration Trophy Image */}
        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md mb-2 bg-white">
          <img
            src="/src/assets/images/toki_trophy_celebration_1791027051257.jpg"
            alt="Toki Celebration"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
          {paper.title} · 学习评估报告
        </div>

        {/* Stars Earned */}
        <div className="flex items-center gap-1.5 my-2">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-8 h-8 transition-transform duration-300 ${
                result.stars >= starIdx
                  ? 'fill-amber-500 text-amber-600 scale-110 drop-shadow-md'
                  : 'text-amber-200 fill-amber-100/50'
              }`}
            />
          ))}
        </div>

        {/* Big Score Number */}
        <div className="text-4xl font-bubble font-black tracking-tight drop-shadow-sm tabular-nums">
          {result.totalScore} <span className="text-lg font-bold">分</span>
        </div>

        {/* Status Message */}
        <p className="text-xs font-bold text-amber-900 mt-1 max-w-xs">
          {result.stars >= 1
            ? `🎉 表现优异！成功解锁下一关卡！(准确率 ${Math.round((result.correctCount / result.totalCount) * 100)}%)`
            : `💪 距离解锁下一关还差一点点（需达到60%及以上），再挑战一次吧！`}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-xs mt-4">
          <div className="p-2 bg-white/90 rounded-xl border border-amber-200/80 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">答对题数</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums">
              {result.correctCount} / {result.totalCount}
            </div>
          </div>
          <div className="p-2 bg-white/90 rounded-xl border border-amber-200/80 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">未作答</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums">
              {result.unansweredCount} 题
            </div>
          </div>
          <div className="p-2 bg-white/90 rounded-xl border border-amber-200/80 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">答卷用时</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums">
              {formatDuration(result.durationSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Content */}
      <div className="p-4 max-w-lg mx-auto w-full flex flex-col gap-4">
        {/* Next Action Suggestion Card */}
        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-amber-200 shadow-xs">
          <TokiMascot mood={result.stars >= 1 ? 'happy' : 'coaching'} size="sm" />
          <div className="flex-1 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block">向导 Toki 的下一步建议：</span>
            {result.stars >= 1
              ? '本次基础掌握扎实，建议直接进入下一关继续探索更多大马英语技能！'
              : '建议先查看下方错题解析与规则点，针对弱项完成一次补强题后再重做本关！'}
          </div>
        </div>

        {/* Diagnostic Strengths & Growth Areas (PRD Section 13.1) */}
        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            本次能力诊断 (本次题目显示)
          </h4>

          {/* Strengths */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>做得好的具体能力点：</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1 pl-5 list-disc marker:text-emerald-500">
              {result.strengths.map((str, idx) => (
                <li key={idx} className="leading-snug">{str}</li>
              ))}
            </ul>
          </div>

          {/* Growth Areas */}
          {result.areasToImprove.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>建议重点强化的技能：</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1 pl-5 list-disc marker:text-amber-500">
                {result.areasToImprove.map((area, idx) => (
                  <li key={idx} className="leading-snug">{area}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Detailed Question Review & Explanations Header */}
        <div className="flex items-center justify-between mt-2">
          <h4 className="text-sm font-bubble font-bold text-slate-800 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>逐题解析与针对补强</span>
          </h4>

          {/* Filter segment */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-xl text-[11px] font-semibold">
            <button
              onClick={() => {
                soundFx.playPop();
                setFilterMode('all');
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterMode === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => {
                soundFx.playPop();
                setFilterMode('wrong');
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterMode === 'wrong' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              仅看错题 ({questions.filter((q) => !result.answers[q.id]?.isCorrect).length})
            </button>
          </div>
        </div>

        {/* Questions Explanations Accordion List */}
        <div className="flex flex-col gap-3">
          {filteredQuestions.map((q, idx) => {
            const ansInfo = result.answers[q.id];
            const isCorrect = ansInfo?.isCorrect;
            const isExpanded = expandedQId === q.id || !isCorrect;

            return (
              <div
                key={q.id}
                className={`p-4 bg-white rounded-2xl border transition-all ${
                  isCorrect ? 'border-emerald-200' : 'border-rose-200 bg-rose-50/10'
                }`}
              >
                {/* Accordion Toggle Header */}
                <div
                  onClick={() => {
                    soundFx.playPop();
                    setExpandedQId(isExpanded ? null : q.id);
                  }}
                  className="flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-slate-500">
                        第 {paper.questions.indexOf(q) + 1} 题 · {q.skillNameZh}
                      </div>
                      <div className="text-xs md:text-sm font-semibold text-slate-800 mt-0.5 leading-snug">
                        {q.stem}
                      </div>
                    </div>
                  </div>

                  <div className="text-slate-400 p-1 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2.5 text-xs text-slate-700">
                    {/* Correct Answer & Student Answer */}
                    <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-slate-500">正确答案：</span>
                        <strong className="text-emerald-700 font-bold ml-1">
                          {typeof q.correctAnswer === 'object'
                            ? JSON.stringify(q.correctAnswer)
                            : String(q.correctAnswer)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500">你的作答：</span>
                        <strong className={isCorrect ? 'text-emerald-700 font-bold ml-1' : 'text-rose-600 font-bold ml-1'}>
                          {ansInfo?.studentAnswer !== undefined
                            ? typeof ansInfo.studentAnswer === 'object'
                              ? JSON.stringify(ansInfo.studentAnswer)
                              : String(ansInfo.studentAnswer)
                            : '(未作答)'}
                        </strong>
                      </div>
                    </div>

                    {/* Correct Reason (一句简明的正确理由) */}
                    <div>
                      <strong className="text-slate-900 block mb-0.5">💡 为什么选这个答案：</strong>
                      <p className="text-slate-700 leading-relaxed">{q.explanation.correctReason}</p>
                    </div>

                    {/* Rule Note (对应语法或阅读规则) */}
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                      <strong className="text-amber-900 block mb-0.5">📘 核心考点规则点：</strong>
                      <p className="text-amber-800 leading-relaxed">{q.explanation.ruleNote}</p>
                    </div>

                    {/* Malaysian Real Life Example Sentence */}
                    <div>
                      <strong className="text-slate-900 block mb-0.5">🇲🇾 大马生活实境例句：</strong>
                      <p className="text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-200">
                        {q.explanation.malaysianExample}
                      </p>
                    </div>

                    {/* Targeted Reinforcement Question (同能力点补强题) */}
                    {q.explanation.reinforcementQuestion && (
                      <div className="mt-2 p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
                        <div className="text-xs font-bold text-indigo-900 flex items-center gap-1 mb-2">
                          <Award className="w-3.5 h-3.5 text-indigo-600" />
                          <span>同能力点现场补强练习：</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 mb-2">
                          {q.explanation.reinforcementQuestion.stem}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {q.explanation.reinforcementQuestion.options.map((opt) => {
                            const isChosen = reinforceAnswer[q.id] === opt;
                            const isFeedback = reinforceFeedback[q.id] !== undefined;
                            const isCorrectOpt = opt === q.explanation.reinforcementQuestion?.correctAnswer;

                            return (
                              <button
                                key={opt}
                                disabled={isFeedback}
                                onClick={() =>
                                  handleReinforceSubmit(
                                    q.id,
                                    opt,
                                    q.explanation.reinforcementQuestion!.correctAnswer
                                  )
                                }
                                className={`p-2 rounded-xl text-xs font-medium text-left transition-all ${
                                  isFeedback && isCorrectOpt
                                    ? 'bg-emerald-500 text-white font-bold'
                                    : isFeedback && isChosen && !isCorrectOpt
                                    ? 'bg-rose-500 text-white line-through'
                                    : isChosen
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-white hover:bg-indigo-100 border border-indigo-200 text-slate-800'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {reinforceFeedback[q.id] !== undefined && (
                          <div className="mt-2 text-xs font-bold text-indigo-950">
                            {reinforceFeedback[q.id]
                              ? '🎉 太棒了，完全答对！该能力点已掌握！'
                              : '💡 再看一次规则：' + q.explanation.reinforcementQuestion.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="sticky bottom-0 z-30 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => {
              soundFx.playPop();
              onReturnToMap();
            }}
            className="flex-1 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bubble font-bold text-xs shadow-xs active:scale-95 transition-all text-center"
          >
            返回关卡地图
          </button>

          <button
            onClick={() => {
              soundFx.playPop();
              onRetry();
            }}
            className="flex-1 py-3 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bubble font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>再练一次</span>
          </button>

          {result.stars >= 1 && (
            <button
              onClick={() => {
                soundFx.playDing();
                onContinueNext();
              }}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-bubble font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <span>继续下一关</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
