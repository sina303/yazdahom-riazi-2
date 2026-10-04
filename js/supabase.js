/* =========================================
SUPABASE — AXIS Database
========================================= */
const SUPABASE_URL = "https://lmszsfjzvqsxcbzvycbq.supabase.co";
const SUPABASE_KEY = "sb_publishable_uAlu-PlpA820kFxz91XTYw_N3jaVQkC";

let supabaseClient = null;

function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("✅ Supabase connected");
    return supabaseClient;
  } else {
    console.warn("⚠️ Supabase library not loaded");
    return null;
  }
}

async function signUp(email, password, username) {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return { error: "Supabase not initialized" };
  return await supabaseClient.auth.signUp({
    email, password, options: { data: { username } }
  });
}

async function signIn(email, password) {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return { error: "Supabase not initialized" };
  return await supabaseClient.auth.signInWithPassword({ email, password });
}

async function signOut() {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return { error: "Supabase not initialized" };
  return await supabaseClient.auth.signOut();
}

async function getCurrentUser() {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return null;
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}

async function getProfile(userId) {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient
    .from('profiles').select('*').eq('id', userId).single();
  if (error) { console.error(error); return null; }
  return data;
}

async function saveProfile(profile) {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient
    .from('profiles')
    .upsert({ ...profile, updated_at: new Date().toISOString() })
    .select().single();
  if (error) { console.error(error); return null; }
  return data;
}

document.addEventListener("DOMContentLoaded", initSupabase);
