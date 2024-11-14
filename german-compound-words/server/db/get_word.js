import { supabase } from "../lib/dbClient.js";

export async function getAllWords() {
    const { data, error } = await supabase
        .from("dictionary")
        .select('*')

    if (error) return null;
    return data;
}

export async function getCompoundWords() {
    const { data, error } = await supabase
        .from("dictionary")
        .select('*')
        .not('sub_words', 'is', null);

    if (error) return null;
    return data;
}

export async function getWord(word_id) {
    const { data, error } = await supabase
        .from("dictionary")
        .select('*')
        .eq('id', word_id)

    if (error) return null;
    return data;
    
}
