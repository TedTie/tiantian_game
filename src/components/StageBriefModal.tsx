import React from 'react';
import { Paper } from '../types/game';
import { TokiMascot } from './TokiMascot';
import { soundFx } from '../services/soundEffects';
import { Clock, HelpCircle, Headphones, Award, X, Sparkles } from 'lucide-react';

interface StageBriefModalProps {
  paper: Paper;
  onStart: () => void;
  onClose: () => void;
  bestScore?: number;
  bestStars?: number;
}

export const StageBriefModal: React.FC<StageBriefModalProps> = ({
  paper,
  onStart,
  onClose,
  bestScore = 0,
  bestStars = 0,
}) => {
  const isBoss = paper.type === 'boss';
  const isCheckpoint = paper.type === 'checkpoint';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border-4 border-amber-200 overflow-hidden flex flex-col">
        {/* Header Ribbon */}
        <div
          className={`px-5 py-4 text-white relative ${
            isBoss
              ? 'bg-gradient-to-r from-red-500 via-rose-500 to-amber-500'
              : isCheckpoint
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950'
              : 'bg-gradient-to-r from-amber-400 to-amber-500'
          }`}
        >
          <button
            onClick={() => {
              soundFx.playPop();
              onClose();
            }}
            className="absolute top-3.5 right-3.5 p-1 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-[11px] font-bold uppercase tracking-wider opacity-90">
            {isBoss ? '🔥 BOSS 模拟战' : isCheckpoint ? '⭐ 阶段综合检测' : '📘 日常演练小卷'}
          </div>
          <h2 className="text-lg font-bubble font-black mt-0.5 leading-snug">
            {paper.title}
          </h2>
          <div className="text-xs opacity-90 mt-0.5 font-medium">
            {paper.subtitle}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-4">
          {/* Toki Guide Row */}
          <div className="flex items-center gap-3 bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60">
            <TokiMascot mood={isBoss ? 'boss' : 'happy'} size="sm" />
            <div className="text-xs text-slate-700 leading-relaxed font-medium">
              {isBoss
                ? '我是大马丛林守护者 Toki！全力以赴冲击三星王者徽章吧！'
                : '每次用 8–15 分钟完成一份日常小卷，答完即出能力解析哦！'}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>建议用时</span>
              </div>
              <div className="text-sm font-bold text-slate-800 mt-0.5 tabular-nums">
                {paper.estimatedMinutes} 分钟
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                <span>题目数量</span>
              </div>
              <div className="text-sm font-bold text-slate-800 mt-0.5 tabular-nums">
                {paper.questions.length} 题 (自动判分)
              </div>
            </div>
          </div>

          {/* Previous Best Record if available */}
          {bestScore > 0 && (
            <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
              <span className="font-semibold flex items-center gap-1">
                <Award className="w-4 h-4 text-emerald-600" />
                历史最佳纪录
              </span>
              <span className="font-bold tabular-nums">
                {bestScore} 分 ({bestStars} ★)
              </span>
            </div>
          )}

          {/* Audio Notice if paper has listening question */}
          {paper.questions.some((q) => q.type === 'listening_choice') && (
            <div className="flex items-start gap-2 p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900">
              <Headphones className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">听力提醒：</span>
                包含真实日常听力题，每题允许播放 2 次，请调整适当设备音量。
              </div>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={() => {
              if (isBoss) {
                soundFx.playBossIntro();
              } else {
                soundFx.playDing();
              }
              onStart();
            }}
            className={`w-full py-3.5 rounded-2xl font-bubble font-black text-base text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
              isBoss
                ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-red-500/30'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 shadow-amber-400/30'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>开始挑战</span>
          </button>
        </div>
      </div>
    </div>
  );
};
