import React, { useState, useEffect } from "react";
import { readAloud } from '../lib/readAloud.js';
import { transformWord } from "../lib/wordFormatting.js";
import { fetchAllWords, updateWord, createWord, upsertWord } from "../service/wordService.js";

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

const App = () => {
  const [compoundWord, setCompoundWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [subWords, setSubWords] = useState([]);
  const [savedWords, setSavedWords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalData, setModalData] = useState(null); // State for modal data
  const [speechSpeed, setSpeechSpeed] = useState(1); // Default speed is normal
  const [fileName, setFileName] = useState(null); // Keep track of the chosen file name

  //fetch all compound words from database
  /*should we display all?
  Or with a more complicated implementation to display possible existing words (from database) while
  typing in to the Compound Word bar?
  */
  // Saved compound words is still a good way to track user current work done
  //!!! SUPER SLOW !!!
  useEffect(() => {
    const loadWords = async () => {
      try {
        const words = await fetchAllWords();
        //console.log(words);
        //transform all words form database format to client format
        const transformedWords = words.map(transformWord);
        //console.log(transformedWords);
        setSavedWords(transformedWords);
      } catch (error) {
        console.error("Failed to fetch words:", error.message);
      }
    };
  
    loadWords();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      setFileName(file.name); // Set the chosen file name
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);

          const formattedData = data.map((item) => ({
            compoundWord: item.compoundWord,
            translation: item.translation,
            subWords: item.subWords.map((subWord) => ({
              word: subWord.word,
              translation: subWord.translation,
              stays: subWord.stays,
              original: subWord.original,
              gender: subWord.gender,
            })),
          }));

          setSavedWords((prevSavedWords) => {
            // Filter out duplicates based on the compoundWord
            const existingWords = new Set(
              prevSavedWords.map((word) => word.compoundWord)
            );

            const uniqueWords = formattedData.filter(
              (word) => !existingWords.has(word.compoundWord)
            );

            return [...prevSavedWords, ...uniqueWords];
          });
        } catch (error) {
          alert("Error reading JSON file");
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid JSON file");
    }
  };

  const createNewFile = () => {
    // Initialize an empty array for the new file
    const newFileData = [];
    const newFileName = window.prompt('Enter a name for the new file:');
    if (!newFileName) {
      alert('File name is required!');
      return;
    }
    const blob = new Blob([JSON.stringify(newFileData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = newFileName + ".json"; // Correct way to append ".json" to user input
    link.click();
    URL.revokeObjectURL(url);

    setFileName(newFileName + ".json"); // Update the UI to show the new file name
    alert("New file has been created!");
  };

  const saveCompoundWord = () => {
    // Validation for mandatory fields
    if (!compoundWord.trim() || !translation.trim()) {
      alert("Compound Word and Translation are required.");
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

    const newWord = { compoundWord, translation, subWords };
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

  const overwriteJSON = async () => {
    if (!fileName) {
      alert("No file selected to overwrite.");
      return;
    }

    const uniqueData = [...new Map(
      savedWords.map((item) => [item.compoundWord, item])
    ).values()]; // Ensure no duplicates in the saved data

    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(new TextEncoder().encode(JSON.stringify(uniqueData, null, 2)));
      await writable.close();

      alert(`File "${fileName}" has been overwritten.`);
    } catch (error) {
      console.error("Error overwriting file:", error);
      alert("Error saving the file.");
    }
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

  const deleteWord = (index) => {
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
      <h1 className="text-3xl font-bold mb-6 text-center">German Compound Word Builder</h1>

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
        <div className="mb-4">
          {/* File Upload Section */}
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            📂 Choose File
          </label>

          {/* If no file selected, show the "Create New File" button */}
          {!fileName && (
            <button
              onClick={createNewFile}
              className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              ➕ Create New File
            </button>
          )}

          {fileName && (
            <span className="ml-4 text-gray-700">Selected File: {fileName}</span>
          )}

          <button
            onClick={overwriteJSON}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Overwrite File
          </button>
        </div>

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

            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-lg flex flex-col">
                <div className="flex-grow">
                  <h3 className="font-bold text-lg break-words">
                    {word.compoundWord}
                    {gender && (
                      <span
                        className={`text-gray-500 ${gender === "der" ? "text-blue-500" : gender === "die" ? "text-pink-600" : ""
                          }`}
                      >
                        ({gender === "das" ? "Das" : gender.charAt(0).toUpperCase() + gender.slice(1)})
                      </span>
                    )}
                  </h3>
                  <div className="mt-2">
                    <p>
                      {word.subWords.map((subWord, i) => (
                        <span
                          key={i}
                          className="cursor-pointer text-blue-600 hover:underline"
                          onClick={() => openModal(subWord)}
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

export default App;
