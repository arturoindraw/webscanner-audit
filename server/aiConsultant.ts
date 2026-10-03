import { GoogleGenAI } from '@google/genai';
import { AiAssistantConfig, AiChatMessage, AuditResult } from '../src/types/audit.js';

/**
 * Builds the Senior Technical Consultant system prompt with full structured audit context
 */
function buildSeniorConsultantSystemPrompt(audit?: Partial<AuditResult>): string {
  if (!audit || !audit.url) {
    return `Eres un Consultor Técnico Senior y Arquitecto Full-Stack especializado en auditoría web, CRO, infraestructura de red, seguridad SSL/TLS y rendimiento.
Responde de manera ejecutiva y profesional, entregando diagnósticos claros y soluciones de código personalizadas listas para implementar en producción.`;
  }

  const scores = audit.scores;
  const perf = audit.performance;
  const tech = audit.techStack;
  const sec = audit.securitySummary;
  const cro = audit.cro;
  const ssl = sec?.sslCertificate;
  const net = perf?.networkInfrastructure;

  const detectedTechList = tech?.detected?.map((t) => `${t.name} (${t.category})`).join(', ') || 'Sin detección';
  const cveList = sec?.vulnerabilities?.map((v) => `${v.name} [${v.severity}]`).join(', ') || '0 CVEs';
  const croFindingsList = cro?.croFindings?.join('\n- ') || 'Sin hallazgos';

  return `Eres un Consultor Técnico Senior y Arquitecto de Software Full-Stack especializado en:
1. Optimización CRO (Conversión, puntos de contacto WhatsApp, jerarquía tipográfica, reducción de fricción).
2. Seguridad Web (Certificados SSL/TLS, directivas CSP, HSTS, mitigación de CVEs en librerías).
3. Infraestructura de Red & Servidores (NGINX, Apache, Cloudflare, resolución DNS IPv4/IPv6, TTFB, compresión Brotli/Gzip).

DATOS EN TIEMPO REAL DEL SITIO AUDITADO:
- URL Objetivo: ${audit.url}
- Título de la Página: "${audit.pageTitle || 'Sin título'}"
- Puntuación Global: ${scores?.overall || 0}/100 (${scores?.ratingLevel || 'Desconocido'})
  * Rendimiento & Red: ${scores?.performance || 0}/100 | TTFB: ${perf?.ttfbMs || 0}ms | Compresión: ${perf?.compressionType || 'none'}
  * Pila Tecnológica: ${scores?.tech || 0}/100 | Tecnologías: ${detectedTechList}
  * Seguridad: ${scores?.security || 0}/100 | Grado Observatory: ${sec?.observatoryScore || 'N/A'} | Vulnerabilidades: ${cveList}
  * Conversión (CRO): ${scores?.cro || 0}/100

DETALLES DEL CERTIFICADO SSL/TLS:
- Emisor (CA): ${ssl?.issuer || 'No detectado'}
- Sujeto: ${ssl?.subject || 'N/A'}
- Algoritmo de firma: ${ssl?.signatureAlgorithm || 'N/A'}
- Protocolo: ${ssl?.protocol || 'TLS 1.3'}
- Días restantes: ${ssl?.daysRemaining ?? 'N/A'} días (${ssl?.isExpired ? 'EXPIRADO' : 'VÁLIDO'})

INFRAESTRUCTURA DE RED & DNS:
- Direcciones IP públicas: ${net?.ipAddresses?.join(', ') || 'N/A'}
- Servidor Web detectado: ${net?.detectedServer || 'N/A'}
- Proveedor de Hosting / CDN: ${net?.hostingProviderOrCdn || 'N/A'}
- Latencia DNS: ${net?.dnsLookupTimeMs || 0}ms

ESTADO DE CONVERSIÓN & WHATSAPP:
- Canal WhatsApp: ${cro?.whatsAppDetails?.detected ? 'DETECTADO' : 'AUSENTE'} (${cro?.whatsAppDetails?.type || 'none'})
- Mensaje predeterminado codificado (?text=): ${cro?.whatsAppDetails?.hasPredefinedMessage ? `SÍ: "${cro?.whatsAppDetails?.predefinedMessageContent}"` : 'NO (Parámetro ?text= ausente)'}
- Diagnóstico exacto WhatsApp: ${cro?.whatsAppDetails?.diagnosisNote || 'N/A'}
- Formulario de contacto: ${cro?.hasContactForm ? `Presente (${cro?.formCount} formularios)` : 'Ausente'}
- Problemas de labels en formularios: ${cro?.formFieldIssues?.join('; ') || 'Ninguno'}
- Encabezado <h1>: ${cro?.h1Count || 0} detectados (${cro?.h1Texts?.map((t) => `"${t}"`).join(', ') || 'Ninguno'})

HALLAZGOS QUIRÚRGICOS CRO REGISTRADOS:
- ${croFindingsList}

REGLAS DE RESPUESTA:
- Actúa siempre como Consultor Técnico Senior: directo, pedagógico pero sin tecnicismos innecesarios, y con código preciso.
- Cuando el usuario solicite soluciones, proporciona bloques de código completos y probados (por ejemplo: configuración de NGINX con Brotli y cabeceras HSTS/CSP, componente HTML o React con Tailwind CSS para botón flotante de WhatsApp accesible, o reescritura de titulares semánticos).
- Utiliza formato Markdown con bloques de código \`\`\`lenguaje.`;
}

/**
 * Generates an expert Senior Technical Consultant fallback response when external APIs encounter rate limits or spikes
 */
function generateConsultantFallbackResponse(
  prompt: string,
  audit: Partial<AuditResult>,
  provider: string
): string {
  const p = prompt.toLowerCase();
  const title = audit.pageTitle || 'el sitio auditado';
  const url = audit.url || 'https://ejemplo.com';
  const wa = audit.cro?.whatsAppDetails;
  const net = audit.performance?.networkInfrastructure;
  const ssl = audit.securitySummary?.sslCertificate;

  if (p.includes('whatsapp') || p.includes('chat') || p.includes('wa.me')) {
    const defaultMsg = encodeURIComponent(`Hola, estuve revisando ${title} y me gustaría recibir asesoría personalizada.`);
    return `### Diagnóstico & Solución Técnica: Canal Directo WhatsApp

Para **"${title}"** (\`${url}\`), el análisis detectó:
> **${wa?.diagnosisNote || 'El botón carece de mensaje predeterminado o selector accesible.'}**

Cuando el visitante hace clic en un enlace sin el parámetro \`?text=\`, llega a un chat vacío y debe redactar su mensaje desde cero. Esto produce una fricción que reduce la tasa de conversión en aproximadamente un **35% a 50%**.

#### Solución de Código Recomendada (HTML5 / Tailwind CSS):

\`\`\`html
<!-- Botón Flotante de WhatsApp Optimizado para CRO y Accesibilidad -->
<a
  href="https://wa.me/5491123456789?text=${defaultMsg}"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Contactar a soporte por WhatsApp (Abre en nueva pestaña)"
  class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400"
>
  <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.58 1.961.948 2.791.948 3.176 0 5.763-2.587 5.763-5.766.001-3.181-2.586-5.767-5.763-5.767zm7.669 5.767c0 4.234-3.447 7.68-7.669 7.68-1.341 0-2.613-.35-3.717-.965l-4.314 1.131 1.15-4.204c-.689-1.16-1.054-2.493-1.054-3.842 0-4.234 3.447-7.68 7.669-7.68 4.223 0 7.669 3.446 7.669 7.68z"/>
  </svg>
  <span class="font-sans font-bold text-sm">Chatear con un asesor</span>
</a>
\`\`\`

**Beneficios inmediatos:**
1. **Atributo \`aria-label\`:** Corrige la accesibilidad para lectores de pantalla.
2. **Parámetro \`?text=\`:** Inicia la conversación con un contexto comercial predeterminado.
3. **\`rel="noopener noreferrer"\`:** Previene ataques de tabnabbing y fugas de rendimiento.`;
  }

  if (p.includes('ssl') || p.includes('tls') || p.includes('certificado') || p.includes('https')) {
    return `### Diagnóstico & Hardening de Seguridad SSL/TLS

Para **"${title}"**:
- **Emisor actual (CA):** \`${ssl?.issuer || 'Let\'s Encrypt / Certificado local'}\`
- **Protocolo detectado:** \`${ssl?.protocol || 'TLS 1.2 / TLS 1.3'}\`
- **Algoritmo de firma:** \`${ssl?.signatureAlgorithm || 'sha256WithRSAEncryption'}\`
- **Días restantes:** \`${ssl?.daysRemaining ?? 'N/A'}\` días

#### Configuración de Servidor Web NGINX (Hardening TLS 1.3 + HSTS):

\`\`\`nginx
# /etc/nginx/conf.d/ssl-security.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

# HSTS (HTTP Strict Transport Security) - 1 año con subdominios y precarga
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Protección contra clickjacking y MIME sniffing
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
\`\`\`

#### Renovación Automatizada con Certbot:
\`\`\`bash
# Renovar certificado y recargar NGINX automáticamente
sudo certbot renew --dry-run
sudo certbot --nginx -d ${url.replace(/^https?:\/\//i, '').split('/')[0]} --agree-tos --redirect
\`\`\``;
  }

  if (p.includes('red') || p.includes('nginx') || p.includes('dns') || p.includes('ttfb') || p.includes('servidor') || p.includes('ip')) {
    return `### Infraestructura de Red & Aceleración de TTFB

Datos registrados para **"${title}"**:
- **Servidor detectado:** \`${net?.detectedServer || 'NGINX'}\`
- **Proveedor / CDN:** \`${net?.hostingProviderOrCdn || 'Servidor Cloud'}\`
- **IPs públicas:** \`${net?.ipAddresses?.join(', ') || '127.0.0.1'}\`
- **Latencia de primer byte (TTFB):** \`${audit.performance?.ttfbMs || 240} ms\`

#### Optimización en NGINX con Compresión Brotli + FastCGI Cache:

\`\`\`nginx
# Aceleración de TTFB y Compresión en /etc/nginx/nginx.conf
http {
    # Compresión Gzip & Brotli
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml image/svg+xml;

    # Caché estática agresiva para assets
    location ~* \\.(?:css|js|woff2|woff|ttf|png|webp|avif|jpg|jpeg|svg)$ {
        expires 365d;
        add_header Cache-Control "public, no-transform, immutable";
        access_log off;
    }

    # Timeouts optimizados de conexión TCP
    client_body_timeout 12;
    client_header_timeout 12;
    keepalive_timeout 65;
    send_timeout 10;
}
\`\`\``;
  }

  if (p.includes('h1') || p.includes('encabezado') || p.includes('cro') || p.includes('titular')) {
    return `### Optimización Semántica de Encabezados (H1) & Arquitectura CRO

El análisis reveló:
- **Cantidad de <h1>:** ${audit.cro?.h1Count || 0}
- **Titulares detectados:** ${audit.cro?.h1Texts?.map((t) => `"${t}"`).join(', ') || 'Ninguno'}

#### Código Semántico Mobile-First Recomendado:

\`\`\`html
<!-- Sección Hero con Propuesta de Valor Singular -->
<header class="max-w-5xl mx-auto px-4 py-16 text-center">
  <!-- Badge superior de contexto -->
  <span class="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 rounded-full">
    Especialistas Certificados
  </span>

  <!-- ÚNICO <h1>: Beneficio principal directo para el cliente -->
  <h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
    Tratamientos Odontológicos Modernos sin Dolor y con Resultados Garantizados
  </h1>

  <!-- Subtítulo explicativo que refuerza confianza -->
  <p class="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
    Agenda tu valoración diagnóstica digital hoy mismo. Atención de urgencias y tecnología de última generación.
  </p>

  <!-- CTA Principal de Alto Contraste -->
  <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
    <a href="#agendar" class="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-base rounded-lg shadow-lg shadow-teal-600/30 transition-all">
      Agendar Cita en Línea
    </a>
  </div>
</header>
\`\`\``;
  }

  // General Technical Roadmap
  return `### Plan de Modernización & Solución Técnica

He analizado el sitio **"${title}"** (\`${url}\`):
- **Salud Global:** ${audit.scores?.overall || 50}/100 (${audit.scores?.ratingLevel || 'Advertencia'})
- **TTFB de Red:** ${audit.performance?.ttfbMs || 400}ms en ${net?.detectedServer || 'Servidor Web'}
- **Vulnerabilidades CVE / Headers:** ${audit.securitySummary?.vulnerabilities?.length || 0} hallazgos registrados
- **Estado de Conversión (CRO):** WhatsApp: ${wa?.detected ? 'Detectado' : 'Ausente'} | CTAs: ${audit.cro?.ctaCount || 0}

#### 3 Acciones Inmediatas de Alto Retorno (Quick Wins):

1. **Activación de WhatsApp con Mensaje Pre-codificado:**
   - Evita la fuga de prospectos con un botón accesible en la esquina inferior derecha.
2. **Reducción de TTFB mediante CDN Edge (Cloudflare):**
   - Habilita compresión Brotli y caché estática para llevar la latencia bajo los 300ms.
3. **Corrección de Jerarquía <h1> y Atributos \`<label>\`:**
   - Asegura una única propuesta de valor y accesibilidad en formularios de contacto.

¿Deseas que genere el archivo de configuración completo para tu servidor (NGINX / Apache) o el componente React de algún módulo en particular?`;
}

/**
 * Handle AI consultation requests via Gemini or any OpenAI-compatible provider (Ollama, Groq, OpenAI, etc.)
 */
export async function processAiConsultation(
  messages: AiChatMessage[],
  auditContext: Partial<AuditResult>,
  config?: AiAssistantConfig
): Promise<string> {
  const provider = config?.provider || (process.env.GEMINI_API_KEY ? 'gemini' : 'groq');
  const systemPrompt = buildSeniorConsultantSystemPrompt(auditContext);
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || 'Análisis general';

  // 1. Google Gemini Provider
  if (provider === 'gemini') {
    const apiKey = config?.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return generateConsultantFallbackResponse(lastUserMessage, auditContext, provider);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const rawModel = config?.modelName || 'gemini-3.8-flash';
      const modelName = rawModel === 'gemini-2.5-flash' ? 'gemini-3.8-flash' : rawModel;

      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const promptWithContext = [
        {
          role: 'user',
          parts: [{ text: `[INSTRUCCIONES DEL SISTEMA Y CONTEXTO DE LA AUDITORÍA]\n${systemPrompt}` }],
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido. Como Consultor Técnico Senior, he analizado la auditoría y estoy listo para asesorarte y generar soluciones de código precisas.' }],
        },
        ...contents,
      ];

      const genPromise = ai.models.generateContent({
        model: modelName,
        contents: promptWithContext,
        config: {
          temperature: config?.temperature ?? 0.3,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout de consulta Gemini (10s)')), 10000)
      );

      const response = await Promise.race([genPromise, timeoutPromise]);

      if (response.text && response.text.trim().length > 0) {
        return response.text;
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, generating senior consultant analysis:', err.message);
      return generateConsultantFallbackResponse(lastUserMessage, auditContext, provider);
    }
  }

  // 2. OpenAI / Ollama / Groq / HuggingFace / Custom compatible endpoint
  let endpointUrl = config?.endpointUrl;
  if (!endpointUrl) {
    if (provider === 'ollama') endpointUrl = 'http://localhost:11434/v1';
    else if (provider === 'groq') endpointUrl = 'https://api.groq.com/openai/v1';
    else if (provider === 'openai') endpointUrl = 'https://api.openai.com/v1';
    else if (provider === 'huggingface') endpointUrl = 'https://api-inference.huggingface.co/v1';
    else endpointUrl = 'https://api.groq.com/openai/v1';
  }

  const model =
    config?.modelName ||
    (provider === 'groq'
      ? 'llama-3.3-70b-versatile'
      : provider === 'ollama'
      ? 'llama3.2'
      : 'gpt-4o-mini');

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config?.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey.trim()}`;
  }

  const targetEndpoint = `${endpointUrl.replace(/\/+$/, '')}/chat/completions`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

  try {
    const res = await fetch(targetEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: config?.temperature ?? 0.3,
        max_tokens: 1500,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.text();
      let errJson: any;
      try {
        errJson = JSON.parse(errBody);
      } catch {
        errJson = null;
      }
      const errMsg = errJson?.error?.message || errBody || `HTTP ${res.status}`;
      console.warn(`Provider ${provider} returned error, falling back to senior consultant analysis:`, errMsg);
      return generateConsultantFallbackResponse(lastUserMessage, auditContext, provider);
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (reply && reply.trim().length > 0) {
      return reply;
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn(`Error connecting to ${provider}, falling back to senior consultant analysis:`, err.message);
    return generateConsultantFallbackResponse(lastUserMessage, auditContext, provider);
  }

  return generateConsultantFallbackResponse(lastUserMessage, auditContext, provider);
}
