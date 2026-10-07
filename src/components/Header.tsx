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
    <header className="border-b px-4 py-2.5 flex flex-col gap-2.5 transition-colors border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)]">
      {/* Top Bar Status & System Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-base">
        {/* Brand Lockup: WebScanner Audit */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 border bg-[var(--color-control-background)] border-[var(--color-control-border)] text-[var(--color-accent)]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-base text-[var(--color-text-primary)]">
                WebScanner Audit
              </span>
              <span className="text-sm px-1.5 py-0.2 bg-[var(--color-control-selected-background)] border border-[var(--color-control-selected-border)] text-[var(--color-control-selected-foreground)]">
                SECURITY & CRO RADAR
              </span>
            </div>
            <div className="text-sm flex items-center gap-1.5 text-[var(--color-text-secondary)]">
              <span>FINGERPRINTING: WAPPALYZER OPEN SOURCE</span>
              <span>·</span>
              <span className="text-[var(--color-success)]">OSV.DEV & OBSERVATORY</span>
            </div>
          </div>
        </div>

        {/* Live System Telemetry & Theme Switcher */}
        <div className="flex items-center gap-3 text-base">
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 border bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]">
            <Cpu className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>RAM:</span>
            <span className="tabular-nums font-bold text-sm font-mono text-[var(--color-text-primary)]">
              {systemHealth ? `${systemHealth.memoryMb.heapUsed}MB` : '28MB'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 border bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]">
            <Zap className="w-3.5 h-3.5 text-[var(--color-warning)]" />
            <span>FORKS:</span>
            <span className="tabular-nums font-bold text-sm font-mono text-[var(--color-text-primary)]">
              {totalForks}
            </span>
          </div>

          {/* Theme Selector Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 border cursor-pointer transition-colors bg-[var(--color-control-background)] hover:bg-[var(--color-control-hover-background)] border-[var(--color-control-border)] hover:border-[var(--color-control-hover-border)] text-[var(--color-control-foreground)] hover:text-[var(--color-control-hover-foreground)]"
            title={isDark ? 'Cambiar a Modo Claro (Reporte Limpio)' : 'Cambiar a Modo Oscuro (Terminal Cyberpunk)'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[var(--color-warning)]" />
                <span className="text-base font-bold">MODO CLARO</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span className="text-base font-bold">MODO OSCURO</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* URL Input Bar & Exploraciones Relacionadas */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex items-center border transition-colors bg-[var(--color-control-background)] border-[var(--color-control-border)] focus-within:border-[var(--color-control-focus-border)]"
        >
          <div className="px-3 flex items-center gap-1.5 border-r text-[var(--color-accent)] border-[var(--color-border)]">
            <Globe className="w-3.5 h-3.5" />
            <span className="text-sm font-mono font-semibold">TARGET_URL</span>
          </div>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://ejemplo.com o selecciona una exploración..."
            className="flex-1 bg-transparent px-3 py-1.5 text-base font-mono text-[var(--color-control-foreground)] placeholder:text-[var(--color-text-secondary)]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputUrl.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 text-base font-bold transition-colors cursor-pointer bg-[var(--color-accent)] hover:brightness-90 text-[var(--color-background)] disabled:bg-[var(--color-control-disabled-background)] disabled:text-[var(--color-control-disabled-foreground)] disabled:border-[var(--color-control-disabled-border)] disabled:cursor-not-allowed"
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
        <div className="flex items-center gap-1.5 overflow-x-auto text-base pb-1 lg:pb-0">
          <div className="flex items-center gap-1 text-base font-semibold whitespace-nowrap pl-1 text-[var(--color-text-secondary)]">
            <History className="w-3 h-3 text-[var(--color-accent)]" />
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
                className="px-2 py-0.5 border whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer text-base bg-[var(--color-control-background)] hover:bg-[var(--color-control-hover-background)] border-[var(--color-control-border)] hover:border-[var(--color-control-hover-border)] text-[var(--color-control-foreground)] hover:text-[var(--color-control-hover-foreground)]"
                title={`${exp.url} (${exp.title || 'Sin título'}) - ${exp.scannedAt}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isCritical ? 'bg-[var(--color-error)]' : isWarn ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-success)]'
                }`}></span>
                <span className="font-medium truncate max-w-[130px]">
                  {exp.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </span>
                <span className={`font-bold tabular-nums text-sm font-mono ${
                  isCritical ? 'text-[var(--color-error)]' : isWarn ? 'text-[var(--color-warning)]' : 'text-[var(--color-success)]'
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
