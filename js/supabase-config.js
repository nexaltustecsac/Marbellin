/*
 * Configuración pública del cliente Supabase para Marbellin.
 * La publishable/anon key puede estar en el navegador, pero NUNCA pongas
 * aquí la service_role key ni contraseñas.
 *
 * En Vercel, este archivo se sirve al navegador: solo usa la publishable key.
 */
window.MARBELLIN_SUPABASE_URL = "https://ckgvgfpcxeqyilfphnsu.supabase.co";
window.MARBELLIN_SUPABASE_ANON_KEY = "sb_publishable_XLQDJByokKbI5m0UVkJHEw_KRTygH9M";

window.createMarbellinSupabaseClient = function () {
  if (!window.supabase || !window.supabase.createClient) {
    console.warn("No se cargó Supabase JS.");
    return null;
  }
  const key = window.MARBELLIN_SUPABASE_ANON_KEY;
  if (!key || key.includes("PEGA_AQUI")) {
    console.warn("Configura la publishable key en js/supabase-config.js.");
    return null;
  }
  return window.supabase.createClient(window.MARBELLIN_SUPABASE_URL, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
};
