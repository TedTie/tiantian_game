import React, { useRef, useEffect } from 'react';
import { LevelProgress, Paper, GradeLevel, DifficultyTrack } from '../types/game';
import { soundFx } from '../services/soundEffects';
import { TokiMascot } from './TokiMascot';
import { Star, Lock, Crown, Gift, Compass, ChevronRight, Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';

interface LevelMapProps {
  grade: GradeLevel;
  difficulty: DifficultyTrack;
  progressMap: Record<string, LevelProgress>;
  currentLevel: number;
  totalStars: number;
  onSelectLevel: (levelNo: number) => void;
  onOpenProfile: () => void;
  onOpenTrends: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  studentId: string;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  grade,
  difficulty,
  progressMap,
  currentLevel,
  totalStars,
  onSelectLevel,
  onOpenProfile,
  onOpenTrends,
  isMuted,
  onToggleMute,
  studentId,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll towards current active node on load
  useEffect(() => {
    if (activeNodeRef.current) {
      activeNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentLevel]);

  // Generate 50 nodes array
  const totalLevels = 50;
  const nodes = Array.from({ length: totalLevels }, (_, i) => i + 1);

  // Helper to determine node status
  const getNodeInfo = (levelNo: number) => {
    const key = `${grade}_${difficulty}_${levelNo}`;
    const progress = progressMap[key];
    const isUnlocked = levelNo === 1 || (progress && progress.unlocked);
    const isCompleted = progress && progress.stars > 0;
    const stars = progress ? progress.stars : 0;
    const isBoss = levelNo % 10 === 0;
    const isCheckpoint = levelNo % 10 === 9;
    const isCurrent = levelNo === currentLevel;

    return { isUnlocked, isCompleted, stars, isBoss, isCheckpoint, isCurrent, bestScore: progress?.bestScore || 0 };
  };

  const handleNodeClick = (levelNo: number, isUnlocked: boolean, isBoss: boolean) => {
    if (!isUnlocked) {
      soundFx.playGentleBoing();
      return;
    }
    if (isBoss) {
      soundFx.playBossIntro();
    } else {
      soundFx.playDing();
    }
    onSelectLevel(levelNo);
  };

  // Jump to specific zone
  const jumpToZone = (startLevel: number) => {
    soundFx.playPop();
    const elem = document.getElementById(`node-level-${startLevel}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-b from-sky-100 via-amber-50/70 to-emerald-50 select-none">
      {/* Top Floating Status Bar */}
      <header className="sticky top-0 z-30 px-4 py-2.5 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 51Talk Brand Mark */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={onOpenProfile}>
            <div className="w-8 h-8 rounded-xl bg-amber-400 border border-amber-500/30 flex items-center justify-center font-bubble font-black text-white text-base shadow-sm">
              51
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>天天练智能题库</span>
              </div>
              <div className="text-[11px] text-amber-600 font-medium">
                ID: {studentId} · ☁️已同步
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls: Stars, Trends, Mute */}
        <div className="flex items-center gap-2">
          {/* Star Counter */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-100/90 border border-amber-300/60 rounded-full text-amber-800 font-bold text-xs shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="tabular-nums font-bubble text-sm">{totalStars}</span>
            <span className="text-[10px] text-amber-700/80 font-normal">/ 150★</span>
          </div>

          {/* Learning Trend Report Button */}
          <button
            onClick={() => {
              soundFx.playPop();
              onOpenTrends();
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-xs transition-colors"
            title="查看近期练习趋势与能力报告"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>报告</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-slate-600 shadow-xs transition-colors"
            title={isMuted ? '开启音效' : '静音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
          </button>
        </div>
      </header>

      {/* Hero Banner with Toki */}
      <div className="relative mx-3 mt-3 overflow-hidden rounded-2xl border border-amber-200 shadow-md bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300">
        <img
          src="/src/assets/images/toki_english_adventure_banner_1791027038141.jpg"
          alt="Toki English Adventure"
          referrerPolicy="no-referrer"
          className="w-full h-28 object-cover opacity-85 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-3 text-white">
          <div className="w-full flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-amber-200 uppercase tracking-wide">
                {grade} 级 · {difficulty === 'easy' ? '轻松 (Easy)' : difficulty === 'medium' ? '中等 (Medium)' : '挑战 (Challenge)'}
              </div>
              <h2 className="text-base font-bubble font-bold text-white drop-shadow-sm">
                当前目标：第 {currentLevel} 关
              </h2>
            </div>
            <button
              onClick={() => handleNodeClick(currentLevel, true, currentLevel % 10 === 0)}
              className="px-3.5 py-1.5 bg-white text-amber-700 hover:bg-amber-50 active:scale-95 font-bubble font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
            >
              <span>立即挑战</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Zone Quick Jumper Bar */}
      <div className="px-3 pt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { label: '起步岛 (1-10)', start: 1 },
          { label: '雨林原野 (11-20)', start: 11 },
          { label: '海湾古城 (21-30)', start: 21 },
          { label: '高地茶园 (31-40)', start: 31 },
          { label: '巅峰殿堂 (41-50)', start: 41 },
        ].map((zone) => (
          <button
            key={zone.start}
            onClick={() => jumpToZone(zone.start)}
            className="shrink-0 px-2.5 py-1 bg-white/80 hover:bg-white border border-amber-200/80 rounded-lg text-[11px] font-semibold text-slate-700 shadow-xs transition-colors"
          >
            {zone.label}
          </button>
        ))}
      </div>

      {/* Adventure Winding Map Trail */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-8 relative"
      >
        <div className="max-w-md mx-auto relative flex flex-col items-center gap-6">
          {nodes.map((levelNo) => {
            const { isUnlocked, isCompleted, stars, isBoss, isCheckpoint, isCurrent } = getNodeInfo(levelNo);

            // Winding horizontal offset pattern for road-like feel: -40px, 0, 40px, 0, etc.
            const offsetIdx = levelNo % 4;
            let offsetClass = 'translate-x-0';
            if (offsetIdx === 1) offsetClass = '-translate-x-10';
            if (offsetIdx === 3) offsetClass = 'translate-x-10';

            return (
              <div
                id={`node-level-${levelNo}`}
                key={levelNo}
                ref={isCurrent ? activeNodeRef : undefined}
                className={`relative flex flex-col items-center ${offsetClass} transition-transform duration-300`}
              >
                {/* Toki Mascot Standing on Current Node */}
                {isCurrent && (
                  <div className="absolute -top-16 z-20 flex flex-col items-center animate-bounce-gentle">
                    <TokiMascot
                      mood={isBoss ? 'boss' : 'happy'}
                      size="sm"
                      bubbleText={isBoss ? '🔥 Boss 决战！' : '来这练！'}
                    />
                  </div>
                )}

                {/* Level Circle Node Button */}
                <button
                  onClick={() => handleNodeClick(levelNo, isUnlocked, isBoss)}
                  disabled={!isUnlocked}
                  className={`relative group w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-lg active:scale-95 ${
                    !isUnlocked
                      ? 'bg-slate-200 border-4 border-slate-300 text-slate-400 cursor-not-allowed opacity-80'
                      : isBoss
                      ? 'bg-gradient-to-tr from-rose-500 via-red-500 to-amber-500 border-4 border-yellow-300 text-white shadow-red-500/30'
                      : isCheckpoint
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 border-4 border-amber-200 text-amber-950 shadow-amber-400/30'
                      : isCompleted
                      ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 border-4 border-emerald-200 text-white shadow-emerald-500/20'
                      : 'bg-gradient-to-tr from-amber-400 to-amber-500 border-4 border-white text-white shadow-amber-500/30'
                  } ${isCurrent ? 'ring-4 ring-amber-400 ring-offset-2 scale-105' : ''}`}
                >
                  {/* Glowing Pulse Ring for Current Level */}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full bg-amber-400 opacity-40 animate-ping -z-10" />
                  )}

                  {/* Icon or Level Number */}
                  {!isUnlocked ? (
                    <Lock className="w-5 h-5 text-slate-400" />
                  ) : isBoss ? (
                    <div className="flex flex-col items-center">
                      <Crown className="w-5 h-5 text-yellow-200 drop-shadow-sm animate-pulse" />
                      <span className="text-[11px] font-bubble font-black tracking-wider leading-none">
                        BOSS {levelNo}
                      </span>
                    </div>
                  ) : isCheckpoint ? (
                    <div className="flex flex-col items-center">
                      <Gift className="w-5 h-5 text-amber-900 drop-shadow-xs" />
                      <span className="text-[11px] font-bubble font-black leading-none">
                        检测 {levelNo}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bubble font-bold tabular-nums">
                      {levelNo}
                    </span>
                  )}

                  {/* Level Type Tag Ribbon */}
                  {isBoss && (
                    <span className="absolute -top-2.5 px-2 py-0.5 bg-red-600 border border-yellow-300 text-yellow-100 text-[9px] font-black rounded-full uppercase tracking-tight shadow-xs">
                      模拟卷
                    </span>
                  )}
                  {isCheckpoint && (
                    <span className="absolute -top-2.5 px-2 py-0.5 bg-amber-600 text-white text-[9px] font-black rounded-full uppercase tracking-tight shadow-xs">
                      阶段卷
                    </span>
                  )}
                </button>

                {/* Star Rating Display Under Node */}
                {isUnlocked && (
                  <div className="flex items-center gap-0.5 mt-1.5 px-2 py-0.5 bg-white/80 rounded-full shadow-xs border border-amber-100">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3 h-3 ${
                          stars >= starIdx
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-slate-200 fill-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                )}
                {!isUnlocked && (
                  <span className="text-[10px] text-slate-400 mt-1 font-medium">
                    需1星解锁
                  </span>
                )}

                {/* Connecting Trail Line between nodes */}
                {levelNo < totalLevels && (
                  <div className="w-1.5 h-6 bg-amber-200/80 rounded-full my-1 border-dashed border-amber-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
