import { supabase } from "../lib/dbClient.js";

export async function upsertWordSet(id, name, words) {
  const { data, error } = await supabase
    .from("word_sets")
    .upsert(
      {
        id,
        name,
        words,
      },
      { onConflict: "id" },
    )
    .select()
    .single();
  if (error) {
    console.error("Error upserting word set:", error);
    return null;
  }
  return data;
}
