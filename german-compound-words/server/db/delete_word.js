import { supabase } from "../lib/dbClient.js";

export async function deleteWord(wordId) {
    const { error } = await supabase
        .from("dictionary")
        .delete()
        .eq("id", wordId)

    if (error) {
        console.error("Error deleting word:", error);
        return null;
    }
    return true;
}
