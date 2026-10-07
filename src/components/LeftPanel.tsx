import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Terminal as TerminalIcon,
  Shield,
  Zap,
  Layers,
  MousePointerClick,
  Filter,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ExternalLink,
  Bot,
} from 'lucide-react';
import {
  AuditIssue,
  AuditScoreBreakdown,
  SessionLogEntry,
} from '../types/audit.js';
import { getPlainExplanationForIssue } from '../utils/plainExplainer.js';
import { IssueExplainerModal } from './IssueExplainerModal.js';

interface LeftPanelProps {
  scores: AuditScoreBreakdown;
  issues: AuditIssue[];
  logs: SessionLogEntry[];
  isLoading: boolean;
  onSelectIssue?: (issue: AuditIssue) => void;
  onGoToQuote?: () => void;
  theme?: 'dark' | 'light';
  onAskAi?: (prompt: string) => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  scores,
  issues,
  logs,
  isLoading,
  onSelectIssue,
  onGoToQuote,
  theme = 'dark',
  onAskAi,
}) => {
  const [logFilter, setLogFilter] = useState<'ALL' | 'ERROR' | 'WARN' | 'AGENT'>('ALL');
  const [isPlainMode, setIsPlainMode] = useState<boolean>(true);
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);
  const [activeModalIssue, setActiveModalIssue] = useState<AuditIssue | null>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const criticalIssues = issues.filter((i) => i.severity === 'critical');
  const warningIssues = issues.filter((i) => i.severity === 'warning');

  const filteredLogs = logs.filter((l) => {
    if (logFilter === 'ALL') return true;
    if (logFilter === 'ERROR') return l.level === 'error';
    if (logFilter === 'WARN') return l.level === 'warn';
    if (logFilter === 'AGENT') return l.level === 'agent' || l.level === 'success';
    return true;
  });

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedIssueId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <aside className={`w-full lg:w-96 flex flex-col border-r h-full overflow-hidden transition-colors ${
        'border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)]'
      }`}>
        {/* 1. HEALTH SCORE & METRICS OVERVIEW */}
        <div className={`p-3.5 border-b transition-colors ${
            'border-[var(--color-border)] bg-[var(--color-surface)]'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-base tracking-wider uppercase font-semibold text-[var(--color-text-secondary)]">
              ESTADO DE SALUD DEL SITIO
            </span>
            <span
              className="text-base px-2 py-0.5 font-bold border uppercase tracking-wider"
              style={{
                color: scores.colorHex,
                borderColor: scores.colorHex,
                backgroundColor: `${scores.colorHex}15`,
              }}
            >
              {scores.ratingLevel}
            </span>
          </div>

          {/* Global Score Number */}
          <div className="flex items-end gap-3 my-2">
            <div
              className="text-4xl font-extrabold tabular-nums tracking-tighter"
              style={{ color: scores.colorHex }}
            >
              {scores.overall}
            </div>
            <div className="text-base pb-1 text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-text-primary)]">/ 100</span> ÍNDICE GLOBAL CRO
            </div>
          </div>

          {/* Sub-Score Bars */}
          <div className="space-y-1.5 mt-3 pt-2 border-t border-[var(--color-border)]">
            {/* Performance */}
            <div className="flex items-center justify-between text-base">
              <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                <Zap className="w-3 h-3 text-[#D29922]" /> Rendimiento & Red
              </span>
              <span className="tabular-nums font-bold text-[var(--color-text-primary)]">
                {scores.performance}%
              </span>
            </div>
            <div className={`w-full h-1 ${isDark ? 'bg-[#21262D]' : 'bg-slate-200'}`}>
              <div
                className="h-1 bg-[#D29922] transition-all duration-500"
                style={{ width: `${scores.performance}%` }}
              ></div>
            </div>

            {/* Tech Stack */}
            <div className="flex items-center justify-between text-base pt-1">
              <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                <Layers className="w-3 h-3 text-[#56D4DD]" /> Stack & Estándares
              </span>
              <span className="tabular-nums font-bold text-[var(--color-text-primary)]">
                {scores.tech}%
              </span>
            </div>
            <div className={`w-full h-1 ${isDark ? 'bg-[#21262D]' : 'bg-slate-200'}`}>
              <div
                className="h-1 bg-[#56D4DD] transition-all duration-500"
                style={{ width: `${scores.tech}%` }}
              ></div>
            </div>

            {/* CRO */}
            <div className="flex items-center justify-between text-base pt-1">
              <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                <MousePointerClick className="w-3 h-3 text-[#3FB950]" /> Conversión (CRO)
              </span>
              <span className="tabular-nums font-bold text-[var(--color-text-primary)]">{scores.cro}%</span>
            </div>
            <div className={`w-full h-1 ${isDark ? 'bg-[#21262D]' : 'bg-slate-200'}`}>
              <div
                className="h-1 bg-[#3FB950] transition-all duration-500"
                style={{ width: `${scores.cro}%` }}
              ></div>
            </div>

            {/* Security */}
            <div className="flex items-center justify-between text-base pt-1">
              <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                <Shield className="w-3 h-3 text-[#8B949E]" /> Seguridad & SSL
              </span>
              <span className="tabular-nums font-bold text-[var(--color-text-primary)]">
                {scores.security}%
              </span>
            </div>
            <div className={`w-full h-1 ${isDark ? 'bg-[#21262D]' : 'bg-slate-200'}`}>
              <div
                className="h-1 bg-[#8B949E] transition-all duration-500"
                style={{ width: `${scores.security}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 2. REGISTRO DE ERRORES & HALLAZGOS */}
        <div className="p-3 border-b max-h-72 overflow-y-auto border-[var(--color-border)]">
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
            <span className="text-base tracking-wider uppercase font-semibold text-[var(--color-text-secondary)]">
              REGISTRO DE HALLAZGOS
            </span>

            <button
              onClick={() => setIsPlainMode(!isPlainMode)}
              className={`flex items-center gap-1 px-1.5 py-0.5 text-base font-bold border transition-colors cursor-pointer ${
                isPlainMode
                  ? 'bg-[var(--color-control-selected-background)] border-[var(--color-control-selected-border)] text-[var(--color-control-selected-foreground)]'
                  : 'bg-[var(--color-control-background)] border-[var(--color-control-border)] text-[var(--color-control-foreground)]'
              }`}
            >
              <Lightbulb className="w-3 h-3" />
              <span>{isPlainMode ? 'MODO FÁCIL (ACTIVO)' : 'MODO TÉCNICO'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {issues.map((issue) => {
              const plain = getPlainExplanationForIssue(issue);
              const isExpanded = expandedIssueId === issue.id;
              const isCritical = issue.severity === 'critical';

              return (
                <div
                  key={issue.id}
                  className={`border transition-all duration-150 ${
                    isCritical
                      ? 'bg-[var(--color-surface)] border-l-4 border-l-[var(--color-error)] border-y-[var(--color-border)] border-r-[var(--color-border)]'
                      : 'bg-[var(--color-surface)] border-l-4 border-l-[var(--color-warning)] border-y-[var(--color-border)] border-r-[var(--color-border)]'
                  }`}
                >
                  <div
                    onClick={() => onSelectIssue && onSelectIssue(issue)}
                    className="p-2 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <div className="flex items-start justify-between gap-1 text-base font-bold">
                      <span className={isCritical ? 'text-[var(--color-error)] underline decoration-2 underline-offset-2' : 'text-[var(--color-warning)]'}>
                        {isPlainMode ? plain.simpleTitle : issue.title}
                      </span>
                      <span
                        className={`text-sm px-1 shrink-0 ${
                          isCritical
                            ? 'bg-[var(--color-error-subtle)] text-[var(--color-error)]'
                            : 'bg-[var(--color-surface-raised)] text-[var(--color-warning)]'
                        }`}
                      >
                        -{issue.impactScore}pts
                      </span>
                    </div>

                    <p className="text-base mt-1 line-clamp-2 text-[var(--color-text-secondary)]">
                      {isPlainMode ? `💡 ${plain.analogy}` : issue.description}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t text-base border-[var(--color-border)]">
                      <button
                        onClick={(e) => toggleExpand(e, issue.id)}
                        className="text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3 h-3" />
                            <span>Plegar explicación</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            <span>¿Por qué pasa esto? (Expandir)</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalIssue(issue);
                        }}
                        className="text-[var(--color-warning)] hover:underline flex items-center gap-1 cursor-pointer bg-[var(--color-surface-raised)] px-1.5 py-0.5"
                      >
                        <Lightbulb className="w-3 h-3" />
                        <span>Ventana completa</span>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={`p-3 border-t space-y-2 text-[10px] leading-relaxed animate-in fade-in duration-150 ${
                      isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className={`p-2 border ${isDark ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-slate-300'}`}>
                        <span className="text-[#56D4DD] font-bold block mb-0.5">
                          🗣️ Ejemplo de la vida cotidiana:
                        </span>
                        <p className={`italic ${isDark ? 'text-[#F0F6FC]' : 'text-slate-800'}`}>"{plain.analogy}"</p>
                      </div>

                      <div>
                        <span className="text-[#F85149] font-bold block mb-0.5">
                          📉 ¿Cómo te afecta en ventas y clientes?:
                        </span>
                        <p className={isDark ? 'text-[#C9D1D9]' : 'text-slate-700'}>{plain.businessImpact}</p>
                      </div>

                      <div>
                        <span className="text-[#3FB950] font-bold block mb-0.5">
                          🛠️ ¿Cómo lo arreglamos en el rediseño?:
                        </span>
                        <p className={isDark ? 'text-[#C9D1D9]' : 'text-slate-700'}>{plain.simpleFix}</p>
                      </div>

                      <button
                        onClick={() => setActiveModalIssue(issue)}
                        className={`w-full text-center py-1 mt-1 font-bold text-[9px] cursor-pointer transition-colors ${
                          isDark ? 'bg-[#21262D] hover:bg-[#30363D] text-[#56D4DD]' : 'bg-slate-200 hover:bg-slate-300 text-teal-800'
                        }`}
                      >
                        Ver detalles técnicos y evidencia completa ➜
                      </button>

                      {onAskAi && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAskAi(`¿Cómo puedo solucionar a nivel de código o configuración el siguiente hallazgo detectado en la auditoría?: "${issue.title}". Descripción técnica: ${issue.description}. Recomendación inicial: ${issue.recommendation}.`);
                          }}
                          className={`w-full text-center py-1 mt-1 font-bold text-[9px] cursor-pointer transition-colors flex items-center justify-center gap-1 ${
                            isDark ? 'bg-[#56D4DD]/15 hover:bg-[#56D4DD]/25 text-[#56D4DD] border border-[#56D4DD]/30' : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                          }`}
                        >
                          <Bot className="w-3 h-3" />
                          <span>Consultar solución con Asistente IA ➜</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. TERMINAL SESSION LOG */}
        <div className={`flex-1 flex flex-col min-h-0 ${isDark ? 'bg-[#0A0D12]' : 'bg-slate-100'}`}>
          <div className={`px-3 py-2 border-b flex items-center justify-between ${
            isDark ? 'border-[#21262D] bg-[#161B22]' : 'border-slate-200 bg-white'
          }`}>
            <div className={`flex items-center gap-1.5 text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-600'}`}>
              <TerminalIcon className="w-3.5 h-3.5 text-[#56D4DD]" />
              <span className={`font-semibold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>SESSION_LOG</span>
              <span className="text-[9px] text-[#56D4DD]">({logs.length})</span>
            </div>

            <div className="flex items-center gap-1 text-[9px]">
              {(['ALL', 'ERROR', 'WARN', 'AGENT'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLogFilter(mode)}
                  className={`px-1.5 py-0.5 cursor-pointer transition-colors ${
                    logFilter === mode
                      ? isDark ? 'bg-[#30363D] text-[#56D4DD] font-bold' : 'bg-slate-300 text-slate-900 font-bold'
                      : isDark ? 'text-[#8B949E] hover:text-[#C9D1D9]' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={logsContainerRef}
            className="flex-1 p-2.5 overflow-y-auto space-y-1.5 text-[10px] leading-relaxed font-mono select-text"
          >
            {filteredLogs.length === 0 ? (
              <div className={`italic py-4 text-center ${isDark ? 'text-[#8B949E]' : 'text-slate-400'}`}>
                Sin registros en este filtro.
              </div>
            ) : (
              filteredLogs.map((log) => {
                let badgeColor = isDark ? 'text-[#8B949E]' : 'text-slate-500';
                if (log.level === 'error') badgeColor = 'text-[#F85149] font-bold';
                else if (log.level === 'warn') badgeColor = 'text-[#D29922] font-semibold';
                else if (log.level === 'success') badgeColor = 'text-[#3FB950] font-semibold';
                else if (log.level === 'agent') badgeColor = 'text-[#56D4DD] font-bold';

                return (
                  <div key={log.id} className={`border-b pb-1 ${isDark ? 'border-[#21262D]/40' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-1">
                      <span className={isDark ? 'text-[#484F58]' : 'text-slate-400'}>{log.timestamp}</span>
                      <span className="text-[#56D4DD]">[{log.agent}]</span>
                      <span className={badgeColor}>[{log.level.toUpperCase()}]</span>
                    </div>
                    <div className={`pl-2 ${isDark ? 'text-[#C9D1D9]' : 'text-slate-800'}`}>{log.message}</div>
                    {log.detail && (
                      <div className={`pl-4 text-[9px] italic ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                        ↳ {log.detail}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            {isLoading && (
              <div className="flex items-center gap-2 text-[#56D4DD] py-1 animate-pulse">
                <span className="animate-cursor">▋</span>
                <span>Procesando subagentes paralelos...</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      <IssueExplainerModal
        issue={activeModalIssue}
        onClose={() => setActiveModalIssue(null)}
        onGoToQuote={onGoToQuote}
        onAskAi={onAskAi}
      />
    </>
  );
};
