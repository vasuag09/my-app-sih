// src/apis/groups.js
import { supabase } from "../store/supaBaseClient";

export async function fetchGroups() {
  const { data, error } = await supabase.from("groups").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
