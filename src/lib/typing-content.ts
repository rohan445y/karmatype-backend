export const ENGLISH_WORDS_EASY = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they',
  'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'from',
  'or', 'which', 'one', 'would', 'all', 'will', 'there', 'say', 'who', 'make', 'when',
  'can', 'more', 'if', 'no', 'man', 'out', 'other', 'so', 'what', 'time', 'up', 'go',
  'about', 'than', 'into', 'could', 'state', 'only', 'new', 'year', 'some', 'take', 'them',
  'some', 'come', 'these', 'know', 'see', 'use', 'get', 'like', 'then', 'first', 'any',
  'work', 'now', 'may', 'such', 'give', 'over', 'think', 'most', 'even', 'find', 'day'
];

export const ENGLISH_WORDS_HARD = [
  'algorithm', 'synchronous', 'polymorphism', 'architecture', 'cryptography',
  'asynchronous', 'optimization', 'persistence', 'middleware', 'encapsulation',
  'infrastructure', 'microservices', 'declarative', 'concurrency', 'serialization',
  'authentication', 'authorization', 'abstraction', 'immutable', 'refactoring',
  'idempotent', 'dependency', 'virtualization', 'parallelism', 'quantization'
];

export const NEPALI_WORDS = [
  'नमस्ते', 'नेपाल', 'काठमाडौं', 'हिमाल', 'सगरमाथा', 'कर्म', 'टाइपिङ', 'प्रविधि', 'सफलता',
  'ज्ञान', 'बुद्ध', 'शान्ति', 'मित्र', 'परिवार', 'भविष्य', 'विकास', 'सपना', 'प्रयास', 'उर्जा',
  'इतिहास', 'संस्कृति', 'सौन्दर्य', 'प्रकृति', 'शिक्षा', 'विद्यार्थी', 'सम्भावना', 'प्रगति'
];

export const QUOTES = [
  {
    text: 'Typing fast is not just about speed, it is about staying synchronized with your thoughts without interruption.',
    author: 'Karma Type'
  },
  {
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill'
  },
  {
    text: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger W. Dijkstra'
  },
  {
    text: 'Focus on being productive instead of busy. Action produces clarity and progress.',
    author: 'Tim Ferriss'
  },
  {
    text: 'Do not wait to strike till the iron is hot; but make it hot by striking.',
    author: 'William Butler Yeats'
  }
];

export const CODE_SNIPPETS = [
  {
    language: 'TypeScript',
    code: `async function calculateWpm(keystrokes: number[], durationSeconds: number): Promise<number> {
  const words = keystrokes.length / 5;
  const minutes = durationSeconds / 60;
  return Math.round(words / minutes);
}`
  },
  {
    language: 'JavaScript',
    code: `const rewardCalculator = (wpm, accuracy, streak) => {
  const base = Math.floor(wpm * 0.25);
  const accBonus = accuracy >= 95 ? 10 : 0;
  return (base + accBonus) * (1 + streak * 0.05);
};`
  },
  {
    language: 'Python',
    code: `def verify_anti_cheat(keystroke_deltas, max_stddev=150):
    import numpy as np
    std_dev = np.std(keystroke_deltas)
    if std_dev < 10:  # Bot behavior (too uniform)
        return False
    return True`
  }
];

export function generateWords(mode: string, language: string, difficulty: string, count: number = 60): string[] {
  if (language === 'nepali') {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(NEPALI_WORDS[Math.floor(Math.random() * NEPALI_WORDS.length)]);
    }
    return result;
  }

  const pool = difficulty === 'hard' || difficulty === 'expert' 
    ? [...ENGLISH_WORDS_EASY, ...ENGLISH_WORDS_HARD] 
    : ENGLISH_WORDS_EASY;
    
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return words;
}
