import { supabase } from "../lib/dbClient.js";

export async function insertWordSet(name, user_id) {
  const { data, error } = await supabase
    .from("word_sets").insert({ name, user_id })
    .select("*")
    .single();

  if (error) return error;
  return data;
}
