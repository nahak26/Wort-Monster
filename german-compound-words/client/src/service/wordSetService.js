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
export const fetchWordSetsById = async (setId) => {
  const response = await fetch(`${API_URL}/${setId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch word sets: ${response.statusText}`);
  }
  return await response.json();
};

// Fetch user's word sets from the database
export const fetchWordSets = async (userId) => {
  const response = await fetch(`${API_URL}/user/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch word sets: ${response.statusText}`);
  }
  return await response.json();
};

// Create a new word set
export const createWordSet = async (setData) => {
  const response = await fetch(`${API_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(setData),
  });
  if (!response.ok) {
    throw new Error(`Failed to create word set: ${response.statusText}`);
  }
  return await response.json();
};

// Update a word set
export const updateWordSet = async (set_id, setData) => {
  const response = await fetch(`${API_URL}/update/${set_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(setData),
  });
  if (!response.ok) {
    throw new Error(`Failed to update word set: ${response.statusText}`);
  }
  return await response.json();
};

// Search for public word sets
export const searchPublicWordSets = async (query, filter) => {
  const response = await fetch(`${API_URL}/getall`);
  if (!response.ok) {
    throw new Error(`Failed to fetch words: ${response.statusText}`);
  }
  return await response.json();
};
