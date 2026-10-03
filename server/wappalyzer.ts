import { DetectedTechnology } from '../src/types/audit.js';

export interface TechSignature {
  name: string;
  category: DetectedTechnology['category'];
  description: string;
  website: string;
  htmlPatterns?: RegExp[];
  scriptPatterns?: RegExp[];
  metaPatterns?: { name: string; pattern?: RegExp }[];
  headerPatterns?: { header: string; pattern?: RegExp }[];
  versionExtractor?: (html: string, scripts: string[]) => string | undefined;
  isObsolete?: boolean;
  riskNote?: string;
}

export const WAPPALYZER_SIGNATURES: TechSignature[] = [
  // --- CMS ---
  {
    name: 'WordPress',
    category: 'CMS',
    description: 'Sistema de gestión de contenidos (CMS) de código abierto más utilizado en el mundo.',
    website: 'https://wordpress.org',
    htmlPatterns: [/wp-content\//i, /wp-includes\//i, /wp-json\//i],
    metaPatterns: [{ name: 'generator', pattern: /wordpress/i }],
    versionExtractor: (html) => {
      const match = html.match(/name=["']generator["'][^>]*content=["']WordPress\s*([0-9.]+)/i);
      return match ? match[1] : undefined;
    },
  },
  {
    name: 'Shopify',
    category: 'E-commerce',
    description: 'Plataforma líder para comercio electrónico y tiendas online en la nube.',
    website: 'https://shopify.com',
    htmlPatterns: [/cdn\.shopify\.com/i, /Shopify\.theme/i, /shopify-payment-button/i],
    metaPatterns: [{ name: 'generator', pattern: /shopify/i }],
  },
  {
    name: 'WooCommerce',
    category: 'E-commerce',
    description: 'Extensión de e-commerce personalizable de código abierto para WordPress.',
    website: 'https://woocommerce.com',
    htmlPatterns: [/woocommerce/i, /wc-add-to-cart/i, /woocommerce-Price-amount/i],
  },
  {
    name: 'Drupal',
    category: 'CMS',
    description: 'Plataforma CMS modular de nivel empresarial para portales complejos.',
    website: 'https://drupal.org',
    htmlPatterns: [/Drupal\.settings/i, /sites\/all\/modules/i],
    metaPatterns: [{ name: 'generator', pattern: /drupal/i }],
    headerPatterns: [{ header: 'x-generator', pattern: /drupal/i }],
  },
  {
    name: 'Joomla',
    category: 'CMS',
    description: 'Sistema CMS libre que permite desarrollar sitios web y aplicaciones en línea.',
    website: 'https://joomla.org',
    htmlPatterns: [/\/components\/com_/i, /\/templates\/[a-z0-9_-]+\/css/i],
    metaPatterns: [{ name: 'generator', pattern: /joomla/i }],
  },
  {
    name: 'Wix',
    category: 'CMS',
    description: 'Plataforma de desarrollo web basada en la nube que permite crear sitios en HTML5.',
    website: 'https://wix.com',
    htmlPatterns: [/static\.wixstatic\.com/i, /wix-warmup-data/i, /wix\.com/i],
    headerPatterns: [{ header: 'x-wix-request-id', pattern: /.+/i }],
  },
  {
    name: 'Squarespace',
    category: 'CMS',
    description: 'Sistema de gestión de contenido integrado para sitios web y blogs prediseñados.',
    website: 'https://squarespace.com',
    htmlPatterns: [/static1\.squarespace\.com/i, /Squarespace\.Constants/i],
    headerPatterns: [{ header: 'x-servedby', pattern: /squarespace/i }],
  },
  {
    name: 'Webflow',
    category: 'CMS',
    description: 'Herramienta de diseño web visual y CMS sin código con exportación a código limpio.',
    website: 'https://webflow.com',
    htmlPatterns: [/assets\.website-files\.com/i, /html\s*data-wf-page/i],
    metaPatterns: [{ name: 'generator', pattern: /webflow/i }],
  },

  // --- JAVASCRIPT FRAMEWORKS ---
  {
    name: 'React',
    category: 'JavaScript Framework',
    description: 'Biblioteca frontend de JavaScript desarrollada por Meta para construir interfaces de usuario interactivas.',
    website: 'https://react.dev',
    htmlPatterns: [/data-reactroot/i, /__reactFiber/i, /_reactListening/i, /__REACT_DEVTOOLS/i],
    scriptPatterns: [/react(?:\.production|\.development)?\.js/i, /react-dom/i],
  },
  {
    name: 'Next.js',
    category: 'JavaScript Framework',
    description: 'Framework de React para aplicaciones web con renderizado del lado del servidor (SSR) y generación estática.',
    website: 'https://nextjs.org',
    htmlPatterns: [/__NEXT_DATA__/i, /_next\/static/i, /id=["']__next["']/i],
    headerPatterns: [{ header: 'x-powered-by', pattern: /next\.js/i }],
  },
  {
    name: 'Vue.js',
    category: 'JavaScript Framework',
    description: 'Framework progresivo de JavaScript accesible y versátil para crear interfaces web.',
    website: 'https://vuejs.org',
    htmlPatterns: [/data-v-[a-f0-9]{6,8}/i, /__vue_app__/i, /Vue\.config/i],
    scriptPatterns: [/vue(?:\.runtime)?(?:\.esm)?\.js/i],
  },
  {
    name: 'Nuxt.js',
    category: 'JavaScript Framework',
    description: 'Framework intuitivo basado en Vue.js para renderizado híbrido y del lado del servidor.',
    website: 'https://nuxt.com',
    htmlPatterns: [/__NUXT__/i, /_nuxt\//i],
  },
  {
    name: 'Angular',
    category: 'JavaScript Framework',
    description: 'Plataforma y framework de desarrollo mantenido por Google para aplicaciones web SPA empresariales.',
    website: 'https://angular.dev',
    htmlPatterns: [/ng-version=/i, /ng-app=/i, /ng-binding/i],
    versionExtractor: (html) => {
      const match = html.match(/ng-version=["']([0-9.]+)["']/i);
      return match ? match[1] : undefined;
    },
  },
  {
    name: 'Astro',
    category: 'JavaScript Framework',
    description: 'Framework web moderno orientado a contenido rápido con arquitectura de islas.',
    website: 'https://astro.build',
    htmlPatterns: [/astro-island/i, /data-astro-cid/i],
  },
  {
    name: 'Svelte',
    category: 'JavaScript Framework',
    description: 'Compilador que convierte componentes declarativos en código JavaScript reactivo eficiente.',
    website: 'https://svelte.dev',
    htmlPatterns: [/class=["'][^"']*svelte-[a-z0-9]+/i],
  },

  // --- JAVASCRIPT LIBRARIES ---
  {
    name: 'jQuery',
    category: 'JavaScript Library',
    description: 'Biblioteca clásica de JavaScript rápida y pequeña que simplifica el recorrido y manipulación del DOM.',
    website: 'https://jquery.com',
    scriptPatterns: [/jquery[.-]([0-9.]+)(?:\.min)?\.js/i, /jquery\.js/i],
    htmlPatterns: [/window\.jQuery/i, /\$\.fn\.jquery/i],
    versionExtractor: (_html, scripts) => {
      for (const s of scripts) {
        const match = s.match(/jquery[.-]([0-9]+(?:\.[0-9]+)+(?:\.[0-9]+)?)/i);
        if (match) return match[1];
      }
      return undefined;
    },
  },
  {
    name: 'GSAP (GreenSock)',
    category: 'JavaScript Library',
    description: 'Librería estándar de la industria para animaciones web fluidas de alto rendimiento.',
    website: 'https://greensock.com/gsap',
    scriptPatterns: [/gsap(?:\.min)?\.js/i, /TweenMax/i, /ScrollTrigger/i],
  },
  {
    name: 'Lodash / Underscore',
    category: 'JavaScript Library',
    description: 'Biblioteca de utilidades JavaScript que ofrece programación funcional para arrays y objetos.',
    website: 'https://lodash.com',
    scriptPatterns: [/lodash(?:\.min)?\.js/i, /underscore(?:\.min)?\.js/i],
  },
  {
    name: 'Axios',
    category: 'JavaScript Library',
    description: 'Cliente HTTP basado en promesas para el navegador y Node.js.',
    website: 'https://axios-http.com',
    scriptPatterns: [/axios(?:\.min)?\.js/i],
  },
  {
    name: 'Swiper Slider',
    category: 'UI Kit',
    description: 'Control deslizante táctil moderno para navegación por toques en móviles y escritorios.',
    website: 'https://swiperjs.com',
    htmlPatterns: [/swiper-container/i, /swiper-slide/i, /swiper-wrapper/i],
    scriptPatterns: [/swiper(?:\.min)?\.js/i],
  },

  // --- CSS FRAMEWORKS ---
  {
    name: 'Tailwind CSS',
    category: 'CSS Framework',
    description: 'Framework CSS orientado a utilidades para diseño rápido de interfaces modernas sin abandonar el HTML.',
    website: 'https://tailwindcss.com',
    htmlPatterns: [
      /(?:class|className)=["'][^"']*(?:flex|grid|hidden|absolute|relative|space-y-|gap-|rounded-|shadow-|bg-|text-|border-)[^"']*["']/i,
    ],
  },
  {
    name: 'Bootstrap',
    category: 'CSS Framework',
    description: 'El conjunto de herramientas front-end más popular para maquetación responsive rápida.',
    website: 'https://getbootstrap.com',
    htmlPatterns: [/class=["'][^"']*(?:container-fluid|col-md-|col-lg-|navbar-brand|btn-primary)[^"']*["']/i],
    scriptPatterns: [/bootstrap(?:\.bundle)?(?:\.min)?\.js/i],
    versionExtractor: (html, scripts) => {
      const full = html + scripts.join(' ');
      const match = full.match(/bootstrap[/-]([0-9.]+)/i);
      return match ? match[1] : undefined;
    },
  },
  {
    name: 'Font Awesome',
    category: 'Font Engine',
    description: 'Conjunto de iconos vectoriales y herramientas sociales más utilizado en sitios web.',
    website: 'https://fontawesome.com',
    htmlPatterns: [/class=["'][^"']*(?:fa-[a-z0-9-]+|fas\s|fab\s|far\s)[^"']*["']/i, /font-awesome/i],
  },

  // --- ANALYTICS ---
  {
    name: 'Google Analytics (GA4 / Universal)',
    category: 'Analytics',
    description: 'Servicio de analítica web de Google que realiza seguimiento de tráfico y comportamiento de usuarios.',
    website: 'https://analytics.google.com',
    htmlPatterns: [/google-analytics\.com\/analytics\.js/i, /gtag\(["']config["']/i, /G-[A-Z0-9]{8,12}/i],
    scriptPatterns: [/googletagmanager\.com\/gtag\/js/i],
  },
  {
    name: 'Google Tag Manager',
    category: 'Analytics',
    description: 'Sistema de gestión de etiquetas que permite actualizar códigos de seguimiento y conversiones.',
    website: 'https://tagmanager.google.com',
    htmlPatterns: [/googletagmanager\.com\/gtm\.js/i, /gtm\.start/i],
  },
  {
    name: 'Meta Pixel (Facebook Pixel)',
    category: 'Analytics',
    description: 'Herramienta de análisis para medir la eficacia de la publicidad conociendo las acciones en el sitio.',
    website: 'https://facebook.com/business',
    htmlPatterns: [/connect\.facebook\.net\/[a-z_]+\/fbevents\.js/i, /fbq\(["']init["']/i],
  },
  {
    name: 'Hotjar',
    category: 'Analytics',
    description: 'Servicio de mapas de calor, grabaciones de sesiones y encuestas de experiencia de usuario.',
    website: 'https://hotjar.com',
    htmlPatterns: [/static\.hotjar\.com/i, /hjid:/i],
  },

  // --- WEB SERVERS & CDNS ---
  {
    name: 'Cloudflare',
    category: 'Security / CDN',
    description: 'Red global de entrega de contenidos (CDN), mitigación DDoS y servicios de seguridad en el Edge.',
    website: 'https://cloudflare.com',
    headerPatterns: [
      { header: 'cf-ray', pattern: /.+/i },
      { header: 'server', pattern: /cloudflare/i },
    ],
    htmlPatterns: [/cdnjs\.cloudflare\.com/i, /cdn-cgi\/challenge-platform/i],
  },
  {
    name: 'Nginx',
    category: 'Web Server',
    description: 'Servidor web HTTP de código abierto y proxy inverso de alto rendimiento y bajo consumo.',
    website: 'https://nginx.org',
    headerPatterns: [{ header: 'server', pattern: /nginx/i }],
    versionExtractor: (_, __) => undefined,
  },
  {
    name: 'Apache HTTP Server',
    category: 'Web Server',
    description: 'Servidor web modular multiplataforma de código abierto desarrollado por Apache Software Foundation.',
    website: 'https://httpd.apache.org',
    headerPatterns: [{ header: 'server', pattern: /apache/i }],
  },
  {
    name: 'Vercel',
    category: 'Security / CDN',
    description: 'Plataforma en la nube para desarrolladores frontend optimizada para frameworks como Next.js.',
    website: 'https://vercel.com',
    headerPatterns: [{ header: 'x-vercel-id', pattern: /.+/i }],
  },
  {
    name: 'Netlify',
    category: 'Security / CDN',
    description: 'Plataforma de infraestructura en la nube para aplicaciones web modernas y arquitecturas Jamstack.',
    website: 'https://netlify.com',
    headerPatterns: [{ header: 'server', pattern: /netlify/i }],
  },
];

/**
 * Match HTML, Scripts, Metas, and Headers against Wappalyzer signatures
 */
export function identifyTechnologies(
  html: string,
  scripts: string[],
  metaTags: { name: string; content: string }[],
  headers: Record<string, string>
): DetectedTechnology[] {
  const detected: DetectedTechnology[] = [];
  const seenNames = new Set<string>();

  for (const sig of WAPPALYZER_SIGNATURES) {
    let isMatched = false;
    let version: string | undefined;

    // 1. Check HTML Patterns
    if (sig.htmlPatterns) {
      for (const p of sig.htmlPatterns) {
        if (p.test(html)) {
          isMatched = true;
          break;
        }
      }
    }

    // 2. Check Script Patterns
    if (!isMatched && sig.scriptPatterns) {
      for (const scriptSrc of scripts) {
        for (const p of sig.scriptPatterns) {
          if (p.test(scriptSrc)) {
            isMatched = true;
            break;
          }
        }
        if (isMatched) break;
      }
    }

    // 3. Check Meta Patterns
    if (!isMatched && sig.metaPatterns) {
      for (const metaSig of sig.metaPatterns) {
        const found = metaTags.find((m) => m.name.toLowerCase() === metaSig.name.toLowerCase());
        if (found) {
          if (!metaSig.pattern || metaSig.pattern.test(found.content)) {
            isMatched = true;
            break;
          }
        }
      }
    }

    // 4. Check Headers Patterns
    if (!isMatched && sig.headerPatterns) {
      for (const headerSig of sig.headerPatterns) {
        const hVal = headers[headerSig.header.toLowerCase()];
        if (hVal && (!headerSig.pattern || headerSig.pattern.test(hVal))) {
          isMatched = true;
          break;
        }
      }
    }

    if (isMatched && !seenNames.has(sig.name)) {
      seenNames.add(sig.name);

      if (sig.versionExtractor) {
        version = sig.versionExtractor(html, scripts);
      }

      let isObsolete = sig.isObsolete;
      let riskNote = sig.riskNote;

      if (sig.name === 'jQuery' && version) {
        if (version.startsWith('1.') || version.startsWith('2.')) {
          isObsolete = true;
          riskNote = 'Versión legacy descontinuada con vulnerabilidades CVE conocidas (Cross-Site Scripting).';
        }
      }

      detected.push({
        name: sig.name,
        category: sig.category,
        description: sig.description,
        website: sig.website,
        version,
        isObsolete,
        riskNote,
      });
    }
  }

  return detected;
}
