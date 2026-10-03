import React, { useState } from 'react';
import { Terminal, Send, HelpCircle, HardDrive, Wifi } from 'lucide-react';

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

  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onExecuteCommand(command.trim());
      setCommand('');
    }
  };

  return (
    <footer className={`border-t text-xs font-mono select-none transition-colors ${
      isDark ? 'border-[#21262D] bg-[#0A0D12] text-[#8B949E]' : 'border-slate-200 bg-slate-100 text-slate-600'
    }`}>
      {/* Interactive Command Prompt Line */}
      <div className={`flex items-center px-3 py-1.5 border-b ${
        isDark ? 'border-[#21262D]/60 bg-[#161B22]/60' : 'border-slate-200 bg-white'
      }`}>
        <span className="text-[#3FB950] font-bold">scan@webscanner</span>
        <span className={isDark ? 'text-[#8B949E]' : 'text-slate-400'}>:</span>
        <span className="text-[#56D4DD] font-bold">~</span>
        <span className={`mr-2 ${isDark ? 'text-[#8B949E]' : 'text-slate-400'}`}>$</span>

        <form onSubmit={handleSubmit} className="flex-1 flex items-center">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="escribe un comando ('help', 'audit <url>', 'quote', 'tree', 'security', 'tech')..."
            className={`flex-1 bg-transparent outline-none text-xs font-mono ${
              isDark ? 'text-[#F0F6FC] placeholder:text-[#484F58]' : 'text-slate-900 placeholder:text-slate-400'
            }`}
          />
          <button
            type="submit"
            className="text-[#8B949E] hover:text-[#56D4DD] px-2 cursor-pointer transition-colors"
            title="Ejecutar comando"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick shortcut tags */}
        <div className="hidden md:flex items-center gap-1.5 text-[10px]">
          <span className={isDark ? 'text-[#484F58]' : 'text-slate-400'}>Atajos:</span>
          {(['help', 'tree', 'tech', 'security', 'cro', 'quote'] as const).map((c) => (
            <button
              key={c}
              onClick={() => onExecuteCommand(c)}
              className={`px-1.5 py-0.2 border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#161B22] border-[#30363D] hover:border-[#56D4DD] text-[#8B949E] hover:text-[#56D4DD]'
                  : 'bg-slate-50 border-slate-200 hover:border-teal-500 text-slate-600 hover:text-teal-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Telemetry Status Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-1 text-[11px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950]"></span>
            <span className={isDark ? 'text-[#C9D1D9]' : 'text-slate-800'}>{statusText}</span>
          </div>
          <span>·</span>
          <span className="hidden sm:inline">ENGINE: WAPPALYZER_OSV_AUTONOMOUS</span>
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-[#56D4DD]" />
            <span>RAM: <strong className={isDark ? 'text-[#C9D1D9]' : 'text-slate-800'}>{memoryMb} MB</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-[#3FB950]" />
            <span>PORT: <strong className={isDark ? 'text-[#C9D1D9]' : 'text-slate-800'}>3000</strong></span>
          </div>
          <div>
            <span>FORKS: <strong className="text-[#D29922]">{totalForks}</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
