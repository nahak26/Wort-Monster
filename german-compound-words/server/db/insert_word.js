import { supabase } from "../lib/dbClient.js";

export async function insertWord(word, sub_words, definition, gender, pos) {
    const { data, error } = await supabase
        .from("dictionary").insert({word, sub_words, definition, gender, pos})
        .select('*')
        .single();

    if (error) return null;
    return data;
}
