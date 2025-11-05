// Word lists for Anagram and Hangman games
export const wordsByDifficulty: Record<number, string[]> = {
  1: ['cat', 'dog', 'sun', 'car', 'hat', 'run', 'big', 'red', 'hot', 'top'],
  2: ['house', 'table', 'chair', 'water', 'paper', 'clock', 'money', 'plant', 'shirt', 'phone'],
  3: ['computer', 'keyboard', 'mountain', 'birthday', 'elephant', 'sandwich', 'umbrella', 'dinosaur', 'football', 'hospital'],
  4: ['algorithm', 'chocolate', 'adventure', 'education', 'beautiful', 'community', 'important', 'telephone', 'wonderful', 'vegetable'],
  5: ['architecture', 'extraordinary', 'uncomfortable', 'understanding', 'entertainment', 'communication', 'refrigerator', 'international', 'responsibility', 'approximately'],
  6: ['assassination', 'biodegradable', 'characteristics', 'congratulations', 'Constantinople', 'discrimination', 'electromagnetic', 'entrepreneurial', 'experimentation', 'infrastructural'],
  7: ['conceptualization', 'deindustrialization', 'incomprehensibility', 'intercommunication', 'internationalization', 'mischaracterization', 'overcompensation', 'oversimplification', 'photosynthetically', 'professionalization'],
  8: ['counterrevolutionary', 'deoxyribonucleicacid', 'electroencephalogram', 'honorificabilitudinity', 'immunoelectrophoresis', 'interdepartmentalized', 'microcrystallinities', 'overintellectualized', 'pneumonoultramicroscopic', 'psychoneuroimmunological'],
  9: ['antidisestablishmentarian', 'floccinaucinihilipilification', 'hippopotomonstrosesquipedaliophobia', 'honorificabilitudinitatibus', 'pneumonoultramicroscopicsilicovolcanoconiosis', 'pseudopseudohypoparathyroidism', 'supercalifragilisticexpialidocious', 'dichlorodiphenyltrichloroethane', 'incomprehensibilities', 'uncharacteristically'],
  10: ['pneumonoultramicroscopicsilicovolcanoconiosis', 'hippopotomonstrosesquippedaliophobia', 'supercalifragilisticexpialidocious', 'pseudopseudohypoparathyroidism', 'floccinaucinihilipilification', 'antidisestablishmentarianism', 'honorificabilitudinitatibus', 'thyroparathyroidectomized', 'hepaticocholangiogastrostomy', 'spectrophotofluorometrically'],
};

export const getRandomWord = (difficulty: number = 1): string => {
  const words = wordsByDifficulty[difficulty] || wordsByDifficulty[1];
  return words[Math.floor(Math.random() * words.length)];
};

export const shuffleString = (str: string): string => {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
};
