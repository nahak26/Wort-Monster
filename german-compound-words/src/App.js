import React, { useState } from "react";

// Speech synthesis function for pronunciation
const readAloud = (text, slow = false) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE"; // Set German language
  utterance.rate = slow ? 0.7 : 1; // Adjust speed based on 'slow' parameter
  speechSynthesis.cancel(); // Cancel any ongoing speech
  speechSynthesis.speak(utterance); // Speak the text
};

const App = () => {
  // State variables for compound word input, translation, sub-words, saved words, and editing index
  const [compoundWord, setCompoundWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [subWords, setSubWords] = useState([]);
  const [savedWords, setSavedWords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Adds a new blank sub-word object to the 'subWords' array
  const addSubWord = () => {
    setSubWords([
      ...subWords,
      { word: "", translation: "", stays: true, original: "", gender: "" },
    ]);
  };

  // Updates the value of a specific field in a sub-word based on index
  const updateSubWord = (index, field, value) => {
    const newSubWords = [...subWords];
    newSubWords[index][field] = value;
    setSubWords(newSubWords);
  };

  // Removes a sub-word from the 'subWords' array based on index
  const deleteSubWord = (index) => {
    setSubWords(subWords.filter((_, i) => i !== index));
  };

  // Saves the current compound word and its details to the saved words list
  const saveCompoundWord = () => {
    const newWord = {
      compoundWord,
      translation,
      subWords,
    };

    // If in edit mode, update the existing entry; otherwise, add a new entry
    if (editingIndex !== null) {
      const updatedWords = [...savedWords];
      updatedWords[editingIndex] = newWord;
      setSavedWords(updatedWords);
      setEditingIndex(null); // Exit edit mode
    } else {
      setSavedWords([newWord, ...savedWords]); // Prepend new word to saved words
    }

    // Clear input fields
    setCompoundWord("");
    setTranslation("");
    setSubWords([]);
  };

  // Deletes a saved compound word based on index
  const deleteWord = (index) => {
    setSavedWords(savedWords.filter((_, i) => i !== index));
  };

  // Loads a saved compound word into the form for editing
  const editWord = (index) => {
    const wordToEdit = savedWords[index];
    setCompoundWord(wordToEdit.compoundWord);
    setTranslation(wordToEdit.translation);
    setSubWords(wordToEdit.subWords);
    setEditingIndex(index);
  };

  // Adjusts input width to fit content dynamically
  const autoResizeInput = (input) => {
    input.style.width = `${input.scrollWidth}px`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-green-200 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">German Compound Word Builder</h1>

      {/* Disclaimer */}
      <div className="absolute top-4 right-4 text-sm text-gray-600">
        If text-to-speech isn't working, delete browsing data (cached images and files).
      </div>

      {/* Compound Word Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Create a Compound Word</h2>

        {/* Compound word input */}
        <input
          type="text"
          placeholder="Compound Word"
          className="p-3 mb-4 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          value={compoundWord}
          onChange={(e) => setCompoundWord(e.target.value)}
          onInput={(e) => autoResizeInput(e.target)}
        />

        {/* Translation input */}
        <input
          type="text"
          placeholder="Translation"
          className="p-3 mb-4 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          onInput={(e) => autoResizeInput(e.target)}
        />

        {/* Sub-words section */}
        <div className="mb-4">
          <h3 className="font-semibold">Sub-Words</h3>
          <div className="flex flex-wrap mb-2">
            {subWords.map((subWord, index) => (
              <div key={index} className="flex flex-col items-start border p-4 m-2 rounded-lg bg-gray-50 shadow-md">
                {/* Sub-word and translation inputs */}
                <input
                  type="text"
                  placeholder="Sub-Word"
                  className="p-3 border rounded mb-1 min-w-[100px] transition-all focus:outline-none focus:ring focus:ring-blue-300"
                  value={subWord.word}
                  onChange={(e) => updateSubWord(index, "word", e.target.value)}
                  onInput={(e) => autoResizeInput(e.target)}
                />
                <input
                  type="text"
                  placeholder="Translation"
                  className="p-3 border rounded mb-1 min-w-[100px] transition-all focus:outline-none focus:ring focus:ring-blue-300"
                  value={subWord.translation}
                  onChange={(e) => updateSubWord(index, "translation", e.target.value)}
                  onInput={(e) => autoResizeInput(e.target)}
                />

                {/* Dropdown to select if sub-word remains the same or changes */}
                <select
                  className="p-3 border rounded mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                  value={subWord.stays}
                  onChange={(e) => updateSubWord(index, "stays", e.target.value === "true")}
                >
                  <option value="true">Stays</option>
                  <option value="false">Changed</option>
                </select>

                {/* Original word input if the sub-word changes */}
                {subWord.stays === false && (
                  <input
                    type="text"
                    placeholder="Original Word"
                    className="p-3 border rounded mb-1 min-w-[100px] transition-all focus:outline-none focus:ring focus:ring-blue-300"
                    value={subWord.original}
                    onChange={(e) => updateSubWord(index, "original", e.target.value)}
                    onInput={(e) => autoResizeInput(e.target)}
                  />
                )}

                {/* Gender dropdown for the last sub-word */}
                {index === subWords.length - 1 && (
                  <select
                    className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    value={subWord.gender}
                    onChange={(e) => updateSubWord(index, "gender", e.target.value)}
                  >
                    <option value="">Gender</option>
                    <option value="der">Der</option>
                    <option value="die">Die</option>
                    <option value="das">Das</option>
                  </select>
                )}

                {/* Delete sub-word button */}
                <button
                  onClick={() => deleteSubWord(index)}
                  className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑️
                </button>
              </div>
            ))}

            {/* Button to add a new sub-word */}
            <button
              onClick={addSubWord}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ➕
            </button>
          </div>
        </div>

        {/* Save or update compound word button */}
        <button
          onClick={saveCompoundWord}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {editingIndex !== null ? "💾 Update" : "💾 Save"}
        </button>
      </div>

      {/* Display of saved compound words */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Saved Compound Words</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {savedWords.map((word, index) => {
            const lastSubWord = word.subWords[word.subWords.length - 1];
            const gender = lastSubWord ? lastSubWord.gender : "";

            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-lg flex flex-col">
                <div className="flex-grow">
                  {/* Compound word display with gender */}
                  <h3 className="font-bold text-lg break-words">
                    {word.compoundWord} {gender && <span className="text-gray-500">({gender})</span>}
                  </h3>
                  <p>Translation: {word.translation}</p>

                  {/* Sub-word details */}
                  <div className="mt-2">
                    <h4 className="font-semibold">Sub-Words</h4>
                    <div className="flex flex-wrap space-x-2">
                      {word.subWords.map((subWord, i) => (
                        <div key={i} className="flex flex-col items-start border p-2 rounded bg-gray-50 shadow-md">
                          <p
                            className="cursor-pointer hover:text-blue-500"
                            onClick={() => readAloud(subWord.word)}
                          >
                            {subWord.word}
                          </p>
                          <p>Translation: {subWord.translation}</p>
                          {!subWord.stays && (
                            <p>Changed from: {subWord.original}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons for editing, deleting, and reading aloud the compound word */}
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => editWord(index)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => readAloud(word.compoundWord)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    🔊
                  </button>
                  <button
                    onClick={() => readAloud(word.compoundWord, true)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    🔊↘️
                  </button>
                  <button
                    onClick={() => deleteWord(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
