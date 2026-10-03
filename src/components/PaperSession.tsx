import React, { useState, useEffect, useRef } from 'react';
import { Paper, Question, AttemptAnswer } from '../types/game';
import { soundFx } from '../services/soundEffects';
import { TokiMascot } from './TokiMascot';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  LayoutGrid
} from 'lucide-react';

interface PaperSessionProps {
  paper: Paper;
  onSubmit: (answers: Record<string, any>, durationSeconds: number) => void;
  onExit: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PaperSession: React.FC<PaperSessionProps> = ({
  paper,
  onSubmit,
  onExit,
  isMuted,
  onToggleMute,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOverviewDrawer, setShowOverviewDrawer] = useState(false);

  // Audio player state per question: { [qId]: playsUsed }
  const [audioPlays, setAudioPlays] = useState<Record<string, number>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Timer reference
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      clearInterval(timer);
      soundFx.stopSpeaking();
    };
  }, []);

  // Try restore draft from localStorage
  useEffect(() => {
    try {
      const draft = localStorage.getItem(`draft_${paper.id}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.bookmarked) setBookmarked(parsed.bookmarked);
        if (parsed.elapsedSeconds) setElapsedSeconds(parsed.elapsedSeconds);
      }
    } catch {
      // ignore
    }
  }, [paper.id]);

  // Auto-save draft on answers change
  useEffect(() => {
    try {
      localStorage.setItem(
        `draft_${paper.id}`,
        JSON.stringify({ answers, bookmarked, elapsedSeconds })
      );
    } catch {
      // ignore
    }
  }, [answers, bookmarked, elapsedSeconds, paper.id]);

  const currentQ = paper.questions[currentIndex];
  const totalQuestions = paper.questions.length;
  const answeredCount = Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length;
  const unansweredCount = totalQuestions - answeredCount;

  const handleSetAnswer = (ans: any) => {
    soundFx.playSnap();
    setAnswers((prev) => ({ ...prev, [currentQ.id]: ans }));
  };

  const handleToggleBookmark = () => {
    soundFx.playPop();
    setBookmarked((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const handlePlayAudio = () => {
    const playsUsed = audioPlays[currentQ.id] || 0;
    const limit = currentQ.audioPlayCountLimit || 2;
    if (playsUsed >= limit || isPlayingAudio) return;

    soundFx.playDing();
    setAudioPlays((prev) => ({ ...prev, [currentQ.id]: playsUsed + 1 }));
    setIsPlayingAudio(true);

    if (currentQ.audioScript) {
      soundFx.speakText(currentQ.audioScript, () => {
        setIsPlayingAudio(false);
      });
    } else {
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 3000);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinalSubmit = () => {
    soundFx.stopSpeaking();
    // Clear draft
    try {
      localStorage.removeItem(`draft_${paper.id}`);
    } catch {
      // ignore
    }
    onSubmit(answers, elapsedSeconds);
  };

  // Render question interactive input based on type
  const renderQuestionBody = () => {
    switch (currentQ.type) {
      case 'single_choice':
      case 'dialogue_matching':
      case 'listening_choice': {
        const selected = answers[currentQ.id];
        return (
          <div className="flex flex-col gap-2.5 mt-4">
            {currentQ.options?.map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSetAnswer(opt.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left font-medium transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'bg-amber-100/90 border-amber-500 text-amber-950 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bubble font-black text-sm shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {opt.id}
                  </div>
                  <div className="flex-1 text-sm leading-relaxed">{opt.text}</div>
                </button>
              );
            })}
          </div>
        );
      }

      case 'sentence_builder': {
        const currentTokens: string[] = answers[currentQ.id] || [];
        const availableTokens = (currentQ.tokens || []).filter(
          (tok, idx) => {
            // Count occurrences in target vs used
            const totalOccurrences = (currentQ.tokens || []).filter((t) => t === tok).length;
            const usedOccurrences = currentTokens.filter((t) => t === tok).length;
            const priorOccurrences = (currentQ.tokens || []).slice(0, idx).filter((t) => t === tok).length;
            return priorOccurrences >= usedOccurrences;
          }
        );

        const handleAddToken = (token: string) => {
          soundFx.playSnap();
          setAnswers((prev) => ({
            ...prev,
            [currentQ.id]: [...(prev[currentQ.id] || []), token],
          }));
        };

        const handleRemoveToken = (removeIdx: number) => {
          soundFx.playPop();
          setAnswers((prev) => {
            const list = [...(prev[currentQ.id] || [])];
            list.splice(removeIdx, 1);
            return { ...prev, [currentQ.id]: list };
          });
        };

        return (
          <div className="flex flex-col gap-4 mt-4">
            {/* Sentence Construction Zone */}
            <div className="min-h-[72px] p-3.5 bg-amber-50/60 rounded-2xl border-2 border-dashed border-amber-300 flex flex-wrap gap-2 items-center">
              {currentTokens.length === 0 ? (
                <span className="text-xs text-amber-700/60 italic font-medium">
                  点击下方单词块拼装正确句子……
                </span>
              ) : (
                currentTokens.map((tok, idx) => (
                  <button
                    key={`${tok}_${idx}`}
                    onClick={() => handleRemoveToken(idx)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bubble font-bold text-sm rounded-xl shadow-xs transition-transform active:scale-90 flex items-center gap-1"
                  >
                    <span>{tok}</span>
                    <span className="text-[10px] text-amber-900/60">×</span>
                  </button>
                ))
              )}
            </div>

            {/* Token Bank */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                单词备选池 (Word Bank)
              </div>
              <div className="flex flex-wrap gap-2">
                {(currentQ.tokens || []).map((tok, idx) => {
                  // check if this specific instance is already used
                  const countInBank = (currentQ.tokens || []).slice(0, idx + 1).filter((t) => t === tok).length;
                  const countUsed = currentTokens.filter((t) => t === tok).length;
                  const isUsed = countInBank <= countUsed;

                  return (
                    <button
                      key={`${tok}_bank_${idx}`}
                      disabled={isUsed}
                      onClick={() => handleAddToken(tok)}
                      className={`px-3 py-1.5 rounded-xl font-bubble font-semibold text-sm border transition-all ${
                        isUsed
                          ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-60'
                          : 'bg-white hover:bg-amber-50 border-amber-200 text-slate-800 shadow-xs active:scale-95'
                      }`}
                    >
                      {tok}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      case 'matching': {
        const pairs = currentQ.pairs || [];
        const currentMatches: Record<string, string> = answers[currentQ.id] || {};
        const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

        const leftItems = pairs.map((p) => p.left);
        const rightItems = pairs.map((p) => p.right);

        const handleLeftClick = (item: string) => {
          soundFx.playPop();
          setSelectedLeft(item);
        };

        const handleRightClick = (item: string) => {
          if (!selectedLeft) {
            soundFx.playGentleBoing();
            return;
          }
          soundFx.playSnap();
          setAnswers((prev) => ({
            ...prev,
            [currentQ.id]: {
              ...(prev[currentQ.id] || {}),
              [selectedLeft]: item,
            },
          }));
          setSelectedLeft(null);
        };

        const handleRemovePair = (leftItem: string) => {
          soundFx.playPop();
          setAnswers((prev) => {
            const copy = { ...(prev[currentQ.id] || {}) };
            delete copy[leftItem];
            return { ...prev, [currentQ.id]: copy };
          });
        };

        return (
          <div className="flex flex-col gap-4 mt-4">
            <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
              💡 玩法：先点击左侧词汇，再点击右侧对应释义完成配对；点击已配对卡片可取消。
            </div>

            {/* Left and Right Columns */}
            <div className="grid grid-cols-2 gap-3">
              {/* Left Column */}
              <div className="flex flex-col gap-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase">词汇 (Term)</div>
                {leftItems.map((left) => {
                  const isPaired = !!currentMatches[left];
                  const isSelected = selectedLeft === left;
                  return (
                    <button
                      key={left}
                      onClick={() => handleLeftClick(left)}
                      className={`p-2.5 rounded-xl border text-xs text-left font-bold transition-all ${
                        isSelected
                          ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-xs ring-2 ring-amber-400'
                          : isPaired
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {left}
                      {isPaired && <span className="block text-[10px] text-emerald-600 font-normal mt-0.5">✓ 已配对</span>}
                    </button>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase">释义 (Meaning)</div>
                {rightItems.map((right) => {
                  const matchedLeft = Object.keys(currentMatches).find((k) => currentMatches[k] === right);
                  return (
                    <button
                      key={right}
                      onClick={() => handleRightClick(right)}
                      className={`p-2.5 rounded-xl border text-xs text-left leading-relaxed transition-all ${
                        matchedLeft
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : selectedLeft
                          ? 'bg-amber-50/70 border-amber-300 text-slate-800 hover:bg-amber-100'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {right}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active matched pairs summary */}
            {Object.keys(currentMatches).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(currentMatches).map(([l, r]) => (
                  <button
                    key={l}
                    onClick={() => handleRemovePair(l)}
                    className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-medium border border-emerald-300 flex items-center gap-1.5"
                  >
                    <span><strong>{l}</strong> ⇄ {r.slice(0, 18)}...</span>
                    <span className="text-red-500 font-bold">×</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'cloze_choice': {
        const paragraph = currentQ.clozeParagraph || '';
        const optionsMap = currentQ.clozeOptions || {};
        const currentAns: Record<string, string> = answers[currentQ.id] || {};

        // Parse paragraph parts with [blank_x]
        const parts = paragraph.split(/(\[blank_\d+\])/g);

        return (
          <div className="flex flex-col gap-4 mt-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm leading-relaxed text-slate-800">
              {parts.map((part, idx) => {
                const match = part.match(/\[(blank_\d+)\]/);
                if (match) {
                  const blankKey = match[1];
                  const chosen = currentAns[blankKey];
                  return (
                    <span
                      key={blankKey}
                      className={`inline-block mx-1 px-2.5 py-0.5 rounded-lg border font-bold text-sm ${
                        chosen
                          ? 'bg-amber-300 text-amber-950 border-amber-400'
                          : 'bg-amber-50 text-amber-700 border-amber-300 border-dashed'
                      }`}
                    >
                      {chosen || `(${blankKey.replace('blank_', '空格 ')})`}
                    </span>
                  );
                }
                return <span key={idx}>{part}</span>;
              })}
            </div>

            {/* Dropdowns / Option pickers for each blank */}
            <div className="flex flex-col gap-3">
              {Object.keys(optionsMap).map((blankKey, bIdx) => (
                <div key={blankKey} className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-600 mb-2">
                    选择空格 {bIdx + 1} 答案：
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {optionsMap[blankKey].map((opt) => {
                      const isSelected = currentAns[blankKey] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            soundFx.playSnap();
                            setAnswers((prev) => ({
                              ...prev,
                              [currentQ.id]: {
                                ...(prev[currentQ.id] || {}),
                                [blankKey]: opt.id,
                              },
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-amber-950 shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'error_correction': {
        const tokens = currentQ.sentenceWithTokens || [];
        const currentSelectedWord = answers[currentQ.id]?.selectedWord;
        const currentReplacement = answers[currentQ.id]?.replacement;

        return (
          <div className="flex flex-col gap-4 mt-4">
            <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
              💡 第一步：在句子中点选含有语法错误的单词；第二步：在下方选择正确的修改形式。
            </div>

            {/* Sentence with clickable word tokens */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-wrap gap-2 items-center">
              {tokens.map((word, wIdx) => {
                const isSelected = currentSelectedWord === word;
                return (
                  <button
                    key={`${word}_${wIdx}`}
                    onClick={() => {
                      soundFx.playSnap();
                      setAnswers((prev) => ({
                        ...prev,
                        [currentQ.id]: {
                          ...prev[currentQ.id],
                          selectedWord: word,
                          selectedIdx: wIdx,
                        },
                      }));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-red-500 text-white shadow-xs underline underline-offset-4 ring-2 ring-red-400'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {/* Replacement Options */}
            {currentSelectedWord && (
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="text-xs font-bold text-slate-700 mb-2">
                  将「<span className="text-red-600 font-bold">{currentSelectedWord}</span>」修改为：
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentQ.replacementOptions?.map((rep) => {
                    const isChosen = currentReplacement === rep;
                    return (
                      <button
                        key={rep}
                        onClick={() => {
                          soundFx.playSnap();
                          setAnswers((prev) => ({
                            ...prev,
                            [currentQ.id]: {
                              ...prev[currentQ.id],
                              replacement: rep,
                            },
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isChosen
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700'
                        }`}
                      >
                        {rep}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'information_transfer': {
        const fields = currentQ.transferFields || [];
        const currentAns: Record<string, string> = answers[currentQ.id] || {};

        return (
          <div className="flex flex-col gap-4 mt-4">
            {/* Source Text / Poster / Brochure */}
            {currentQ.sourceText && (
              <div className="p-3.5 bg-amber-50/70 border-2 border-amber-300 rounded-2xl text-xs leading-relaxed text-amber-950 font-mono whitespace-pre-wrap">
                {currentQ.sourceText}
              </div>
            )}

            {/* Input Form Fields */}
            <div className="flex flex-col gap-2.5">
              {fields.map((f) => (
                <div key={f.key} className="p-3 bg-white rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={currentAns[f.key] || ''}
                    placeholder={f.placeholder}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAnswers((prev) => ({
                        ...prev,
                        [currentQ.id]: {
                          ...(prev[currentQ.id] || {}),
                          [f.key]: val,
                        },
                      }));
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white text-slate-800"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-slate-50 select-none">
      {/* Top HUD */}
      <header className="sticky top-0 z-30 px-4 py-2.5 bg-white border-b border-slate-200 shadow-xs flex items-center justify-between">
        {/* Back / Exit Button */}
        <button
          onClick={() => {
            soundFx.playPop();
            onExit();
          }}
          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          title="返回地图"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Level Title & Timer */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-bubble font-bold text-slate-800">
            {paper.title.split('：')[0]}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 tabular-nums">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Right Tools: Bookmark, Overview Drawer, Sound */}
        <div className="flex items-center gap-1.5">
          {/* Bookmark for review */}
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-xl border transition-colors ${
              bookmarked[currentQ.id]
                ? 'bg-amber-100 border-amber-400 text-amber-700'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title="稍后检查"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked[currentQ.id] ? 'fill-amber-500' : ''}`} />
          </button>

          {/* Question overview grid sheet */}
          <button
            onClick={() => {
              soundFx.playPop();
              setShowOverviewDrawer(true);
            }}
            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
            title="题卡总览"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Main Question Body Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        {/* Question Header Card */}
        <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col">
          {/* Question Meta Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 mb-3">
            <span className="font-bubble font-bold text-amber-600">
              第 {currentIndex + 1} / {totalQuestions} 题
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {currentQ.skillNameZh}
            </span>
          </div>

          {/* Audio Player if Listening Question */}
          {currentQ.type === 'listening_choice' && (
            <div className="mb-4 p-3 bg-sky-50 rounded-2xl border border-sky-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handlePlayAudio}
                  disabled={(audioPlays[currentQ.id] || 0) >= (currentQ.audioPlayCountLimit || 2) || isPlayingAudio}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    (audioPlays[currentQ.id] || 0) >= (currentQ.audioPlayCountLimit || 2)
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : isPlayingAudio
                      ? 'bg-sky-500 text-white animate-pulse'
                      : 'bg-sky-500 hover:bg-sky-600 text-white shadow-md active:scale-95'
                  }`}
                >
                  <Play className="w-4 h-4 fill-white" />
                </button>
                <div>
                  <div className="text-xs font-bold text-sky-950">
                    {isPlayingAudio ? '正在播放听力音频...' : '点击播放短文听力'}
                  </div>
                  <div className="text-[10px] text-sky-700">
                    剩余播放次数：
                    <strong className="text-sky-900">
                      {Math.max(0, (currentQ.audioPlayCountLimit || 2) - (audioPlays[currentQ.id] || 0))}
                    </strong> / {currentQ.audioPlayCountLimit || 2} 次
                  </div>
                </div>
              </div>

              {/* Sound wave visualizer */}
              {isPlayingAudio && (
                <div className="flex items-center gap-1">
                  <span className="w-1 h-4 bg-sky-500 rounded-full animate-pulse" />
                  <span className="w-1 h-6 bg-sky-500 rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-3 bg-sky-500 rounded-full animate-pulse delay-150" />
                </div>
              )}
            </div>
          )}

          {/* Context Passage if present */}
          {currentQ.contextPassage && (
            <div className="mb-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-xs text-slate-700 italic leading-relaxed whitespace-pre-wrap">
              {currentQ.contextPassage}
            </div>
          )}

          {/* Question Stem */}
          <h3 className="text-sm md:text-base font-bold text-slate-800 leading-snug">
            {currentQ.stem}
          </h3>

          {/* Interactive input area */}
          {renderQuestionBody()}
        </div>
      </div>

      {/* Bottom Sticky Control Bar */}
      <footer className="sticky bottom-0 z-30 px-4 py-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-md">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          {/* Prev Button */}
          <button
            disabled={currentIndex === 0}
            onClick={() => {
              soundFx.playPop();
              setCurrentIndex((prev) => Math.max(0, prev - 1));
            }}
            className={`flex-1 py-2.5 rounded-2xl font-bubble font-bold text-xs flex items-center justify-center gap-1 border transition-all ${
              currentIndex === 0
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>上一题</span>
          </button>

          {/* Next or Submit Button */}
          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => {
                soundFx.playPop();
                setCurrentIndex((prev) => prev + 1);
              }}
              className="flex-1 py-2.5 rounded-2xl font-bubble font-bold text-xs bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <span>下一题</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                soundFx.playDing();
                setShowConfirmModal(true);
              }}
              className="flex-1 py-2.5 rounded-2xl font-bubble font-black text-xs bg-emerald-500 hover:bg-emerald-600 text-white shadow-md flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>提交整卷</span>
            </button>
          )}
        </div>
      </footer>

      {/* Question Overview Sheet / Drawer */}
      {showOverviewDrawer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="text-sm font-bubble font-bold text-slate-800">
                答题卡进度总览
              </div>
              <button
                onClick={() => setShowOverviewDrawer(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                关闭
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2.5 py-2">
              {paper.questions.map((q, idx) => {
                const isAns = answers[q.id] !== undefined && answers[q.id] !== '';
                const isMarked = bookmarked[q.id];
                const isCurr = currentIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      soundFx.playPop();
                      setCurrentIndex(idx);
                      setShowOverviewDrawer(false);
                    }}
                    className={`relative h-11 rounded-xl flex items-center justify-center font-bubble font-bold text-xs transition-all ${
                      isCurr
                        ? 'ring-2 ring-amber-500 ring-offset-1'
                        : ''
                    } ${
                      isAns
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isMarked && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
              <span>已答: <strong>{answeredCount}</strong></span>
              <span>未答: <strong>{unansweredCount}</strong></span>
              <span>标记: <strong>{Object.values(bookmarked).filter(Boolean).length}</strong></span>
            </div>

            <button
              onClick={() => {
                setShowOverviewDrawer(false);
                setShowConfirmModal(true);
              }}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bubble font-bold text-xs rounded-xl transition-all"
            >
              直接去交卷
            </button>
          </div>
        </div>
      )}

      {/* Submission Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border-4 border-amber-300 flex flex-col items-center text-center gap-3">
            <TokiMascot mood={unansweredCount > 0 ? 'thinking' : 'happy'} size="md" />

            <h3 className="text-base font-bubble font-black text-slate-800">
              确认提交考卷吗？
            </h3>

            {unansweredCount > 0 ? (
              <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-2xl border border-amber-200 text-left leading-relaxed">
                ⚠️ 你还有 <strong className="text-red-600">{unansweredCount} 道题</strong> 尚未作答，提交后将无法修改本轮答案哦！
              </div>
            ) : (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200">
                🎉 太棒啦！你已经完成了全部 {totalQuestions} 道题目！
              </div>
            )}

            <div className="flex items-center gap-2 w-full mt-2">
              <button
                onClick={() => {
                  soundFx.playPop();
                  setShowConfirmModal(false);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bubble font-bold text-xs rounded-xl transition-colors"
              >
                继续检查
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bubble font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                确定交卷
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
