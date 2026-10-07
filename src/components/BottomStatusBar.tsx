import React, { useState } from 'react';
import { Send, HardDrive, Wifi } from 'lucide-react';

interface BottomStatusBarProps {
  onExecuteCommand: (cmd: string) => void;
  statusText: string;
  totalForks: number;
  memoryMb?: number;
  theme?: 'dark' | 'light';
}

export const BottomStatusBar: React.FC<BottomStatusBarProps> = ({
  onExecuteCommand,
  statusText,
  totalForks,
  memoryMb = 34,
  theme = 'dark',
}) => {
  const [command, setCommand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onExecuteCommand(command.trim());
      setCommand('');
    }
  };

  return (
    <footer data-theme={theme} className="border-t text-base select-none transition-colors border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
      {/* Interactive Command Prompt Line */}
      <div className="flex items-center px-3 py-1.5 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
        <span className="text-sm font-mono text-[var(--color-success)] font-bold">scan@webscanner</span>
        <span className="text-sm font-mono text-[var(--color-text-secondary)]">:</span>
        <span className="text-sm font-mono text-[var(--color-accent)] font-bold">~</span>
        <span className="mr-2 text-sm font-mono text-[var(--color-text-secondary)]">$</span>

        <form onSubmit={handleSubmit} className="flex-1 flex items-center">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="escribe un comando ('help', 'audit <url>', 'quote', 'tree', 'security', 'tech')..."
            className="flex-1 bg-transparent text-base font-mono text-[var(--color-control-foreground)] placeholder:text-[var(--color-text-secondary)]"
          />
          <button
            type="submit"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] px-2 cursor-pointer transition-colors"
            title="Ejecutar comando"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick shortcut tags */}
        <div className="hidden md:flex items-center gap-1.5 text-base">
          <span className="text-[var(--color-text-secondary)]">Atajos:</span>
          {(['help', 'tree', 'tech', 'security', 'cro', 'quote'] as const).map((c) => (
            <button
              key={c}
              onClick={() => onExecuteCommand(c)}
              className="px-1.5 py-0.2 border transition-colors cursor-pointer text-base font-mono bg-[var(--color-control-background)] hover:bg-[var(--color-control-hover-background)] border-[var(--color-control-border)] hover:border-[var(--color-control-hover-border)] text-[var(--color-control-foreground)] hover:text-[var(--color-control-hover-foreground)]"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Telemetry Status Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-1 text-base">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]"></span>
            <span className="text-[var(--color-text-primary)]">{statusText}</span>
          </div>
          <span>·</span>
          <span className="hidden sm:inline text-sm font-mono">ENGINE: WAPPALYZER_OSV_AUTONOMOUS</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-[var(--color-accent)]" />
            <span>RAM: <strong className="font-mono text-[var(--color-text-primary)]">{memoryMb} MB</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-[var(--color-success)]" />
            <span>PORT: <strong className="font-mono text-[var(--color-text-primary)]">3000</strong></span>
          </div>
          <div>
            <span>FORKS: <strong className="font-mono text-[var(--color-warning)]">{totalForks}</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
