'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  ExternalLink,
  Radio,
  Filter,
  CheckCircle2,
  RefreshCw,
  Box,
} from 'lucide-react';
import { ContractEventItem } from '../../types/stellar';
import { getTxExplorerUrl, shortenAddress, shortenHash } from '../../config/stellar';

const CORE_API_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4000';

export const RealtimeActivitySection: React.FC = () => {
  const [events, setEvents] = useState<ContractEventItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isConnectedSSE, setIsConnectedSSE] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fallback REST fetch
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${CORE_API_URL}/api/v1/events?limit=50`);
      if (res.ok) {
        const json = await res.json();
        if (json.data?.events) {
          setEvents(json.data.events);
        }
      }
    } catch {
      // Fallback sample data if core backend is still starting
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Setup Server-Sent Events (SSE)
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${CORE_API_URL}/api/v1/events/stream`);

      eventSource.onopen = () => {
        setIsConnectedSSE(true);
      };

      eventSource.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed && parsed.eventType) {
            setEvents((prev) => {
              const exists = prev.some((item) => item.id === parsed.id);
              if (exists) return prev;
              return [parsed, ...prev].slice(0, 50);
            });
          }
        } catch {}
      };

      eventSource.onerror = () => {
        setIsConnectedSSE(false);
      };
    } catch {
      setIsConnectedSSE(false);
    }

    const interval = setInterval(fetchEvents, 8000);

    return () => {
      clearInterval(interval);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const filteredEvents = events.filter((ev) => {
    if (filter === 'all') return true;
    return ev.contractName === filter || ev.eventType.includes(filter);
  });

  const getEventBadge = (type: string) => {
    if (type.includes('designer')) {
      return {
        label: 'Designer Atelier',
        color: 'text-amber-400 bg-amber-950/60 border-amber-800',
      };
    }
    if (type.includes('passport')) {
      return {
        label: 'Product Passport',
        color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
      };
    }
    if (type.includes('escrow')) {
      return {
        label: 'Fashion Escrow',
        color: 'text-blue-400 bg-blue-950/60 border-blue-800',
      };
    }
    return {
      label: 'Protocol Event',
      color: 'text-stone-400 bg-stone-900 border-stone-800',
    };
  };

  return (
    <section className="bg-stone-900/70 border border-stone-800 rounded-2xl p-6 lg:p-8 backdrop-blur-md shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Live State Synchronization
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnectedSSE ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {isConnectedSSE ? 'SSE Stream Connected' : 'Polling Sync Active'}
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-100 mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-amber-400" />
            Real-Time Soroban Contract Event Stream
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Live blockchain events emitted by deployed Stellar Threads smart contracts. Normalized,
            deduplicated, and synchronized in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-stone-950 border border-stone-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'all' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('designer_registry')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'designer_registry' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Designers
            </button>
            <button
              onClick={() => setFilter('product_passport')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'product_passport' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Passports
            </button>
            <button
              onClick={() => setFilter('fashion_escrow')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'fashion_escrow' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Escrow
            </button>
          </div>

          <button
            onClick={fetchEvents}
            disabled={isLoading}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
            title="Manual sync"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="mt-6">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-stone-500 rounded-xl bg-stone-950/50 border border-stone-800/80">
            <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">Listening for Soroban Contract Events...</p>
            <p className="text-xs text-stone-600 mt-1">
              Events will appear here as transactions are confirmed on Stellar Testnet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((ev) => {
              const badge = getEventBadge(ev.eventType);
              return (
                <div
                  key={ev.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-stone-950/70 border border-stone-800/90 hover:border-amber-500/30 transition gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-amber-400" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs font-semibold text-stone-200">
                          {ev.eventType.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-[11px] font-mono text-stone-500">
                          Ledger #{ev.ledger}
                        </span>
                      </div>

                      <div className="mt-1 text-xs text-stone-400 font-mono">
                        {ev.data && typeof ev.data === 'object' ? (
                          <div className="text-[11px] text-stone-300 flex flex-wrap gap-2">
                            {Object.entries(ev.data).map(([k, v]) => (
                              <span key={k} className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                                <span className="text-stone-500">{k}:</span> {String(v)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span>{String(ev.data)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center md:flex-col md:items-end justify-between text-right gap-1 pt-2 md:pt-0 border-t md:border-t-0 border-stone-800/80">
                    <span className="text-[10px] text-stone-500">
                      {new Date(ev.ledgerClosedAt || ev.indexedAt).toLocaleTimeString()}
                    </span>
                    {ev.txHash ? (
                      <a
                        href={getTxExplorerUrl(ev.txHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
                      >
                        {shortenHash(ev.txHash, 5)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-stone-600">Verified</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
