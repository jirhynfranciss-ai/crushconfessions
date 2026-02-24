import { useState } from 'react';
import { Heart, Send, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { addConfession } from '../storage';
import { MOODS } from '../types';
import type { MoodType } from '../types';

export function PublicPage() {
  const [senderName, setSenderName] = useState('');
  const [crushName, setCrushName] = useState('');
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState<MoodType>('shy');
  const [submitted, setSubmitted] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crushName.trim() || !message.trim() || loading) return;
    setLoading(true);

    const success = await addConfession({
      sender_name: isAnonymous ? 'Anonymous' : senderName.trim() || 'Anonymous',
      crush_name: crushName.trim(),
      message: message.trim(),
      mood,
    });

    setLoading(false);
    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSenderName('');
        setCrushName('');
        setMessage('');
        setMood('shy');
        setIsAnonymous(true);
      }, 3000);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 animate-bounce-in">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200 mx-auto">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Confession Sent! 💌</h2>
          <p className="text-gray-500 text-lg">Your secret is safe with us...</p>
          <div className="flex justify-center gap-2">
            {['💕', '✨', '💖', '✨', '💕'].map((emoji, i) => (
              <span key={i} className="text-2xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>{emoji}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Floating Hearts */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-200 opacity-30 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 1.5}s`,
              fontSize: `${20 + i * 8}px`,
            }}
          >♥</div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-purple-600 font-medium">100% Anonymous & Secret</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent mb-3">
            Crush Confessions
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Pour your heart out. Tell them what you feel. Your secret stays safe here. 💗
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-pink-100/50 border border-pink-100/50 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymous Toggle */}
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl">
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  isAnonymous ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                  isAnonymous ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {isAnonymous ? '🎭 Staying Anonymous' : '👤 Revealing my identity'}
              </span>
            </div>

            {/* Sender Name */}
            {!isAnonymous && (
              <div className="space-y-2 animate-fade-in-up">
                <label className="block text-sm font-semibold text-gray-700">Your Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all placeholder:text-gray-400"
                />
              </div>
            )}

            {/* Crush Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                <Heart className="inline h-4 w-4 text-pink-500 mr-1 -mt-0.5" />
                Who's your crush?
              </label>
              <input
                type="text"
                value={crushName}
                onChange={(e) => setCrushName(e.target.value)}
                placeholder="Their name..."
                required
                className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">How are you feeling?</label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(m.value)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      mood === m.value
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Your Confession 💌</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Dear crush, I've been wanting to tell you..."
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all placeholder:text-gray-400 resize-none"
              />
              <p className="text-xs text-gray-400 text-right">{message.length} characters</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!crushName.trim() || !message.trim() || loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</>
              ) : (
                <><Send className="h-5 w-5" /> Send My Confession</>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-gray-400">🔒 All confessions are encrypted and anonymous</p>
          <p className="text-xs text-gray-300">Made with 💕 for hopeless romantics</p>
        </div>
      </div>
    </div>
  );
}
