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
      word,
      translation,
      stays,
      original,
      gender,
    };
  });
};

export const transformWord = (word, sub_words) => ({
  id: word.id,
  compoundWord: word.word,
  translation: word.definition,
  subWords: transformSubWords(word.sub_words, word.sub_word_ids, sub_words),
  owner: word.owner,
});

export const transformSet = (set) => ({
  id: set.id,
  name: set.name,
  owner: set.user_id,
  words: set.words
});