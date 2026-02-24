import { useState, useEffect, useCallback } from 'react';
import {
  Heart, Trash2, Star, Mail, MailOpen, LogOut,
  Search, Filter, ArrowLeft, AlertTriangle, X,
  Inbox, StarOff, Clock, TrendingUp, BookOpen,
  Database, Wifi, HardDrive, RefreshCw
} from 'lucide-react';
import {
  fetchConfessions, toggleRead, toggleFavorite,
  deleteConfession, deleteAllConfessions, getStorageMode
} from '../storage';
import { MOOD_EMOJIS, MOOD_COLORS } from '../types';
import { SetupGuide } from './SetupGuide';
import type { Confession } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
  onBack: () => void;
}

type TabType = 'confessions' | 'setup';

export function AdminPanel({ onLogout, onBack }: AdminPanelProps) {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [search, setSearch] = useState('');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [selectedConfession, setSelectedConfession] = useState<Confession | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('confessions');
  const [loading, setLoading] = useState(true);

  const storageMode = getStorageMode();

  const loadConfessions = useCallback(async () => {
    const data = await fetchConfessions();
    setConfessions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadConfessions();
    const interval = setInterval(loadConfessions, 3000);
    return () => clearInterval(interval);
  }, [loadConfessions]);

  const stats = {
    total: confessions.length,
    unread: confessions.filter(c => !c.is_read).length,
    favorites: confessions.filter(c => c.is_favorite).length,
    today: confessions.filter(c => {
      const today = new Date();
      const d = new Date(c.created_at);
      return d.toDateString() === today.toDateString();
    }).length,
  };

  const filtered = confessions.filter((c) => {
    const matchSearch =
      c.crush_name.toLowerCase().includes(search.toLowerCase()) ||
      c.sender_name.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase());
    const matchMood = filterMood === 'all' || c.mood === filterMood;
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'unread' && !c.is_read) ||
      (filterStatus === 'read' && c.is_read) ||
      (filterStatus === 'favorites' && c.is_favorite);
    return matchSearch && matchMood && matchStatus;
  });

  const handleToggleRead = async (id: string) => {
    await toggleRead(id);
    await loadConfessions();
  };

  const handleToggleFavorite = async (id: string) => {
    await toggleFavorite(id);
    await loadConfessions();
  };

  const handleDelete = async (id: string) => {
    await deleteConfession(id);
    await loadConfessions();
    setSelectedConfession(null);
  };

  const handleDeleteAll = async () => {
    await deleteAllConfessions();
    await loadConfessions();
    setShowDeleteAll(false);
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-sm sm:text-base">Confession Dashboard</h1>
                <div className="flex items-center gap-2">
                  <p className="text-gray-500 text-xs hidden sm:block">Admin Panel</p>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    storageMode === 'supabase'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {storageMode === 'supabase' ? <><Wifi className="h-2.5 w-2.5" /> Live</> : <><HardDrive className="h-2.5 w-2.5" /> Demo</>}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadConfessions()}
              className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            {confessions.length > 0 && (
              <button
                onClick={() => setShowDeleteAll(true)}
                className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-gray-800"
                title="Delete all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-all text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 -mb-px">
            <button
              onClick={() => setActiveTab('confessions')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'confessions'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Inbox className="h-4 w-4" />
              Confessions
              {stats.unread > 0 && (
                <span className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {stats.unread}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'setup'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Setup Guide
              {storageMode === 'local' && (
                <span className="bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold">!</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* SETUP TAB */}
        {activeTab === 'setup' && <SetupGuide />}

        {/* CONFESSIONS TAB */}
        {activeTab === 'confessions' && (
          <div className="space-y-6">
            {/* Storage Warning */}
            {storageMode === 'local' && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
                <Database className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-semibold text-sm">Demo Mode — Local Storage Only</p>
                  <p className="text-yellow-300/70 text-xs mt-1">
                    Confessions are only saved in this browser. Go to the{' '}
                    <button onClick={() => setActiveTab('setup')} className="underline font-semibold">Setup Guide</button>
                    {' '}tab to connect Supabase for real multi-user support.
                  </p>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Inbox className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-gray-400 font-medium">Total</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-gray-400 font-medium">Unread</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.unread}</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-gray-400 font-medium">Favorites</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.favorites}</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-gray-400 font-medium">Today</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.today}</p>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search confessions..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-500 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  <select
                    value={filterMood}
                    onChange={(e) => setFilterMood(e.target.value)}
                    className="pl-9 pr-8 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                  >
                    <option value="all">All Moods</option>
                    <option value="shy">🙈 Shy</option>
                    <option value="bold">🔥 Bold</option>
                    <option value="heartbroken">💔 Heartbroken</option>
                    <option value="hopeful">🌟 Hopeful</option>
                    <option value="obsessed">😍 Obsessed</option>
                  </select>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="unread">📩 Unread</option>
                  <option value="read">📭 Read</option>
                  <option value="favorites">⭐ Favorites</option>
                </select>
              </div>
            </div>

            {/* Confessions List */}
            {loading ? (
              <div className="text-center py-20">
                <RefreshCw className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading confessions...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-800/50 mb-4">
                  <Inbox className="h-10 w-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  {confessions.length === 0 ? 'No confessions yet' : 'No matching confessions'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {confessions.length === 0
                    ? 'Share the public link and wait for confessions to pour in!'
                    : 'Try adjusting your search or filters'}
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filtered.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedConfession(c);
                      if (!c.is_read) handleToggleRead(c.id);
                    }}
                    className={`group relative bg-gray-800/40 backdrop-blur border rounded-2xl p-4 sm:p-5 cursor-pointer hover:bg-gray-800/60 transition-all duration-200 hover:border-purple-500/30 ${
                      !c.is_read ? 'border-purple-500/30 bg-gray-800/50' : 'border-gray-700/30'
                    }`}
                  >
                    {!c.is_read && (
                      <div className="absolute top-4 right-4 h-3 w-3 bg-purple-500 rounded-full animate-pulse" />
                    )}

                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-lg sm:text-xl ${MOOD_COLORS[c.mood]}`}>
                        {MOOD_EMOJIS[c.mood]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-white text-sm sm:text-base">
                            {c.sender_name === 'Anonymous' ? '🎭 Anonymous' : c.sender_name}
                          </h3>
                          <span className="text-gray-600">→</span>
                          <span className="text-pink-400 font-medium text-sm sm:text-base flex items-center gap-1">
                            <Heart className="h-3 w-3 fill-current" />
                            {c.crush_name}
                          </span>
                          {c.is_favorite && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-2">{c.message}</p>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${MOOD_COLORS[c.mood]}`}>
                            {MOOD_EMOJIS[c.mood]} {c.mood}
                          </span>
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(c.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(c.id); }}
                          className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                          title={c.is_favorite ? 'Unfavorite' : 'Favorite'}
                        >
                          {c.is_favorite ? <StarOff className="h-4 w-4 text-yellow-400" /> : <Star className="h-4 w-4 text-gray-500" />}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleRead(c.id); }}
                          className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                          title={c.is_read ? 'Mark unread' : 'Mark read'}
                        >
                          {c.is_read ? <MailOpen className="h-4 w-4 text-gray-500" /> : <Mail className="h-4 w-4 text-blue-400" />}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                          className="p-1.5 rounded-lg hover:bg-red-900/30 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedConfession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedConfession(null)}>
          <div className="bg-gray-900 border border-gray-700/50 rounded-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${MOOD_COLORS[selectedConfession.mood]}`}>
                  {MOOD_EMOJIS[selectedConfession.mood]} {selectedConfession.mood}
                </div>
                <button onClick={() => setSelectedConfession(null)} className="text-gray-500 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm w-12">From:</span>
                  <span className="text-white font-medium">
                    {selectedConfession.sender_name === 'Anonymous' ? '🎭 Anonymous' : selectedConfession.sender_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm w-12">To:</span>
                  <span className="text-pink-400 font-medium flex items-center gap-1">
                    <Heart className="h-4 w-4 fill-current" />
                    {selectedConfession.crush_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm w-12">When:</span>
                  <span className="text-gray-300 text-sm">
                    {new Date(selectedConfession.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/30">
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{selectedConfession.message}</p>
              </div>

              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <button
                  onClick={() => handleToggleFavorite(selectedConfession.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedConfession.is_favorite
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-yellow-400'
                  }`}
                >
                  <Star className={`h-4 w-4 ${selectedConfession.is_favorite ? 'fill-current' : ''}`} />
                  {selectedConfession.is_favorite ? 'Favorited' : 'Favorite'}
                </button>
                <button
                  onClick={() => handleToggleRead(selectedConfession.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-800 text-gray-400 border border-gray-700 hover:text-blue-400 transition-all"
                >
                  {selectedConfession.is_read ? <><Mail className="h-4 w-4" /> Mark Unread</> : <><MailOpen className="h-4 w-4" /> Mark Read</>}
                </button>
                <button
                  onClick={() => handleDelete(selectedConfession.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-900/20 text-red-400 border border-red-900/30 hover:bg-red-900/40 transition-all ml-auto"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Modal */}
      {showDeleteAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteAll(false)}>
          <div className="bg-gray-900 border border-gray-700/50 rounded-3xl w-full max-w-sm p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-900/30 mx-auto">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete All Confessions?</h3>
              <p className="text-gray-400 text-sm">
                This action cannot be undone. All {confessions.length} confessions will be permanently deleted.
              </p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowDeleteAll(false)} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all font-medium text-sm">
                  Cancel
                </button>
                <button onClick={handleDeleteAll} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all font-medium text-sm">
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
