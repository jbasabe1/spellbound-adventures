import { Word, GradeLevel } from '@/types';

// Sample word bank for K-5 grades
// In production, this would be much larger and stored in a database

export const wordBank: Word[] = [
  // Kindergarten Words (Grade K)
  { id: 'k1', word: 'cat', grade: 'K', length: 3, syllables: 1, phonicsPattern: ['CVC'], isSightWord: false, difficulty: 1, definition: 'A small furry pet', exampleSentence: 'The cat sat on the mat.' },
  { id: 'k2', word: 'dog', grade: 'K', length: 3, syllables: 1, phonicsPattern: ['CVC'], isSightWord: false, difficulty: 1, definition: 'A pet that barks', exampleSentence: 'The dog likes to run.' },
  { id: 'k3', word: 'the', grade: 'K', length: 3, syllables: 1, phonicsPattern: ['digraphs'], isSightWord: true, difficulty: 1, definition: 'Used before nouns', exampleSentence: 'The sun is bright.' },
  { id: 'k4', word: 'and', grade: 'K', length: 3, syllables: 1, phonicsPattern: ['blends'], isSightWord: true, difficulty: 1, definition: 'Connects words together', exampleSentence: 'Mom and dad love me.' },
  { id: 'k5', word: 'sun', grade: 'K', length: 3, syllables: 1, phonicsPattern: ['CVC'], isSightWord: false, difficulty: 1, definition: 'The star that gives us light', exampleSentence: 'The sun is yellow.' },
  { id: 'k6', word: 'hat', grade: 'K', length: 3, syllables: 1, phonicsPattern: ['CVC'], isSightWord: false, difficulty: 1, definition: 'Something you wear on your head', exampleSentence: 'I have a red hat.' },
  { id: 'k7', word: 'bed', grade: 'K', length: 3, syllables: 1, phonicsPattern: ['CVC'], isSightWord: false, difficulty: 1, definition: 'Where you sleep', exampleSentence: 'My bed is cozy.' },
  { id: 'k8', word: 'red', grade: 'K', length: 3, syllables: 1, phonicsPattern: ['CVC'], isSightWord: false, difficulty: 1, definition: 'A color like apples', exampleSentence: 'The apple is red.' },
  { id: 'k9', word: 'big', grade: 'K', length: 3, syllables: 1, phonicsPattern: ['CVC'], isSightWord: false, difficulty: 1, definition: 'Large in size', exampleSentence: 'The elephant is big.' },
  { id: 'k10', word: 'run', grade: 'K', length: 3, syllables: 1, phonicsPattern: ['CVC'], isSightWord: false, difficulty: 1, definition: 'To move fast', exampleSentence: 'I like to run fast.' },
  { id: 'k11', word: 'see', grade: 'K', length: 3, syllables: 1, phonicsPattern: ['vowel-teams'], isSightWord: true, difficulty: 1, definition: 'To look at', exampleSentence: 'I see a bird.' },
  { id: 'k12', word: 'mom', grade: 'K', length: 3, syllables: 1, phonicsPattern: ['CVC'], isSightWord: false, difficulty: 1, definition: 'Your mother', exampleSentence: 'My mom is kind.' },
  
  // Grade 1 Words
  { id: '1-1', word: 'ship', grade: '1', length: 4, syllables: 1, phonicsPattern: ['digraphs'], isSightWord: false, difficulty: 2, definition: 'A large boat', exampleSentence: 'The ship sails on the sea.' },
  { id: '1-2', word: 'chip', grade: '1', length: 4, syllables: 1, phonicsPattern: ['digraphs'], isSightWord: false, difficulty: 2, definition: 'A small piece', exampleSentence: 'I ate a chip.' },
  { id: '1-3', word: 'this', grade: '1', length: 4, syllables: 1, phonicsPattern: ['digraphs'], isSightWord: true, difficulty: 2, definition: 'Points to something', exampleSentence: 'This is my book.' },
  { id: '1-4', word: 'that', grade: '1', length: 4, syllables: 1, phonicsPattern: ['digraphs'], isSightWord: true, difficulty: 2, definition: 'Points to something far', exampleSentence: 'That is a tree.' },
  { id: '1-5', word: 'clap', grade: '1', length: 4, syllables: 1, phonicsPattern: ['blends'], isSightWord: false, difficulty: 2, definition: 'To hit hands together', exampleSentence: 'Clap your hands!' },
  { id: '1-6', word: 'stop', grade: '1', length: 4, syllables: 1, phonicsPattern: ['blends'], isSightWord: false, difficulty: 2, definition: 'To not move', exampleSentence: 'Stop at the sign.' },
  { id: '1-7', word: 'from', grade: '1', length: 4, syllables: 1, phonicsPattern: ['blends'], isSightWord: true, difficulty: 2, definition: 'Starting point', exampleSentence: 'I am from here.' },
  { id: '1-8', word: 'play', grade: '1', length: 4, syllables: 1, phonicsPattern: ['vowel-teams'], isSightWord: false, difficulty: 2, definition: 'To have fun', exampleSentence: 'Let us play a game.' },
  { id: '1-9', word: 'like', grade: '1', length: 4, syllables: 1, phonicsPattern: ['silent-e'], isSightWord: true, difficulty: 2, definition: 'To enjoy something', exampleSentence: 'I like ice cream.' },
  { id: '1-10', word: 'make', grade: '1', length: 4, syllables: 1, phonicsPattern: ['silent-e'], isSightWord: false, difficulty: 2, definition: 'To create something', exampleSentence: 'I will make a cake.' },
  { id: '1-11', word: 'came', grade: '1', length: 4, syllables: 1, phonicsPattern: ['silent-e'], isSightWord: false, difficulty: 2, definition: 'Arrived', exampleSentence: 'She came to visit.' },
  { id: '1-12', word: 'home', grade: '1', length: 4, syllables: 1, phonicsPattern: ['silent-e'], isSightWord: false, difficulty: 2, definition: 'Where you live', exampleSentence: 'I love my home.' },

  // Grade 2 Words
  { id: '2-1', word: 'about', grade: '2', length: 5, syllables: 2, phonicsPattern: ['vowel-teams'], isSightWord: true, difficulty: 2, definition: 'Concerning something', exampleSentence: 'Tell me about your day.' },
  { id: '2-2', word: 'black', grade: '2', length: 5, syllables: 1, phonicsPattern: ['blends'], isSightWord: false, difficulty: 2, definition: 'A dark color', exampleSentence: 'The cat is black.' },
  { id: '2-3', word: 'brown', grade: '2', length: 5, syllables: 1, phonicsPattern: ['blends'], isSightWord: false, difficulty: 2, definition: 'Color of chocolate', exampleSentence: 'The dog is brown.' },
  { id: '2-4', word: 'clean', grade: '2', length: 5, syllables: 1, phonicsPattern: ['vowel-teams', 'blends'], isSightWord: false, difficulty: 2, definition: 'Not dirty', exampleSentence: 'Keep your room clean.' },
  { id: '2-5', word: 'every', grade: '2', length: 5, syllables: 3, phonicsPattern: ['vowel-teams'], isSightWord: true, difficulty: 3, definition: 'All of something', exampleSentence: 'I brush my teeth every day.' },
  { id: '2-6', word: 'green', grade: '2', length: 5, syllables: 1, phonicsPattern: ['vowel-teams', 'blends'], isSightWord: false, difficulty: 2, definition: 'Color of grass', exampleSentence: 'The grass is green.' },
  { id: '2-7', word: 'happy', grade: '2', length: 5, syllables: 2, phonicsPattern: ['CVC'], isSightWord: false, difficulty: 2, definition: 'Feeling joy', exampleSentence: 'I am so happy today!' },
  { id: '2-8', word: 'party', grade: '2', length: 5, syllables: 2, phonicsPattern: ['r-controlled'], isSightWord: false, difficulty: 3, definition: 'A celebration', exampleSentence: 'We had a birthday party.' },
  { id: '2-9', word: 'sleep', grade: '2', length: 5, syllables: 1, phonicsPattern: ['vowel-teams', 'blends'], isSightWord: false, difficulty: 2, definition: 'To rest at night', exampleSentence: 'I need to sleep.' },
  { id: '2-10', word: 'water', grade: '2', length: 5, syllables: 2, phonicsPattern: ['r-controlled'], isSightWord: false, difficulty: 3, definition: 'What we drink', exampleSentence: 'I drink water every day.' },
  { id: '2-11', word: 'under', grade: '2', length: 5, syllables: 2, phonicsPattern: ['r-controlled'], isSightWord: false, difficulty: 3, definition: 'Below something', exampleSentence: 'The ball is under the table.' },
  { id: '2-12', word: 'which', grade: '2', length: 5, syllables: 1, phonicsPattern: ['digraphs'], isSightWord: true, difficulty: 3, definition: 'Asking about choices', exampleSentence: 'Which one do you want?' },

  // Grade 3 Words
  { id: '3-1', word: 'animal', grade: '3', length: 6, syllables: 3, phonicsPattern: ['CVC'], isSightWord: false, difficulty: 3, definition: 'A living creature', exampleSentence: 'My favorite animal is a dog.' },
  { id: '3-2', word: 'answer', grade: '3', length: 6, syllables: 2, phonicsPattern: ['blends'], isSightWord: false, difficulty: 3, definition: 'A reply to a question', exampleSentence: 'I know the answer!' },
  { id: '3-3', word: 'beautiful', grade: '3', length: 9, syllables: 4, phonicsPattern: ['vowel-teams'], isSightWord: false, difficulty: 4, definition: 'Very pretty', exampleSentence: 'The sunset is beautiful.' },
  { id: '3-4', word: 'because', grade: '3', length: 7, syllables: 2, phonicsPattern: ['vowel-teams'], isSightWord: true, difficulty: 3, definition: 'For the reason that', exampleSentence: 'I am happy because I won!' },
  { id: '3-5', word: 'different', grade: '3', length: 9, syllables: 3, phonicsPattern: ['blends'], isSightWord: false, difficulty: 4, definition: 'Not the same', exampleSentence: 'We are all different.' },
  { id: '3-6', word: 'favorite', grade: '3', length: 8, syllables: 3, phonicsPattern: ['silent-e'], isSightWord: false, difficulty: 3, definition: 'Most liked', exampleSentence: 'Pizza is my favorite food.' },
  { id: '3-7', word: 'friend', grade: '3', length: 6, syllables: 1, phonicsPattern: ['blends', 'vowel-teams'], isSightWord: false, difficulty: 3, definition: 'Someone you like', exampleSentence: 'You are my best friend.' },
  { id: '3-8', word: 'important', grade: '3', length: 9, syllables: 3, phonicsPattern: ['blends'], isSightWord: false, difficulty: 4, definition: 'Very meaningful', exampleSentence: 'School is important.' },
  { id: '3-9', word: 'learned', grade: '3', length: 7, syllables: 1, phonicsPattern: ['r-controlled', 'vowel-teams'], isSightWord: false, difficulty: 3, definition: 'Got knowledge', exampleSentence: 'I learned to spell!' },
  { id: '3-10', word: 'probably', grade: '3', length: 8, syllables: 3, phonicsPattern: ['blends'], isSightWord: false, difficulty: 4, definition: 'Most likely', exampleSentence: 'It will probably rain.' },
  { id: '3-11', word: 'together', grade: '3', length: 8, syllables: 3, phonicsPattern: ['digraphs'], isSightWord: false, difficulty: 3, definition: 'With each other', exampleSentence: 'We play together.' },
  { id: '3-12', word: 'usually', grade: '3', length: 7, syllables: 4, phonicsPattern: ['vowel-teams'], isSightWord: false, difficulty: 4, definition: 'Most of the time', exampleSentence: 'I usually wake up early.' },

  // Grade 4 Words
  { id: '4-1', word: 'adventure', grade: '4', length: 9, syllables: 3, phonicsPattern: ['blends'], isSightWord: false, difficulty: 4, definition: 'An exciting journey', exampleSentence: 'We went on an adventure.' },
  { id: '4-2', word: 'although', grade: '4', length: 8, syllables: 2, phonicsPattern: ['digraphs', 'vowel-teams'], isSightWord: false, difficulty: 4, definition: 'Even though', exampleSentence: 'Although it rained, we played.' },
  { id: '4-3', word: 'beginning', grade: '4', length: 9, syllables: 3, phonicsPattern: ['blends'], isSightWord: false, difficulty: 4, definition: 'The start', exampleSentence: 'This is just the beginning.' },
  { id: '4-4', word: 'calendar', grade: '4', length: 8, syllables: 3, phonicsPattern: ['r-controlled'], isSightWord: false, difficulty: 4, definition: 'Shows days and months', exampleSentence: 'Check the calendar for the date.' },
  { id: '4-5', word: 'discover', grade: '4', length: 8, syllables: 3, phonicsPattern: ['blends', 'r-controlled'], isSightWord: false, difficulty: 4, definition: 'To find out', exampleSentence: 'Let us discover new things.' },
  { id: '4-6', word: 'especially', grade: '4', length: 10, syllables: 4, phonicsPattern: ['blends'], isSightWord: false, difficulty: 5, definition: 'Particularly', exampleSentence: 'I love animals, especially dogs.' },
  { id: '4-7', word: 'knowledge', grade: '4', length: 9, syllables: 2, phonicsPattern: ['digraphs', 'silent-e'], isSightWord: false, difficulty: 5, definition: 'What you know', exampleSentence: 'Reading gives us knowledge.' },
  { id: '4-8', word: 'paragraph', grade: '4', length: 9, syllables: 3, phonicsPattern: ['digraphs', 'blends'], isSightWord: false, difficulty: 4, definition: 'A group of sentences', exampleSentence: 'Write a paragraph about dogs.' },
  { id: '4-9', word: 'separate', grade: '4', length: 8, syllables: 3, phonicsPattern: ['silent-e'], isSightWord: false, difficulty: 4, definition: 'To divide apart', exampleSentence: 'Separate the colors.' },
  { id: '4-10', word: 'through', grade: '4', length: 7, syllables: 1, phonicsPattern: ['digraphs', 'vowel-teams'], isSightWord: true, difficulty: 4, definition: 'From one end to another', exampleSentence: 'Walk through the door.' },
  { id: '4-11', word: 'vocabulary', grade: '4', length: 10, syllables: 5, phonicsPattern: ['blends'], isSightWord: false, difficulty: 5, definition: 'Words you know', exampleSentence: 'Build your vocabulary!' },
  { id: '4-12', word: 'whether', grade: '4', length: 7, syllables: 2, phonicsPattern: ['digraphs'], isSightWord: false, difficulty: 4, definition: 'If one thing or another', exampleSentence: 'I wonder whether it will snow.' },

  // Grade 5 Words
  { id: '5-1', word: 'accomplish', grade: '5', length: 10, syllables: 3, phonicsPattern: ['blends'], isSightWord: false, difficulty: 5, definition: 'To achieve', exampleSentence: 'You can accomplish anything.' },
  { id: '5-2', word: 'appreciate', grade: '5', length: 10, syllables: 4, phonicsPattern: ['blends', 'silent-e'], isSightWord: false, difficulty: 5, definition: 'To be thankful for', exampleSentence: 'I appreciate your help.' },
  { id: '5-3', word: 'catastrophe', grade: '5', length: 11, syllables: 4, phonicsPattern: ['digraphs'], isSightWord: false, difficulty: 5, definition: 'A disaster', exampleSentence: 'The storm was a catastrophe.' },
  { id: '5-4', word: 'conscience', grade: '5', length: 10, syllables: 2, phonicsPattern: ['blends', 'silent-e'], isSightWord: false, difficulty: 5, definition: 'Sense of right and wrong', exampleSentence: 'Let your conscience guide you.' },
  { id: '5-5', word: 'embarrass', grade: '5', length: 9, syllables: 3, phonicsPattern: ['blends'], isSightWord: false, difficulty: 5, definition: 'To make uncomfortable', exampleSentence: 'Do not embarrass yourself.' },
  { id: '5-6', word: 'exaggerate', grade: '5', length: 10, syllables: 4, phonicsPattern: ['blends', 'silent-e'], isSightWord: false, difficulty: 5, definition: 'To overstate', exampleSentence: 'Do not exaggerate the story.' },
  { id: '5-7', word: 'guarantee', grade: '5', length: 9, syllables: 3, phonicsPattern: ['vowel-teams'], isSightWord: false, difficulty: 5, definition: 'A promise', exampleSentence: 'I guarantee you will love it.' },
  { id: '5-8', word: 'independent', grade: '5', length: 11, syllables: 4, phonicsPattern: ['blends', 'prefixes'], isSightWord: false, difficulty: 5, definition: 'On your own', exampleSentence: 'Be an independent thinker.' },
  { id: '5-9', word: 'mischievous', grade: '5', length: 11, syllables: 3, phonicsPattern: ['blends', 'suffixes'], isSightWord: false, difficulty: 5, definition: 'Playfully naughty', exampleSentence: 'The mischievous cat hid my socks.' },
  { id: '5-10', word: 'necessary', grade: '5', length: 9, syllables: 4, phonicsPattern: ['blends'], isSightWord: false, difficulty: 5, definition: 'Needed', exampleSentence: 'Water is necessary for life.' },
  { id: '5-11', word: 'recommend', grade: '5', length: 9, syllables: 3, phonicsPattern: ['blends'], isSightWord: false, difficulty: 5, definition: 'To suggest', exampleSentence: 'I recommend this book.' },
  { id: '5-12', word: 'thoroughly', grade: '5', length: 10, syllables: 3, phonicsPattern: ['digraphs', 'suffixes'], isSightWord: false, difficulty: 5, definition: 'Completely', exampleSentence: 'Clean your room thoroughly.' },
];

export const getWordsByGrade = (grade: GradeLevel): Word[] => {
  return wordBank.filter(word => word.grade === grade);
};

export const getRandomWords = (
  grade: GradeLevel, 
  count: number = 10,
  filters?: {
    phonicsPatterns?: string[];
    lengthRange?: [number, number];
  }
): Word[] => {
  let words = getWordsByGrade(grade);
  
  if (filters?.phonicsPatterns && filters.phonicsPatterns.length > 0) {
    words = words.filter(word => 
      word.phonicsPattern.some(p => filters.phonicsPatterns?.includes(p))
    );
  }
  
  if (filters?.lengthRange) {
    words = words.filter(word => 
      word.length >= filters.lengthRange![0] && word.length <= filters.lengthRange![1]
    );
  }
  
  // Shuffle and take count
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
