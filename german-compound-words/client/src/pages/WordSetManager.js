import React, { useState, useEffect } from "react";
import WordBuilder from "./WordBuilder.js"; // Import WordBuilder
import {
  fetchWordSets,
  createWordSet,
  searchPublicWordSets,
} from "../service/wordSetService.js";

const WordSetManager = ({ user }) => {
  const [wordSets, setWordSets] = useState([]); // Stores saved word sets
  const [searchQuery, setSearchQuery] = useState(""); // Search bar input
  const [searchResults, setSearchResults] = useState([]); // Results of public word set search
  const [selectedWordSet, setSelectedWordSet] = useState(null); // Tracks selected word set
  const [isEditing, setIsEditing] = useState(false); // Tracks whether a set is being edited or created

  // Load saved word sets on mount
  useEffect(() => {
    const loadWordSets = async () => {
      try {
        const sets = await fetchWordSets(user.uid); 
        console.log("Fetched word sets:", sets); // Debugging log
        setWordSets(sets);
      } catch (error) {
        console.error("Failed to fetch word sets:", error.message);
      }
    };
    loadWordSets();
  }, [user]);

  // Handle search bar input
  const handleSearch = async () => {
    try {
      const results = await searchPublicWordSets(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Failed to search public word sets:", error.message);
    }
  };

  // Create a new word set
  const handleCreateWordSet = async () => {
    setIsEditing(false); // Mark as a new word set
    setSelectedWordSet({
      name: "New Word Set",
      words: [],
    }); // Pass a blank set to WordBuilder
  };

  // Open an existing word set
  const handleEditWordSet = (wordSet) => {
    setIsEditing(true); // Mark as editing
    setSelectedWordSet(wordSet); // Pass the word set to WordBuilder
  };

  // Save a word set (new or updated)
  const handleSaveWordSet = async (updatedSet) => {
    try {
      if (isEditing) {
        // Update an existing set
        setWordSets((prev) =>
          prev.map((set) => (set.id === updatedSet.id ? updatedSet : set))
        );
      } else {
        // Create a new set
        const newSet = await createWordSet(user.uid, updatedSet.name);
        setWordSets((prev) => [...prev, { ...newSet, words: updatedSet.words }]);
      }
      setSelectedWordSet(null); // Return to manager
    } catch (error) {
      console.error("Failed to save word set:", error.message);
    }
  };

  // Return to WordSetManager from WordBuilder
  const handleReturnToManager = () => {
    setSelectedWordSet(null);
  };

  // Render WordBuilder if a word set is selected
  if (selectedWordSet) {
    return (
      <WordBuilder
        wordSet={selectedWordSet}
        onReturn={handleReturnToManager}
        onSave={handleSaveWordSet}
        isEditing={isEditing}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-100 to-green-200 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Word Sets</h1>

      {/* Create Word Set Button */}
      <div className="mb-6 text-center">
        <button
          onClick={handleCreateWordSet}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ➕ Create New Word Set
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search public word sets"
          className="p-3 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🔍 Search
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((set) => (
              <div
                key={set.id}
                className="bg-white p-4 rounded-lg shadow-lg flex flex-col"
              >
                <h3 className="font-bold text-lg break-words">{set.name}</h3>
                <button
                  onClick={() => handleEditWordSet(set)}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Word Sets */}
      <h2 className="text-xl font-semibold mb-4">Your Word Sets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wordSets.map((set) => (
          <div
            key={set.id}
            className="bg-white p-4 rounded-lg shadow-lg flex flex-col"
          >
            <h3 className="font-bold text-lg break-words">{set.name}</h3>
            <button
              onClick={() => handleEditWordSet(set)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordSetManager;
