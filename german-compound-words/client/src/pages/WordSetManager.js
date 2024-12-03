import React, { useState, useEffect } from "react";
import WordBuilder from "./WordBuilder.js"; // Import WordBuilder
import { fetchWordSets, createWordSet, updateWordSet, searchPublicWordSets } from "../service/wordSetService.js";

const WordSetManager = ({ user }) => {
  const [wordSets, setWordSets] = useState([]); // Stores saved word sets
  const [searchQuery, setSearchQuery] = useState(""); // Search bar input
  const [searchResults, setSearchResults] = useState([]); // Results of public word set search
  const [selectedWordSet, setSelectedWordSet] = useState(null); // Tracks selected word set
  const [searchFilter, setSearchFilter] = useState("name");
  const [isEditing, setisEditing] = useState(true);
  
  // Load saved word sets on mount
  useEffect(() => {
    const loadWordSets = async () => {
      try {
        console.log("current user:", user);
        const sets = await fetchWordSets(user.id); // Pass user ID to fetch user's sets
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
      const results = await searchPublicWordSets(searchQuery, searchFilter);
      setSearchResults(results);
    } catch (error) {
      console.error("Failed to search public word sets:", error.message);
    }
  };
  

  // Create a new word set
  const handleCreateWordSet = async () => {
    try {
      const setName = prompt("Enter the name for your Word Set:");
      // Validate the input
      if (!setName || !setName.trim()) {
        alert("Word Set name cannot be empty.");
        return;
      }
      const setData = { name: setName, id: user.id}; // Default name with user ID
      const newSet = await createWordSet(setData);
      console.log("new word set created:", newSet);
      setSelectedWordSet(newSet); // Open the new word set in WordBuilder
    } catch (error) {
      console.error("Failed to create word set:", error.message);
    }
  };

  // Open an existing word set
  const handleEditWordSet = (wordSet) => {
    setSelectedWordSet(wordSet); // Pass the word set to WordBuilder
  };

  const handleViewWordSet = (wordSet) => {
    setSelectedWordSet(wordSet); // Pass the word set to WordBuilder
    setisEditing(false); // Set to View Only
  }

  const handleEditWordSetName = (wordSetId) => {
    // Prompt user for the new word set name
    const newName = prompt("Enter the new name for your Word Set:");
  
    // Validate the input
    if (!newName || !newName.trim()) {
      alert("Word Set name cannot be empty.");
      return;
    }
  
    // Update the state immutably
    setWordSets((prevWordSets) =>
      prevWordSets.map((wordSet) =>
        wordSet.id === wordSetId
          ? { ...wordSet, name: newName.trim() }
          : wordSet
      )
    );
  };  

  // Add this function inside WordSetManager
  const handleDeleteWordSet = (wordSetId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Word Set? This action cannot be undone."
    );

    if (confirmDelete) {
      // Update state to remove the word set
      setWordSets((prevWordSets) =>
        prevWordSets.filter((wordSet) => wordSet.id !== wordSetId)
      );

      // Optionally, make a call to your backend to delete the word set
      updateWordSet(wordSetId)
        .then(() => {
          console.log(`Word Set with ID ${wordSetId} deleted successfully.`);
        })
        .catch((error) => {
          console.error("Failed to delete Word Set:", error.message);
        });
    }
  };

  // Return to WordSetManager from WordBuilder
  const handleReturnToManager = () => {
    setSelectedWordSet(null);
    window.location.reload(); // Refresh the page
  };

  // If a word set is selected, render WordBuilder
  if (selectedWordSet) {
    return <WordBuilder wordSet={selectedWordSet} onReturn={handleReturnToManager} isEditing={isEditing}/>;
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

      {/* Search Bar with Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          {/* Search Query Input */}
          <input
            type="text"
            placeholder="Search public word sets"
            className="p-3 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Search Filter Dropdown */}
          <select
            className="p-3 border rounded bg-white focus:outline-none focus:ring focus:ring-blue-300"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          >
            <option value="name">Set Name</option>
            <option value="word">Includes Word</option>
            <option value="creator">Creator</option>
          </select>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🔍 Search
          </button>
        </div>
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
                  onClick={() => handleViewWordSet(set)}
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
            <span
              className="cursor-pointer hover:underline"
              onClick={() => handleEditWordSetName(set.id)}
            >
              <h3 className="font-bold text-lg break-words">{set.name}</h3>
            </span>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleEditWordSet(set)}
                className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
              >
                ✏️
              </button>
              <button
                onClick={() => handleEditWordSetName(set.id)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                📝 Name
              </button>
              <button
                onClick={() => handleDeleteWordSet(set.id)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordSetManager;
