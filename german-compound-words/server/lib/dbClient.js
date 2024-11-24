import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("!!!Missing SUPABASE_URL or SUPABASE_KEY in root/server/.env");
}

// Set up the Supabase client without the auth header initially
export const supabase = createClient(supabaseUrl, supabaseKey, {
    fetch: async (input, init) => {
        const token = await getFirebaseToken(); // Get the Firebase token dynamically
        init.headers = { ...init.headers, Authorization: `Bearer ${token}` };
        return fetch(input, init);
    }
});

// Function to retrieve the current Firebase token
async function getFirebaseToken() {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
}
