import { useState } from 'react';
import {
  Database, Globe, Shield, Copy, Check,
  ExternalLink, ChevronDown, ChevronRight,
  Rocket, Key, Terminal, Eye
} from 'lucide-react';

const SQL_SCHEMA = `-- Run this in your Supabase SQL Editor
CREATE TABLE confessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL DEFAULT 'Anonymous',
  crush_name TEXT NOT NULL,
  message TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT 'shy',
  is_read BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Allow anyone to INSERT (submit confessions)
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit confessions"
  ON confessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read confessions"
  ON confessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update confessions"
  ON confessions FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete confessions"
  ON confessions FOR DELETE
  USING (true);`;

export function SetupGuide() {
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const copySQL = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  const toggleStep = (step: number) => {
    setExpandedStep(expandedStep === step ? null : step);
  };

  const steps = [
    {
      num: 1,
      icon: <Database className="h-5 w-5" />,
      title: 'Create a Free Supabase Project',
      color: 'from-emerald-500 to-teal-500',
      content: (
        <div className="space-y-3 text-gray-300 text-sm">
          <p>1. Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline inline-flex items-center gap-1">supabase.com <ExternalLink className="h-3 w-3" /></a></p>
          <p>2. Sign up for free (use GitHub login - fastest)</p>
          <p>3. Click <strong className="text-white">"New Project"</strong></p>
          <p>4. Name it anything (e.g., "crush-confessions")</p>
          <p>5. Set a database password (save it somewhere!)</p>
          <p>6. Choose the closest region to you</p>
          <p>7. Click <strong className="text-white">"Create new project"</strong> — wait ~2 minutes</p>
          <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-3 mt-2">
            <p className="text-emerald-400 text-xs">✅ Free tier includes: 500MB database, 50K monthly users, unlimited API requests</p>
          </div>
        </div>
      ),
    },
    {
      num: 2,
      icon: <Terminal className="h-5 w-5" />,
      title: 'Create the Database Table',
      color: 'from-blue-500 to-indigo-500',
      content: (
        <div className="space-y-3 text-gray-300 text-sm">
          <p>1. In your Supabase dashboard, click <strong className="text-white">"SQL Editor"</strong> in the left sidebar</p>
          <p>2. Click <strong className="text-white">"New query"</strong></p>
          <p>3. Copy & paste this SQL code and click <strong className="text-white">"Run"</strong>:</p>
          <div className="relative">
            <pre className="bg-gray-950 border border-gray-700 rounded-lg p-4 text-xs overflow-x-auto text-green-400 max-h-60 overflow-y-auto">
              {SQL_SCHEMA}
            </pre>
            <button
              onClick={copySQL}
              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-xs text-white transition-colors"
            >
              {copiedSQL ? <><Check className="h-3 w-3" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
            </button>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3">
            <p className="text-blue-400 text-xs">✅ You should see "Success. No rows returned" — that means it worked!</p>
          </div>
        </div>
      ),
    },
    {
      num: 3,
      icon: <Key className="h-5 w-5" />,
      title: 'Get Your API Keys',
      color: 'from-purple-500 to-pink-500',
      content: (
        <div className="space-y-3 text-gray-300 text-sm">
          <p>1. Go to <strong className="text-white">Settings → API</strong> in your Supabase dashboard</p>
          <p>2. You need TWO things:</p>
          <div className="bg-gray-950 border border-gray-700 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-purple-400 font-mono text-xs mb-1">Project URL:</p>
              <p className="text-gray-400 text-xs">Looks like: https://abcdefg.supabase.co</p>
            </div>
            <div>
              <p className="text-pink-400 font-mono text-xs mb-1">anon / public key:</p>
              <p className="text-gray-400 text-xs">Looks like: eyJhbGciOi... (long string)</p>
            </div>
          </div>
          <p>3. Open the file <code className="bg-gray-800 px-2 py-0.5 rounded text-purple-300">src/supabaseClient.ts</code></p>
          <p>4. Paste your URL and key in the constants:</p>
          <pre className="bg-gray-950 border border-gray-700 rounded-lg p-3 text-xs text-yellow-300">
{`const SUPABASE_URL = 'https://YOUR-ID.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbG...YOUR-KEY';`}
          </pre>
          <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
            <p className="text-purple-400 text-xs">🔐 The anon key is safe to expose — Supabase RLS policies protect your data</p>
          </div>
        </div>
      ),
    },
    {
      num: 4,
      icon: <Globe className="h-5 w-5" />,
      title: 'Host It For Free',
      color: 'from-orange-500 to-red-500',
      content: (
        <div className="space-y-4 text-gray-300 text-sm">
          <div className="space-y-2">
            <p className="text-white font-semibold">Option A: Vercel (Recommended — Easiest)</p>
            <p>1. Push your code to <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline">GitHub</a></p>
            <p>2. Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline inline-flex items-center gap-1">vercel.com <ExternalLink className="h-3 w-3" /></a> → Sign in with GitHub</p>
            <p>3. Click "Import Project" → Select your repo</p>
            <p>4. Click "Deploy" — done! You get a URL like <code className="bg-gray-800 px-1 rounded text-green-400">yourapp.vercel.app</code></p>
          </div>
          <div className="space-y-2">
            <p className="text-white font-semibold">Option B: Netlify</p>
            <p>1. Go to <a href="https://netlify.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline inline-flex items-center gap-1">netlify.com <ExternalLink className="h-3 w-3" /></a></p>
            <p>2. Drag & drop your <code className="bg-gray-800 px-1 rounded">dist</code> folder after building</p>
            <p>3. Get a URL like <code className="bg-gray-800 px-1 rounded text-green-400">yourapp.netlify.app</code></p>
          </div>
          <div className="bg-orange-900/20 border border-orange-500/20 rounded-lg p-3">
            <p className="text-orange-400 text-xs">🌐 Both are 100% free and give you a shareable URL!</p>
          </div>
        </div>
      ),
    },
    {
      num: 5,
      icon: <Rocket className="h-5 w-5" />,
      title: 'Share & Collect Confessions',
      color: 'from-pink-500 to-rose-500',
      content: (
        <div className="space-y-3 text-gray-300 text-sm">
          <p>1. Share your app URL with friends/classmates</p>
          <p>2. They see the <strong className="text-white">beautiful confession form</strong> — they can submit anonymously</p>
          <p>3. You access your <strong className="text-white">secret admin panel</strong> to read all confessions</p>
          <div className="bg-gray-950 border border-gray-700 rounded-lg p-4 space-y-2">
            <p className="text-pink-400 font-semibold text-xs">🔐 HOW TO ACCESS ADMIN PANEL:</p>
            <p className="text-gray-400 text-xs">• Add <code className="bg-gray-800 px-1 rounded text-green-400">#admin</code> to your URL (e.g., yourapp.vercel.app<strong className="text-green-400">#admin</strong>)</p>
            <p className="text-gray-400 text-xs">• Or press <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-white">Ctrl</kbd> + <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-white">Shift</kbd> + <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-white">A</kbd></p>
            <p className="text-gray-400 text-xs">• Or tap the invisible button in the bottom-right corner 5 times</p>
            <p className="text-gray-400 text-xs">• Default password: <code className="bg-gray-800 px-1 rounded text-yellow-400">iloveyou123</code></p>
          </div>
          <div className="bg-pink-900/20 border border-pink-500/20 rounded-lg p-3">
            <p className="text-pink-400 text-xs">💡 Nobody else can see the admin panel — it's completely hidden!</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Setup Guide</h2>
          <p className="text-gray-400 text-sm">Follow these steps to make your confession system live</p>
        </div>
      </div>

      {/* Current Mode Indicator */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
        <Eye className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-yellow-400 font-semibold text-sm">Currently in Demo Mode (localStorage)</p>
          <p className="text-yellow-300/70 text-xs mt-1">
            Confessions are only saved in YOUR browser. Follow the steps below to connect Supabase 
            so that anyone who visits your URL can submit confessions and you can read them from any device.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.num} className="bg-gray-800/40 border border-gray-700/30 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleStep(step.num)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-800/60 transition-colors"
            >
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">
                  Step {step.num}: {step.title}
                </p>
              </div>
              {expandedStep === step.num ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedStep === step.num && (
              <div className="px-4 pb-4 pt-0 ml-11">
                {step.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
