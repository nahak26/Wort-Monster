const API_URL = "http://localhost:5001/api/users";

export const userCheck = async (uid) => {
  const response = await fetch(`${API_URL}/${uid}`);
  if (!response.ok) {
    return null;
    //throw new Error(`Failed to get user: ${response.statusText}`);
  }
  return await response.json();
}

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
