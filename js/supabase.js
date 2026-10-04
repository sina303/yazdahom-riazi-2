/* =========================================
SUPABASE — AXIS Database
========================================= */
const SUPABASE_URL = "https://lmszsfjzvqsxcbzvycbq.supabase.co";
const SUPABASE_KEY = "sb_publishable_uAlu-PlpA820kFxz91XTYw_N3jaVQkC";

let supabaseClient = null;

/* =========================================
INIT
========================================= */
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

/* =========================================
AUTH — ثبت‌نام
========================================= */
async function signUp(email, password, username) {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return { error: "Supabase not initialized" };

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { username: username }
    }
  });

  return { data, error };
}

/* =========================================
AUTH — ورود
========================================= */
async function signIn(email, password) {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return { error: "Supabase not initialized" };

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  return { data, error };
}

/* =========================================
AUTH — خروج
========================================= */
async function signOut() {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return { error: "Supabase not initialized" };

  const { error } = await supabaseClient.auth.signOut();
  return { error };
}

/* =========================================
AUTH — کاربر فعلی
========================================= */
async function getCurrentUser() {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return null;

  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}

/* =========================================
PROFILE — گرفتن پروفایل
========================================= */
async function getProfile(userId) {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error("Error getting profile:", error);
    return null;
  }
  return data;
}

/* =========================================
PROFILE — ذخیره‌ی پروفایل
========================================= */
async function saveProfile(profile) {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from('profiles')
    .upsert({
      ...profile,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving profile:", error);
    return null;
  }
  return data;
}

/* =========================================
PROFILE — آپدیت XP و پیشرفت
========================================= */
async function updateXP(userId, newXP, newSolved, newCorrect, newWrong) {
  if (!supabaseClient) initSupabase();
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from('profiles')
    .update({
      xp: newXP,
      solved: newSolved,
      correct: newCorrect,
      wrong: newWrong,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating XP:", error);
    return null;
  }
  return data;
}

/* =========================================
START
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  initSupabase();
});
