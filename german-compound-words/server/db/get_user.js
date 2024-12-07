import { supabase } from "../lib/dbClient.js";

export async function getUserById(uid) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("firebase_uid", uid)
    .single();

  if (error) return null;
  return data;
}

export async function getUsersByName(name) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .or(`name.ilike.%${name}%`);

  if (error) return null;
  return data;
}

