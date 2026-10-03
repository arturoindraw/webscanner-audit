import React from 'react';
import {
  X,
  Lightbulb,
  AlertTriangle,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  CheckCircle2,
  Bot,
} from 'lucide-react';
import { AuditIssue } from '../types/audit.js';
import { getPlainExplanationForIssue } from '../utils/plainExplainer.js';

interface IssueExplainerModalProps {
  issue: AuditIssue | null;
  onClose: () => void;
  onGoToQuote?: () => void;
  onAskAi?: (prompt: string) => void;
}

export const IssueExplainerModal: React.FC<IssueExplainerModalProps> = ({
  issue,
  onClose,
  onGoToQuote,
  onAskAi,
}) => {
  if (!issue) return null;

  const plain = getPlainExplanationForIssue(issue);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-mono text-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0D1117] border border-[#30363D] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header with Switcher Badge */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#161B22] border-b border-[#21262D]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#D29922]/15 border border-[#D29922]/30 flex items-center justify-center text-[#D29922]">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-[#56D4DD] uppercase tracking-wider font-bold">
                TRADUCTOR TÉCNICO ➜ MODO NEGOCIO
              </span>
              <div className="text-xs font-bold text-[#F0F6FC]">
                Explicación para Personas del Común
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#8B949E] hover:text-[#F0F6FC] p-1 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-[#C9D1D9] leading-relaxed">
          {/* Plain Title & Urgency Banner */}
          <div className="p-3.5 bg-[#161B22] border-l-4 border-l-[#D29922] border-y border-r border-[#21262D]">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] text-[#D29922] font-bold uppercase tracking-wider">
                {plain.urgencyPlain}
              </span>
              <span className="text-[10px] text-[#8B949E] tabular-nums">
                Penalización: -{issue.impactScore} pts
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#F0F6FC]">
              {plain.simpleTitle}
            </h3>
            <div className="text-[10px] text-[#8B949E] mt-1">
              <strong>Término técnico original:</strong> {issue.title}
            </div>
          </div>

          {/* 1. Real Life Analogy Box */}
          <div className="p-4 bg-[#161B22]/70 border border-[#30363D] relative">
            <div className="flex items-center gap-2 text-xs font-bold text-[#56D4DD] mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>¿CÓMO ENTENDERLO? (EJEMPLO DE LA VIDA REAL)</span>
            </div>
            <p className="text-[11px] text-[#F0F6FC] italic bg-[#0D1117] p-3 border border-[#21262D] rounded-none leading-relaxed">
              "{plain.analogy}"
            </p>
          </div>

          {/* 2. Business Impact: Money & Clients */}
          <div className="p-4 bg-[#F85149]/5 border border-[#F85149]/30">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F85149] mb-1.5">
              <TrendingDown className="w-4 h-4" />
              <span>¿CÓMO AFECTA A TUS VENTAS Y A TUS CLIENTES?</span>
            </div>
            <p className="text-[11px] text-[#C9D1D9] leading-relaxed">
              {plain.businessImpact}
            </p>
          </div>

          {/* 3. The Solution in Plain Words */}
          <div className="p-4 bg-[#3FB950]/5 border border-[#3FB950]/30">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3FB950] mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>¿CÓMO LO SOLUCIONAMOS EN EL REDISEÑO?</span>
            </div>
            <p className="text-[11px] text-[#C9D1D9] leading-relaxed">
              {plain.simpleFix}
            </p>
          </div>

          {/* Technical Evidence Accordion / Dropdown */}
          <details className="group border border-[#21262D] bg-[#161B22]/40 text-[10px]">
            <summary className="px-3 py-2 text-[#8B949E] cursor-pointer hover:text-[#C9D1D9] select-none flex items-center justify-between">
              <span>Ver evidencia técnica interna (Código y rastros en el servidor)</span>
              <span className="text-[#56D4DD] group-open:rotate-90 transition-transform">▸</span>
            </summary>
            <div className="p-3 border-t border-[#21262D] space-y-2 bg-[#0D1117]">
              <div>
                <span className="text-[#8B949E]">Diagnóstico crudo del motor:</span>
                <p className="text-[#C9D1D9] mt-0.5">{issue.description}</p>
              </div>
              <div>
                <span className="text-[#8B949E]">Evidencia detectada en el DOM/Socket:</span>
                <pre className="bg-[#161B22] p-2 mt-0.5 text-[#56D4DD] text-[9px] overflow-x-auto">
                  {issue.evidence}
                </pre>
              </div>
            </div>
          </details>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-[#161B22] border-t border-[#21262D] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] text-[#8B949E]">
            Este punto está contemplado en la cotización automática.
          </span>

          <div className="flex items-center gap-2">
            {onAskAi && (
              <button
                onClick={() => {
                  onClose();
                  onAskAi(`¿Cómo puedo solucionar de forma técnica y con código el siguiente problema?: "${issue.title}". Descripción: ${issue.description}. Recomendación: ${issue.recommendation}.`);
                }}
                className="px-3 py-1.5 bg-[#56D4DD]/20 hover:bg-[#56D4DD]/30 text-[#56D4DD] border border-[#56D4DD]/40 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>SOLUCIÓN CON IA</span>
              </button>
            )}

            {onGoToQuote && (
              <button
                onClick={() => {
                  onClose();
                  onGoToQuote();
                }}
                className="px-3 py-1.5 bg-[#3FB950] hover:bg-[#349e44] text-[#0D1117] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>VER EN LA COTIZACIÓN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] text-xs transition-colors cursor-pointer"
            >
              CERRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
