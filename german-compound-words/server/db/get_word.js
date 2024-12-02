import { supabase } from "../lib/dbClient.js";

export async function getAllWords() {
  const { data, error } = await supabase
    .from("dictionary")
    .select("*");

  if (error) return null;
  return data;
}

export async function getAllCompoundWords() {
  const { data, error } = await supabase
    .from("dictionary")
    .select("*")
    .not("sub_words", "is", null);

  if (error) return null;
  return data;
}

export async function getCompoundWords(word_ids) {
  const { data, error } = await supabase
    .from("dictionary")
    .select("*")
    .not("sub_words", "is", null)
    .in("id", word_ids);

  if (error) return null;
  return data;
}

export async function getWord(word_id) {
  const { data, error } = await supabase
    .from("dictionary")
    .select("*")
    .eq("id", word_id);

  if (error) return null;
  return data;
}

export async function getSubWords(sub_word_ids) {
  const { data, error } = await supabase
    .from("dictionary")
    .select("id, word, definition, gender")
    .in("id", sub_word_ids);

  if (error) return null;
  return data;
}
