/**
 * 51Talk 天天练智能题库 - Toki English Adventure
 * Lightweight Browser Game App for Malaysian Chinese Students
 */

import React, { useState, useEffect } from 'react';
import {
  GradeLevel,
  DifficultyTrack,
  Paper,
  StudentProfile,
  AttemptResult,
  AttemptAnswer
} from './types/game';
import { getPaperForLevel } from './data/questionBank';
import { soundFx } from './services/soundEffects';
import { LevelMap } from './components/LevelMap';
import { StageBriefModal } from './components/StageBriefModal';
import { PaperSession } from './components/PaperSession';
import { ResultReport } from './components/ResultReport';
import { StudentProfileModal } from './components/StudentProfileModal';
import { TrendsReportModal } from './components/TrendsReportModal';

export default function App() {
  // Global sound state
  const [isMuted, setIsMuted] = useState(soundFx.getIsMuted());

  // Student Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('51talk_student_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      studentId: 'MY-Y4-KAIXUAN',
      displayName: 'Kai Xuan (凯旋)',
      grade: 'Y4' as GradeLevel,
      selectedDifficulty: 'easy' as DifficultyTrack,
      totalStars: 4,
      currentStreakDays: 3,
      progress: {
        'Y4_easy_1': { levelNo: 1, stars: 3, bestScore: 100, latestScore: 100, unlocked: true, attemptsCount: 1 },
        'Y4_easy_2': { levelNo: 2, stars: 1, bestScore: 75, latestScore: 75, unlocked: true, attemptsCount: 1 },
        'Y4_easy_3': { levelNo: 3, stars: 0, bestScore: 0, latestScore: 0, unlocked: true, attemptsCount: 0 },
      },
      badges: ['b_explorer'],
    };
  });

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('51talk_student_profile', JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Current view: 'MAP' | 'BRIEF' | 'SESSION' | 'REPORT'
  const [viewState, setViewState] = useState<'MAP' | 'BRIEF' | 'SESSION' | 'REPORT'>('MAP');

  // Currently selected level paper
  const [selectedLevelNo, setSelectedLevelNo] = useState(1);
  const [currentPaper, setCurrentPaper] = useState<Paper | null>(null);

  // Latest attempt result
  const [latestResult, setLatestResult] = useState<AttemptResult | null>(null);

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showTrendsModal, setShowTrendsModal] = useState(false);

  // Toggle sound effects
  const handleToggleMute = () => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
  };

  // Determine current active level (highest unlocked level)
  const getCurrentActiveLevel = () => {
    for (let l = 1; l <= 50; l++) {
      const key = `${profile.grade}_${profile.selectedDifficulty}_${l}`;
      const prog = profile.progress[key];
      if (l === 1 && !prog) return 1;
      if (!prog || !prog.unlocked) {
        return Math.max(1, l - 1);
      }
      if (prog.stars === 0) {
        return l;
      }
    }
    return 1;
  };

  // User taps a level node on map
  const handleSelectLevel = (levelNo: number) => {
    setSelectedLevelNo(levelNo);
    const paper = getPaperForLevel(profile.grade, profile.selectedDifficulty, levelNo);
    setCurrentPaper(paper);
    setViewState('BRIEF');
  };

  // User clicks "Start" on pre-stage brief modal
  const handleStartPaper = () => {
    setViewState('SESSION');
  };

  // User submits paper
  const handleSubmitPaper = (answers: Record<string, any>, durationSeconds: number) => {
    if (!currentPaper) return;

    let totalPointsEarned = 0;
    let totalPointsPossible = 0;
    let correctCount = 0;
    const answeredMap: Record<string, AttemptAnswer> = {};
    const skillsMap: Record<string, { total: number; correct: number; skillNameZh: string }> = {};

    currentPaper.questions.forEach((q) => {
      totalPointsPossible += q.points;
      const studentAns = answers[q.id];
      let isCorrect = false;

      // Evaluation by question type
      if (q.type === 'single_choice' || q.type === 'dialogue_matching' || q.type === 'listening_choice') {
        isCorrect = studentAns === q.correctAnswer;
      } else if (q.type === 'sentence_builder') {
        const studentTokens = Array.isArray(studentAns) ? studentAns : [];
        const correctTokens = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
        isCorrect =
          studentTokens.length === correctTokens.length &&
          studentTokens.every((val, idx) => val === correctTokens[idx]);
      } else if (q.type === 'matching') {
        const correctPairs = q.correctAnswer || {};
        const studentPairs = studentAns || {};
        const keys = Object.keys(correctPairs);
        isCorrect =
          keys.length > 0 &&
          keys.every((k) => studentPairs[k] === correctPairs[k]);
      } else if (q.type === 'cloze_choice') {
        const correctMap = q.correctAnswer || {};
        const studentMap = studentAns || {};
        const keys = Object.keys(correctMap);
        isCorrect =
          keys.length > 0 &&
          keys.every((k) => studentMap[k] === correctMap[k]);
      } else if (q.type === 'error_correction') {
        const rep = studentAns?.replacement;
        isCorrect = rep === q.correctAnswer;
      } else if (q.type === 'information_transfer') {
        const fields = q.transferFields || [];
        const studentMap = studentAns || {};
        let allFieldMatch = true;
        fields.forEach((f) => {
          const val = (studentMap[f.key] || '').trim().toLowerCase();
          const matches = f.acceptedAnswers.some((acc) => acc.trim().toLowerCase() === val);
          if (!matches) allFieldMatch = false;
        });
        isCorrect = fields.length > 0 && allFieldMatch;
      }

      const pointsEarned = isCorrect ? q.points : 0;
      totalPointsEarned += pointsEarned;
      if (isCorrect) correctCount++;

      answeredMap[q.id] = {
        questionId: q.id,
        studentAnswer: studentAns,
        isCorrect,
        pointsEarned,
        timeSpentSeconds: Math.round(durationSeconds / currentPaper.questions.length),
      };

      // Skill aggregation
      if (!skillsMap[q.skillCode]) {
        skillsMap[q.skillCode] = { total: 0, correct: 0, skillNameZh: q.skillNameZh };
      }
      skillsMap[q.skillCode].total += 1;
      if (isCorrect) skillsMap[q.skillCode].correct += 1;
    });

    const scorePercentage = Math.round((totalPointsEarned / totalPointsPossible) * 100);

    // Star calculation per PRD:
    // 0 star: < 60%
    // 1 star: 60% - 74% (unlocks next level)
    // 2 stars: 75% - 89%
    // 3 stars: 90% - 100%
    let stars = 0;
    if (scorePercentage >= 90) stars = 3;
    else if (scorePercentage >= 75) stars = 2;
    else if (scorePercentage >= 60) stars = 1;

    // Strengths & Growth Areas
    const strengths: string[] = [];
    const areasToImprove: string[] = [];

    Object.entries(skillsMap).forEach(([code, item]) => {
      const rate = item.correct / item.total;
      if (rate >= 0.8) {
        strengths.push(`${item.skillNameZh}：作答精准，能够迅速结合语境做出正确推断`);
      } else {
        areasToImprove.push(`${item.skillNameZh}：在主谓一致与关键信息提取上可进一步结合规则点强化`);
      }
    });

    // Ensure 3 strengths as requested by PRD Section 13.1
    if (strengths.length < 3) {
      if (!strengths.some((s) => s.includes('注意力'))) {
        strengths.push('作答专注度：在限定时间内完成整卷并积极配合检查');
      }
      if (!strengths.some((s) => s.includes('本土'))) {
        strengths.push('大马文化情境感知：能准确识别本土日常词汇与校园情景');
      }
      if (!strengths.some((s) => s.includes('自检'))) {
        strengths.push('规则意识：遵循自动化题型规范与标准化答案结构');
      }
    }

    const result: AttemptResult = {
      attemptId: `att_${Date.now()}`,
      paperId: currentPaper.id,
      grade: currentPaper.grade,
      difficulty: currentPaper.difficulty,
      levelNo: currentPaper.levelNo,
      totalScore: scorePercentage,
      stars,
      correctCount,
      totalCount: currentPaper.questions.length,
      unansweredCount: currentPaper.questions.length - Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length,
      durationSeconds,
      submittedAt: new Date().toLocaleTimeString('zh-MY'),
      answers: answeredMap,
      skillsPerformance: skillsMap,
      strengths: strengths.slice(0, 3),
      areasToImprove: areasToImprove.slice(0, 3),
      recommendedNextStep: stars >= 1 ? 'next_level' : 'retry_level',
    };

    setLatestResult(result);

    // Update Student Profile & Unlock next level if stars >= 1
    setProfile((prev) => {
      const key = `${currentPaper.grade}_${currentPaper.difficulty}_${currentPaper.levelNo}`;
      const nextKey = `${currentPaper.grade}_${currentPaper.difficulty}_${currentPaper.levelNo + 1}`;
      const existing = prev.progress[key];

      const newStars = Math.max(existing?.stars || 0, stars);
      const updatedProgress = { ...prev.progress };

      updatedProgress[key] = {
        levelNo: currentPaper.levelNo,
        stars: newStars,
        bestScore: Math.max(existing?.bestScore || 0, scorePercentage),
        latestScore: scorePercentage,
        completedAt: new Date().toISOString(),
        unlocked: true,
        attemptsCount: (existing?.attemptsCount || 0) + 1,
      };

      // Unlock next stage if 1 star or more earned
      if (stars >= 1 && currentPaper.levelNo < 50) {
        if (!updatedProgress[nextKey]) {
          updatedProgress[nextKey] = {
            levelNo: currentPaper.levelNo + 1,
            stars: 0,
            bestScore: 0,
            latestScore: 0,
            unlocked: true,
            attemptsCount: 0,
          };
        } else {
          updatedProgress[nextKey].unlocked = true;
        }
      }

      // Re-sum total stars
      const sumStars = Object.values(updatedProgress).reduce((acc, p) => acc + p.stars, 0);

      // Check badges
      const badges = [...prev.badges];
      if (currentPaper.levelNo >= 10 && stars >= 1 && !badges.includes('b_explorer')) {
        badges.push('b_explorer');
      }
      if (currentPaper.levelNo >= 20 && stars >= 1 && !badges.includes('b_boss_slayer_1')) {
        badges.push('b_boss_slayer_1');
      }

      return {
        ...prev,
        totalStars: sumStars,
        progress: updatedProgress,
        badges,
        lastPracticedAt: new Date().toISOString(),
      };
    });

    setViewState('REPORT');
  };

  // Continue to next level from result report
  const handleContinueNext = () => {
    if (selectedLevelNo < 50) {
      const nextLevel = selectedLevelNo + 1;
      setSelectedLevelNo(nextLevel);
      const paper = getPaperForLevel(profile.grade, profile.selectedDifficulty, nextLevel);
      setCurrentPaper(paper);
      setViewState('BRIEF');
    } else {
      setViewState('MAP');
    }
  };

  // Retry level from result report
  const handleRetryLevel = () => {
    if (currentPaper) {
      setViewState('SESSION');
    }
  };

  // Update profile from modal
  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const currentLevel = getCurrentActiveLevel();
  const currentKey = `${profile.grade}_${profile.selectedDifficulty}_${selectedLevelNo}`;
  const currentLevelProgress = profile.progress[currentKey];

  return (
    <div className="flex justify-center min-h-screen bg-slate-900/5">
      {/* Mobile WebView Wrapper with max-w-md constraint (375-430px mobile baseline or tablet layout) */}
      <main className="w-full max-w-md min-h-screen bg-white shadow-2xl relative flex flex-col overflow-hidden">
        {/* VIEW: Level Map */}
        {viewState === 'MAP' && (
          <LevelMap
            grade={profile.grade}
            difficulty={profile.selectedDifficulty}
            progressMap={profile.progress}
            currentLevel={currentLevel}
            totalStars={profile.totalStars}
            onSelectLevel={handleSelectLevel}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenTrends={() => setShowTrendsModal(true)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            studentId={profile.studentId}
          />
        )}

        {/* VIEW: Stage Brief Modal */}
        {viewState === 'BRIEF' && currentPaper && (
          <StageBriefModal
            paper={currentPaper}
            onStart={handleStartPaper}
            onClose={() => setViewState('MAP')}
            bestScore={currentLevelProgress?.bestScore}
            bestStars={currentLevelProgress?.stars}
          />
        )}

        {/* VIEW: Active Paper Session */}
        {viewState === 'SESSION' && currentPaper && (
          <PaperSession
            paper={currentPaper}
            onSubmit={handleSubmitPaper}
            onExit={() => setViewState('MAP')}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {/* VIEW: Result & Diagnostic Report */}
        {viewState === 'REPORT' && currentPaper && latestResult && (
          <ResultReport
            paper={currentPaper}
            result={latestResult}
            onContinueNext={handleContinueNext}
            onRetry={handleRetryLevel}
            onReturnToMap={() => setViewState('MAP')}
          />
        )}

        {/* Modal: Student ID & Grade/Difficulty Switcher */}
        {showProfileModal && (
          <StudentProfileModal
            currentProfile={profile}
            onUpdateProfile={handleUpdateProfile}
            onClose={() => setShowProfileModal(false)}
          />
        )}

        {/* Modal: Learning Trend & Mastery Report */}
        {showTrendsModal && (
          <TrendsReportModal
            profile={profile}
            onClose={() => setShowTrendsModal(false)}
          />
        )}
      </main>
    </div>
  );
}
