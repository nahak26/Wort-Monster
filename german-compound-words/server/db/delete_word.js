import { supabase } from "../lib/dbClient.js";

export async function deleteWord(word) {
    const { error } = await supabase
        .from("dictionary")
        .delete().eq("word", word);

    if (error) return null;
    return true;
}
