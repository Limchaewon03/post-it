export type Category = '할 일' | '아이디어' | '기타';
export type FilterCategory = '전체' | Category;

export interface PostIt {
  timestamp: string;      // A열: unique ID / 시트 기록 timestamp
  datetime: string;       // B열: 메모 생성 날짜 및 시간 (예: "2026.10.09 (금) 21:05")
  category: Category;     // C열: 메모 범주
  content: string;        // D열: 메모 내용
  color: string;          // E열: 메모 색상 (1: 노랑, 2: 분홍, 3: 초록, 4: 파랑)
  state: '미완료' | '완료'; // F열: 체크 상태
  order: number;          // G열: 메모 순서 (1, 2, 3...)
}

export interface PostItColorConfig {
  id: string;
  name: string;
  bgClass: string;
  badgeBg: string;
  badgeText: string;
  textClass: string;
  borderClass: string;
  accent: string;
  inlineBg: string;
  inlineBadgeBg: string;
  inlineBadgeText: string;
}

export const POSTIT_COLORS: Record<string, PostItColorConfig> = {
  // 1: 노란색 (Yellow)
  '1': {
    id: '1',
    name: '노란색',
    bgClass: 'bg-[#fef9c3]',
    badgeBg: 'bg-[#facc15]',
    badgeText: 'text-[#713f12]',
    textClass: 'text-[#422006]',
    borderClass: 'border-[#fde047]',
    accent: '#facc15',
    inlineBg: '#fef9c3',
    inlineBadgeBg: '#facc15',
    inlineBadgeText: '#713f12',
  },
  // 2: 분홍색 (Pink)
  '2': {
    id: '2',
    name: '분홍색',
    bgClass: 'bg-[#fce7f3]',
    badgeBg: 'bg-[#f472b6]',
    badgeText: 'text-[#831843]',
    textClass: 'text-[#500724]',
    borderClass: 'border-[#fbcfe8]',
    accent: '#f472b6',
    inlineBg: '#fce7f3',
    inlineBadgeBg: '#f472b6',
    inlineBadgeText: '#831843',
  },
  // 3: 초록색 (Mint Green)
  '3': {
    id: '3',
    name: '초록색',
    bgClass: 'bg-[#bbf7d0]',
    badgeBg: 'bg-[#4ade80]',
    badgeText: 'text-[#14532d]',
    textClass: 'text-[#052e16]',
    borderClass: 'border-[#86efac]',
    accent: '#4ade80',
    inlineBg: '#bbf7d0',
    inlineBadgeBg: '#4ade80',
    inlineBadgeText: '#14532d',
  },
  // 4: 파랑색 (Sky Blue)
  '4': {
    id: '4',
    name: '파랑색',
    bgClass: 'bg-[#bae6fd]',
    badgeBg: 'bg-[#38bdf8]',
    badgeText: 'text-[#0c4a6e]',
    textClass: 'text-[#082f49]',
    borderClass: 'border-[#7dd3fc]',
    accent: '#38bdf8',
    inlineBg: '#bae6fd',
    inlineBadgeBg: '#38bdf8',
    inlineBadgeText: '#0c4a6e',
  },
};
