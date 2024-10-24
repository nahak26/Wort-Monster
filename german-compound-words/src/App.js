import React, { useState } from 'react';

function App() {
  const [compoundWord, setCompoundWord] = useState('');
  const [compoundTranslation, setCompoundTranslation] = useState('');
  const [compoundPronunciation, setCompoundPronunciation] = useState(''); // New state for pronunciation
  const [subWords, setSubWords] = useState([{ word: '', translation: '', blocker: 'stays', originalWord: '' }]);
  const [gender, setGender] = useState('');
  const [savedWords, setSavedWords] = useState([]);

  const addSubWord = () => {
    setSubWords([...subWords, { word: '', translation: '', blocker: 'stays', originalWord: '' }]);
  };

  const handleSubWordChange = (index, e) => {
    const newSubWords = [...subWords];
    newSubWords[index].word = e.target.value;
    setSubWords(newSubWords);
  };

  const handleTranslationChange = (index, e) => {
    const newSubWords = [...subWords];
    newSubWords[index].translation = e.target.value;
    setSubWords(newSubWords);
  };

  const handleBlockerChange = (index, e) => {
    const newSubWords = [...subWords];
    newSubWords[index].blocker = e.target.value;
    newSubWords[index].originalWord = ''; // Reset original word when changing blocker type
    setSubWords(newSubWords);
  };

  const handleOriginalWordChange = (index, e) => {
    const newSubWords = [...subWords];
    newSubWords[index].originalWord = e.target.value;
    setSubWords(newSubWords);
  };

  const saveCompoundWord = () => {
    const newWord = {
      fullWord: compoundWord,
      translation: compoundTranslation,
      pronunciation: compoundPronunciation, // Include pronunciation
      subWords: subWords,
      gender,
    };
    setSavedWords([...savedWords, newWord]);
    resetForm();
  };

  const resetForm = () => {
    setCompoundWord('');
    setCompoundTranslation('');
    setCompoundPronunciation(''); // Reset pronunciation field
    setSubWords([{ word: '', translation: '', blocker: 'stays', originalWord: '' }]);
    setGender('');
  };

  const deleteWord = (index) => {
    const newSavedWords = savedWords.filter((_, i) => i !== index);
    setSavedWords(newSavedWords);
  };

  const editWord = (index) => {
    const wordToEdit = savedWords[index];
    setCompoundWord(wordToEdit.fullWord);
    setCompoundTranslation(wordToEdit.translation);
    setCompoundPronunciation(wordToEdit.pronunciation); // Set pronunciation for editing
    setSubWords(wordToEdit.subWords);
    setGender(wordToEdit.gender);
    deleteWord(index); // Remove the word from saved words after loading it for editing
  };

  const deleteSubWord = (index) => {
    const newSubWords = subWords.filter((_, i) => i !== index);
    setSubWords(newSubWords);
  };

  const readWords = (text, rate = 1) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE'; // Set the language to German
    utterance.rate = rate; // Set the speech rate
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create German Compound Words</h1>

      <div className="mb-4">
        <label className="block mb-2">Full Compound Word:</label>
        <input
          type="text"
          value={compoundWord}
          onChange={(e) => setCompoundWord(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full mb-2"
        />
        <label className="block mb-2">English Translation:</label>
        <input
          type="text"
          value={compoundTranslation}
          onChange={(e) => setCompoundTranslation(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full mb-2"
        />
        <label className="block mb-2">Pronunciation:</label> {/* New input for pronunciation */}
        <input
          type="text"
          value={compoundPronunciation}
          onChange={(e) => setCompoundPronunciation(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>

      <h2 className="text-lg font-semibold mb-2">Sub-Words</h2>
      {subWords.map((subWord, index) => (
        <div key={index} className="flex items-center mb-4">
          <input
            type="text"
            value={subWord.word}
            onChange={(e) => handleSubWordChange(index, e)}
            placeholder="Sub-word"
            className="border border-gray-300 rounded-md p-2 w-1/4 mr-2"
          />
          <input
            type="text"
            value={subWord.translation}
            onChange={(e) => handleTranslationChange(index, e)}
            placeholder="Translation"
            className="border border-gray-300 rounded-md p-2 w-1/4 mr-2"
          />
          <select
            value={subWord.blocker}
            onChange={(e) => handleBlockerChange(index, e)}
            className="border border-gray-300 rounded-md p-2 mr-2"
          >
            <option value="stays">Stays</option>
            <option value="changed">Changed</option>
          </select>
          {subWord.blocker === 'changed' && (
            <input
              type="text"
              value={subWord.originalWord}
              onChange={(e) => handleOriginalWordChange(index, e)}
              placeholder="Original Word"
              className="border border-gray-300 rounded-md p-2 w-1/4"
            />
          )}
          {index === subWords.length - 1 && (
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border border-gray-300 rounded-md p-2 ml-2"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="neutral">Neutral</option>
            </select>
          )}
          <button onClick={() => deleteSubWord(index)} className="bg-red-500 text-white rounded-md p-1 ml-2">
            Delete
          </button>
        </div>
      ))}
      <button
        onClick={addSubWord}
        className="bg-blue-500 text-white rounded-md p-2 mb-4"
      >
        Add Sub-Word
      </button>

      <button
        onClick={saveCompoundWord}
        className="bg-green-500 text-white rounded-md p-2 mb-4"
      >
        Save Compound Word
      </button>

      <h2 className="text-lg font-semibold mb-2">Saved Compound Words</h2>
      <div className="grid grid-cols-1 gap-4">
        {savedWords.map((word, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-md">
            <strong>{word.fullWord}</strong> ({word.gender}) - {word.translation}<br />
            <em>Pronunciation: {word.pronunciation}</em><br /> {/* Display pronunciation */}
            <div className="mt-2">
              <h3 className="font-semibold">Sub-Words:</h3>
              <ul className="list-disc pl-5">
                {word.subWords.map((subWord, subIndex) => (
                  <li key={subIndex}>
                    {subWord.word} ({subWord.translation}) {subWord.blocker === 'changed' && `- Changed from: ${subWord.originalWord}`}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <button onClick={() => readWords(word.fullWord)} className="bg-blue-500 text-white rounded-md p-1 mr-2">
                Read Word
              </button>
              <button onClick={() => readWords(word.fullWord, 0.5)} className="bg-blue-300 text-white rounded-md p-1 mr-2">
                Read Slower
              </button>
              <button onClick={() => editWord(index)} className="bg-yellow-500 text-white rounded-md p-1 mr-2">
                Edit
              </button>
              <button onClick={() => deleteWord(index)} className="bg-red-500 text-white rounded-md p-1">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
