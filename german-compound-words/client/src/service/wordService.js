const API_URL = 'http://localhost:5001/api/words';

// Fetch all compound words
export const fetchAllCompoundWords = async () => {
  const response = await fetch(`${API_URL}/getall`);
  if (!response.ok) {
    throw new Error(`Failed to fetch words: ${response.statusText}`);
  }
  return await response.json();
};

export const fetchCompoundWords = async (ids) => {
  const query = ids.join(",");

  const response = await fetch(`${API_URL}/get?ids=${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch words: ${response.statusText}`);
  }
  return await response.json();
};

// Fetch all subwords with ids
export const fetchSubWords = async (ids) => {
  const query = ids.join(",");

  const response = await fetch(`${API_URL}/getsub?ids=${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch subwords: ${response.statusText}`);
  }
  return await response.json();
};

// Fetch one word by ID
export const fetchWord = async (wordId) => {
  const response = await fetch(`${API_URL}/get/${wordId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch word: ${response.statusText}`);
  }
  return await response.json();
};

// Create a new word
export const createWord = async (wordData) => {
  const response = await fetch(`${API_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(wordData),
  });
  if (!response.ok) {
    throw new Error(`Failed to create word: ${response.statusText}`);
  }
  return await response.json();
};

// Upsert a word
export const upsertWord = async (wordData) => {
  const response = await fetch(`${API_URL}/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(wordData),
  });
  if (!response.ok) {
    throw new Error(`Failed to create word: ${response.statusText}`);
  }
  return await response.json();
};

// Update a word by ID
export const updateWord = async (wordId, updatedData) => {
  const response = await fetch(`${API_URL}/${wordId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error(`Failed to update word: ${response.statusText}`);
  }
  return await response.json();
};

// Delete a word by ID
export const deleteWord = async (wordId) => {
  const response = await fetch(`${API_URL}/${wordId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete word: ${response.statusText}`);
  }
  return await response.json();
};
