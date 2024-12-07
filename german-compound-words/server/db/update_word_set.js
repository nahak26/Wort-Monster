import { supabase } from "../lib/dbClient.js";

export async function updateWordSet(id, name, words) {
  const { data, error } = await supabase
    .from("word_sets")
    .update(
      {
        id,
        name,
        words,
      },
    )
    .eq("id", id)
    .select("*");

  if (error) {
    console.error("Error upserting word set:", error);
    return null;
  }
  return data;
}

export async function addViewerToSet(id, user_id) {
  const { data, error } = await supabase
    .from("word_sets")
    .update({
      viewers: supabase.sql`array(
      SELECT DISTINCT UNNEST(viewers || ${userId}::bigint[])
    )`,
    })
    .eq("id", setId)
    .select();

  if (error) {
    console.error("Error adding viewer into set:", error);
    return null;
  }
  return data;
}
