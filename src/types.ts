export type VerbGroup = 'v1' | 'v2' | 'irr'; // Godan, Ichidan, Irregular

export interface Verb {
  id: number;
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
  group: VerbGroup;
  tags: string[];
}

export type ConjugationForm = 
  | 'dictionary'
  | 'te'
  | 'ta'
  | 'nai'
  | 'masu'
  | 'potential'
  | 'passive'
  | 'causative'
  | 'imperative'
  | 'volitional';

export interface Flashcard {
  id: number;
  kanji: string;
  readings: {
    onyomi: string[];
    kunyomi: string[];
  };
  meaning: string;
  example: string;
  level: 'N5' | 'N4';
  nextReview?: number; // Timestamp for SRS
  box?: number; // Leitner box number (0-5)
}

export interface ExamQuestion {
  id: number;
  category: 'grammar' | 'vocab' | 'reading';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProfile {
  xp: number;
  level: number; // 1 = White Belt, 10 = Black Belt
  streak: number;
  lastLogin: string; // ISO Date
  verbsMastered: number[]; // IDs
}
