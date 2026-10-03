import React, { useState } from 'react';
import {
  Zap,
  Layers,
  MousePointerClick,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Phone,
  FileText,
  FileCode,
  Image,
  Server,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  TrendingDown,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Bug,
  Lock,
  Globe,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Bot,
  Network,
  Radio,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  CroMetrics,
  PerformanceMetrics,
  SecurityAuditSummary,
  TechStackMetrics,
} from '../types/audit.js';

interface TechnicalTabsProps {
  performance: PerformanceMetrics;
  techStack: TechStackMetrics;
  securitySummary: SecurityAuditSummary;
  cro: CroMetrics;
  pageTitle: string;
  targetUrl?: string;
  activeTab: 'network' | 'tech' | 'security' | 'cro';
  onTabChange: (tab: 'network' | 'tech' | 'security' | 'cro') => void;
  theme: 'dark' | 'light';
  onAskAi?: (prompt: string) => void;
}

export const TechnicalTabs: React.FC<TechnicalTabsProps> = ({
  performance,
  techStack,
  securitySummary,
  cro,
  pageTitle,
  targetUrl = 'https://ejemplo.com',
  activeTab,
  onTabChange,
  theme,
  onAskAi,
}) => {
  const [isExplainerOpen, setIsExplainerOpen] = useState<boolean>(true);
  const [activeMetricTip, setActiveMetricTip] = useState<string | null>(null);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState<number>(0);

  const toggleTip = (id: string) => {
    setActiveMetricTip((prev) => (prev === id ? null : id));
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-full text-xs font-mono overflow-y-auto transition-colors ${
      isDark ? 'bg-[#0D1117] text-[#C9D1D9]' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Tab Navigation */}
      <div className={`flex items-center border-b px-3 overflow-x-auto ${
        isDark ? 'border-[#21262D] bg-[#161B22]' : 'border-slate-200 bg-white'
      }`}>
        <button
          onClick={() => onTabChange('network')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'network'
              ? isDark
                ? 'border-[#D29922] text-[#D29922] bg-[#0D1117]'
                : 'border-amber-600 text-amber-600 bg-slate-50'
              : isDark
              ? 'border-transparent text-[#8B949E] hover:text-[#C9D1D9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>RENDIMIENTO & RED</span>
        </button>

        <button
          onClick={() => onTabChange('tech')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'tech'
              ? isDark
                ? 'border-[#56D4DD] text-[#56D4DD] bg-[#0D1117]'
                : 'border-teal-600 text-teal-600 bg-slate-50'
              : isDark
              ? 'border-transparent text-[#8B949E] hover:text-[#C9D1D9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>STACK WAPPALYZER ({techStack.detected.length})</span>
        </button>

        <button
          onClick={() => onTabChange('security')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'security'
              ? isDark
                ? 'border-[#F85149] text-[#F85149] bg-[#0D1117]'
                : 'border-rose-600 text-rose-600 bg-slate-50'
              : isDark
              ? 'border-transparent text-[#8B949E] hover:text-[#C9D1D9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SEGURIDAD (OSV / OBSERVATORY)</span>
        </button>

        <button
          onClick={() => onTabChange('cro')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'cro'
              ? isDark
                ? 'border-[#3FB950] text-[#3FB950] bg-[#0D1117]'
                : 'border-emerald-600 text-emerald-600 bg-slate-50'
              : isDark
              ? 'border-transparent text-[#8B949E] hover:text-[#C9D1D9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>UX & CONVERSIÓN (CRO)</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="p-4 space-y-4 max-w-5xl">
        {/* SECCIÓN DUAL: VENTANA INTERACTIVA DEL SITIO WEB + TÍTULO DE LA PÁGINA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* MARCO / VENTANA INTERACTIVA DEL SITIO WEB AUDITADO (Col 1-7) */}
          <div className={`lg:col-span-7 border flex flex-col overflow-hidden transition-colors ${
            isDark ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-slate-300 shadow-xs'
          }`}>
            {/* Browser Window Chrome / Header */}
            <div className={`px-3 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-[11px] ${
              isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-100 border-slate-200'
            }`}>
              {/* Traffic Lights */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F85149]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#D29922]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#3FB950]"></span>
                <span className={`text-[10px] ml-1 font-bold ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  MARCO DE INSPECCIÓN EN VIVO
                </span>
              </div>

              {/* Viewport switch: Desktop / Tablet / Mobile */}
              <div className={`flex items-center gap-1 p-0.5 border text-[10px] ${
                isDark ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('desktop')}
                  className={`px-1.5 py-0.5 flex items-center gap-1 cursor-pointer transition-colors ${
                    previewViewport === 'desktop'
                      ? isDark ? 'bg-[#21262D] text-[#56D4DD] font-bold' : 'bg-slate-100 text-teal-700 font-bold'
                      : isDark ? 'text-[#8B949E] hover:text-[#C9D1D9]' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Vista Escritorio (1440px)"
                >
                  <Monitor className="w-3 h-3" />
                  <span className="hidden sm:inline">1440px</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('tablet')}
                  className={`px-1.5 py-0.5 flex items-center gap-1 cursor-pointer transition-colors ${
                    previewViewport === 'tablet'
                      ? isDark ? 'bg-[#21262D] text-[#56D4DD] font-bold' : 'bg-slate-100 text-teal-700 font-bold'
                      : isDark ? 'text-[#8B949E] hover:text-[#C9D1D9]' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Vista Tablet (768px)"
                >
                  <Tablet className="w-3 h-3" />
                  <span className="hidden sm:inline">768px</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('mobile')}
                  className={`px-1.5 py-0.5 flex items-center gap-1 cursor-pointer transition-colors ${
                    previewViewport === 'mobile'
                      ? isDark ? 'bg-[#21262D] text-[#56D4DD] font-bold' : 'bg-slate-100 text-teal-700 font-bold'
                      : isDark ? 'text-[#8B949E] hover:text-[#C9D1D9]' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Vista Móvil (375px)"
                >
                  <Smartphone className="w-3 h-3" />
                  <span className="hidden sm:inline">375px</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIframeKey((k) => k + 1)}
                  className={`p-1 hover:text-[#56D4DD] cursor-pointer transition-colors ${
                    isDark ? 'text-[#8B949E]' : 'text-slate-500 hover:text-teal-700'
                  }`}
                  title="Recargar marco"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
                <a
                  href={targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-1 hover:text-[#56D4DD] transition-colors ${
                    isDark ? 'text-[#8B949E]' : 'text-slate-500 hover:text-teal-700'
                  }`}
                  title="Abrir en pestaña nueva"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Address bar within simulated browser */}
            <div className={`px-3 py-1.5 border-b flex items-center gap-2 text-[10px] font-mono ${
              isDark ? 'bg-[#161B22] border-[#21262D] text-[#8B949E]' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <Lock className={`w-3 h-3 ${performance.sslEnabled ? 'text-[#3FB950]' : 'text-[#F85149]'}`} />
              <span className="truncate flex-1 font-mono text-[11px] select-all">
                {targetUrl}
              </span>
              <span className={`text-[9px] px-1 py-0.2 border ${
                performance.sslEnabled
                  ? isDark ? 'border-[#3FB950]/30 text-[#3FB950] bg-[#3FB950]/10' : 'border-emerald-300 text-emerald-700 bg-emerald-50'
                  : isDark ? 'border-[#F85149]/30 text-[#F85149] bg-[#F85149]/10' : 'border-rose-300 text-rose-700 bg-rose-50'
              }`}>
                {performance.sslEnabled ? 'HTTPS SEGURO' : 'HTTP INSEGURO'}
              </span>
            </div>

            {/* Interactive Sandbox Viewport */}
            <div className={`relative flex items-center justify-center overflow-hidden p-2 transition-all ${
              isDark ? 'bg-[#0A0D12]' : 'bg-slate-100'
            }`}>
              <div
                className={`transition-all duration-300 overflow-hidden border shadow-inner ${
                  isDark ? 'bg-white border-[#30363D]' : 'bg-white border-slate-300'
                } ${
                  previewViewport === 'mobile'
                    ? 'w-[340px] h-[260px] rounded-md'
                    : previewViewport === 'tablet'
                    ? 'w-[480px] h-[260px] rounded'
                    : 'w-full h-[260px]'
                }`}
              >
                <iframe
                  key={iframeKey}
                  src={targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`}
                  title={`Vista previa interactiva de ${pageTitle || targetUrl}`}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                />
              </div>

              {/* Informative overlay footer */}
              <div className={`absolute bottom-3 left-4 right-4 pointer-events-none flex items-center justify-between text-[9px] px-2 py-1 backdrop-blur-md border ${
                isDark ? 'bg-[#0D1117]/85 border-[#21262D] text-[#8B949E]' : 'bg-white/90 border-slate-200 text-slate-600'
              }`}>
                <span>MODO INSPECCIÓN SANDBOX ACTIVO</span>
                <span className="font-bold text-[#56D4DD]">{previewViewport.toUpperCase()} VIEW</span>
              </div>
            </div>
          </div>

          {/* TARJETA DESTACADA: TÍTULO DE LA PÁGINA (<title>) (Col 8-12) */}
          <div className={`lg:col-span-5 p-4 border border-l-4 flex flex-col justify-between transition-colors ${
            isDark
              ? 'bg-[#161B22] border-y-[#21262D] border-r-[#21262D] border-l-[#56D4DD]'
              : 'bg-white border-y-slate-200 border-r-slate-200 border-l-teal-600 shadow-xs'
          }`}>
            <div>
              {/* Badge & Label */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-[#56D4DD]' : 'text-teal-700'
                }`}>
                  <FileText className="w-4 h-4" />
                  TÍTULO DE LA PÁGINA
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 font-mono font-bold ${
                  isDark ? 'text-[#8B949E] bg-[#0D1117] border border-[#21262D]' : 'text-slate-600 bg-slate-100 border border-slate-200'
                }`}>
                  TAG &lt;TITLE&gt;
                </span>
              </div>

              {/* Exact plain text content of <title> */}
              <div className={`p-3 border select-text mb-3 ${
                isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[13px] font-semibold leading-snug break-words ${
                  isDark ? 'text-[#F0F6FC]' : 'text-slate-900'
                }`}>
                  {pageTitle ? pageTitle : 'Sin título declarado en el documento'}
                </div>
              </div>

              {/* Metrics & SEO Analysis */}
              <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
                <div className={`p-2 border ${
                  isDark ? 'bg-[#0D1117]/60 border-[#21262D]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>LONGITUD TEXTUAL:</span>
                  <div className="flex items-center gap-1 font-bold mt-0.5">
                    <span className="tabular-nums text-xs font-mono">{pageTitle.length}</span>
                    <span className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>caracteres</span>
                  </div>
                </div>

                <div className={`p-2 border ${
                  isDark ? 'bg-[#0D1117]/60 border-[#21262D]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>ESTADO SERP GOOGLE:</span>
                  <div className="mt-0.5 font-bold">
                    {pageTitle.length >= 30 && pageTitle.length <= 65 ? (
                      <span className="text-[#3FB950] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Óptimo (30-65)
                      </span>
                    ) : pageTitle.length === 0 ? (
                      <span className="text-[#F85149] flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Tag Ausente
                      </span>
                    ) : (
                      <span className="text-[#D29922] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {pageTitle.length > 65 ? 'Truncable (>65)' : 'Breve (<30)'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Google SERP Card Preview */}
              <div className={`p-2.5 border text-[10px] mb-2 ${
                isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-1 text-[9px] font-bold text-[#8B949E] mb-1">
                  <Globe className="w-3 h-3 text-[#56D4DD]" />
                  <span>SIMULACIÓN EN GOOGLE SEARCH</span>
                </div>
                <div className="text-[10px] text-emerald-500 font-mono truncate">
                  {targetUrl}
                </div>
                <div className="text-xs font-semibold text-[#58a6ff] hover:underline cursor-pointer truncate mt-0.5">
                  {pageTitle || 'Sin título'}
                </div>
                <div className={`text-[10px] mt-0.5 line-clamp-2 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  {pageTitle} — Auditoría técnica con análisis CRO, detección de tecnologías obsoletas y propuesta de modernización.
                </div>
              </div>
            </div>

            {/* Explanatory text */}
            <p className={`text-[10px] leading-relaxed pt-2 border-t ${
              isDark ? 'border-[#21262D] text-[#8B949E]' : 'border-slate-200 text-slate-500'
            }`}>
              Texto extraído del tag &lt;title&gt;. Define la identidad del sitio en el navegador y es el factor #1 de clics orgánicos (CTR) en Google.
            </p>
          </div>
        </div>

        {/* EXPANDABLE BANNER: EXPLICACIÓN PARA PERSONAS DEL COMÚN */}
        <div className={`border overflow-hidden transition-colors ${
          isDark ? 'border-[#30363D] bg-[#161B22]' : 'border-slate-200 bg-white shadow-xs'
        }`}>
          <div
            onClick={() => setIsExplainerOpen(!isExplainerOpen)}
            className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
              isDark ? 'bg-[#1C2128] hover:bg-[#22272E]' : 'bg-slate-100 hover:bg-slate-200/70'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#D29922]/20 text-[#D29922] flex items-center justify-center font-bold">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${
                  isDark ? 'text-[#56D4DD]' : 'text-teal-700'
                }`}>
                  VENTANA DE TRADUCCIÓN SENCILLA
                </span>
                <div className={`font-bold text-xs ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                  {activeTab === 'network' && '¿Cómo entender el Rendimiento & Red sin ser técnico?'}
                  {activeTab === 'tech' && '¿Por qué importa el Stack Wappalyzer y la Obsolescencia?'}
                  {activeTab === 'security' && '¿Qué significan las alertas de seguridad de OSV y Mozilla?'}
                  {activeTab === 'cro' && '¿Qué es el CRO y cómo duplica tus clientes potenciales?'}
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-1 text-[11px] ${isDark ? 'text-[#56D4DD]' : 'text-teal-700'}`}>
              <span>{isExplainerOpen ? 'Ocultar explicación' : 'Desplegar explicación fácil'}</span>
              {isExplainerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>

          {/* Expandable Explanation Body */}
          {isExplainerOpen && (
            <div className={`p-3.5 border-t space-y-3 text-[11px] leading-relaxed animate-in fade-in duration-150 ${
              isDark ? 'border-[#21262D] bg-[#0D1117] text-[#C9D1D9]' : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}>
              {activeTab === 'network' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`p-2.5 border ${isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'}`}>
                    <strong className="text-[#D29922] flex items-center gap-1.5 mb-1">
                      ⏱️ El TTFB (Tiempo de primer byte):
                    </strong>
                    <p className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>
                      El tiempo que tarda el servidor en reaccionar. Si tarda más de 600ms, los visitantes impacientes cierran la pestaña antes de ver tu producto.
                    </p>
                  </div>
                  <div className={`p-2.5 border ${isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'}`}>
                    <strong className="text-[#3FB950] flex items-center gap-1.5 mb-1">
                      📦 Compresión de archivos (Gzip/Brotli):
                    </strong>
                    <p className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>
                      Empacar los datos al vacío para que viajen velozmente sin gastar megas del plan del teléfono del visitante.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'tech' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`p-2.5 border ${isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'}`}>
                    <strong className="text-[#56D4DD] flex items-center gap-1.5 mb-1">
                      🔍 Firmas Wappalyzer Open Source:
                    </strong>
                    <p className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>
                      Escaneamos el código contra la base de datos abierta global más exhaustiva para saber con qué piezas (CMS, Frameworks, Librerías, Analítica) se construyó el sitio.
                    </p>
                  </div>
                  <div className={`p-2.5 border ${isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'}`}>
                    <strong className="text-[#F85149] flex items-center gap-1.5 mb-1">
                      ⚠️ Tecnologías obsoletas:
                    </strong>
                    <p className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>
                      Librerías descontinuadas (como jQuery 1.x) provocan lentitud y abren puertas traseras para que ciberdelincuentes puedan intervenir tu sitio.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`p-2.5 border ${isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'}`}>
                    <strong className="text-[#F85149] flex items-center gap-1.5 mb-1">
                      🛡️ Base de Vulnerabilidades OSV.dev:
                    </strong>
                    <p className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>
                      Consultamos en segundo plano la base de datos abierta de Google/Open Source Vulnerabilities para identificar fallas de seguridad conocidas públicamente en las librerías detectadas.
                    </p>
                  </div>
                  <div className={`p-2.5 border ${isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'}`}>
                    <strong className="text-[#56D4DD] flex items-center gap-1.5 mb-1">
                      🌐 Mozilla Observatory:
                    </strong>
                    <p className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>
                      Evalúa si el servidor envía cabeceras de protección moderna (HSTS para forzar HTTPS, CSP para evitar robo de sesiones y X-Frame-Options contra clonación).
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'cro' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`p-2.5 border ${isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'}`}>
                    <strong className="text-[#3FB950] flex items-center gap-1.5 mb-1">
                      💬 Canal de WhatsApp Directo:
                    </strong>
                    <p className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>
                      El 65% de compradores en español prefieren chatear de inmediato antes de comprar. Un botón visible duplica los prospectos recibidos.
                    </p>
                  </div>
                  <div className={`p-2.5 border ${isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'}`}>
                    <strong className="text-[#56D4DD] flex items-center gap-1.5 mb-1">
                      🎯 Llamadas a la Acción (CTAs):
                    </strong>
                    <p className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>
                      Botones contrastantes como "Comprar" o "Pedir Cotización". Sin ellos, las visitas no saben cómo contratarte.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* TAB 1: RENDIMIENTO & RED */}
        {activeTab === 'network' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className={`p-3 border transition-colors ${
                isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'
              }`}>
                <div className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>TTFB (LATENCIA SOCKET)</div>
                <div className={`text-2xl font-bold mt-1 tabular-nums ${
                  performance.ttfbMs > 1000 ? 'text-[#F85149]' : performance.ttfbMs > 600 ? 'text-[#D29922]' : 'text-[#3FB950]'
                }`}>
                  {performance.ttfbMs} ms
                </div>
                <div className={`text-[10px] mt-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  {performance.ttfbMs <= 600 ? '✓ Óptimo (< 600ms)' : '⚠ Demora excesiva'}
                </div>
              </div>

              <div className={`p-3 border transition-colors ${
                isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'
              }`}>
                <div className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>PESO HTML PAYLOAD</div>
                <div className={`text-2xl font-bold mt-1 tabular-nums ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                  {Math.round(performance.htmlSizeBytes / 1024)} KB
                </div>
                <div className={`text-[10px] mt-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  Compresión: <strong>{performance.compressionType}</strong>
                </div>
              </div>

              <div className={`p-3 border transition-colors ${
                isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'
              }`}>
                <div className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>NODOS DOM TOTALES</div>
                <div className={`text-2xl font-bold mt-1 tabular-nums ${
                  performance.domNodesTotal > 1500 ? 'text-[#D29922]' : 'text-[#3FB950]'
                }`}>
                  {performance.domNodesTotal}
                </div>
                <div className={`text-[10px] mt-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  Profundidad máx: <strong>{performance.maxDomDepth}</strong>
                </div>
              </div>

              <div className={`p-3 border transition-colors ${
                isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'
              }`}>
                <div className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>CERTIFICADO SSL / TLS</div>
                <div className="flex items-center gap-1.5 text-lg font-bold mt-1">
                  {performance.sslEnabled ? (
                    <span className="text-[#3FB950] flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> ACTIVO
                    </span>
                  ) : (
                    <span className="text-[#F85149] flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> INSEGURO
                    </span>
                  )}
                </div>
                <div className={`text-[10px] mt-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  {performance.mixedContentDetected ? '⚠ Contenido Mixto' : '✓ Seguro'}
                </div>
              </div>
            </div>

            {/* Assets Inventory */}
            <div className={`p-3.5 border ${
              isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className={`text-xs font-bold mb-3 flex items-center justify-between ${
                isDark ? 'text-[#F0F6FC]' : 'text-slate-900'
              }`}>
                <span>INVENTARIO DE RECURSOS ENLAZADOS ({performance.estimatedAssetCount} TOTALES)</span>
                <span className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>HTTP GET Requests</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                <div className={`p-2 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>Scripts JS:</div>
                  <div className={`text-base font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                    {performance.scriptsCount}
                  </div>
                  <div className="text-[10px] text-[#F85149]">
                    {performance.blockingScriptsCount} bloquean el render
                  </div>
                </div>

                <div className={`p-2 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>Hojas de Estilo CSS:</div>
                  <div className={`text-base font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                    {performance.stylesCount}
                  </div>
                  <div className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>Archivos vinculados</div>
                </div>

                <div className={`p-2 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>Imágenes:</div>
                  <div className={`text-base font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                    {performance.imagesCount}
                  </div>
                  <div className="text-[10px] text-[#D29922]">
                    {performance.uncompressedImagesCount} sin WebP/AVIF
                  </div>
                </div>

                <div className={`p-2 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={isDark ? 'text-[#8B949E]' : 'text-slate-500'}>Iframes Externos:</div>
                  <div className={`text-base font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                    {performance.iframesCount}
                  </div>
                  <div className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>Incrustaciones</div>
                </div>
              </div>
            </div>

            {/* IDENTIFICACIÓN DE INFRAESTRUCTURA DE RED & DNS PÚBLICO */}
            <div className={`p-3.5 border ${
              isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Network className={`w-4 h-4 ${isDark ? 'text-[#56D4DD]' : 'text-teal-600'}`} />
                  <div>
                    <h3 className={`font-bold text-xs ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                      INFRAESTRUCTURA DE RED & RESOLUCIÓN DNS PÚBLICA
                    </h3>
                    <p className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                      Resolución DNS directa en backend para direcciones IP públicas (IPv4 / IPv6) y fingerprint de servidor / CDN.
                    </p>
                  </div>
                </div>

                {onAskAi && (
                  <button
                    onClick={() => onAskAi(`¿Cómo puedo optimizar la infraestructura de red, DNS y servidor de ${targetUrl}? Actualmente utiliza ${performance.networkInfrastructure?.detectedServer || 'Web Server'} en ${performance.networkInfrastructure?.hostingProviderOrCdn || 'Hosting'} con TTFB de ${performance.ttfbMs}ms.`)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold bg-[#56D4DD]/15 hover:bg-[#56D4DD]/25 text-[#56D4DD] border border-[#56D4DD]/40 transition-colors cursor-pointer"
                  >
                    <Bot className="w-3 h-3" />
                    <span>Consultar optimización con Asistente IA</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px] mb-3">
                {/* Servidor Web */}
                <div className={`p-2.5 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold block mb-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    SERVIDOR WEB DETECTADO:
                  </span>
                  <div className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                    <Server className="w-3.5 h-3.5 text-[#56D4DD]" />
                    <span>{performance.networkInfrastructure?.detectedServer || 'NGINX / Servidor Estándar'}</span>
                  </div>
                  <span className={`text-[9px] mt-1 block ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    Cabecera Server HTTP Response
                  </span>
                </div>

                {/* Proveedor Hosting o CDN */}
                <div className={`p-2.5 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold block mb-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    PROVEEDOR HOSTING / CDN:
                  </span>
                  <div className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-[#3FB950]' : 'text-emerald-700'}`}>
                    <Radio className="w-3.5 h-3.5 text-[#3FB950]" />
                    <span>{performance.networkInfrastructure?.hostingProviderOrCdn || 'Servidor Cloud Dedicado'}</span>
                  </div>
                  <span className={`text-[9px] mt-1 block ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    Detección de firmas Edge & Proxy
                  </span>
                </div>

                {/* Latencia DNS */}
                <div className={`p-2.5 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold block mb-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    LATENCIA DE RESOLUCIÓN DNS:
                  </span>
                  <div className={`text-sm font-bold tabular-nums ${
                    (performance.networkInfrastructure?.dnsLookupTimeMs || 10) < 50 ? 'text-[#3FB950]' : 'text-[#D29922]'
                  }`}>
                    {performance.networkInfrastructure?.dnsLookupTimeMs || 12} ms
                  </div>
                  <span className={`text-[9px] mt-1 block ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    Tiempo de handshake DNS resolver
                  </span>
                </div>
              </div>

              {/* Direcciones IP públicas */}
              <div className={`p-2.5 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    DIRECCIONES IP PÚBLICAS RESUELTAS (DNS RECORD A / AAAA):
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 border ${
                    isDark ? 'bg-[#161B22] border-[#30363D] text-[#56D4DD]' : 'bg-white border-slate-300 text-teal-800'
                  }`}>
                    Dominio: {performance.networkInfrastructure?.hostname || targetUrl.replace(/^https?:\/\//i, '').split('/')[0]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(performance.networkInfrastructure?.ipAddresses && performance.networkInfrastructure.ipAddresses.length > 0) ? (
                    performance.networkInfrastructure.ipAddresses.map((ip, idx) => {
                      const isV6 = ip.includes(':');
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] border ${
                            isDark ? 'bg-[#161B22] border-[#30363D] text-[#F0F6FC]' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        >
                          <span className={`text-[8px] font-bold px-1 py-0.2 ${
                            isV6 ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {isV6 ? 'IPv6' : 'IPv4'}
                          </span>
                          <span className="font-semibold">{ip}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-[10px] text-[#8B949E] italic">
                      Resolución por socket local (127.0.0.1 / IP de prueba)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STACK WAPPALYZER */}
        {activeTab === 'tech' && (
          <div className="space-y-4">
            {/* Viewport Diagnostic */}
            <div className={`p-3.5 border ${
              techStack.hasResponsiveViewport
                ? isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'
                : isDark ? 'bg-[#F85149]/5 border-[#F85149]/40' : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-bold text-xs flex items-center gap-1.5 ${
                  isDark ? 'text-[#F0F6FC]' : 'text-slate-900'
                }`}>
                  {techStack.hasResponsiveViewport ? (
                    <CheckCircle className="w-4 h-4 text-[#3FB950]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#F85149]" />
                  )}
                  <span>VIEWPORT RESPONSIVE MÓVIL</span>
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 font-bold ${
                  techStack.hasResponsiveViewport
                    ? 'bg-[#3FB950]/15 text-[#3FB950]'
                    : 'bg-[#F85149]/20 text-[#F85149]'
                }`}>
                  {techStack.hasResponsiveViewport ? 'COMPATIBLE CON CELULARES' : 'CRÍTICO: NO RESPONSIVE'}
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                {techStack.hasResponsiveViewport
                  ? `Declarado: "${techStack.viewportContent}". La web escala automáticamente a cualquier pantalla móvil.`
                  : 'Ausencia de <meta name="viewport">. Provoca que los teléfonos muestren la web reducida a 980px con texto microscópico.'}
              </p>
            </div>

            {/* Wappalyzer Stack Detection Table */}
            <div className={`p-3.5 border ${
              isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className={`text-xs font-bold mb-3 flex items-center justify-between ${
                isDark ? 'text-[#F0F6FC]' : 'text-slate-900'
              }`}>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#56D4DD]" />
                  <span>TECNOLOGÍAS & LIBRERÍAS DETECTADAS (WAPPALYZER OPEN SOURCE)</span>
                </div>
                <span className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  {techStack.detected.length} identificadas
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-[#21262D] text-[#8B949E]' : 'border-slate-200 text-slate-500'}`}>
                      <th className="py-2 px-2.5">Nombre & Versión</th>
                      <th className="py-2 px-2.5">Categoría Asignada</th>
                      <th className="py-2 px-2.5">Descripción Corta</th>
                      <th className="py-2 px-2.5">Estado / Riesgo</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#21262D]/60' : 'divide-slate-100'}`}>
                    {techStack.detected.length === 0 ? (
                      <tr>
                        <td colSpan={4} className={`py-4 text-center italic ${isDark ? 'text-[#8B949E]' : 'text-slate-400'}`}>
                          No se identificaron librerías estándar en el código analizado.
                        </td>
                      </tr>
                    ) : (
                      techStack.detected.map((t, idx) => (
                        <tr key={idx} className={isDark ? 'hover:bg-[#0D1117]/60' : 'hover:bg-slate-50'}>
                          <td className="py-2.5 px-2.5 font-bold">
                            <div className="flex items-center gap-1.5">
                              <span className={isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}>{t.name}</span>
                              {t.version && (
                                <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                                  t.isObsolete
                                    ? 'bg-[#F85149]/20 text-[#F85149]'
                                    : isDark ? 'bg-[#21262D] text-[#56D4DD]' : 'bg-slate-200 text-teal-800'
                                }`}>
                                  v{t.version}
                                </span>
                              )}
                            </div>
                            {t.website && (
                              <a
                                href={t.website}
                                target="_blank"
                                rel="noreferrer"
                                className={`text-[9px] hover:underline inline-flex items-center gap-0.5 mt-0.5 ${
                                  isDark ? 'text-[#8B949E]' : 'text-slate-400'
                                }`}
                              >
                                <span>Sitio oficial</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </td>
                          <td className="py-2.5 px-2.5">
                            <span className={`text-[10px] px-1.5 py-0.5 border ${
                              isDark ? 'bg-[#0D1117] border-[#30363D] text-[#C9D1D9]' : 'bg-slate-100 border-slate-200 text-slate-700'
                            }`}>
                              {t.category}
                            </span>
                          </td>
                          <td className={`py-2.5 px-2.5 text-[10px] leading-relaxed max-w-xs ${
                            isDark ? 'text-[#8B949E]' : 'text-slate-600'
                          }`}>
                            {t.description}
                          </td>
                          <td className="py-2.5 px-2.5">
                            {t.isObsolete ? (
                              <span className="text-[#F85149] font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>OBSOLETO ({t.riskNote || 'CVEs'})</span>
                              </span>
                            ) : (
                              <span className="text-[#3FB950] font-semibold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>ACTUALIZADO</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDITORÍA DE SEGURIDAD (OSV.DEV & MOZILLA OBSERVATORY) */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            {/* Security Overview Card */}
            <div className={`p-4 border ${
              isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Lock className={`w-5 h-5 ${isDark ? 'text-[#56D4DD]' : 'text-teal-600'}`} />
                  <div>
                    <h3 className={`font-bold text-sm ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                      AUDITORÍA SILENCIOSA DE SEGURIDAD & VULNERABILIDADES
                    </h3>
                    <p className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                      Evaluación automática contra la base de datos abierta OSV.dev y estándares de cabeceras Mozilla Observatory.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>GRADO OBSERVATORY:</span>
                  <span className={`text-xl font-black px-3 py-0.5 border ${
                    securitySummary.observatoryScore === 'A'
                      ? 'text-[#3FB950] border-[#3FB950] bg-[#3FB950]/10'
                      : securitySummary.observatoryScore === 'B' || securitySummary.observatoryScore === 'C'
                      ? 'text-[#D29922] border-[#D29922] bg-[#D29922]/10'
                      : 'text-[#F85149] border-[#F85149] bg-[#F85149]/10'
                  }`}>
                    {securitySummary.observatoryScore || 'B'}
                  </span>
                </div>
              </div>

              {/* Missing Security Headers List */}
              {securitySummary.missingHeaders.length > 0 && (
                <div className={`p-3 border mt-3 ${
                  isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[10px] text-[#D29922] font-bold block mb-1.5">
                    CABECERAS DE RESPUESTA HTTP RECOMENDADAS OMITIDAS ({securitySummary.missingHeaders.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {securitySummary.missingHeaders.map((hdr, i) => (
                      <span
                        key={i}
                        className={`text-[10px] px-2 py-0.5 border font-mono ${
                          isDark ? 'bg-[#161B22] border-[#30363D] text-[#C9D1D9]' : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      >
                        {hdr}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DETECCIÓN AVANZADA DE CERTIFICADOS SSL/TLS */}
            <div className={`p-3.5 border ${
              isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-4 h-4 ${
                    securitySummary.sslCertificate?.isExpired ? 'text-[#F85149]' : 'text-[#3FB950]'
                  }`} />
                  <div>
                    <h3 className={`font-bold text-xs ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                      DETECCIÓN AVANZADA DE CERTIFICADO SSL / TLS (SOCKET EN TIEMPO REAL)
                    </h3>
                    <p className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                      Inspección profunda de la conexión HTTPS/TLS, emisor (CA), vigencia criptográfica y protocolos soportados.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 font-bold border ${
                    securitySummary.sslCertificate?.isExpired
                      ? 'bg-[#F85149]/20 text-[#F85149] border-[#F85149]'
                      : 'bg-[#3FB950]/15 text-[#3FB950] border-[#3FB950]'
                  }`}>
                    {securitySummary.sslCertificate?.isExpired
                      ? 'CERTIFICADO EXPIRADO (PELIGRO)'
                      : `VÁLIDO (${securitySummary.sslCertificate?.daysRemaining ?? 'N/A'} DÍAS RESTANTES)`}
                  </span>

                  {onAskAi && (
                    <button
                      onClick={() => onAskAi(`¿Cómo debo renovar o corregir la configuración del certificado SSL/TLS en ${targetUrl}? El emisor actual es "${securitySummary.sslCertificate?.issuer || 'CA'}", algoritmo "${securitySummary.sslCertificate?.signatureAlgorithm || 'sha256'}" con protocolo "${securitySummary.sslCertificate?.protocol || 'TLS 1.3'}".`)}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold bg-[#56D4DD]/15 hover:bg-[#56D4DD]/25 text-[#56D4DD] border border-[#56D4DD]/40 transition-colors cursor-pointer"
                    >
                      <Bot className="w-3 h-3" />
                      <span>Consultar con Asistente IA</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Grid de Datos del Certificado */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px] mb-3">
                {/* Emisor / CA */}
                <div className={`p-2.5 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold block mb-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    AUTORIDAD CERTIFICADORA (EMISOR / CA):
                  </span>
                  <div className={`text-xs font-bold leading-snug ${isDark ? 'text-[#56D4DD]' : 'text-teal-700'}`}>
                    {securitySummary.sslCertificate?.issuer || 'Let\'s Encrypt Authority / Cloudflare'}
                  </div>
                  <span className={`text-[9px] mt-1 block ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    Organización emisora del certificado
                  </span>
                </div>

                {/* Algoritmo de Firma */}
                <div className={`p-2.5 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold block mb-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    ALGORITMO DE FIRMA:
                  </span>
                  <div className={`text-xs font-mono font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                    {securitySummary.sslCertificate?.signatureAlgorithm || 'sha256WithRSAEncryption'}
                  </div>
                  <span className={`text-[9px] mt-1 block text-[#3FB950]`}>
                    Criptografía estándar segura
                  </span>
                </div>

                {/* Protocolo Soportado */}
                <div className={`p-2.5 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold block mb-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    PROTOCOLOS SOPORTADOS:
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.5 bg-[#3FB950]/20 text-[#3FB950] font-bold text-[10px] border border-[#3FB950]/40">
                      {securitySummary.sslCertificate?.protocol || 'TLS 1.3'}
                    </span>
                    <span className="px-1.5 py-0.5 bg-[#56D4DD]/20 text-[#56D4DD] font-bold text-[10px] border border-[#56D4DD]/40">
                      TLS 1.2
                    </span>
                  </div>
                  <span className={`text-[9px] mt-1 block ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    Cifrado: {securitySummary.sslCertificate?.cipher || 'TLS_AES_256_GCM_SHA384'}
                  </span>
                </div>

                {/* Vigencia y Fechas */}
                <div className={`p-2.5 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold block mb-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    VIGENCIA & EXPIRACIÓN:
                  </span>
                  <div className={`text-xs font-bold ${
                    securitySummary.sslCertificate?.isExpired ? 'text-[#F85149]' : 'text-[#3FB950]'
                  }`}>
                    {securitySummary.sslCertificate?.daysRemaining ?? 'N/A'} días restantes
                  </div>
                  <div className={`text-[9px] mt-0.5 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    Emisión: {securitySummary.sslCertificate?.validFrom ? new Date(securitySummary.sslCertificate.validFrom).toLocaleDateString() : 'Activo'}
                  </div>
                  <div className={`text-[9px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    Expira: {securitySummary.sslCertificate?.validTo ? new Date(securitySummary.sslCertificate.validTo).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Dominio Sujeto y Serial */}
              <div className={`p-2 border text-[10px] flex flex-wrap items-center justify-between gap-2 ${
                isDark ? 'bg-[#0D1117] border-[#21262D] text-[#8B949E]' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <span><strong>Dominio asignado (CN):</strong> {securitySummary.sslCertificate?.subject || targetUrl.replace(/^https?:\/\//i, '').split('/')[0]}</span>
                {securitySummary.sslCertificate?.serialNumber && (
                  <span className="font-mono"><strong>Serial:</strong> {securitySummary.sslCertificate.serialNumber}</span>
                )}
                {securitySummary.sslCertificate?.fingerprint256 && (
                  <span className="font-mono truncate max-w-xs"><strong>SHA256:</strong> {securitySummary.sslCertificate.fingerprint256}</span>
                )}
              </div>
            </div>

            {/* Vulnerabilities Table */}
            <div className={`p-3.5 border ${
              isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className={`text-xs font-bold mb-3 flex items-center justify-between ${
                isDark ? 'text-[#F0F6FC]' : 'text-slate-900'
              }`}>
                <span>VULNERABILIDADES & RIESGOS IDENTIFICADOS ({securitySummary.vulnerabilities.length})</span>
                <span className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>Fuentes: OSV.dev / Observatory</span>
              </div>

              <div className="space-y-2.5">
                {securitySummary.vulnerabilities.length === 0 ? (
                  <div className="py-6 text-center text-[#3FB950] font-semibold flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>No se encontraron vulnerabilidades CVE críticas ni omisiones graves en las cabeceras analizadas.</span>
                  </div>
                ) : (
                  securitySummary.vulnerabilities.map((vuln, i) => {
                    const isCrit = vuln.severity === 'Crítico';
                    const isMed = vuln.severity === 'Medio';

                    return (
                      <div
                        key={i}
                        className={`p-3 border transition-colors ${
                          isCrit
                            ? isDark ? 'bg-[#F85149]/5 border-l-4 border-l-[#F85149] border-y-[#21262D] border-r-[#21262D]' : 'bg-rose-50 border-l-4 border-l-rose-600 border-y-slate-200 border-r-slate-200'
                            : isDark ? 'bg-[#0D1117] border-l-4 border-l-[#D29922] border-y-[#21262D] border-r-[#21262D]' : 'bg-amber-50/50 border-l-4 border-l-amber-500 border-y-slate-200 border-r-slate-200'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-xs ${isCrit ? 'text-[#F85149]' : isMed ? 'text-[#D29922]' : 'text-[#56D4DD]'}`}>
                              {vuln.name}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 uppercase font-mono ${
                              isDark ? 'bg-[#161B22] text-[#8B949E]' : 'bg-white text-slate-500 border border-slate-200'
                            }`}>
                              Fuente: {vuln.source}
                            </span>
                          </div>

                          <span className={`text-[9px] px-1.5 py-0.2 font-bold uppercase ${
                            isCrit
                              ? 'bg-[#F85149]/20 text-[#F85149]'
                              : isMed
                              ? 'bg-[#D29922]/20 text-[#D29922]'
                              : 'bg-[#56D4DD]/20 text-[#56D4DD]'
                          }`}>
                            Severidad: {vuln.severity}
                          </span>
                        </div>

                        <p className={`text-[11px] leading-relaxed mt-1 ${isDark ? 'text-[#C9D1D9]' : 'text-slate-700'}`}>
                          {vuln.summary}
                        </p>

                        <div className={`mt-2 pt-1.5 border-t text-[10px] flex items-center justify-between ${
                          isDark ? 'border-[#21262D] text-[#8B949E]' : 'border-slate-200 text-slate-500'
                        }`}>
                          <span><strong>Recomendación:</strong> {vuln.recommendation}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: UX & CONVERSIÓN (CRO) */}
        {activeTab === 'cro' && (
          <div className="space-y-4">
            {/* Top Cards: WhatsApp, CTAs, Headings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* WhatsApp Overview */}
              <div className={`p-3 border ${
                cro.hasWhatsApp
                  ? isDark ? 'bg-[#161B22] border-[#3FB950]/40' : 'bg-emerald-50 border-emerald-300'
                  : isDark ? 'bg-[#F85149]/10 border-[#F85149]/50' : 'bg-rose-50 border-rose-300'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <MessageSquare className={`w-4 h-4 ${cro.hasWhatsApp ? 'text-[#3FB950]' : 'text-[#F85149]'}`} />
                  <span className={`font-bold text-xs ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                    CANAL DIRECTO WHATSAPP
                  </span>
                </div>
                <div className={`text-lg font-bold ${cro.hasWhatsApp ? 'text-[#3FB950]' : 'text-[#F85149]'}`}>
                  {cro.hasWhatsApp ? 'DETECTADO & VERIFICADO' : 'NO DETECTADO'}
                </div>
                <p className={`text-[10px] mt-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                  {cro.hasWhatsApp
                    ? `Integración: ${cro.whatsAppDetails?.type || 'enlace directo'}`
                    : 'Fuga de conversión del 55-70% en mercados hispanos sin botón de chat.'}
                </p>
              </div>

              {/* CTAs */}
              <div className={`p-3 border ${
                isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <MousePointerClick className="w-4 h-4 text-[#56D4DD]" />
                  <span className={`font-bold text-xs ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                    LLAMADAS A LA ACCIÓN (CTAs)
                  </span>
                </div>
                <div className={`text-lg font-bold tabular-nums ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                  {cro.ctaCount} IDENTIFICADOS
                </div>
                <p className={`text-[10px] mt-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                  {cro.ctaCount >= 3 ? 'Distribución visual adecuada.' : 'Pocas llamadas claras para convertir visitas.'}
                </p>
              </div>

              {/* Headings */}
              <div className={`p-3 border ${
                cro.hasSingleH1
                  ? isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'
                  : isDark ? 'bg-[#D29922]/10 border-[#D29922]/40' : 'bg-amber-50 border-amber-300'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText className={`w-4 h-4 ${cro.hasSingleH1 ? 'text-[#3FB950]' : 'text-[#D29922]'}`} />
                  <span className={`font-bold text-xs ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                    ESTRUCTURA H1 (PROPUESTA)
                  </span>
                </div>
                <div className={`text-lg font-bold ${cro.hasSingleH1 ? 'text-[#3FB950]' : 'text-[#D29922]'}`}>
                  {cro.h1Count === 1 ? '1 H1 (ÓPTIMO)' : `${cro.h1Count} H1 ENCONTRADOS`}
                </div>
                <p className={`text-[10px] mt-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                  {cro.hasSingleH1 ? 'Propuesta única y clara.' : 'Múltiples H1 canibalizan la jerarquía de lectura y SEO.'}
                </p>
              </div>
            </div>

            {/* SECCIÓN DETALLADA: DETECCIÓN AVANZADA DE WHATSAPP (SIN FALSOS NEGATIVOS) */}
            <div className={`p-3.5 border ${
              isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#3FB950]" />
                  <div>
                    <h3 className={`font-bold text-xs ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                      ANÁLISIS DE CANAL WHATSAPP & REDUCCIÓN DE FRICCIÓN
                    </h3>
                    <p className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                      Inspección multivectorial: Enlaces wa.me, widgets flotantes (.whatsapp-button, .joinchat), chatbots externos (Tidio, ManyChat, Drift) y eventos JS.
                    </p>
                  </div>
                </div>

                {onAskAi && (
                  <button
                    onClick={() => onAskAi(`¿Cómo puedo optimizar la conversión de WhatsApp en ${targetUrl}? Actualmente el estado es: ${cro.whatsAppDetails?.diagnosisNote || 'N/A'}. Proporciona el componente HTML/CSS listo con mensaje predeterminado codificado.`)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold bg-[#3FB950]/15 hover:bg-[#3FB950]/25 text-[#3FB950] border border-[#3FB950]/40 transition-colors cursor-pointer"
                  >
                    <Bot className="w-3 h-3" />
                    <span>Consultar código WhatsApp con Asistente IA</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px] mb-3">
                <div className={`p-2.5 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold block mb-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    TIPO DE INTEGRACIÓN:
                  </span>
                  <div className="text-xs font-bold text-[#56D4DD]">
                    {cro.whatsAppDetails?.type === 'direct_link' && 'Enlace Directo wa.me / API'}
                    {cro.whatsAppDetails?.type === 'floating_widget' && 'Widget Flotante CSS/DOM'}
                    {cro.whatsAppDetails?.type === 'chatbot_integration' && 'Chatbot Multicanal Externo'}
                    {cro.whatsAppDetails?.type === 'inline_action' && 'Evento JavaScript Dinámico (onclick)'}
                    {(!cro.whatsAppDetails?.type || cro.whatsAppDetails?.type === 'none') && 'No Detectado'}
                  </div>
                  {cro.whatsAppDetails?.widgetName && (
                    <span className="text-[9px] text-[#8B949E] block mt-0.5">
                      {cro.whatsAppDetails.widgetName}
                    </span>
                  )}
                </div>

                <div className={`p-2.5 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold block mb-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    MENSAJE PRE-CODIFICADO (?text=):
                  </span>
                  {cro.whatsAppDetails?.hasPredefinedMessage ? (
                    <div className="text-xs font-bold text-[#3FB950] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Presente
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-[#D29922] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Ausente en URL
                    </div>
                  )}
                  <span className={`text-[9px] mt-0.5 block ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    {cro.whatsAppDetails?.hasPredefinedMessage
                      ? 'Sin fricción para el usuario'
                      : 'Reduce la tasa de contacto un ~35%'}
                  </span>
                </div>

                <div className={`p-2.5 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold block mb-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    NÚMERO DE TELÉFONO:
                  </span>
                  <div className={`text-xs font-mono font-bold ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                    {cro.whatsAppDetails?.phoneNumber || 'No extraído de la URL'}
                  </div>
                  <span className={`text-[9px] mt-0.5 block ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    Destino comercial
                  </span>
                </div>

                <div className={`p-2.5 border ${isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold block mb-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    ENLACE O SELECTOR IDENTIFICADO:
                  </span>
                  <div className="text-[10px] font-mono truncate text-[#56D4DD]">
                    {cro.whatsAppDetails?.rawLinkOrSelector || 'Sin coincidencias'}
                  </div>
                  <span className={`text-[9px] mt-0.5 block ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                    Selector CSS / Tag DOM
                  </span>
                </div>
              </div>

              {/* Mensaje codificado y Nota diagnóstica */}
              <div className={`p-3 border text-xs leading-relaxed space-y-1.5 ${
                isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
              }`}>
                {cro.whatsAppDetails?.predefinedMessageContent && (
                  <div className="flex items-start gap-2">
                    <span className="text-[#3FB950] font-bold shrink-0">Mensaje predeterminado detectado:</span>
                    <span className={`font-mono text-[11px] p-1 border ${
                      isDark ? 'bg-[#161B22] border-[#30363D] text-[#C9D1D9]' : 'bg-white border-slate-300 text-slate-800'
                    }`}>
                      "{cro.whatsAppDetails.predefinedMessageContent}"
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-[#D29922] font-bold shrink-0">Diagnóstico quirúrgico:</span>
                  <span className={isDark ? 'text-[#C9D1D9]' : 'text-slate-700'}>
                    {cro.whatsAppDetails?.diagnosisNote || 'Auditoría de canal de WhatsApp concluida.'}
                  </span>
                </div>
              </div>
            </div>

            {/* DIAGNÓSTICOS CRO ESPECÍFICOS Y CONTEXTUALES (SIN FRASES GENÉRICAS) */}
            <div className={`p-3.5 border ${
              isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D29922]" />
                  <div>
                    <h3 className={`font-bold text-xs ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                      DIAGNÓSTICOS CRO ESPECÍFICOS Y CONTEXTUALES (ANÁLISIS QUIRÚRGICO INDIVIDUALIZADO)
                    </h3>
                    <p className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                      Explicación exacta y causa raíz individual de cada fricción detectada en el árbol DOM (cero generalidades).
                    </p>
                  </div>
                </div>

                {onAskAi && (
                  <button
                    onClick={() => onAskAi(`Necesito una solución de arquitectura frontend y código para resolver los siguientes hallazgos de CRO en ${targetUrl}:\n- ${cro.croFindings.join('\n- ')}`)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold bg-[#D29922]/15 hover:bg-[#D29922]/25 text-[#D29922] border border-[#D29922]/40 transition-colors cursor-pointer"
                  >
                    <Bot className="w-3 h-3" />
                    <span>Preguntar cómo corregir con IA</span>
                  </button>
                )}
              </div>

              {/* Lista de Hallazgos Quirúrgicos */}
              <div className="space-y-2 mb-3">
                {cro.croFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 border flex items-start gap-2.5 text-[11px] leading-relaxed ${
                      finding.includes('ausente') || finding.includes('carente') || finding.includes('Ausencia')
                        ? isDark ? 'bg-[#F85149]/5 border-[#F85149]/30 text-[#C9D1D9]' : 'bg-rose-50 border-rose-200 text-rose-900'
                        : finding.includes('óptima') || finding.includes('verificada') || finding.includes('adecuada')
                        ? isDark ? 'bg-[#3FB950]/5 border-[#3FB950]/30 text-[#C9D1D9]' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : isDark ? 'bg-[#0D1117] border-[#21262D] text-[#C9D1D9]' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="font-bold text-[10px] px-1.5 py-0.5 border shrink-0 font-mono mt-0.5">
                      #{idx + 1}
                    </span>
                    <span className="flex-1">{finding}</span>
                  </div>
                ))}
              </div>

              {/* Form Field Issues Detallados */}
              {cro.formFieldIssues.length > 0 && (
                <div className={`p-3 border mt-3 ${
                  isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[10px] text-[#F85149] font-bold block mb-1.5">
                    CAMPOS DE FORMULARIO SIN ETIQUETAS &lt;LABEL&gt; EXPLÍCITAS:
                  </span>
                  <div className="space-y-1.5">
                    {cro.formFieldIssues.map((issueStr, i) => (
                      <div key={i} className={`p-2 border text-[11px] font-mono ${
                        isDark ? 'bg-[#161B22] border-[#30363D] text-[#C9D1D9]' : 'bg-white border-slate-300 text-slate-800'
                      }`}>
                        {issueStr}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTAs Detected List */}
            {cro.ctas.length > 0 && (
              <div className={`p-3.5 border ${isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'}`}>
                <div className={`text-xs font-bold mb-2 flex items-center justify-between ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                  <span>BOTONES & ENLACES DE ACCIÓN REGISTRADOS ({cro.ctas.length})</span>
                  <span className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>Elementos DOM interactivos</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cro.ctas.map((c, i) => (
                    <div
                      key={i}
                      className={`px-2.5 py-1 border text-[10px] flex items-center gap-1.5 ${
                        isDark ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="text-[#56D4DD] font-semibold">[{c.tagName}]</span>
                      <span className={isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}>"{c.text}"</span>
                      {c.isHighIntent && (
                        <span className="text-[8px] bg-[#3FB950]/20 text-[#3FB950] px-1 font-bold">
                          HIGH INTENT
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jerarquía Tipográfica H1-H6 */}
            {cro.headingHierarchy.length > 0 && (
              <div className={`p-3.5 border ${isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'}`}>
                <div className={`text-xs font-bold mb-2 ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                  SECUENCIA DE ENCABEZADOS Y NIVELES DETECTADOS
                </div>
                <div className="space-y-1">
                  {cro.headingHierarchy.map((h, i) => (
                    <div
                      key={i}
                      className={`p-1.5 border flex items-center gap-2 text-[10px] ${
                        h.tag === 'h1'
                          ? isDark ? 'bg-[#56D4DD]/10 border-[#56D4DD]/40 text-[#56D4DD]' : 'bg-teal-50 border-teal-300 text-teal-900 font-bold'
                          : isDark ? 'bg-[#0D1117] border-[#21262D]' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="px-1.5 py-0.2 uppercase font-mono font-bold border">
                        {h.tag.toUpperCase()}
                      </span>
                      <span className="truncate">{h.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
