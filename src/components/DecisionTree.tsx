import React, { useState } from 'react';
import {
  GitFork,
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  Zap,
  MousePointerClick,
  Coins,
  Cpu,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Lightbulb,
  FileCheck,
} from 'lucide-react';
import { SubagentNode } from '../types/audit.js';

interface DecisionTreeProps {
  subagents: SubagentNode[];
  totalForks: number;
  auditDurationMs: number;
  isLoading: boolean;
  onSelectNodeTab?: (tab: 'tree' | 'network' | 'tech' | 'security' | 'cro' | 'quote') => void;
  theme?: 'dark' | 'light';
}

export const DecisionTree: React.FC<DecisionTreeProps> = ({
  subagents,
  totalForks,
  auditDurationMs,
  isLoading,
  onSelectNodeTab,
  theme = 'dark',
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('agent_orchestrator');

  const isDark = theme === 'dark';

  const orchestrator = subagents.find((a) => a.id === 'agent_orchestrator');
  const networkWorker = subagents.find((a) => a.id === 'agent_network');
  const domExplorer = subagents.find((a) => a.id === 'agent_dom');
  const croResearcher = subagents.find((a) => a.id === 'agent_cro');
  const quoteEngine = subagents.find((a) => a.id === 'agent_quote');

  const selectedNode = subagents.find((a) => a.id === selectedNodeId) || orchestrator;

  return (
    <div className={`flex flex-col h-full text-xs font-mono overflow-y-auto transition-colors ${
      isDark ? 'bg-[#0D1117] text-[#C9D1D9]' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Top Bar for Tree Panel */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${
        isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-[#56D4DD]" />
          <span className={`font-bold tracking-wider text-xs ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
            ÁRBOL DE DECISIÓN & SUBAGENTES CONCURRENTES
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 border ${
            isDark ? 'text-[#56D4DD] bg-[#56D4DD]/10 border-[#56D4DD]/20' : 'text-teal-700 bg-teal-50 border-teal-200'
          }`}>
            PARALLEL EXECUTION GRAPH
          </span>
        </div>

        <div className={`flex items-center gap-3 text-[11px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#56D4DD]" />
            <span>DURACIÓN TOTAL:</span>
            <span className={`font-bold tabular-nums ${isDark ? 'text-[#C9D1D9]' : 'text-slate-800'}`}>
              {auditDurationMs} ms
            </span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5 text-[#D29922]" />
            <span>FORKS DINÁMICOS:</span>
            <span className="text-[#D29922] font-bold tabular-nums">
              {totalForks}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col items-center">
        {/* SVG Flow Canvas with Orthogonal Circuit Lines */}
        <div className="w-full max-w-4xl relative py-2">
          {/* LEVEL 1: MASTER ORCHESTRATOR */}
          <div className="flex justify-center mb-6">
            {orchestrator && (
              <div
                onClick={() => setSelectedNodeId(orchestrator.id)}
                className={`w-80 p-3 border cursor-pointer transition-all duration-200 relative ${
                  isDark ? 'bg-[#161B22]' : 'bg-white shadow-xs'
                } ${
                  selectedNodeId === orchestrator.id
                    ? isDark ? 'border-[#56D4DD] shadow-[0_0_12px_rgba(86,212,221,0.2)]' : 'border-teal-500 ring-2 ring-teal-100'
                    : isDark ? 'border-[#30363D] hover:border-[#56D4DD]/60' : 'border-slate-300 hover:border-teal-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <div className="flex items-center gap-1.5 text-[#56D4DD] font-bold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{orchestrator.name}</span>
                  </div>
                  <span className="text-[10px] text-[#3FB950] flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950] animate-pulse"></span>
                    COMPLETED
                  </span>
                </div>
                <div className={`text-[10px] mb-2 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>{orchestrator.role}</div>

                <div className={`flex items-center justify-between text-[10px] p-1.5 border ${
                  isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>FORKS: {orchestrator.forksCount}</span>
                  <span className="text-[#56D4DD] tabular-nums font-bold">
                    {orchestrator.executionTimeMs} ms
                  </span>
                  <span className="text-[#3FB950] font-bold">3/3 TASKS</span>
                </div>
              </div>
            )}
          </div>

          {/* SVG Connector from Orchestrator down to 3 Workers */}
          <div className="h-8 relative -my-4 flex justify-center">
            <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
              <line
                x1="50%"
                y1="0"
                x2="50%"
                y2="16"
                stroke={isDark ? '#30363D' : '#cbd5e1'}
                strokeWidth="2"
                strokeDasharray={isLoading ? '4 2' : 'none'}
              />
              <line x1="18%" y1="16" x2="82%" y2="16" stroke={isDark ? '#30363D' : '#cbd5e1'} strokeWidth="2" />
              <line x1="18%" y1="16" x2="18%" y2="32" stroke={isDark ? '#30363D' : '#cbd5e1'} strokeWidth="2" />
              <line x1="50%" y1="16" x2="50%" y2="32" stroke={isDark ? '#30363D' : '#cbd5e1'} strokeWidth="2" />
              <line x1="82%" y1="16" x2="82%" y2="32" stroke={isDark ? '#30363D' : '#cbd5e1'} strokeWidth="2" />
            </svg>
          </div>

          {/* LEVEL 2: 3 PARALLEL SUBAGENTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
            {/* WORKER 1: NETWORK & LATENCY */}
            {networkWorker && (
              <div
                onClick={() => {
                  setSelectedNodeId(networkWorker.id);
                  if (onSelectNodeTab) onSelectNodeTab('network');
                }}
                className={`p-3 border cursor-pointer transition-all duration-200 relative ${
                  isDark ? 'bg-[#161B22]' : 'bg-white shadow-xs'
                } ${
                  selectedNodeId === networkWorker.id
                    ? isDark ? 'border-[#D29922] shadow-[0_0_12px_rgba(210,153,34,0.2)]' : 'border-amber-500 ring-2 ring-amber-100'
                    : isDark ? 'border-[#30363D] hover:border-[#D29922]/60' : 'border-slate-300 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-1.5 text-[#D29922] font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{networkWorker.name}</span>
                  </div>
                  <span className="text-[9px] text-[#3FB950] font-semibold">DONE</span>
                </div>
                <div className={`text-[10px] mb-2 line-clamp-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  {networkWorker.role}
                </div>

                <div className={`space-y-1 text-[10px] p-2 border ${
                  isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>TTFB:</span>
                    <span className={`font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-800'}`}>
                      {networkWorker.telemetry.ttfb || '680ms'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>Forks Asignados:</span>
                    <span className="text-[#D29922] font-bold">
                      {networkWorker.forksCount}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-[#56D4DD] flex items-center justify-between">
                  <span>Ver telemetría red</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            )}

            {/* WORKER 2: DOM & TECH EXPLORER (WAPPALYZER) */}
            {domExplorer && (
              <div
                onClick={() => {
                  setSelectedNodeId(domExplorer.id);
                  if (onSelectNodeTab) onSelectNodeTab('tech');
                }}
                className={`p-3 border cursor-pointer transition-all duration-200 relative ${
                  isDark ? 'bg-[#161B22]' : 'bg-white shadow-xs'
                } ${
                  selectedNodeId === domExplorer.id
                    ? isDark ? 'border-[#56D4DD] shadow-[0_0_12px_rgba(86,212,221,0.2)]' : 'border-teal-500 ring-2 ring-teal-100'
                    : isDark ? 'border-[#30363D] hover:border-[#56D4DD]/60' : 'border-slate-300 hover:border-teal-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-1.5 text-[#56D4DD] font-bold">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{domExplorer.name}</span>
                  </div>
                  <span className="text-[9px] text-[#3FB950] font-semibold">DONE</span>
                </div>
                <div className={`text-[10px] mb-2 line-clamp-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  {domExplorer.role}
                </div>

                <div className={`space-y-1 text-[10px] p-2 border ${
                  isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>Tecnologías:</span>
                    <span className={`font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-800'}`}>
                      {domExplorer.telemetry.technologies || 'Wappalyzer'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>Viewport Móvil:</span>
                    <span
                      className={`font-bold ${
                        domExplorer.telemetry.viewport === 'OK'
                          ? 'text-[#3FB950]'
                          : 'text-[#F85149]'
                      }`}
                    >
                      {domExplorer.telemetry.viewport === 'OK' ? 'SÍ' : 'FALTANTE'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-[#56D4DD] flex items-center justify-between">
                  <span>Ver stack Wappalyzer</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            )}

            {/* WORKER 3: CRO & CONVERSION RESEARCHER */}
            {croResearcher && (
              <div
                onClick={() => {
                  setSelectedNodeId(croResearcher.id);
                  if (onSelectNodeTab) onSelectNodeTab('cro');
                }}
                className={`p-3 border cursor-pointer transition-all duration-200 relative ${
                  isDark ? 'bg-[#161B22]' : 'bg-white shadow-xs'
                } ${
                  selectedNodeId === croResearcher.id
                    ? isDark ? 'border-[#3FB950] shadow-[0_0_12px_rgba(63,185,80,0.2)]' : 'border-emerald-500 ring-2 ring-emerald-100'
                    : isDark ? 'border-[#30363D] hover:border-[#3FB950]/60' : 'border-slate-300 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-1.5 text-[#3FB950] font-bold">
                    <MousePointerClick className="w-3.5 h-3.5" />
                    <span>{croResearcher.name}</span>
                  </div>
                  <span className="text-[9px] text-[#3FB950] font-semibold">DONE</span>
                </div>
                <div className={`text-[10px] mb-2 line-clamp-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  {croResearcher.role}
                </div>

                <div className={`space-y-1 text-[10px] p-2 border ${
                  isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>CTAs Activos:</span>
                    <span className={`font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-800'}`}>
                      {croResearcher.telemetry.ctas || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>WhatsApp Directo:</span>
                    <span
                      className={`font-bold ${
                        croResearcher.telemetry.whatsApp === 'Sí'
                          ? 'text-[#3FB950]'
                          : 'text-[#F85149]'
                      }`}
                    >
                      {croResearcher.telemetry.whatsApp === 'Sí' ? 'DETECTADO' : 'AUSENTE'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-[#56D4DD] flex items-center justify-between">
                  <span>Ver embudo CRO</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>

          {/* SVG Connector from 3 Workers down to Quote Engine */}
          <div className="h-8 relative -my-2 flex justify-center">
            <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
              <line x1="18%" y1="0" x2="18%" y2="16" stroke={isDark ? '#30363D' : '#cbd5e1'} strokeWidth="2" />
              <line x1="50%" y1="0" x2="50%" y2="16" stroke={isDark ? '#30363D' : '#cbd5e1'} strokeWidth="2" />
              <line x1="82%" y1="0" x2="82%" y2="16" stroke={isDark ? '#30363D' : '#cbd5e1'} strokeWidth="2" />
              <line x1="18%" y1="16" x2="82%" y2="16" stroke={isDark ? '#30363D' : '#cbd5e1'} strokeWidth="2" />
              <line
                x1="50%"
                y1="16"
                x2="50%"
                y2="32"
                stroke={isDark ? '#56D4DD' : '#0d9488'}
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* LEVEL 3: QUOTE ENGINE & SYNTHESIZER */}
          <div className="flex justify-center mt-6">
            {quoteEngine && (
              <div
                onClick={() => {
                  setSelectedNodeId(quoteEngine.id);
                  if (onSelectNodeTab) onSelectNodeTab('quote');
                }}
                className={`w-96 p-3.5 border cursor-pointer transition-all duration-200 relative ${
                  isDark ? 'bg-[#161B22]' : 'bg-white shadow-xs'
                } ${
                  selectedNodeId === quoteEngine.id
                    ? isDark ? 'border-[#3FB950] shadow-[0_0_14px_rgba(63,185,80,0.25)]' : 'border-emerald-500 ring-2 ring-emerald-100'
                    : isDark ? 'border-[#30363D] hover:border-[#3FB950]/60' : 'border-slate-300 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2 text-[#3FB950] font-bold">
                    <FileCheck className="w-4 h-4" />
                    <span>{quoteEngine.name}</span>
                  </div>
                  <span className="text-[10px] text-[#3FB950] bg-[#3FB950]/10 border border-[#3FB950]/30 px-1.5 py-0.2">
                    SCOPE_SYNTHESIZED
                  </span>
                </div>
                <div className={`text-[10px] mb-2 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>{quoteEngine.role}</div>

                <div className={`flex items-center justify-between text-[11px] p-2 border ${
                  isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>PAQUETE TÉCNICO:</span>
                  <span className={`font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                    {quoteEngine.telemetry.package || 'Rediseño Web Pro'}
                  </span>
                </div>

                <div className={`flex items-center justify-between mt-2 text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  <span>Horas Estimadas: <strong className="text-[#3FB950]">{quoteEngine.telemetry.totalHours || '79 hrs'}</strong></span>
                  <span className="text-[#56D4DD] flex items-center gap-0.5">
                    Ir a propuesta <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className={`w-full max-w-4xl mt-6 p-3 border text-xs ${
            isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 mb-2 ${
              isDark ? 'border-[#21262D]' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#56D4DD]" />
                <span className={`font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                  DETALLE DE EJECUCIÓN: {selectedNode.name}
                </span>
                <span className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>({selectedNode.role})</span>
              </div>
              <span className="text-[#56D4DD] tabular-nums font-bold">
                {selectedNode.executionTimeMs} ms
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className={`text-[10px] font-semibold uppercase ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  Tareas Completadas ({selectedNode.tasksCompleted.length})
                </span>
                <ul className={`mt-1 space-y-1 ${isDark ? 'text-[#C9D1D9]' : 'text-slate-700'}`}>
                  {selectedNode.tasksCompleted.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3FB950] shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className={`text-[10px] font-semibold uppercase ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  Telemetría Interna Registrada
                </span>
                <div className={`mt-1 p-2 border space-y-1 ${
                  isDark ? 'bg-[#0D1117] border-[#21262D] text-[#8B949E]' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  {Object.entries(selectedNode.telemetry).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="capitalize">{k}:</span>
                      <span className={`font-semibold font-mono ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                        {String(v)}
                      </span>
                    </div>
                  ))}
                  <div className={`flex justify-between pt-1 border-t ${
                    isDark ? 'border-[#21262D]' : 'border-slate-200'
                  }`}>
                    <span>Forks Paralelos:</span>
                    <span className="text-[#D29922] font-bold">
                      {selectedNode.forksCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Plain Language Box */}
            <div className={`mt-3 pt-2.5 border-t p-2.5 border ${
              isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 text-[#D29922] text-[10px] font-bold mb-1">
                <Lightbulb className="w-3 h-3" />
                <span>¿QUÉ SIGNIFICA ESTE SUBAGENTE EN PALABRAS SENCILLAS?</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#C9D1D9]' : 'text-slate-700'}`}>
                {selectedNode.id === 'agent_orchestrator' &&
                  'El Capitán del Equipo: Comprueba que la dirección web exista, valida el certificado SSL de seguridad y despacha a los demás agentes para inspeccionar todo en paralelo sin demoras.'}
                {selectedNode.id === 'agent_network' &&
                  'El Medidor de Velocidad: Calcula cuántos milisegundos tarda tu servidor en atender a una persona y si las imágenes o archivos están pesados, consumiendo el plan de datos del visitante.'}
                {selectedNode.id === 'agent_dom' &&
                  'El Inspector de Arquitectura & Wappalyzer: Reconoce el stack de tecnologías y librerías abiertas con que se construyó el sitio, revisando si cabe en teléfonos celulares o si tiene código viejo.'}
                {selectedNode.id === 'agent_cro' &&
                  'El Especialista en Ventas: Busca si hay un botón directo de WhatsApp para cerrar clientes de inmediato, si tienes botones de compra atractivos y si los títulos explican con claridad qué ofreces.'}
                {selectedNode.id === 'agent_quote' &&
                  'El Planificador de Entregables: Toma todos los problemas encontrados y calcula de forma matemática y transparente el alcance técnico de la propuesta, detallando horas reales y roadmap.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
