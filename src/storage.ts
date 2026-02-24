import { getSupabase, isSupabaseConfigured } from './supabaseClient';
import type { Confession, NewConfession } from './types';

const LOCAL_KEY = 'crush_confessions_db';

// ============ LOCAL STORAGE FALLBACK ============

function getLocal(): Confession[] {
  try {
    const data = localStorage.getItem(LOCAL_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveLocal(confessions: Confession[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(confessions));
}

// ============ UNIFIED STORAGE API ============

export async function addConfession(data: NewConfession): Promise<boolean> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from('confessions').insert({
      sender_name: data.sender_name,
      crush_name: data.crush_name,
      message: data.message,
      mood: data.mood,
      is_read: false,
      is_favorite: false,
    });
    return !error;
  } else {
    const confessions = getLocal();
    const newConfession: Confession = {
      id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2),
      ...data,
      created_at: new Date().toISOString(),
      is_read: false,
      is_favorite: false,
    };
    confessions.unshift(newConfession);
    saveLocal(confessions);
    return true;
  }
}

export async function fetchConfessions(): Promise<Confession[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from('confessions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return data || [];
  } else {
    return getLocal();
  }
}

export async function toggleRead(id: string): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb.from('confessions').select('is_read').eq('id', id).single();
    if (data) {
      await sb.from('confessions').update({ is_read: !data.is_read }).eq('id', id);
    }
  } else {
    const confessions = getLocal();
    const idx = confessions.findIndex(c => c.id === id);
    if (idx !== -1) { confessions[idx].is_read = !confessions[idx].is_read; saveLocal(confessions); }
  }
}

export async function toggleFavorite(id: string): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb.from('confessions').select('is_favorite').eq('id', id).single();
    if (data) {
      await sb.from('confessions').update({ is_favorite: !data.is_favorite }).eq('id', id);
    }
  } else {
    const confessions = getLocal();
    const idx = confessions.findIndex(c => c.id === id);
    if (idx !== -1) { confessions[idx].is_favorite = !confessions[idx].is_favorite; saveLocal(confessions); }
  }
}

export async function deleteConfession(id: string): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    await sb.from('confessions').delete().eq('id', id);
  } else {
    const confessions = getLocal().filter(c => c.id !== id);
    saveLocal(confessions);
  }
}

export async function deleteAllConfessions(): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    await sb.from('confessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  } else {
    saveLocal([]);
  }
}

export function getStorageMode(): 'supabase' | 'local' {
  return isSupabaseConfigured() ? 'supabase' : 'local';
}
