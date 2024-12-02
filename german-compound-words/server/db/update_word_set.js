import { supabase } from "../lib/dbClient.js";

export async function updateWordSet(id, name, words) {
  const { data, error } = await supabase
    .from("word_sets")
    .update(
      {
        id,
        name,
        words,
      }
    )
    .eq("id", id)
    .select("*");

  if (error) {
    console.error("Error upserting word set:", error);
    return null;
  }
  return data;
}
