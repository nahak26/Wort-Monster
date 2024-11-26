const API_URL = "http://localhost:5001/api/users";

export const userLogin = async (userData) => {
  const response = await fetch(`${API_URL}/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error(`Failed to sync user data: ${response.statusText}`);
  }
  return await response.json();
};
