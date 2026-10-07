/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GitFork,
  Zap,
  Layers,
  MousePointerClick,
  Coins,
  BookOpen,
  Terminal,
  Activity,
  AlertCircle,
  RefreshCw,
  ShieldAlert,
  Bot,
} from 'lucide-react';
import { Header } from './components/Header.js';
import { LeftPanel } from './components/LeftPanel.js';
import { DecisionTree } from './components/DecisionTree.js';
import { TechnicalTabs } from './components/TechnicalTabs.js';
import { QuoteProposalSection } from './components/QuoteProposalSection.js';
import { AiConsultantPanel } from './components/AiConsultantPanel.js';
import { BottomStatusBar } from './components/BottomStatusBar.js';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal.js';
import { AuditResult, RecentExploration } from './types/audit.js';
import { PRESET_WEBSITES, PresetWebsite, SUGGESTED_EXPLORATIONS } from '../server/presets.js';

export default function App() {
  const [presets, setPresets] = useState<PresetWebsite[]>(PRESET_WEBSITES);
  const [recentExplorations, setRecentExplorations] = useState<RecentExploration[]>(SUGGESTED_EXPLORATIONS);
  const [currentResult, setCurrentResult] = useState<AuditResult>(
    PRESET_WEBSITES[0].presetResult
  );
  const [activeTab, setActiveTab] = useState<
    'tree' | 'network' | 'tech' | 'security' | 'cro' | 'quote' | 'ai'
  >('tree');
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [systemHealth, setSystemHealth] = useState<{
    memoryMb: { heapUsed: number; rss: number };
    uptimeSeconds: number;
  }>({
    memoryMb: { heapUsed: 31, rss: 64 },
    uptimeSeconds: 120,
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch presets, suggested explorations, and telemetry on initial load
  useEffect(() => {
    fetch('/api/presets')
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.presets) && data.presets.length > 0) {
          setPresets(data.presets);
        }
        if (data && Array.isArray(data.recentExplorations) && data.recentExplorations.length > 0) {
          setRecentExplorations(data.recentExplorations);
        }
      })
      .catch(() => {
        // Fallback to local presets
      });

    fetch('/api/system/health')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.memoryMb) {
          setSystemHealth(data);
        }
      })
      .catch(() => {});
  }, []);

  // Run audit against target URL
  const handleRunAudit = async (targetUrl: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Error HTTP ${response.status} al auditar el sitio`
        );
      }

      const result: AuditResult = await response.json();
      setCurrentResult(result);

      // Add to dynamic Recent Explorations (max 5 items)
      const newExploration: RecentExploration = {
        url: result.url,
        title: result.pageTitle || 'Sin título declarado',
        score: result.scores.overall,
        ratingLevel: result.scores.ratingLevel,
        scannedAt: 'Ahora mismo',
      };

      setRecentExplorations((prev) => [
        newExploration,
        ...prev.filter(
          (e) => e.url.toLowerCase() !== result.url.toLowerCase()
        ),
      ].slice(0, 5));
    } catch (err: any) {
      console.error('Audit failed:', err);
      setErrorMessage(
        err.message || 'No se pudo conectar con el servidor o resolver la URL.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectExploration = (item: RecentExploration) => {
    setErrorMessage(null);
    const matched = presets.find(
      (p) =>
        p.url.toLowerCase() === item.url.toLowerCase() ||
        p.name.toLowerCase() === item.title.toLowerCase() ||
        item.url.includes(p.id)
    );

    if (matched) {
      setCurrentResult(matched.presetResult);
    } else {
      handleRunAudit(item.url);
    }
  };

  const handleAskAi = (prompt: string) => {
    setAiPrompt(prompt);
    setActiveTab('ai');
  };

  // Handle bash console commands
  const handleExecuteCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === 'help') {
      alert(
        'COMANDOS DISPONIBLES EN CONSOLA WEBSCANNER:\n' +
          '- audit <url> : Ejecuta auditoría técnica autónoma en vivo\n' +
          '- tree : Muestra el árbol de decisión y subagentes concurrentes\n' +
          '- network : Abre la pestaña de Rendimiento & Red\n' +
          '- tech : Abre la pestaña de Stack Tecnológico (Wappalyzer)\n' +
          '- security : Abre la auditoría de seguridad (OSV.dev y Observatory)\n' +
          '- cro : Abre la pestaña de Conversión y llamadas a la acción\n' +
          '- quote : Abre la propuesta de rediseño técnico (sin precios)\n' +
          '- ai : Abre el Asistente IA Consultor Senior y generador de soluciones\n' +
          '- theme : Alterna entre Modo Oscuro y Modo Claro\n' +
          '- docs : Abre la arquitectura y guía de despliegue VPS\n' +
          '- clear : Limpia alertas en pantalla'
      );
    } else if (trimmed.startsWith('audit ')) {
      const url = trimmed.replace('audit ', '').trim();
      if (url) handleRunAudit(url);
    } else if (trimmed === 'tree') {
      setActiveTab('tree');
    } else if (trimmed === 'quote') {
      setActiveTab('quote');
    } else if (trimmed === 'network') {
      setActiveTab('network');
    } else if (trimmed === 'tech') {
      setActiveTab('tech');
    } else if (trimmed === 'security') {
      setActiveTab('security');
    } else if (trimmed === 'cro') {
      setActiveTab('cro');
    } else if (trimmed === 'ai') {
      setAiPrompt(undefined);
      setActiveTab('ai');
    } else if (trimmed === 'theme') {
      toggleTheme();
    } else if (trimmed === 'docs') {
      setIsDocsOpen(true);
    } else if (trimmed === 'clear') {
      setErrorMessage(null);
    } else if (trimmed.includes('hotel')) {
      const p = presets.find((p) => p.id === 'legacy_hotel');
      if (p) setCurrentResult(p.presetResult);
    } else if (trimmed.includes('clinic')) {
      const p = presets.find((p) => p.id === 'dental_clinic');
      if (p) setCurrentResult(p.presetResult);
    } else if (trimmed.includes('saas')) {
      const p = presets.find((p) => p.id === 'saas_modern');
      if (p) setCurrentResult(p.presetResult);
    }
  };

  return (
    <div
      data-theme={theme}
      className="flex flex-col h-screen w-screen overflow-hidden select-text transition-colors duration-200 bg-[var(--color-background)] text-[var(--color-text-primary)]"
    >
      {/* 1. Header with URL bar, theme toggle & exploraciones relacionadas */}
      <Header
        currentUrl={currentResult.url}
        isLoading={isLoading}
        onRunAudit={handleRunAudit}
        recentExplorations={recentExplorations}
        onSelectExploration={handleSelectExploration}
        systemHealth={systemHealth}
        totalForks={currentResult.totalForks}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Tab Switcher Bar */}
      <div className="border-b px-4 flex flex-wrap items-center justify-between text-base transition-colors border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center overflow-x-auto">
          <button
            onClick={() => setActiveTab('tree')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-base font-bold transition-colors cursor-pointer ${
              activeTab === 'tree'
                ? 'border-[var(--color-control-selected-border)] text-[var(--color-control-selected-foreground)] bg-[var(--color-control-selected-background)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-control-hover-foreground)]'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>01. ÁRBOL & SUBAGENTES</span>
          </button>

          <button
            onClick={() => setActiveTab('network')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-base font-bold transition-colors cursor-pointer ${
              activeTab === 'network'
                ? 'border-[var(--color-control-selected-border)] text-[var(--color-control-selected-foreground)] bg-[var(--color-control-selected-background)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-control-hover-foreground)]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>02. RENDIMIENTO & RED</span>
          </button>

          <button
            onClick={() => setActiveTab('tech')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-base font-bold transition-colors cursor-pointer ${
              activeTab === 'tech'
                ? 'border-[var(--color-control-selected-border)] text-[var(--color-control-selected-foreground)] bg-[var(--color-control-selected-background)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-control-hover-foreground)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>03. STACK WAPPALYZER</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-base font-bold transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'border-[var(--color-control-selected-border)] text-[var(--color-control-selected-foreground)] bg-[var(--color-control-selected-background)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-control-hover-foreground)]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>04. SEGURIDAD SSL/OSV</span>
          </button>

          <button
            onClick={() => setActiveTab('cro')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-base font-bold transition-colors cursor-pointer ${
              activeTab === 'cro'
                ? 'border-[var(--color-control-selected-border)] text-[var(--color-control-selected-foreground)] bg-[var(--color-control-selected-background)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-control-hover-foreground)]'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>05. CONVERSIÓN (CRO)</span>
          </button>

          <button
            onClick={() => setActiveTab('quote')}
              className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 text-base font-bold transition-colors cursor-pointer ${
              activeTab === 'quote'
                ? 'border-[var(--color-control-selected-border)] text-[var(--color-control-selected-foreground)] bg-[var(--color-control-selected-background)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-control-hover-foreground)]'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>06. COTIZADOR INTELIGENTE</span>
          </button>

          {/* 7. Asistente IA (LLM Agent) */}
          <button
            onClick={() => {
              setAiPrompt(undefined);
              setActiveTab('ai');
            }}
              className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 text-base font-bold transition-colors cursor-pointer ${
              activeTab === 'ai'
                ? 'border-[var(--color-control-selected-border)] text-[var(--color-control-selected-foreground)] bg-[var(--color-control-selected-background)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-control-hover-foreground)]'
            }`}
          >
            <Bot className="w-3.5 h-3.5 animate-pulse" />
            <span>07. ASISTENTE IA (CONSULTOR SENIOR)</span>
          </button>
        </div>

        {/* Docs Button */}
        <button
          onClick={() => setIsDocsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 text-base font-semibold transition-colors cursor-pointer my-1 border bg-[var(--color-control-background)] hover:bg-[var(--color-control-hover-background)] hover:text-[var(--color-control-hover-foreground)] border-[var(--color-control-border)] text-[var(--color-accent)]"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>DOCS & GUÍA VPS</span>
        </button>
      </div>

      {/* Error Banner if any */}
      {errorMessage && (
        <div className="bg-[var(--color-error-subtle)] border-b border-[var(--color-error)] text-[var(--color-error)] px-4 py-2 text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span><strong>AVISO:</strong> {errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-base text-[var(--color-text-primary)] hover:underline cursor-pointer"
          >
            DESCARTAR
          </button>
        </div>
      )}

      {/* 2. Main Workspace Body (Left Panel + Central Display) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Health score, registered findings & real-time auto-scrolling log */}
        <LeftPanel
          scores={currentResult.scores}
          issues={currentResult.issues}
          logs={currentResult.logs}
          isLoading={isLoading}
          theme={theme}
          onSelectIssue={(issue) => {
            if (issue.category === 'performance') setActiveTab('network');
            else if (issue.category === 'tech') setActiveTab('tech');
            else if (issue.category === 'security') setActiveTab('security');
            else if (issue.category === 'cro') setActiveTab('cro');
            else setActiveTab('tree');
          }}
          onGoToQuote={() => setActiveTab('quote')}
          onAskAi={handleAskAi}
        />

        {/* Central Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden transition-colors bg-[var(--color-background)]">
          {activeTab === 'tree' && (
            <DecisionTree
              subagents={currentResult.subagents}
              totalForks={currentResult.totalForks}
              auditDurationMs={currentResult.auditDurationMs}
              isLoading={isLoading}
              theme={theme}
              onSelectNodeTab={(tab) => {
                if (tab === 'quote') setActiveTab('quote');
                else if (tab === 'network' || tab === 'tech' || tab === 'security' || tab === 'cro')
                  setActiveTab(tab);
              }}
            />
          )}

          {(activeTab === 'network' ||
            activeTab === 'tech' ||
            activeTab === 'security' ||
            activeTab === 'cro') && (
            <TechnicalTabs
              performance={currentResult.performance}
              techStack={currentResult.techStack}
              securitySummary={currentResult.securitySummary}
              cro={currentResult.cro}
              pageTitle={currentResult.pageTitle}
              targetUrl={currentResult.url}
              activeTab={activeTab}
              onTabChange={(t) => setActiveTab(t)}
              theme={theme}
              onAskAi={handleAskAi}
            />
          )}

          {activeTab === 'quote' && (
            <QuoteProposalSection
              proposal={currentResult.quote}
              targetUrl={currentResult.url}
              pageTitle={currentResult.pageTitle}
              theme={theme}
            />
          )}

          {activeTab === 'ai' && (
            <AiConsultantPanel
              auditResult={currentResult}
              theme={theme}
              initialPrompt={aiPrompt}
            />
          )}
        </main>
      </div>

      {/* 3. Bottom Bash Prompt & Telemetry Bar */}
      <BottomStatusBar
        onExecuteCommand={handleExecuteCommand}
        statusText={
          isLoading
            ? 'ANALIZANDO SITIO Y EJECUTANDO FORKS...'
            : `AUDITORÍA COMPLETADA EN ${currentResult.auditDurationMs}ms`
        }
        totalForks={currentResult.totalForks}
        memoryMb={systemHealth.memoryMb.heapUsed}
        theme={theme}
      />

      {/* 4. Architecture & VPS Deployment Modal */}
      <ArchitectureDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
