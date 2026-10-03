/**
 * Type definitions for 51Talk 天天练智能题库 (Toki English Adventure)
 * In strict alignment with PRD Draft v0.1
 */

export type GradeLevel =
  | 'Y1' | 'Y2' | 'Y3' | 'Y4' | 'Y5' | 'Y6'
  | 'F1' | 'F2' | 'F3' | 'F4' | 'F5';

export interface GradeInfo {
  code: GradeLevel;
  nameZh: string;
  nameEn: string;
  stage: 'primary_lower' | 'primary_upper' | 'secondary_lower' | 'secondary_upper';
  curriculum: string;
  cefrTarget: string;
}

export type DifficultyTrack = 'easy' | 'medium' | 'hard';

export interface DifficultyInfo {
  code: DifficultyTrack;
  nameZh: string;
  desc: string;
  accentColor: string;
}

export type PaperType = 'daily' | 'checkpoint' | 'boss';

export type QuestionType =
  | 'single_choice'
  | 'sentence_builder'
  | 'matching'
  | 'cloze_choice'
  | 'word_completion'
  | 'error_correction'
  | 'information_transfer'
  | 'listening_choice'
  | 'dialogue_matching';

export interface QuestionExplanation {
  correctReason: string;
  distractorReasons?: Record<string, string>;
  ruleNote: string;
  malaysianExample: string;
  reinforcementQuestion?: {
    stem: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
}

export interface Question {
  id: string;
  type: QuestionType;
  stem: string;
  contextPassage?: string;
  audioScript?: string;
  audioPlayCountLimit?: number; // PRD: default 2
  
  // Single choice / listening choice
  options?: { id: string; text: string }[];
  
  // Matching
  pairs?: { left: string; right: string; id: string }[];
  
  // Sentence builder
  tokens?: string[]; // word tokens to arrange
  targetTokens?: string[]; // correct sequence
  
  // Cloze
  clozeParagraph?: string; // with [blank_1], [blank_2] placeholders
  clozeOptions?: Record<string, { id: string; text: string }[]>; // blankId -> options
  
  // Error correction
  sentenceWithTokens?: string[]; // array of words, one is wrong
  errorIndex?: number;
  replacementOptions?: string[]; // options to replace the wrong word
  
  // Information transfer
  sourceText?: string;
  transferFields?: { key: string; label: string; placeholder: string; acceptedAnswers: string[] }[];

  // Answer
  correctAnswer: any;
  skillCode: string;
  skillNameZh: string;
  points: number;
  explanation: QuestionExplanation;
}

export interface Paper {
  id: string;
  grade: GradeLevel;
  difficulty: DifficultyTrack;
  levelNo: number; // 1 - 50
  type: PaperType;
  title: string;
  subtitle: string;
  description: string;
  estimatedMinutes: number;
  questions: Question[];
  skillsTested: string[];
}

export interface LevelProgress {
  levelNo: number;
  stars: number; // 0, 1, 2, 3
  bestScore: number; // 0 - 100
  latestScore: number;
  completedAt?: string;
  unlocked: boolean;
  attemptsCount: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  earnedAt?: string;
  requiredLevel: number;
}

export interface StudentProfile {
  studentId: string;
  displayName: string;
  grade: GradeLevel;
  selectedDifficulty: DifficultyTrack;
  totalStars: number;
  currentStreakDays: number;
  progress: Record<string, LevelProgress>; // key: `${grade}_${difficulty}_${levelNo}`
  badges: string[]; // badge IDs
  lastPracticedAt?: string;
}

export interface AttemptAnswer {
  questionId: string;
  studentAnswer: any;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpentSeconds: number;
}

export interface AttemptResult {
  attemptId: string;
  paperId: string;
  grade: GradeLevel;
  difficulty: DifficultyTrack;
  levelNo: number;
  totalScore: number; // 0 - 100
  stars: number;
  correctCount: number;
  totalCount: number;
  unansweredCount: number;
  durationSeconds: number;
  submittedAt: string;
  answers: Record<string, AttemptAnswer>;
  skillsPerformance: Record<string, { total: number; correct: number; skillNameZh: string }>;
  strengths: string[]; // 3 points
  areasToImprove: string[]; // up to 3 points
  recommendedNextStep: 'next_level' | 'retry_level' | 'reinforcement';
}

export interface SkillMastery {
  skillCode: string;
  skillNameZh: string;
  domain: string;
  accuracy: number;
  totalAnswered: number;
}
