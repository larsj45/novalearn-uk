'use client';

import { useEffect, useState } from 'react';
import { History, Bot, User, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Scan {
  id: string;
  text_snippet: string;
  ai_score: number;
  detected_model: string | null;
  created_at: string;
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 75)
    return (
      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
        <Bot className="w-3 h-3" />
        {Math.round(score)}% IA
      </span>
    );
  if (score >= 40)
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
        <AlertTriangle className="w-3 h-3" />
        {Math.round(score)}% IA
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
      <User className="w-3 h-3" />
      {Math.round(score)}% IA
    </span>
  );
}

export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScans() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('scans')
        .select('id, text_snippet, ai_score, detected_model, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      setScans(data ?? []);
      setLoading(false);
    }

    loadScans();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <History className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-bold text-navy">Historique des analyses</h1>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Chargement…</div>
      ) : scans.length === 0 ? (
        <div className="text-center py-20">
          <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune analyse pour le moment.</p>
          <p className="text-gray-400 text-sm mt-1">
            Lancez votre première analyse depuis le tableau de bord.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 line-clamp-2">{scan.text_snippet}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">
                      {new Date(scan.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {scan.detected_model && (
                      <span className="text-xs text-gray-400">
                        Modèle : {scan.detected_model}
                      </span>
                    )}
                  </div>
                </div>
                <ScoreBadge score={scan.ai_score} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
