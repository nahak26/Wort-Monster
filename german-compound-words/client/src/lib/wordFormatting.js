const transformSubWords = (subWordsString, subWordIds, subwords) => {
  const subWordList = subWordsString.split(", ");
  //console.log("current subwords:", subWordList);
  //console.log("all possible subwords:", subwords);

  return subWordList.map((subWord, index) => {
    const subWordId = subWordIds[index];
    const subWordData = subwords.find((sub) => sub.id === subWordId);

    const word = subWord;
    const translation = subWordData.definition;
    const original = subWordData.word;
    const stays = (word === original) ? true : false;
    const gender = subWordData?.gender === 0 ? "der" :
                   subWordData?.gender === 1 ? "die" :
                   subWordData?.gender === 2 ? "das" : "";

    return {
      word, // current form
      translation, // Placeholder, need to be implemented
      stays,
      original,
      gender,
    };
  });
};

export const transformWord = (word, sub_words) => ({
  compoundWord: word.word,
  translation: word.definition,
  subWords: transformSubWords(word.sub_words, word.sub_word_ids, sub_words),
});
