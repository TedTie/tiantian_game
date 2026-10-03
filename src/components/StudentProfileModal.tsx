import React, { useState } from 'react';
import { GradeLevel, DifficultyTrack, StudentProfile } from '../types/game';
import { GRADE_LIST, DIFFICULTY_LIST } from '../data/questionBank';
import { TokiMascot } from './TokiMascot';
import { soundFx } from '../services/soundEffects';
import { X, UserCheck, ShieldCheck, School, Sparkles, Check, RefreshCw } from 'lucide-react';

interface StudentProfileModalProps {
  currentProfile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  currentProfile,
  onUpdateProfile,
  onClose,
}) => {
  const [inputStudentId, setInputStudentId] = useState(currentProfile.studentId);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(currentProfile.grade);
  const [selectedDiff, setSelectedDiff] = useState<DifficultyTrack>(currentProfile.selectedDifficulty);

  // Preset demo students for easy one-click testing
  const demoProfiles = [
    { id: 'MY-Y4-KAIXUAN', name: 'Kai Xuan (凯旋)', grade: 'Y4' as GradeLevel, desc: '小学四年级 · 正在冲刺 UASA 关卡' },
    { id: 'MY-Y4-AISHAH', name: 'Aishah (艾莎)', grade: 'Y4' as GradeLevel, desc: '小学四年级 · 听力强项练习生' },
    { id: 'MY-Y2-ZIEN', name: 'Zi En (子恩)', grade: 'Y2' as GradeLevel, desc: '小学二年级 · 基础动词启蒙' },
    { id: 'MY-F2-WEILUN', name: 'Wei Lun (伟伦)', grade: 'F2' as GradeLevel, desc: '初中二年级 · 挑战篇章阅读' },
  ];

  const handleSave = () => {
    soundFx.playDing();
    onUpdateProfile({
      studentId: inputStudentId.trim() || 'MY-Y4-DEMO',
      grade: selectedGrade,
      selectedDifficulty: selectedDiff,
    });
    onClose();
  };

  const handleSelectDemo = (demo: typeof demoProfiles[0]) => {
    soundFx.playPop();
    setInputStudentId(demo.id);
    setSelectedGrade(demo.grade);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border-4 border-amber-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-900" />
            <div>
              <h3 className="text-base font-bubble font-black">学生身份与关卡设置</h3>
              <div className="text-[11px] text-amber-900/80 font-medium">
                Student ID 免密同步机制
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

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4 text-xs text-slate-700">
          {/* Toki Welcome Card */}
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <TokiMascot mood="happy" size="sm" />
            <div className="text-xs text-amber-950 leading-relaxed">
              输入你的 <strong className="text-amber-800">Student ID</strong>，更换设备后直接输入同一 ID 即可恢复进度！
            </div>
          </div>

          {/* Student ID Input */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-800 flex items-center justify-between">
              <span>Student ID (学生编号)</span>
              <span className="text-[10px] text-emerald-600 font-normal flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                低隐私云端映射
              </span>
            </label>
            <input
              type="text"
              value={inputStudentId}
              onChange={(e) => setInputStudentId(e.target.value.toUpperCase())}
              placeholder="例如: STU-8823"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
            />
          </div>

          {/* Quick Demo Pickers */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase">
              快速切换演示学员档案
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoProfiles.map((dp) => (
                <button
                  key={dp.id}
                  onClick={() => handleSelectDemo(dp)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    inputStudentId === dp.id
                      ? 'bg-amber-100 border-amber-400 text-amber-950 ring-1 ring-amber-400'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs truncate">{dp.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{dp.id}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Grade Selector (11 Grades) */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-800 flex items-center justify-between">
              <span>选择年级 (Year 1 – Form 5)</span>
              <span className="text-[10px] text-slate-500">11个年级自由选</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
              {GRADE_LIST.map((g) => {
                const isSelected = selectedGrade === g.code;
                return (
                  <button
                    key={g.code}
                    onClick={() => {
                      soundFx.playPop();
                      setSelectedGrade(g.code);
                    }}
                    className={`py-2 px-1.5 rounded-lg text-center transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-amber-950 font-black shadow-xs ring-2 ring-amber-400'
                        : 'bg-white hover:bg-slate-100 text-slate-700 font-semibold'
                    }`}
                  >
                    <div className="text-xs">{g.nameEn}</div>
                    <div className="text-[9px] opacity-75">{g.nameZh.slice(2)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selector (3 Tracks) */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-800">
              选择难度路线 (按顺序解锁50关)
            </label>
            <div className="flex flex-col gap-2">
              {DIFFICULTY_LIST.map((d) => {
                const isSelected = selectedDiff === d.code;
                return (
                  <button
                    key={d.code}
                    onClick={() => {
                      soundFx.playPop();
                      setSelectedDiff(d.code);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-100/90 border-amber-400 text-amber-950 ring-2 ring-amber-400'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{d.nameZh}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{d.desc}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-700 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playPop();
              onClose();
            }}
            className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bubble font-bold text-xs rounded-xl border border-slate-200"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bubble font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            保存并应用
          </button>
        </div>
      </div>
    </div>
  );
};
