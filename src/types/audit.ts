export type SeverityLevel = 'critical' | 'warning' | 'optimal';
export type SubagentStatus = 'idle' | 'running' | 'completed' | 'alert';

export interface PlainLanguageExplanation {
  simpleTitle: string; // Título en palabras cotidianas
  analogy: string; // Ejemplo de la vida real
  businessImpact: string; // Impacto directo en clientes y ventas
  simpleFix: string; // Cómo lo solucionamos
  urgencyPlain: string; // Nivel de riesgo explicado
}

export interface AuditIssue {
  id: string;
  title: string;
  category: 'performance' | 'tech' | 'cro' | 'security';
  severity: SeverityLevel;
  impactScore: number; // Penalty points 1-25
  description: string;
  evidence: string;
  recommendation: string;
  plainLanguage?: PlainLanguageExplanation;
}

export interface NetworkInfrastructure {
  ipAddresses: string[];
  ipv4: string[];
  ipv6: string[];
  hostname: string;
  detectedServer: string; // e.g. "nginx/1.24.0", "cloudflare", "Apache/2.4"
  hostingProviderOrCdn: string; // e.g. "Cloudflare Edge CDN", "Amazon Web Services (AWS)", "Hostinger"
  dnsLookupTimeMs: number;
}

export interface PerformanceMetrics {
  ttfbMs: number;
  totalLoadTimeMs: number;
  htmlSizeBytes: number;
  estimatedAssetCount: number;
  scriptsCount: number;
  stylesCount: number;
  imagesCount: number;
  iframesCount: number;
  domNodesTotal: number;
  maxDomDepth: number;
  compressionType: string;
  sslEnabled: boolean;
  hstsEnabled: boolean;
  mixedContentDetected: boolean;
  uncompressedImagesCount: number;
  blockingScriptsCount: number;
  networkInfrastructure?: NetworkInfrastructure;
}

export interface DetectedTechnology {
  name: string;
  category: 'CMS' | 'JavaScript Framework' | 'JavaScript Library' | 'CSS Framework' | 'Analytics' | 'Web Server' | 'Security / CDN' | 'E-commerce' | 'UI Kit' | 'Font Engine' | 'Other';
  version?: string;
  description: string;
  website?: string;
  isObsolete?: boolean;
  riskNote?: string;
}

export interface TechStackMetrics {
  detected: DetectedTechnology[];
  hasResponsiveViewport: boolean;
  viewportContent?: string;
  usesTablesForLayout: boolean;
  tableLayoutCount: number;
  usesIframesForLayout: boolean;
  iframeCount: number;
  legacyJqueryDetected: boolean;
  jqueryVersion?: string;
  deprecatedHtmlTags: string[];
  htmlDoctype: string;
}

export interface SslCertificateDetails {
  issuer: string; // Emisor (Issuer / CA, e.g. "Let's Encrypt Authority X3", "Cloudflare Inc ECC CA-3")
  subject: string; // Common Name / SAN
  validFrom: string; // Fecha de emisión ISO
  validTo: string; // Fecha de expiración ISO
  daysRemaining: number; // Días restantes hasta vencimiento
  signatureAlgorithm: string; // Algoritmo de firma (e.g. "sha256WithRSAEncryption", "ecdsa-with-SHA384")
  protocol: string; // Protocolo soportado (e.g. "TLSv1.3" / "TLSv1.2")
  cipher: string; // Cifrado activo (e.g. "TLS_AES_256_GCM_SHA384")
  isExpired: boolean;
  isValid: boolean;
  serialNumber?: string;
  fingerprint256?: string;
}

export interface SecurityVulnerability {
  id: string;
  source: 'OSV.dev' | 'Mozilla Observatory' | 'Security Header Analysis';
  name: string; // e.g. "CVE-2015-9251" or "Missing Content-Security-Policy (CSP)"
  component?: string; // e.g. "jQuery 1.8.2" or "HTTP Response Headers"
  severity: 'Crítico' | 'Medio' | 'Bajo';
  summary: string;
  recommendation: string;
}

export interface SecurityAuditSummary {
  observatoryScore?: string; // e.g. "F", "C", "A"
  missingHeaders: string[];
  vulnerabilities: SecurityVulnerability[];
  totalVulnCount: number;
  sslCertificate?: SslCertificateDetails;
}

export interface CtaElement {
  text: string;
  href?: string;
  tagName: string;
  isHighIntent: boolean;
}

export interface HeadingItem {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text: string;
  level: number;
}

export interface WhatsAppDetails {
  detected: boolean;
  type: 'direct_link' | 'floating_widget' | 'chatbot_integration' | 'inline_action' | 'none';
  widgetName?: string; // e.g. "JoinChat Widget", "Tidio Chatbot", "ManyChat Bot", "WhatsHelp", "Custom Button"
  rawLinkOrSelector?: string;
  hasPredefinedMessage: boolean; // ¿Cuenta con texto predeterminado en URL (?text=)?
  predefinedMessageContent?: string;
  phoneNumber?: string;
  locationContext?: 'header' | 'floating' | 'footer' | 'body';
  diagnosisNote: string;
}

export interface CroMetrics {
  ctaCount: number;
  ctas: CtaElement[];
  hasWhatsApp: boolean;
  whatsAppLinks: string[];
  whatsAppDetails?: WhatsAppDetails;
  hasPhoneLink: boolean;
  phoneLinks: string[];
  hasContactForm: boolean;
  formCount: number;
  formFieldIssues: string[]; // Diagnósticos específicos de formularios y etiquetas <label>
  headingHierarchy: HeadingItem[];
  h1Count: number;
  h1Texts: string[];
  hasSingleH1: boolean;
  headingIssues: string[];
  croFindings: string[]; // Diagnósticos quirúrgicos individualizados (sin generalidades)
  wordCount: number;
  totalImages: number;
  imagesMissingAlt: number;
  hasSocialProof: boolean;
  hasLegalPrivacyLink: boolean;
}

export interface AuditScoreBreakdown {
  overall: number; // 0-100
  performance: number; // 0-100
  tech: number; // 0-100
  cro: number; // 0-100
  security: number; // 0-100
  ratingLevel: 'Crítico' | 'Advertencia' | 'Bueno' | 'Óptimo';
  colorHex: string;
}

export interface QuoteLineItem {
  id: string;
  title: string;
  category: 'core' | 'cro' | 'perf' | 'seo' | 'integration';
  triggerReason: string;
  estimatedHours: number;
  selected: boolean;
  isCore: boolean;
  plainWhyNeeded?: string;
  clientBenefit?: string;
}

export interface QuoteProposal {
  tierId: 'express_landing' | 'redesign_pro' | 'enterprise_lead_engine';
  tierName: string;
  tagline: string;
  summary: string;
  estimatedDeliveryDays: number;
  estimatedConversionUplift: string;
  totalEstimatedHours: number;
  lineItems: QuoteLineItem[];
  actionRoadmap: { phase: string; title: string; duration: string; tasks: string[] }[];
}

export interface SubagentNode {
  id: string;
  name: string;
  role: string;
  status: SubagentStatus;
  executionTimeMs: number;
  forksCount: number;
  tasksCompleted: string[];
  findingsCount: number;
  activeTask?: string;
  telemetry: Record<string, string | number>;
}

export interface SessionLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'agent';
  agent: string;
  message: string;
  detail?: string;
}

export interface RecentExploration {
  url: string;
  title: string;
  score: number;
  ratingLevel: string;
  scannedAt: string;
}

export interface AiAssistantConfig {
  provider: 'gemini' | 'openai' | 'ollama' | 'groq' | 'huggingface' | 'custom';
  apiKey?: string;
  endpointUrl?: string; // e.g. "https://api.groq.com/openai/v1" or "http://localhost:11434/v1"
  modelName: string; // e.g. "gemini-3.8-flash", "llama-3.3-70b-versatile", "gpt-4o-mini"
  temperature?: number;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
    filename?: string;
  };
}

export interface AuditResult {
  url: string;
  pageTitle: string; // Exact content of <title>
  scannedAt: string;
  status: 'success' | 'error';
  errorMessage?: string;
  scores: AuditScoreBreakdown;
  issues: AuditIssue[];
  performance: PerformanceMetrics;
  techStack: TechStackMetrics;
  securitySummary: SecurityAuditSummary;
  cro: CroMetrics;
  quote: QuoteProposal;
  subagents: SubagentNode[];
  logs: SessionLogEntry[];
  totalForks: number;
  auditDurationMs: number;
}
