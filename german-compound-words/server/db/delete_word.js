import { supabase } from "../lib/dbClient.js";

export async function deleteWord(uid, word) {
    const { error } = await supabase
        .from("dictionary")
        .delete()
        .eq("word", word)
        .eq("user_uid", uid);  // Ensure the deletion is restricted to the user's UID

    if (error) {
        console.error("Error deleting word:", error);
        return null;
    }
    return true;
}
