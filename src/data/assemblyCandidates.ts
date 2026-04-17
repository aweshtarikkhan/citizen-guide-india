import data from "./assemblyCandidates2026.json";

export interface CandidateEntry {
  alliance: string;
  party: string | null;
  candidate: string | null;
}

export interface ConstituencyCandidates {
  district: string | null;
  constituency: string;
  candidates: CandidateEntry[];
}

export type StateSlug =
  | "kerala"
  | "tamil-nadu"
  | "west-bengal"
  | "assam"
  | "puducherry";

const dataset = data as Record<string, ConstituencyCandidates[]>;

export const getCandidates = (slug: string): ConstituencyCandidates[] =>
  dataset[slug] || [];

export const hasCandidates = (slug: string): boolean =>
  Array.isArray(dataset[slug]) && dataset[slug].length > 0;

// Last election (2021) summary for the 5 states
export interface LastElectionResult {
  year: number;
  totalSeats: number;
  turnout: string;
  winner: string;
  winnerSeats: number;
  results: { party: string; alliance: string; seats: number; voteShare: string }[];
  cm: string;
}

export const LAST_ELECTION: Record<string, LastElectionResult> = {
  kerala: {
    year: 2021,
    totalSeats: 140,
    turnout: "74.06%",
    winner: "LDF",
    winnerSeats: 99,
    cm: "Pinarayi Vijayan (CPI-M)",
    results: [
      { party: "CPI(M)", alliance: "LDF", seats: 62, voteShare: "25.4%" },
      { party: "INC", alliance: "UDF", seats: 21, voteShare: "25.1%" },
      { party: "CPI", alliance: "LDF", seats: 17, voteShare: "8.0%" },
      { party: "IUML", alliance: "UDF", seats: 15, voteShare: "8.3%" },
      { party: "KEC(M)", alliance: "LDF", seats: 5, voteShare: "2.5%" },
      { party: "Others", alliance: "—", seats: 20, voteShare: "30.7%" },
    ],
  },
  "tamil-nadu": {
    year: 2021,
    totalSeats: 234,
    turnout: "72.81%",
    winner: "SPA (DMK+)",
    winnerSeats: 159,
    cm: "M. K. Stalin (DMK)",
    results: [
      { party: "DMK", alliance: "SPA", seats: 133, voteShare: "37.7%" },
      { party: "AIADMK", alliance: "AIADMK+", seats: 66, voteShare: "33.3%" },
      { party: "INC", alliance: "SPA", seats: 18, voteShare: "4.3%" },
      { party: "BJP", alliance: "AIADMK+", seats: 4, voteShare: "2.6%" },
      { party: "PMK", alliance: "AIADMK+", seats: 5, voteShare: "3.8%" },
      { party: "Others", alliance: "—", seats: 8, voteShare: "18.3%" },
    ],
  },
  "west-bengal": {
    year: 2021,
    totalSeats: 294,
    turnout: "81.69%",
    winner: "AITC+",
    winnerSeats: 215,
    cm: "Mamata Banerjee (AITC)",
    results: [
      { party: "AITC", alliance: "AITC+", seats: 215, voteShare: "47.9%" },
      { party: "BJP", alliance: "BJP", seats: 77, voteShare: "38.1%" },
      { party: "ISF", alliance: "LF+", seats: 1, voteShare: "1.4%" },
      { party: "Others", alliance: "—", seats: 1, voteShare: "12.6%" },
    ],
  },
  assam: {
    year: 2021,
    totalSeats: 126,
    turnout: "82.04%",
    winner: "NDA",
    winnerSeats: 75,
    cm: "Himanta Biswa Sarma (BJP)",
    results: [
      { party: "BJP", alliance: "NDA", seats: 60, voteShare: "33.2%" },
      { party: "INC", alliance: "Mahajot", seats: 29, voteShare: "29.7%" },
      { party: "AIUDF", alliance: "Mahajot", seats: 16, voteShare: "9.3%" },
      { party: "AGP", alliance: "NDA", seats: 9, voteShare: "7.9%" },
      { party: "BPF", alliance: "Mahajot", seats: 3, voteShare: "3.4%" },
      { party: "UPPL", alliance: "NDA", seats: 6, voteShare: "3.2%" },
      { party: "Others", alliance: "—", seats: 3, voteShare: "13.3%" },
    ],
  },
  puducherry: {
    year: 2021,
    totalSeats: 30,
    turnout: "81.55%",
    winner: "NDA",
    winnerSeats: 16,
    cm: "N. Rangasamy (AINRC)",
    results: [
      { party: "AINRC", alliance: "NDA", seats: 10, voteShare: "23.9%" },
      { party: "DMK", alliance: "SPA", seats: 6, voteShare: "20.6%" },
      { party: "BJP", alliance: "NDA", seats: 6, voteShare: "13.7%" },
      { party: "INC", alliance: "SPA", seats: 2, voteShare: "15.6%" },
      { party: "IND", alliance: "—", seats: 6, voteShare: "26.2%" },
    ],
  },
};

// Alliance brand colors (kept neutral/monochrome friendly with subtle hue accent)
export const ALLIANCE_TONE: Record<string, string> = {
  LDF: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-900",
  UDF: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900",
  NDA: "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950/30 dark:border-orange-900",
  SPA: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-900",
  "AIADMK+": "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900",
  "AITC+": "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-900",
  BJP: "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950/30 dark:border-orange-900",
  "LF+": "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-900",
  INC: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900",
  "ASOM (Mahajot)": "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900",
  "TVK+": "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/30 dark:border-yellow-900",
};

export const STATE_DISPLAY: Record<string, string> = {
  kerala: "Kerala",
  "tamil-nadu": "Tamil Nadu",
  "west-bengal": "West Bengal",
  assam: "Assam",
  puducherry: "Puducherry",
};
