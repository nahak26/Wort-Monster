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

export async function addWordToSet(id, word_id) {
  const { data, error } = await supabase.rpc("append_to_array", {
    table_name: "word_sets",
    row_id: id,
    column_name: "words",
    element: word_id
  });

  if (error) {
    console.error("Error adding word into set:", error);
    return error;
  }
  return data;
}

export async function addViewerToSet(id, user_id) {
  const { data, error } = await supabase.rpc("append_to_array", {
    table_name: "word_sets",
    row_id: id,
    column_name: "viewers",
    element: user_id
  });

  if (error) {
    console.error("Error adding viewer into set:", error);
    return null;
  }
  return data;
}
