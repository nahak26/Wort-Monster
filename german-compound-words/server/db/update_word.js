import { supabase } from "../lib/dbClient.js";

export async function updateWord(word_id, word, definition, gender) {
    const { error, data } = await supabase
        .from("dictionary")
        .update({word, definition, gender})
        .eq("id", word_id)
        .select("*");

    if (error) return null;
    return data;
}
