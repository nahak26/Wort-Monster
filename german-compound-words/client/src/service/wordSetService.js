const API_URL = "http://localhost:5001/api/wordsets";

// Fetch user's word sets from the database
export const fetchWordSets = async (userId) => {
  const response = await fetch(`${API_URL}/user/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch word sets: ${response.statusText}`);
  }
  return await response.json();
};

// Create a new & update word set
export const upsertWordSet = async (setData) => {
  
  const response = await fetch(`${API_URL}/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(setData),
  });
  if (!response.ok) {
    throw new Error(`Failed to upsert word set: ${response.statusText}`);
  }
  return await response.json();
};

// Search for public word sets
export const searchPublicWordSets = async (query) => {
  
  // Replace with actual API logic
  return [];
};
