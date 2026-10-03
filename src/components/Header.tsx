import React, { useState } from 'react';
import {
  Terminal,
  Activity,
  Cpu,
  Globe,
  Play,
  RotateCw,
  Sun,
  Moon,
  Zap,
  History,
  Search,
} from 'lucide-react';
import { RecentExploration } from '../types/audit.js';

interface HeaderProps {
  currentUrl: string;
  isLoading: boolean;
  onRunAudit: (url: string) => void;
  recentExplorations: RecentExploration[];
  onSelectExploration: (item: RecentExploration) => void;
  systemHealth?: {
    memoryMb: { heapUsed: number; rss: number };
    uptimeSeconds: number;
  };
  totalForks: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUrl,
  isLoading,
  onRunAudit,
  recentExplorations,
  onSelectExploration,
  systemHealth,
  totalForks,
  theme,
  onToggleTheme,
}) => {
  const [inputUrl, setInputUrl] = useState(currentUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onRunAudit(inputUrl.trim());
    }
  };

  const isDark = theme === 'dark';

  return (
    <header className={`border-b px-4 py-2.5 flex flex-col gap-2.5 transition-colors ${
      isDark ? 'border-[#21262D] bg-[#0D1117] text-[#C9D1D9]' : 'border-slate-200 bg-white text-slate-800'
    }`}>
      {/* Top Bar Status & System Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Brand Lockup: WebScanner Audit */}
        <div className="flex items-center gap-2.5">
          <div className={`flex items-center justify-center w-7 h-7 border ${
            isDark ? 'bg-[#161B22] border-[#30363D] text-[#56D4DD]' : 'bg-slate-100 border-slate-300 text-teal-600'
          }`}>
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold tracking-wider text-sm ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                WebScanner Audit
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 font-mono ${
                isDark ? 'text-[#56D4DD] bg-[#56D4DD]/10 border border-[#56D4DD]/30' : 'text-teal-700 bg-teal-50 border border-teal-200'
              }`}>
                SECURITY & CRO RADAR
              </span>
            </div>
            <div className={`text-[10px] flex items-center gap-1.5 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
              <span>FINGERPRINTING: WAPPALYZER OPEN SOURCE</span>
              <span>·</span>
              <span className={isDark ? 'text-[#3FB950]' : 'text-emerald-600'}>OSV.DEV & OBSERVATORY</span>
            </div>
          </div>
        </div>

        {/* Live System Telemetry & Theme Switcher */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className={`hidden md:flex items-center gap-1.5 px-2 py-1 border ${
            isDark ? 'bg-[#161B22] border-[#21262D] text-[#8B949E]' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <Cpu className={`w-3.5 h-3.5 ${isDark ? 'text-[#56D4DD]' : 'text-teal-600'}`} />
            <span>RAM:</span>
            <span className={`tabular-nums font-bold ${isDark ? 'text-[#C9D1D9]' : 'text-slate-800'}`}>
              {systemHealth ? `${systemHealth.memoryMb.heapUsed}MB` : '28MB'}
            </span>
          </div>

          <div className={`hidden md:flex items-center gap-1.5 px-2 py-1 border ${
            isDark ? 'bg-[#161B22] border-[#21262D] text-[#8B949E]' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <Zap className={`w-3.5 h-3.5 ${isDark ? 'text-[#D29922]' : 'text-amber-600'}`} />
            <span>FORKS:</span>
            <span className={`tabular-nums font-bold ${isDark ? 'text-[#C9D1D9]' : 'text-slate-800'}`}>
              {totalForks}
            </span>
          </div>

          {/* Theme Selector Toggle */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1 border cursor-pointer transition-colors ${
              isDark
                ? 'bg-[#161B22] hover:bg-[#21262D] border-[#30363D] text-[#C9D1D9]'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
            }`}
            title={isDark ? 'Cambiar a Modo Claro (Reporte Limpio)' : 'Cambiar a Modo Oscuro (Terminal Cyberpunk)'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#D29922]" />
                <span className="text-[10px] font-bold">MODO CLARO</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[10px] font-bold">MODO OSCURO</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* URL Input Bar & Exploraciones Relacionadas */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
        <form
          onSubmit={handleSubmit}
          className={`flex-1 flex items-center border transition-colors ${
            isDark
              ? 'bg-[#161B22] border-[#30363D] focus-within:border-[#56D4DD]'
              : 'bg-slate-50 border-slate-300 focus-within:border-teal-600'
          }`}
        >
          <div className={`px-3 flex items-center gap-1.5 border-r ${
            isDark ? 'text-[#56D4DD] border-[#21262D]' : 'text-teal-700 border-slate-200'
          }`}>
            <Globe className="w-3.5 h-3.5" />
            <span className="text-xs font-mono font-semibold">TARGET_URL</span>
          </div>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://ejemplo.com o selecciona una exploración..."
            className={`flex-1 bg-transparent px-3 py-1.5 text-xs font-mono outline-none ${
              isDark ? 'text-[#F0F6FC] placeholder:text-[#484F58]' : 'text-slate-900 placeholder:text-slate-400'
            }`}
          />
          <button
            type="submit"
            disabled={isLoading || !inputUrl.trim()}
            className={`flex items-center gap-1.5 px-4 py-1.5 font-mono text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${
              isDark
                ? 'bg-[#56D4DD] hover:bg-[#48b9c2] disabled:bg-[#21262D] text-[#0D1117]'
                : 'bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white'
            }`}
          >
            {isLoading ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>ESCANEANDO...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>AUDITAR SITIO</span>
              </>
            )}
          </button>
        </form>

        {/* Section: Exploraciones Relacionadas (Max 5 Recent/Suggested) */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono pb-1 lg:pb-0">
          <div className={`flex items-center gap-1 text-[10px] font-semibold whitespace-nowrap pl-1 ${
            isDark ? 'text-[#8B949E]' : 'text-slate-500'
          }`}>
            <History className="w-3 h-3 text-[#56D4DD]" />
            <span>EXPLORACIONES RELACIONADAS:</span>
          </div>
          {recentExplorations.slice(0, 5).map((exp, idx) => {
            const isCritical = exp.score < 50;
            const isWarn = exp.score >= 50 && exp.score < 75;

            return (
              <button
                key={idx}
                onClick={() => {
                  setInputUrl(exp.url);
                  onSelectExploration(exp);
                }}
                className={`px-2 py-0.5 border whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer text-[10px] ${
                  isDark
                    ? 'bg-[#161B22] hover:bg-[#21262D] border-[#30363D] hover:border-[#56D4DD] text-[#C9D1D9]'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-teal-500 text-slate-700'
                }`}
                title={`${exp.url} (${exp.title || 'Sin título'}) - ${exp.scannedAt}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isCritical ? 'bg-[#F85149]' : isWarn ? 'bg-[#D29922]' : 'bg-[#3FB950]'
                }`}></span>
                <span className="font-medium truncate max-w-[130px]">
                  {exp.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </span>
                <span className={`font-bold tabular-nums text-[9px] ${
                  isCritical ? 'text-[#F85149]' : isWarn ? 'text-[#D29922]' : 'text-[#3FB950]'
                }`}>
                  {exp.score}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
