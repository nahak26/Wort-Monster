import React, { useState, useEffect } from "react";
import { readAloud } from '../lib/readAloud.js';
import { transformWord } from "../lib/wordFormatting.js";
import { fetchCompoundWords, upsertWord, fetchSubWords, deleteWord } from "../service/wordService.js";
import { useUser } from "../context/UserContext.js";

const highlightChanges = (word, original) => {
  if (!original || word === original) {
    return word; // No changes, just return the word as it is
  }

  let result = [];
  let commonPart = "";
  let removedPart = "";
  let addedPart = "";

  // Loop through the word and compare with the original
  for (let i = 0; i < Math.max(word.length, original.length); i++) {
    if (i < word.length && i < original.length && word[i] === original[i]) {
      // If characters match, add to common part
      commonPart += word[i];
    } else {
      // If there's a difference, process the removed and added parts
      if (i < original.length) {
        removedPart += original[i];
      }
      if (i < word.length) {
        addedPart += word[i];
      }
    }
  }

  // Construct the JSX output with highlighted changes
  result.push(commonPart);

  if (removedPart) {
    result.push(
      <span className="text-red-500 line-through" key="removed">
        {removedPart}
      </span>
    );
  }

  if (addedPart) {
    result.push(
      <span className="text-green-500" key="added">
        {addedPart}
      </span>
    );
  }

  return <>{result}</>;
};

const WordBuilder = ({ wordSet, onReturn }) => {
  const [compoundWord, setCompoundWord] = useState(""); // Stores the main compound word being created/edited
  const [translation, setTranslation] = useState(""); // Translation of the compound word
  const [subWords, setSubWords] = useState([]); // Array of sub-words forming the compound word
  const [savedWords, setSavedWords] = useState([]); // List of saved compound words with their sub-words
  const [editingIndex, setEditingIndex] = useState(null); // Tracks the index of the word being edited
  const [modalData, setModalData] = useState(null); // Data for a modal when viewing sub-word details
  const [speechSpeed, setSpeechSpeed] = useState(1); // Speed for text-to-speech playback
  const [highlightedSubWord, setHighlightedSubWord] = useState(null); // Sub-word to highlight in the compound word
  const [hoveredWordIndex, setHoveredWordIndex] = useState(null); // Tracks the index of the hovered compound word
  const { user } = useUser();

  //fetch all compound words from database
  /*should we display all?
  Or with a more complicated implementation to display possible existing words (from database) while
  typing in to the Compound Word bar?
  */
  // Saved compound words is still a good way to track user current work done
  useEffect(() => {
    const loadWords = async () => {
      try {
        console.log("current word set:", wordSet);
        const words = await fetchCompoundWords(wordSet.words);
        //console.log("Fetched words:", words);
        const allSubwordIds = [
          ...new Set(words.flatMap((word) => word.sub_word_ids || []))
        ];
        //console.log("subwords needed:", allSubwordIds);
        const subwords = await fetchSubWords(allSubwordIds);
        //console.log("subwords fetched:", subwords);
        //transform all words form database format to client format
        const transformedWords = words.map((word) => transformWord(word, subwords));
        
        console.log(transformedWords);
        setSavedWords(transformedWords);
      } catch (error) {
        console.error("Failed to fetch words:", error.message);
      }
    };
  
    loadWords();
  }, []);

  // Feature:  Hover over sub-word shows sub-word in full compound word section
  const highlightCompoundWord = (compoundWord, subWord, isHovered) => {
    if (!subWord || !isHovered) return compoundWord;
  
    const lowerCompoundWord = compoundWord.toLowerCase();
    const lowerSubWord = subWord.toLowerCase();
  
    const index = lowerCompoundWord.indexOf(lowerSubWord);
    if (index === -1) return compoundWord;
  
    return (
      <>
        {compoundWord.slice(0, index)}
        <span className="bg-yellow-200 font-bold">{subWord}</span>
        {compoundWord.slice(index + subWord.length)}
      </>
    );
  };

  const saveCompoundWord = () => {
    // Validation for mandatory fields
    if (!compoundWord.trim() || !translation.trim()) {
      alert("Compound Word and Translation are required.");
      return;
    }
    
    // Ensure at least one sub-word is added
    if (subWords.length === 0) {
      alert("You must add at least one Sub-Word.");
      return;
    }

    for (const subWord of subWords) {
      if (!subWord.word.trim() || !subWord.translation.trim()) {
        alert("Each Sub-Word must have a value and a Translation.");
        return;
      }

      // Set gender to default if it's empty (for any missing user selection)
      if (!subWord.gender) {
        subWord.gender = "das"; // Default to "das" if not selected
      }
    }

    const newWord = { compoundWord, translation, subWords};
    console.log(newWord);
    const data = upsertWord(newWord);

    setSavedWords((prevSavedWords) => {
      // Check if the word is already saved
      if (prevSavedWords.some((word) => word.compoundWord === compoundWord)) {
        return prevSavedWords;
      }

      return [newWord, ...prevSavedWords];
    });

    setEditingIndex(null);
    setCompoundWord("");
    setTranslation("");
    setSubWords([]);
  };

  const addSubWord = () => {
    setSubWords([
      ...subWords,
      { word: "", translation: "", stays: true, original: "", gender: "" },
    ]);
  };

  const updateSubWord = (index, field, value) => {
    const newSubWords = [...subWords];
    newSubWords[index][field] = value;
    setSubWords(newSubWords);
  };

  const deleteSubWord = (index) => {
    setSubWords(subWords.filter((_, i) => i !== index));
  };

  const deleteCompoundWord = async (index) => {
    const word = savedWords[index];
    console.log("delete word:", word);
    console.log("current user:", user);
    console.log("target word owner:", word.owner);
    if (word.owner === user.id) {
      console.log("deleting word with id:", word.id);
      const response = await deleteWord(word.id);
      console.log("word deleted!:", response);
    }
    setSavedWords(savedWords.filter((_, i) => i !== index));
  };

  const editWord = (index) => {
    const wordToEdit = savedWords[index];
    setCompoundWord(wordToEdit.compoundWord);
    setTranslation(wordToEdit.translation);
    setSubWords(wordToEdit.subWords);
    setEditingIndex(index);
  };

  const autoResizeInput = (input) => {
    input.style.width = `${input.scrollWidth}px`;
  };

  const openModal = (subWord) => {
    setModalData(subWord);
  };

  const closeModal = () => {
    setModalData(null);
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-green-200 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{wordSet.name}</h1>

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
          onInput={(e) => autoResizeInput(e.target)}  // Trigger resizing on input
          style={{ resize: 'none' }} // Disable manual resizing (optional)
        />

        {/* Translation input */}
        <input
          type="text"
          placeholder="Translation"
          className="p-3 mb-4 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          onInput={(e) => autoResizeInput(e.target)}  // Trigger resizing on input
          style={{ resize: 'none' }} // Disable manual resizing (optional)
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

                <select
                  className="p-3 border rounded mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                  value={subWord.stays}
                  onChange={(e) => updateSubWord(index, "stays", e.target.value === "true")}
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
                    onChange={(e) => updateSubWord(index, "original", e.target.value)}
                    onInput={(e) => autoResizeInput(e.target)}
                  />
                )}

                {index === subWords.length - 1 && (
                  <select
                    className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    value={subWord.gender}
                    onChange={(e) => updateSubWord(index, "gender", e.target.value)}
                  >
                    <option value="das">Das</option>
                    <option value="der">Der</option>
                    <option value="die">Die</option>
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

      {/* Display of saved compound words */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Saved Compound Words</h2>
        <button
          onClick={onReturn}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save Set
        </button>
        {/* Speech Speed Control */}
        <div className="my-4">
          <label className="mr-2">Speech Speed:</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={speechSpeed}
            onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
            className="w-64"
          />
          <span>{speechSpeed.toFixed(1)}x</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {savedWords.map((word, index) => {
            const lastSubWord = word.subWords[word.subWords.length - 1];
            const gender = lastSubWord ? lastSubWord.gender : "";
            const isHovered = index === hoveredWordIndex;

            return (
              <div 
                key={index} 
                className="bg-white p-4 rounded-lg shadow-lg flex flex-col"
                onMouseEnter={() => setHoveredWordIndex(index)}
                onMouseLeave={() => setHoveredWordIndex(null)}
              >
                <div className="flex-grow">
                  <h3 className="font-bold text-lg break-words">
                    {gender && (
                      <span
                        className={`text-gray-500 ${gender === "der" ? "text-blue-500" : gender === "die" ? "text-pink-600" : ""
                          }`}
                      >
                        ({gender === "das" ? "Das" : gender.charAt(0).toUpperCase() + gender.slice(1)})
                      </span>
                    )}
                    {" "}
                    {highlightCompoundWord(word.compoundWord, highlightedSubWord, isHovered)}
                  </h3>
                  <div className="mt-2">
                    <p>
                      {word.subWords.map((subWord, i) => (
                        <span
                          key={i}
                          className="cursor-pointer text-blue-600 hover:underline"
                          onClick={() => openModal(subWord)}
                          onMouseEnter={() => setHighlightedSubWord(subWord.word)}
                          onMouseLeave={() => setHighlightedSubWord(null)}
                        >
                          {subWord.stays === false
                            ? highlightChanges(subWord.word, subWord.original) // Apply highlighting
                            : subWord.word}
                          {i < word.subWords.length - 1 && "-"}
                        </span>
                      ))}
                    </p>
                  </div>
                  <p>Translation: {word.translation}</p>
                </div>

                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => editWord(index)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => readAloud(word.compoundWord, speechSpeed)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    🔊
                  </button>

                  <button
                    onClick={() => deleteCompoundWord(index)}
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

      {/* Modal for Sub-Word Details */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-2">{modalData.word}</h2>
            <p><strong>Translation:</strong> {modalData.translation}</p>

            {/* Display Current Word only if there's a change */}
            {modalData.stays === false && (
              <p>
                <strong>Original Word:</strong> {modalData.original}
                <span className="text-red-500 ml-1">(Changed)</span>
              </p>
            )}

            <button
              onClick={() => readAloud(modalData.word, speechSpeed)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              🔊 Pronounce
            </button>
            <button
              onClick={closeModal}
              className="mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordBuilder;
