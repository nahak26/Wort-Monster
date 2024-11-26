import { supabase } from "../lib/dbClient.js";

export async function upsertUser(uid, name, email, picture) {
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        name,
        email,
        picture,
        firebase_uid: uid,
      },
      { onConflict: "firebase_uid" },
    )
    .select()
    .single();

  if (error) {
    console.error("Error upserting user:", error);
    return null;
  }
  return data;
}
