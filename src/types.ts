export interface Confession {
  id: string;
  sender_name: string;
  crush_name: string;
  message: string;
  mood: 'shy' | 'bold' | 'heartbroken' | 'hopeful' | 'obsessed';
  created_at: string;
  is_read: boolean;
  is_favorite: boolean;
}

export type NewConfession = Pick<Confession, 'sender_name' | 'crush_name' | 'message' | 'mood'>;

export type MoodType = Confession['mood'];

export const MOODS: { value: MoodType; label: string; emoji: string }[] = [
  { value: 'shy', label: 'Shy', emoji: '🙈' },
  { value: 'bold', label: 'Bold', emoji: '🔥' },
  { value: 'heartbroken', label: 'Heartbroken', emoji: '💔' },
  { value: 'hopeful', label: 'Hopeful', emoji: '🌟' },
  { value: 'obsessed', label: 'Obsessed', emoji: '😍' },
];

export const MOOD_EMOJIS: Record<string, string> = {
  shy: '🙈', bold: '🔥', heartbroken: '💔', hopeful: '🌟', obsessed: '😍',
};

export const MOOD_COLORS: Record<string, string> = {
  shy: 'bg-amber-100 text-amber-700',
  bold: 'bg-red-100 text-red-700',
  heartbroken: 'bg-blue-100 text-blue-700',
  hopeful: 'bg-green-100 text-green-700',
  obsessed: 'bg-pink-100 text-pink-700',
};
