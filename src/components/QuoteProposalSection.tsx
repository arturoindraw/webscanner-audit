import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Copy,
  Check,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { QuoteLineItem, QuoteProposal } from '../types/audit.js';

interface QuoteProposalSectionProps {
  proposal: QuoteProposal;
  targetUrl: string;
  pageTitle: string;
  theme: 'dark' | 'light';
}

export const QuoteProposalSection: React.FC<QuoteProposalSectionProps> = ({
  proposal,
  targetUrl,
  pageTitle,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeItems, setActiveItems] = useState<QuoteLineItem[]>(proposal.lineItems);
  const [isExplainerOpen, setIsExplainerOpen] = useState<boolean>(true);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const handleToggleItem = (id: string) => {
    setActiveItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  const selectedList = activeItems.filter((i) => i.selected);
  const totalHours = selectedList.reduce((acc, i) => acc + i.estimatedHours, 0);

  const handleCopyMarkdown = () => {
    const md = `
# PROPUESTA TÉCNICA DE ENTREGABLES Y TIEMPOS DE EJECUCIÓN
**Sitio Auditado:** ${targetUrl}
**Título de la Página:** ${pageTitle || 'Sin título declarado'}
**Paquete Técnico Asignado:** ${proposal.tierName}
**Horas Totales Estimadas:** ${totalHours} horas de desarrollo
**Tiempo de Entrega:** ${proposal.estimatedDeliveryDays} días laborables
**Impacto en Conversión (ROI Estimado):** ${proposal.estimatedConversionUplift}

---

### RESUMEN TÉCNICO EJECUTIVO
${proposal.summary}

### MATRIZ DE ENTREGABLES TÉCNICOS SELECCIONADOS (${selectedList.length} MÓDULOS):
${selectedList
  .map(
    (item, idx) =>
      `#### ${idx + 1}. ${item.title} (${item.estimatedHours} horas)\n` +
      `- **Motivo de Auditoría:** ${item.triggerReason}\n` +
      `- **Beneficio Técnico/Negocio:** ${item.clientBenefit || 'Optimización arquitectónica y de conversión'}\n` +
      `- **Justificación:** ${item.plainWhyNeeded || 'Solución a hallazgo detectado'}`
  )
  .join('\n\n')}

---

### CRONOGRAMA DE EJECUCIÓN POR FASES:
${proposal.actionRoadmap
  .map(
    (step) =>
      `#### ${step.phase}: ${step.title} (${step.duration})\n${step.tasks
        .map((t) => `  - ${t}`)
        .join('\n')}`
  )
  .join('\n')}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportJson = () => {
    const exportData = {
      targetUrl,
      pageTitle,
      proposalTier: proposal.tierName,
      tagline: proposal.tagline,
      estimatedDeliveryDays: proposal.estimatedDeliveryDays,
      estimatedConversionUplift: proposal.estimatedConversionUplift,
      totalEstimatedHours: totalHours,
      selectedModulesCount: selectedList.length,
      lineItems: selectedList,
      roadmap: proposal.actionRoadmap,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `propuesta_tecnica_${targetUrl.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
  };

  return (
    <div className={`flex flex-col h-full text-xs font-mono overflow-y-auto transition-colors ${
      isDark ? 'bg-[#0D1117] text-[#C9D1D9]' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Top Header */}
      <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b ${
        isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#3FB950]" />
          <span className={`font-bold tracking-wider text-xs ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
            PROPUESTA TÉCNICA DE ENTREGABLES & TIEMPOS DE EJECUCIÓN
          </span>
          <span className="text-[10px] text-[#3FB950] bg-[#3FB950]/15 border border-[#3FB950]/30 px-1.5 py-0.2 font-semibold">
            {proposal.tierName.toUpperCase()}
          </span>
        </div>

        <div className={`text-[11px] font-mono flex items-center gap-2 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
          <span>TIEMPO TOTAL:</span>
          <strong className="text-[#3FB950]">{totalHours} Horas Estimadas</strong>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-5xl">
        {/* Highlight Card: Target Page Title */}
        <div className={`p-3.5 border border-l-4 transition-colors ${
          isDark
            ? 'bg-[#161B22] border-y-[#21262D] border-r-[#21262D] border-l-[#56D4DD]'
            : 'bg-white border-y-slate-200 border-r-slate-200 border-l-teal-600 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-[#56D4DD]' : 'text-teal-700'
            }`}>
              <FileText className="w-3.5 h-3.5" />
              TÍTULO DE LA PÁGINA ESPECIFICADA
            </span>
            <span className={`text-[9px] px-1.5 py-0.2 font-mono ${
              isDark ? 'text-[#8B949E] bg-[#0D1117]' : 'text-slate-500 bg-slate-100'
            }`}>
              {targetUrl}
            </span>
          </div>
          <div className={`text-sm font-semibold select-text ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
            "{pageTitle}"
          </div>
        </div>

        {/* Package Banner Card */}
        <div className={`p-4 border border-l-4 transition-colors ${
          isDark
            ? 'bg-[#161B22] border-y-[#21262D] border-r-[#21262D] border-l-[#3FB950]'
            : 'bg-white border-y-slate-200 border-r-slate-200 border-l-emerald-600 shadow-xs'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div>
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                isDark ? 'text-[#56D4DD]' : 'text-teal-700'
              }`}>
                PAQUETE DE INGENIERÍA SUGERIDO
              </span>
              <h2 className={`text-base font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                {proposal.tierName}
              </h2>
            </div>
            <div className="text-right">
              <div className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                CARGA DE TRABAJO ESTIMADA
              </div>
              <div className="text-2xl font-extrabold text-[#3FB950] tabular-nums">
                {totalHours} Horas
              </div>
            </div>
          </div>

          <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? 'text-[#C9D1D9]' : 'text-slate-600'}`}>
            {proposal.summary}
          </p>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t text-[11px] ${
            isDark ? 'border-[#21262D]' : 'border-slate-100'
          }`}>
            <div className={`flex items-center gap-2 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
              <Clock className="w-3.5 h-3.5 text-[#56D4DD]" />
              <span>Tiempo de Entrega: <strong className={isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}>{proposal.estimatedDeliveryDays} días</strong></span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
              <TrendingUp className="w-3.5 h-3.5 text-[#3FB950]" />
              <span>Uplift Estimado: <strong className="text-[#3FB950]">{proposal.estimatedConversionUplift}</strong></span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
              <FileCheck className="w-3.5 h-3.5 text-[#D29922]" />
              <span>Módulos Activos: <strong className={isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}>{selectedList.length} seleccionados</strong></span>
            </div>
          </div>
        </div>

        {/* Modular Line Items (Without monetary costs) */}
        <div className={`p-3.5 border ${
          isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`flex items-center justify-between mb-3 text-xs font-bold ${
            isDark ? 'text-[#F0F6FC]' : 'text-slate-900'
          }`}>
            <span>ALCANCE & DESGLOSE TÉCNICO DE ENTREGABLES ({activeItems.length} MÓDULOS)</span>
            <span className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
              Selecciona los módulos a incluir en el alcance
            </span>
          </div>

          <div className="space-y-2.5">
            {activeItems.map((item) => {
              const isExpanded = expandedItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`border transition-all duration-150 ${
                    item.selected
                      ? isDark ? 'bg-[#0D1117] border-[#30363D] hover:border-[#56D4DD]' : 'bg-white border-slate-300 hover:border-teal-500'
                      : isDark ? 'bg-[#161B22]/40 border-[#21262D] opacity-60' : 'bg-slate-100/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div
                    onClick={() => handleToggleItem(item.id)}
                    className="p-3 cursor-pointer flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5 flex-1">
                      <div className="pt-0.5 text-[#56D4DD]">
                        {item.selected ? (
                          <CheckSquare className="w-4 h-4 text-[#3FB950]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#8B949E]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <span className={isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}>{item.title}</span>
                          {item.isCore && (
                            <span className="text-[8px] bg-[#56D4DD]/20 text-[#56D4DD] px-1 py-0.2 uppercase font-mono">
                              MÓDULO CORE
                            </span>
                          )}
                        </div>

                        <div className={`text-[10px] mt-0.5 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                          <strong className="text-[#D29922]">Causa detectada:</strong> {item.triggerReason}
                        </div>

                        <div className="mt-2">
                          <button
                            onClick={(e) => toggleExpand(e, item.id)}
                            className="text-[#56D4DD] hover:underline flex items-center gap-1 text-[10px] cursor-pointer"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3 h-3" />
                                <span>Ocultar justificación técnica</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" />
                                <span>💡 Ver justificación de entregable & beneficio</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-[#3FB950] tabular-nums font-mono">
                        {item.estimatedHours} hrs
                      </div>
                      <div className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-400'}`}>
                        estimadas
                      </div>
                    </div>
                  </div>

                  {/* Expandable Explanation Drawer */}
                  {isExpanded && (
                    <div className={`p-3 border-t space-y-2 text-[10px] leading-relaxed animate-in fade-in duration-150 ${
                      isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <strong className="text-[#3FB950] block mb-0.5">
                          🎯 Beneficio Directo para el Negocio:
                        </strong>
                        <p className={isDark ? 'text-[#C9D1D9]' : 'text-slate-700'}>{item.clientBenefit}</p>
                      </div>

                      <div>
                        <strong className="text-[#D29922] block mb-0.5">
                          🔎 Justificación Técnica de Ejecución:
                        </strong>
                        <p className={isDark ? 'text-[#C9D1D9]' : 'text-slate-700'}>{item.plainWhyNeeded}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hours Totals Summary */}
          <div className={`mt-4 p-3 border space-y-1.5 text-[11px] ${
            isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`flex justify-between ${isDark ? 'text-[#8B949E]' : 'text-slate-600'}`}>
              <span>Módulos Técnicos Incluidos:</span>
              <span className={`font-mono font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                {selectedList.length} de {activeItems.length}
              </span>
            </div>

            <div className={`flex justify-between text-sm font-bold pt-2 border-t ${
              isDark ? 'border-[#21262D]' : 'border-slate-200'
            }`}>
              <span className="text-[#3FB950]">TOTAL HORAS DE DESARROLLO & TESTING:</span>
              <span className="text-[#3FB950] tabular-nums font-mono text-base">
                {totalHours} Horas
              </span>
            </div>
          </div>
        </div>

        {/* Action Roadmap */}
        <div className={`p-3.5 border ${
          isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`text-xs font-bold mb-3 ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
            CRONOGRAMA & HOJA DE RUTA DE TRABAJO (ROADMAP)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            {proposal.actionRoadmap.map((step, idx) => (
              <div key={idx} className={`p-3 border ${
                isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`flex items-center justify-between text-[10px] font-bold mb-1 ${
                  isDark ? 'text-[#56D4DD]' : 'text-teal-700'
                }`}>
                  <span>{step.phase}</span>
                  <span className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>{step.duration}</span>
                </div>
                <div className={`font-bold text-xs mb-2 ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>{step.title}</div>
                <ul className={`space-y-1 text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                  {step.tasks.map((t, tidx) => (
                    <li key={tidx} className="flex items-start gap-1">
                      <span className="text-[#3FB950]">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3FB950] hover:bg-[#349e44] text-[#0D1117] font-bold transition-colors cursor-pointer text-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡PROPUESTA TÉCNICA COPIADA!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>COPIAR PROPUESTA TÉCNICA (MARKDOWN)</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportJson}
            className={`flex items-center gap-1.5 px-4 py-2 border transition-colors cursor-pointer text-xs ${
              isDark
                ? 'bg-[#161B22] hover:bg-[#21262D] border-[#30363D] text-[#C9D1D9]'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <Download className="w-4 h-4 text-[#56D4DD]" />
            <span>EXPORTAR ALCANCE (JSON)</span>
          </button>

          <button
            onClick={() => window.print()}
            className={`flex items-center gap-1.5 px-3 py-2 border transition-colors cursor-pointer text-xs ${
              isDark
                ? 'bg-[#161B22] hover:bg-[#21262D] border-[#30363D] text-[#8B949E] hover:text-[#C9D1D9]'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>IMPRIMIR / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
