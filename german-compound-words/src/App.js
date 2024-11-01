import React, { useState } from "react";

// Speech synthesis function for pronunciation
const readAloud = (text, slow = false) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = slow ? 0.7 : 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};

const App = () => {
  const [compoundWord, setCompoundWord] = useState("");
  const [translation, setTranslation] = useState(""); // Changed from pronunciation to translation
  const [subWords, setSubWords] = useState([]);
  const [savedWords, setSavedWords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); // Index of the word being edited

  // Handler to add a new sub-word entry
  const addSubWord = () => {
    setSubWords([
      ...subWords,
      { word: "", translation: "", stays: true, original: "", gender: "" },
    ]);
  };

  // Handler to update a sub-word field
  const updateSubWord = (index, field, value) => {
    const newSubWords = [...subWords];
    newSubWords[index][field] = value;
    setSubWords(newSubWords);
  };

  // Delete a sub-word
  const deleteSubWord = (index) => {
    setSubWords(subWords.filter((_, i) => i !== index));
  };

  // Save the compound word
  const saveCompoundWord = () => {
    const newWord = {
      compoundWord,
      translation, // Updated field name
      subWords,
    };

    if (editingIndex !== null) {
      // Update the existing word if we're in edit mode
      const updatedWords = [...savedWords];
      updatedWords[editingIndex] = newWord;
      setSavedWords(updatedWords);
      setEditingIndex(null); // Reset editing index after saving
    } else {
      // Create a new word if not editing
      setSavedWords([newWord, ...savedWords]);
    }

    // Reset fields
    setCompoundWord("");
    setTranslation(""); // Updated field name
    setSubWords([]);
  };

  // Delete a saved word
  const deleteWord = (index) => {
    setSavedWords(savedWords.filter((_, i) => i !== index));
  };

  // Edit a saved word
  const editWord = (index) => {
    const wordToEdit = savedWords[index];
    setCompoundWord(wordToEdit.compoundWord);
    setTranslation(wordToEdit.translation); // Updated field name
    setSubWords(wordToEdit.subWords);
    setEditingIndex(index); // Set the index of the word being edited
  };

  // Function to auto-resize input
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
        
        <input
          type="text"
          placeholder="Compound Word"
          className="p-3 mb-4 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          value={compoundWord}
          onChange={(e) => setCompoundWord(e.target.value)}
          onInput={(e) => autoResizeInput(e.target)}
        />

        {/* Translation Input */}
        <input
          type="text"
          placeholder="Translation" // Updated placeholder
          className="p-3 mb-4 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          value={translation} // Updated field name
          onChange={(e) => setTranslation(e.target.value)} // Updated field name
          onInput={(e) => autoResizeInput(e.target)}
        />

        {/* Sub-words */}
        <div className="mb-4">
          <h3 className="font-semibold">Sub-Words</h3>
          <div className="flex flex-wrap mb-2">
            {subWords.map((subWord, index) => (
              <div key={index} className="flex flex-col items-start border p-4 m-2 rounded-lg bg-gray-50 shadow-md">
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
                  onChange={(e) =>
                    updateSubWord(index, "translation", e.target.value)
                  }
                  onInput={(e) => autoResizeInput(e.target)}
                />
                <select
                  className="p-3 border rounded mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                  value={subWord.stays}
                  onChange={(e) =>
                    updateSubWord(index, "stays", e.target.value === "true")
                  }
                >
                  <option value="true">Stays</option>
                  <option value="false">Changed</option>
                </select>
                {subWord.stays === false && (
                  <input
                    type="text"
                    placeholder="Original Word"
                    className="p-3 border rounded mb-1 min-w-[100px] transition-all focus:outline-none focus:ring focus:ring-blue-300"
                    value={subWord.original}
                    onChange={(e) =>
                      updateSubWord(index, "original", e.target.value)
                    }
                    onInput={(e) => autoResizeInput(e.target)}
                  />
                )}
                {index === subWords.length - 1 && (
                  <select
                    className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    value={subWord.gender}
                    onChange={(e) =>
                      updateSubWord(index, "gender", e.target.value)
                    }
                  >
                    <option value="">Gender</option>
                    <option value="der">Der</option>
                    <option value="die">Die</option>
                    <option value="das">Das</option>
                  </select>
                )}
                <button
                  onClick={() => deleteSubWord(index)}
                  className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑️
                </button>
              </div>
            ))}
            <button
              onClick={addSubWord}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ➕
            </button>
          </div>
        </div>

        <button
          onClick={saveCompoundWord}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {editingIndex !== null ? "💾 Update" : "💾 Save"}
        </button>
      </div>

      {/* Saved Compound Words */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Saved Compound Words</h2>
        <div className="space-y-4">
          {savedWords.map((word, index) => {
            // Determine the gender from the last sub-word
            const lastSubWord = word.subWords[word.subWords.length - 1];
            const gender = lastSubWord ? lastSubWord.gender : "";

            return (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-start"
              >
                <div>
                  <h3 className="font-bold text-lg">{word.compoundWord} {gender && <span className="text-gray-500">({gender})</span>}</h3>
                  <p>Translation: {word.translation}</p> {/* Updated label */}
                  <div className="mt-2">
                    <h4 className="font-semibold">Sub-Words</h4>
                    <div className="flex flex-wrap space-x-4">
                      {word.subWords.map((subWord, i) => (
                        <div key={i} className="flex flex-col items-start border p-2 m-2 rounded bg-gray-50 shadow-md">
                          <p
                            className="cursor-pointer hover:text-blue-500"
                            onClick={() => readAloud(subWord.word)}
                          >
                            {subWord.word}
                          </p>
                          <p>Translation: {subWord.translation}</p> {/* Updated label */}
                          {!subWord.stays && (
                            <p>Changed from: {subWord.original}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
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
