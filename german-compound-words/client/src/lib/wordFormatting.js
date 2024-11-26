//!!! SUPER SLOW !!!, need updates
const transformSubWords = (subWordsString, word_gender) => {
  return subWordsString.split(", ").map((subWord) => {
    // Parse the subword format (e.g., 'Straße+n', 'halte-n', 'Stelle')
    const stays = !subWord.includes("+") && !subWord.includes("-");
    const changeMarker = subWord.includes('+') ? '+' : 
                         subWord.includes('-') ? '-' : '~';
    
    const gender = (word_gender === 0) ? "der" : 
                   (word_gender === 1) ? "die" :
                   "das"; // !!! Default gender all following last subword

    let word, original_word, original, suffix;
    if (stays) {
        word = subWord;
        original_word = '';
    } else if (changeMarker === '+') {
        [original, suffix] = subWord.split("+");
        word = original + suffix;
        original_word = original;
    } else if (changeMarker === '-') {
        [original, suffix] = subWord.split("-");
        word = original;
        original_word = original + suffix;
    } else {
        [original, suffix] = subWord.split("~");
        word = original;
        original_word = suffix;
    }

    return {
      word: word, // current form
      translation: "", // Placeholder, need to be implemented
      stays,
      original: original_word,
      gender,
    };
  });
};

export const transformWord = (word) => ({
  compoundWord: word.word,
  translation: word.definition,
  subWords: transformSubWords(word.sub_words, word.gender),
});
