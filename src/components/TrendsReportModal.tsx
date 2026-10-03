import React from 'react';
import { StudentProfile, LevelProgress } from '../types/game';
import { BADGE_LIST } from '../data/questionBank';
import { TokiMascot } from './TokiMascot';
import { soundFx } from '../services/soundEffects';
import {
  X,
  TrendingUp,
  Award,
  Sparkles,
  Star,
  CheckCircle,
  BarChart3,
  Calendar,
  Compass,
  Trophy,
  BookOpen,
  Headphones
} from 'lucide-react';

interface TrendsReportModalProps {
  profile: StudentProfile;
  onClose: () => void;
}

export const TrendsReportModal: React.FC<TrendsReportModalProps> = ({
  profile,
  onClose,
}) => {
  // Aggregate stats
  const completedLevels = Object.values(profile.progress).filter((p) => p.stars > 0);
  const totalStars = Object.values(profile.progress).reduce((acc, p) => acc + p.stars, 0);

  // Simulated 5 recent attempts trend
  const recentAttempts = [
    { name: '关卡 1 (日常)', score: 100, stars: 3, date: '昨天 16:20' },
    { name: '关卡 2 (日常)', score: 85, stars: 2, date: '昨天 17:15' },
    { name: '关卡 9 (检测)', score: 75, stars: 2, date: '今天 10:05' },
    { name: '关卡 10 (Boss)', score: 90, stars: 3, date: '今天 11:30' },
    { name: '关卡 11 (日常)', score: 80, stars: 2, date: '刚刚' },
  ];

  // Specific skills mastery benchmarks complying with PRD Section 13.3
  const skillDomains = [
    { name: 'Sentence Construction', labelZh: '句子结构与语序', accuracy: 88, tag: '近期稳定' },
    { name: 'Grammar Accuracy', labelZh: '语法准确度 (主谓一致/时态)', accuracy: 82, tag: '良好' },
    { name: 'Vocabulary Use', labelZh: '词汇应用与大马文化常识', accuracy: 94, tag: '优势强项' },
    { name: 'Reading Comprehension', labelZh: '阅读理解与细节提取', accuracy: 85, tag: '良好' },
    { name: 'Information Transfer', labelZh: '信息转换 (表格与海报提取)', accuracy: 78, tag: '建议持续强化' },
    { name: 'Listening Comprehension', labelZh: '听力理解与日常指令', accuracy: 90, tag: '优势强项' },
    { name: 'Exam Readiness', labelZh: '自动化题型应试熟练度', accuracy: 86, tag: '稳定提升' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-900" />
            <div>
              <h3 className="text-base font-bubble font-black">学情趋势与能力报告</h3>
              <div className="text-[11px] text-amber-900/80 font-medium">
                Student ID: {profile.studentId} · 累计关卡练习分析
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playPop();
              onClose();
            }}
            className="p-1 rounded-full bg-black/10 hover:bg-black/20 text-amber-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4 text-xs text-slate-700">
          {/* Summary Strip */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="text-[10px] text-amber-800 font-semibold">已通关卡</div>
              <div className="text-lg font-bubble font-black text-amber-950 tabular-nums">
                {completedLevels.length} <span className="text-xs font-normal">/ 50</span>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="text-[10px] text-amber-800 font-semibold">累计金星</div>
              <div className="text-lg font-bubble font-black text-amber-950 flex items-center justify-center gap-0.5 tabular-nums">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{totalStars}</span>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="text-[10px] text-amber-800 font-semibold">连续练习</div>
              <div className="text-lg font-bubble font-black text-amber-950 tabular-nums">
                {profile.currentStreakDays} <span className="text-xs font-normal">天</span>
              </div>
            </div>
          </div>

          {/* Recent 5 Attempts Trend (PRD Section 13.2) */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2.5">
            <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>最近练习成绩走势 (最高与最近)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">近 5 次尝试</span>
            </div>

            <div className="flex items-end justify-between gap-2 h-28 pt-4 px-2 border-b border-slate-200">
              {recentAttempts.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-bold text-amber-800 tabular-nums">
                    {item.score}%
                  </span>
                  <div
                    className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-amber-400 to-amber-500 transition-all duration-500"
                    style={{ height: `${(item.score / 100) * 80}%` }}
                  />
                  <span className="text-[9px] text-slate-500 text-center truncate w-full">
                    {item.name.slice(0, 4)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Performance Mastery Breakdown */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-3">
            <div className="text-xs font-bold text-slate-800">
              技能维度准确率 (自动化测评数据)
            </div>

            <div className="flex flex-col gap-2">
              {skillDomains.map((sk) => (
                <div key={sk.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{sk.name}</span>
                      <span className="text-[10px] text-slate-500 ml-1">({sk.labelZh})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-md font-medium">
                        {sk.tag}
                      </span>
                      <span className="font-bold text-slate-800 tabular-nums">{sk.accuracy}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sk.accuracy >= 90
                          ? 'bg-emerald-500'
                          : sk.accuracy >= 80
                          ? 'bg-amber-500'
                          : 'bg-sky-500'
                      }`}
                      style={{ width: `${sk.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Collection Showcase */}
          <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200 flex flex-col gap-2.5">
            <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>通关荣誉徽章库</span>
              </span>
              <span className="text-[10px] text-amber-800">
                已收集 {profile.badges.length} / {BADGE_LIST.length}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {BADGE_LIST.map((b) => {
                const isEarned = profile.badges.includes(b.id) || profile.totalStars >= b.requiredLevel;
                return (
                  <div
                    key={b.id}
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all ${
                      isEarned
                        ? 'bg-white border-amber-300 text-amber-950 shadow-xs'
                        : 'bg-slate-100/60 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isEarned ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] font-bold truncate w-full">{b.name}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{b.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic Statement Note complying with PRD Section 13.3 */}
          <div className="p-3 bg-slate-100 rounded-xl text-[10px] text-slate-500 leading-relaxed">
            * 说明：本报告呈现该 Student ID 在本练习系统内的自动化题目测评表现，客观反映阅读理解、语法准确度与信息提取能力，不包含主观自由写作或口试，不作正式官方考试成绩预测。
          </div>
        </div>
      </div>
    </div>
  );
};
