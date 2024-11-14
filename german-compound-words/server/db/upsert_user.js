import { supabase } from "../lib/dbClient.js";

export async function upsertUser(name, email, picture) {
    const { data, error } = await supabase.from("users")
        .upsert({
        name,
        email,
        picture,
        }, { onConflict: "email" }).select().single();

    if (error) return null;
    return data;
}
