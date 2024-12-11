const API_URL = "http://localhost:5001/api/wordsets";

// Fetc all word sets
export const fetchAllWordSets = async () => {
  const response = await fetch(`${API_URL}/getall`);
  if (!response.ok) {
    throw new Error(`Failed to fetch word sets: ${response.statusText}`);
  }
  return await response.json();
};

// Fetch word set by set id
export const fetchWordSetById = async (setId) => {
  const response = await fetch(`${API_URL}/get?id=${setId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch word set: ${response.statusText}`);
  }
  return await response.json();
};

// Fetch word sets by set name
export const fetchWordSetByName = async (setName) => {
  const response = await fetch(`${API_URL}/get?name=${setName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch word set: ${response.statusText}`);
  }
  return await response.json();
};

// Fetch users owned word sets from the database
export const fetchWordSetsByCreators = async (ids) => {
  const query = ids.join(",");

  const response = await fetch(`${API_URL}/creator?ids=${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch word sets: ${response.statusText}`);
  }
  return await response.json();
};

// Fetch users owned word sets from the database
export const fetchWordSetsByUser = async (id) => {
  const response = await fetch(`${API_URL}/user/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch word sets: ${response.statusText}`);
  }
  return await response.json();
};

// Fetch word sets containing words by ids
export const fetchWordSetsContainWords = async (ids) => {
  const query = ids.join(",");

  const response = await fetch(`${API_URL}/get/wordIds?ids=${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch word sets: ${response.statusText}`);
  }
  return await response.json();
};

// Create a new word set
export const createWordSet = async (setData) => {
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(setData),
  });
  if (!response.ok) {
    throw new Error(`Failed to create word set: ${response.statusText}`);
  }
  return await response.json();
};

// Update a word set
export const updateWordSet = async (setId, setData) => {
  const response = await fetch(`${API_URL}/update/${setId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(setData),
  });
  if (!response.ok) {
    throw new Error(`Failed to update word set: ${response.statusText}`);
  }
  return await response.json();
};

// Add a word to the set 
export const addWordToSet = async (setId, wordId) => {
  const response = await fetch(`${API_URL}/addword?wordId=${wordId}&setId=${setId}`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Failed to add word into set: ${response.statusText}`);
  }
  return await response.json();
};

// Add a user to the set
export const addUserAsSetViewer = async (setId, userId) => {
  const response = await fetch(`${API_URL}/addviewer?userId=${userId}&setId=${setId}`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Failed to add user as viewer: ${response.statusText}`);
  }
  return await response.json();
};

// Delete a word set by id
export const deleteWordSet = async (setId) => {
  const response = await fetch(`${API_URL}/${setId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete words: ${response.statusText}`);
  }
  return await response.json();
};
