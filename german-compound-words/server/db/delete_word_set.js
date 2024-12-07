import { supabase } from "../lib/dbClient.js";

export async function deleteWordSet(setId) {
    const { error } = await supabase
        .from("word_sets")
        .delete()
        .eq("id", setId)

    if (error) {
        console.error("Error deleting word set:", error);
        return null;
    }
    return true;
}
