import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Settings,
  Sparkles,
  Terminal,
  Cpu,
  Check,
  Copy,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Code2,
  X,
  ExternalLink,
  Zap,
  ShieldAlert,
  MessageSquare,
  Globe,
  Sliders,
} from 'lucide-react';
import { AiAssistantConfig, AiChatMessage, AuditResult } from '../types/audit.js';

interface AiConsultantPanelProps {
  auditResult: AuditResult;
  theme: 'dark' | 'light';
  initialPrompt?: string;
}

const DEFAULT_CONFIG: AiAssistantConfig = {
  provider: 'gemini',
  endpointUrl: '',
  modelName: 'gemini-3.8-flash',
  apiKey: '',
  temperature: 0.3,
};

export const AiConsultantPanel: React.FC<AiConsultantPanelProps> = ({
  auditResult,
  theme,
  initialPrompt,
}) => {
  const isDark = theme === 'dark';

  // Load config from localStorage or fallback
  const [config, setConfig] = useState<AiAssistantConfig>(() => {
    try {
      const saved = localStorage.getItem('webscanner_ai_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CONFIG;
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState<AiAssistantConfig>(config);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testErrorMessage, setTestErrorMessage] = useState<string>('');

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hola. Soy tu **Consultor Técnico Senior y Arquitecto Full-Stack**. 

He cargado en memoria los datos técnicos del sitio **"${auditResult.pageTitle}"** (\`${auditResult.url}\`):
- **Salud Global:** ${auditResult.scores.overall}/100 (${auditResult.scores.ratingLevel})
- **Rendimiento:** TTFB ${auditResult.performance.ttfbMs}ms | Servidor: ${auditResult.performance.networkInfrastructure?.detectedServer || 'Web Server'} (${auditResult.performance.networkInfrastructure?.hostingProviderOrCdn || 'Hosting Propio'})
- **Seguridad:** Grado ${auditResult.securitySummary.observatoryScore || 'F'} | SSL: ${auditResult.securitySummary.sslCertificate?.issuer || 'Let\'s Encrypt'} (${auditResult.securitySummary.sslCertificate?.daysRemaining ?? 'N/A'} días)
- **Conversión (CRO):** WhatsApp: ${auditResult.cro.whatsAppDetails?.detected ? 'Detectado' : 'Ausente'} | <h1>: ${auditResult.cro.h1Count} declarado(s)

¿En qué área deseas que profundicemos o qué fragmento de código personalizado necesitas para corregir los hallazgos?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle external initial prompt if provided
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveConfig = () => {
    setConfig(tempConfig);
    try {
      localStorage.setItem('webscanner_ai_config', JSON.stringify(tempConfig));
    } catch {}
    setIsConfigOpen(false);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestErrorMessage('');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Responde únicamente con la palabra: CONEXION_OK' }],
          auditContext: { url: auditResult.url },
          config: tempConfig,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      setTestStatus('success');
    } catch (err: any) {
      setTestStatus('error');
      setTestErrorMessage(err.message || 'Error de conexión');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          auditContext: auditResult,
          config,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Error HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: AiChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Sin respuesta recibida.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: AiChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Aviso de Conexión:** No se pudo completar la consulta con el modelo (${config.provider}):\n\`${err.message}\`\n\nPuedes hacer clic en **"Configurar Modelo / API"** en la barra superior para verificar tu endpoint, seleccionar Ollama Local o ingresar una API key válida.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format code blocks inside markdown
  const renderFormattedContent = (content: string, msgId: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const language = hasLang ? firstLine : 'code';
        const codeText = hasLang ? lines.slice(1).join('\n') : lines.join('\n');
        const snippetId = `${msgId}_code_${index}`;

        return (
          <div key={index} className="my-3 rounded-none border border-[#30363D] overflow-hidden bg-[#0D1117] text-[#F0F6FC]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#161B22] border-b border-[#30363D] text-[10px] font-mono">
              <span className="text-[#56D4DD] uppercase font-bold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                {language}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(codeText, snippetId)}
                className="flex items-center gap-1 text-[#8B949E] hover:text-[#56D4DD] cursor-pointer transition-colors"
                title="Copiar código"
              >
                {copiedId === snippetId ? (
                  <>
                    <Check className="w-3 h-3 text-[#3FB950]" />
                    <span className="text-[#3FB950] font-bold">COPIADO</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>COPIAR</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-[11px] font-mono overflow-x-auto leading-relaxed text-[#E6EDF3]">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Format basic markdown bold and bullet points
      return (
        <div key={index} className="space-y-1.5 text-xs leading-relaxed whitespace-pre-wrap">
          {part.split('\n\n').map((paragraph, pIdx) => (
            <p key={pIdx}>
              {paragraph.split('**').map((chunk, cIdx) => (
                cIdx % 2 === 1 ? <strong key={cIdx} className={isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}>{chunk}</strong> : chunk
              ))}
            </p>
          ))}
        </div>
      );
    });
  };

  return (
    <div className={`flex flex-col h-full font-mono text-xs transition-colors ${
      isDark ? 'bg-[#0D1117] text-[#C9D1D9]' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Top Header Bar */}
      <div className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 ${
        isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 flex items-center justify-center border ${
            isDark ? 'bg-[#0D1117] border-[#30363D] text-[#56D4DD]' : 'bg-teal-50 border-teal-200 text-teal-700'
          }`}>
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold tracking-wider text-xs ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                ASISTENTE IA CONSULTOR SENIOR
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 border uppercase font-mono ${
                isDark ? 'text-[#3FB950] bg-[#3FB950]/10 border-[#3FB950]/30' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
              }`}>
                {config.provider.toUpperCase()} : {config.modelName}
              </span>
            </div>
            <p className={`text-[10px] ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
              Consultoría técnica en tiempo real fundamentada en los datos de la auditoría activa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTempConfig(config);
              setIsConfigOpen(true);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 border text-[11px] font-semibold cursor-pointer transition-colors ${
              isDark
                ? 'bg-[#21262D] hover:bg-[#30363D] border-[#30363D] text-[#56D4DD]'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-teal-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>CONFIGURAR MODELO / API</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  id: 'welcome_reset',
                  role: 'assistant',
                  content: 'Historial reiniciado. He mantenido en memoria los datos de la auditoría de este sitio. ¿En qué puedo ayudarte ahora?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className={`p-1.5 border cursor-pointer transition-colors ${
              isDark
                ? 'bg-[#21262D] hover:bg-[#30363D] border-[#30363D] text-[#8B949E] hover:text-[#C9D1D9]'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
            }`}
            title="Limpiar conversación"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Audit Context Pill Bar */}
      <div className={`px-4 py-1.5 border-b flex items-center justify-between text-[10px] overflow-x-auto gap-3 ${
        isDark ? 'bg-[#0D1117] border-[#21262D] text-[#8B949E]' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-[#56D4DD]">CONTEXTO ACTIVO:</span>
          <span className="truncate max-w-[280px] font-mono">{auditResult.url}</span>
          <span>·</span>
          <span>Score: <strong className="text-[#3FB950]">{auditResult.scores.overall}/100</strong></span>
          <span>·</span>
          <span>TTFB: <strong>{auditResult.performance.ttfbMs}ms</strong></span>
          <span>·</span>
          <span>WhatsApp: <strong>{auditResult.cro.whatsAppDetails?.detected ? (auditResult.cro.whatsAppDetails.hasPredefinedMessage ? 'Con texto' : 'Sin texto') : 'No detectado'}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950] animate-pulse"></span>
          <span>INSPECTOR V3.0 ONLINE</span>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-7 h-7 rounded-none flex items-center justify-center shrink-0 border text-[11px] font-bold ${
                  isUser
                    ? 'bg-[#56D4DD] text-[#0D1117] border-[#56D4DD]'
                    : isDark
                    ? 'bg-[#161B22] border-[#30363D] text-[#3FB950]'
                    : 'bg-white border-slate-300 text-emerald-700 shadow-xs'
                }`}
              >
                {isUser ? 'TÚ' : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] border p-3.5 transition-colors ${
                  isUser
                    ? isDark
                      ? 'bg-[#1F2937] border-[#374151] text-[#F3F4F6]'
                      : 'bg-teal-50 border-teal-200 text-teal-900 shadow-xs'
                    : isDark
                    ? 'bg-[#161B22] border-[#30363D] text-[#C9D1D9]'
                    : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1.5 opacity-60">
                  <span className="font-bold">{isUser ? 'PREGUNTA' : 'CONSULTOR SENIOR'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {renderFormattedContent(msg.content, msg.id)}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className={`w-7 h-7 flex items-center justify-center border ${
              isDark ? 'bg-[#161B22] border-[#30363D] text-[#3FB950]' : 'bg-white border-slate-300 text-emerald-700'
            }`}>
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className={`p-3 border flex items-center gap-2 text-xs font-mono ${
              isDark ? 'bg-[#161B22] border-[#30363D] text-[#8B949E]' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <div className="w-2 h-2 rounded-full bg-[#56D4DD] animate-ping"></div>
              <span>Analizando datos de auditoría y redactando solución técnica...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className={`px-4 py-2 border-t overflow-x-auto flex items-center gap-2 text-[11px] ${
        isDark ? 'bg-[#161B22]/70 border-[#21262D]' : 'bg-slate-100/80 border-slate-200'
      }`}>
        <span className={`text-[10px] font-bold uppercase shrink-0 flex items-center gap-1 ${
          isDark ? 'text-[#8B949E]' : 'text-slate-500'
        }`}>
          <Sparkles className="w-3 h-3 text-[#D29922]" /> SUGERENCIAS:
        </span>

        <button
          type="button"
          onClick={() => handleSendMessage('¿Cómo configuro el botón de WhatsApp con mensaje predeterminado y tracking de analítica para este sitio?')}
          className={`px-2 py-1 border whitespace-nowrap cursor-pointer transition-colors ${
            isDark
              ? 'bg-[#0D1117] hover:bg-[#21262D] border-[#30363D] text-[#C9D1D9]'
              : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
          }`}
        >
          💬 Botón WhatsApp con mensaje
        </button>

        <button
          type="button"
          onClick={() => handleSendMessage('Dame la configuración para NGINX que activa compresión Brotli y reduce el TTFB a menos de 500ms.')}
          className={`px-2 py-1 border whitespace-nowrap cursor-pointer transition-colors ${
            isDark
              ? 'bg-[#0D1117] hover:bg-[#21262D] border-[#30363D] text-[#C9D1D9]'
              : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
          }`}
        >
          ⚡ Config NGINX Brotli & TTFB
        </button>

        <button
          type="button"
          onClick={() => handleSendMessage('¿Cuáles directivas de cabeceras de seguridad (CSP, HSTS, X-Frame-Options) debo añadir para obtener Grado A en Mozilla Observatory?')}
          className={`px-2 py-1 border whitespace-nowrap cursor-pointer transition-colors ${
            isDark
              ? 'bg-[#0D1117] hover:bg-[#21262D] border-[#30363D] text-[#C9D1D9]'
              : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
          }`}
        >
          🔒 Cabeceras CSP & HSTS Grado A
        </button>

        <button
          type="button"
          onClick={() => handleSendMessage('Propón una reestructuración de encabezados <h1> y <h2> que optimice el SEO y la conversión comercial de esta página.')}
          className={`px-2 py-1 border whitespace-nowrap cursor-pointer transition-colors ${
            isDark
              ? 'bg-[#0D1117] hover:bg-[#21262D] border-[#30363D] text-[#C9D1D9]'
              : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
          }`}
        >
          🏷️ Reestructurar H1 y SEO
        </button>
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className={`p-3 border-t flex items-center gap-2 ${
          isDark ? 'bg-[#161B22] border-[#21262D]' : 'bg-white border-slate-200'
        }`}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Haz una pregunta técnica sobre la auditoría de ${auditResult.url}...`}
          disabled={isLoading}
          className={`flex-1 px-3 py-2 text-xs font-mono border outline-none transition-colors ${
            isDark
              ? 'bg-[#0D1117] border-[#30363D] text-[#F0F6FC] placeholder:text-[#484F58] focus:border-[#56D4DD]'
              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-teal-600'
          }`}
        />

        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold font-mono transition-colors cursor-pointer disabled:opacity-50 ${
            isDark
              ? 'bg-[#56D4DD] hover:bg-[#48b9c2] text-[#0D1117] disabled:bg-[#21262D]'
              : 'bg-teal-600 hover:bg-teal-700 text-white disabled:bg-slate-200'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>CONSULTAR</span>
        </button>
      </form>

      {/* Configuration Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-lg border p-5 shadow-2xl transition-colors ${
            isDark ? 'bg-[#161B22] border-[#30363D] text-[#C9D1D9]' : 'bg-white border-slate-300 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#30363D] mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#56D4DD]" />
                <h3 className={`font-bold text-sm ${isDark ? 'text-[#F0F6FC]' : 'text-slate-900'}`}>
                  CONFIGURACIÓN DE ASISTENTE IA & LLM
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfigOpen(false)}
                className="text-[#8B949E] hover:text-[#F85149] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Provider Selector */}
              <div>
                <label className="block font-bold mb-1">PROVEEDOR DEL MODELO (LLM ENGINE):</label>
                <select
                  value={tempConfig.provider}
                  onChange={(e) => {
                    const p = e.target.value as AiAssistantConfig['provider'];
                    let defaultUrl = tempConfig.endpointUrl;
                    let defaultModel = tempConfig.modelName;

                    if (p === 'ollama') {
                      defaultUrl = 'http://localhost:11434/v1';
                      defaultModel = 'llama3.2';
                    } else if (p === 'groq') {
                      defaultUrl = 'https://api.groq.com/openai/v1';
                      defaultModel = 'llama-3.3-70b-versatile';
                    } else if (p === 'gemini') {
                      defaultUrl = '';
                      defaultModel = 'gemini-2.5-flash';
                    } else if (p === 'openai') {
                      defaultUrl = 'https://api.openai.com/v1';
                      defaultModel = 'gpt-4o-mini';
                    }

                    setTempConfig({
                      ...tempConfig,
                      provider: p,
                      endpointUrl: defaultUrl,
                      modelName: defaultModel,
                    });
                  }}
                  className={`w-full px-3 py-1.5 border outline-none ${
                    isDark ? 'bg-[#0D1117] border-[#30363D] text-[#F0F6FC]' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="groq">Groq Cloud (Llama 3.3 70B, DeepSeek R1 - Ultrarrápido)</option>
                  <option value="ollama">Ollama Local (100% Offline / Código Abierto en tu VPS o PC)</option>
                  <option value="gemini">Google Gemini (Gemini 2.5 Flash / 3.8 Flash)</option>
                  <option value="openai">OpenAI (GPT-4o mini / GPT-4o)</option>
                  <option value="huggingface">Hugging Face Inference API</option>
                  <option value="custom">Endpoint Personalizado (vLLM / LM Studio / LocalAI)</option>
                </select>
                <p className={`text-[10px] mt-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  {tempConfig.provider === 'ollama' && 'Ejecución 100% local sin costo de API ni envío de datos fuera de tu infraestructura.'}
                  {tempConfig.provider === 'groq' && 'Inferencia en la nube a más de 300 tokens/segundo con modelos de código abierto.'}
                  {tempConfig.provider === 'gemini' && 'Utiliza el SDK moderno @google/genai con razonamiento y análisis profundo.'}
                </p>
              </div>

              {/* Endpoint URL (hidden if gemini default) */}
              {tempConfig.provider !== 'gemini' && (
                <div>
                  <label className="block font-bold mb-1">ENDPOINT BASE URL:</label>
                  <input
                    type="text"
                    value={tempConfig.endpointUrl || ''}
                    onChange={(e) => setTempConfig({ ...tempConfig, endpointUrl: e.target.value })}
                    placeholder="https://api.groq.com/openai/v1 o http://localhost:11434/v1"
                    className={`w-full px-3 py-1.5 border outline-none font-mono text-[11px] ${
                      isDark ? 'bg-[#0D1117] border-[#30363D] text-[#F0F6FC]' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              )}

              {/* Model Name */}
              <div>
                <label className="block font-bold mb-1">NOMBRE DEL MODELO (MODEL ID):</label>
                <input
                  type="text"
                  value={tempConfig.modelName}
                  onChange={(e) => setTempConfig({ ...tempConfig, modelName: e.target.value })}
                  placeholder="llama-3.3-70b-versatile, gemini-2.5-flash, deepseek-r1-distill-llama-70b..."
                  className={`w-full px-3 py-1.5 border outline-none font-mono text-[11px] ${
                    isDark ? 'bg-[#0D1117] border-[#30363D] text-[#F0F6FC]' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* API Key */}
              <div>
                <label className="block font-bold mb-1">
                  API KEY {tempConfig.provider === 'ollama' && <span className="text-[#3FB950] font-normal">(Opcional en Ollama local)</span>}:
                </label>
                <input
                  type="password"
                  value={tempConfig.apiKey || ''}
                  onChange={(e) => setTempConfig({ ...tempConfig, apiKey: e.target.value })}
                  placeholder={tempConfig.provider === 'ollama' ? 'No requerida para Ollama localhost' : 'gsk_... / AIza... / sk-...'}
                  className={`w-full px-3 py-1.5 border outline-none font-mono text-[11px] ${
                    isDark ? 'bg-[#0D1117] border-[#30363D] text-[#F0F6FC]' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <p className={`text-[10px] mt-1 ${isDark ? 'text-[#8B949E]' : 'text-slate-500'}`}>
                  Se procesa a través de la ruta segura backend proxy <code>/api/ai/chat</code> para evitar problemas de CORS.
                </p>
              </div>

              {/* Test status banner */}
              {testStatus === 'testing' && (
                <div className="p-2 border border-[#56D4DD]/40 bg-[#56D4DD]/10 text-[#56D4DD] text-[10px] flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#56D4DD] animate-ping"></div>
                  <span>Probando conexión con el endpoint...</span>
                </div>
              )}
              {testStatus === 'success' && (
                <div className="p-2 border border-[#3FB950]/40 bg-[#3FB950]/10 text-[#3FB950] text-[10px] flex items-center gap-1.5 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Conexión exitosa! El modelo respondió adecuadamente.</span>
                </div>
              )}
              {testStatus === 'error' && (
                <div className="p-2 border border-[#F85149]/40 bg-[#F85149]/10 text-[#F85149] text-[10px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Fallo de conexión: {testErrorMessage}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#30363D] mt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testStatus === 'testing'}
                  className={`px-3 py-1.5 border font-bold cursor-pointer transition-colors text-xs ${
                    isDark
                      ? 'bg-[#21262D] hover:bg-[#30363D] border-[#30363D] text-[#56D4DD]'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-teal-800'
                  }`}
                >
                  PROBAR CONEXIÓN
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfigOpen(false)}
                    className="px-3 py-1.5 text-xs text-[#8B949E] hover:underline cursor-pointer"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className={`px-4 py-1.5 border text-xs font-bold cursor-pointer transition-colors ${
                      isDark
                        ? 'bg-[#56D4DD] hover:bg-[#48b9c2] text-[#0D1117] border-[#56D4DD]'
                        : 'bg-teal-600 hover:bg-teal-700 text-white border-teal-600'
                    }`}
                  >
                    GUARDAR AJUSTES
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
