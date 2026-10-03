import { AuditIssue, PlainLanguageExplanation } from '../types/audit.js';

export function getPlainExplanationForIssue(issue: AuditIssue): PlainLanguageExplanation {
  if (issue.plainLanguage) {
    return issue.plainLanguage;
  }

  const titleLower = issue.title.toLowerCase();
  const descLower = issue.description.toLowerCase();

  // 1. Viewport / Mobile
  if (titleLower.includes('viewport') || descLower.includes('viewport') || descLower.includes('smartphones')) {
    return {
      simpleTitle: 'Tu página web se ve diminuta o rota en teléfonos celulares',
      analogy:
        'Es como querer leer el periódico completo a través del ojo de una cerradura: el texto sale microscópico y la persona tiene que hacer zoom con los dedos para poder leer.',
      businessImpact:
        'Hoy el 75% de las personas navega desde su teléfono. Si entran y no se lee fácil, 8 de cada 10 se van a la página de tu competencia en menos de 3 segundos.',
      simpleFix:
        'Rediseñamos la web con un diseño "Mobile-First" que se acomoda automáticamente y de forma impecable a la pantalla de cualquier iPhone, Android o tablet.',
      urgencyPlain: 'URGENTE: Estás perdiendo clientes móviles todos los días',
    };
  }

  // 2. TTFB / Velocidad de respuesta
  if (titleLower.includes('ttfb') || titleLower.includes('tiempo de primer byte') || titleLower.includes('latencia')) {
    return {
      simpleTitle: 'El servidor tarda demasiado tiempo en responder',
      analogy:
        'Es como entrar a una tienda física y que la puerta automática se quede trabada 2 segundos antes de dejarte pasar. La gente impaciente se va sin entrar.',
      businessImpact:
        'Google penaliza a las páginas lentas enviándolas a las páginas 2 o 3 de los resultados de búsqueda, y cada segundo de espera reduce las ventas en un 15%.',
      simpleFix:
        'Migramos a servidores ultrarrápidos en la nube (Edge CDN Cloudflare) y activamos compresión inteligente para que responda casi al instante (< 600 ms).',
      urgencyPlain: 'CRÍTICO: Abandono masivo antes de ver tu producto',
    };
  }

  // 3. Tablas layout
  if (titleLower.includes('tabla') || titleLower.includes('<table>') || descLower.includes('tablas')) {
    return {
      simpleTitle: 'Tu página está construida con tecnología del año 2000',
      analogy:
        'Es como querer correr una carrera de autos moderna usando una carreta tirada por caballos: la estructura rígida de tablas hace que todo sea lento y difícil de acomodar.',
      businessImpact:
        'El sitio tarda más en cargar y cualquier intento de cambiar un botón o precio requiere rehacer pedazos enteros de código viejo.',
      simpleFix:
        'Reemplazamos esa estructura pesada por maquetación moderna (CSS Flexbox/Grid) que es ligera, limpia y fácil de mantener.',
      urgencyPlain: 'ALTO: Deuda técnica que encarece cualquier cambio futuro',
    };
  }

  // 4. jQuery antiguo / Vulnerabilidades
  if (titleLower.includes('jquery') || descLower.includes('jquery') || titleLower.includes('obsolet')) {
    return {
      simpleTitle: 'Librerías antiguas con fallas de seguridad conocidas',
      analogy:
        'Es como tener una chapa oxidada de hace 12 años en la puerta principal de tu negocio: los ladrones ya conocen exactamente cómo abrirla.',
      businessImpact:
        'Riesgo de que inyecten publicidad no deseada, redireccionen a tus visitantes o que navegadores modernos como Chrome muestren avisos de advertencia a tus clientes.',
      simpleFix:
        'Eliminamos dependencias viejas e implementamos JavaScript moderno y seguro sin librerías obsoletas.',
      urgencyPlain: 'CRÍTICO: Vulnerabilidad de seguridad y riesgo de reputación',
    };
  }

  // 5. WhatsApp ausente
  if (titleLower.includes('whatsapp') || descLower.includes('whatsapp')) {
    return {
      simpleTitle: 'No tienes un botón directo para que te escriban por WhatsApp',
      analogy:
        'Es como tener un mostrador lleno de productos pero no tener a nadie atendiendo, obligando al cliente a buscar lápiz y papel para mandarte una carta.',
      businessImpact:
        'En los países de habla hispana, más del 65% de las personas prefiere preguntar precios o dudas por WhatsApp antes de comprar. Si no lo ven con un solo toque, se van.',
      simpleFix:
        'Agregamos un botón flotante llamativo que abre WhatsApp directamente con un mensaje listo: "Hola, me interesa información sobre..."',
      urgencyPlain: 'URGENTE: La forma más rápida de duplicar tus prospectos',
    };
  }

  // 6. Encabezados H1 / Estructura
  if (titleLower.includes('h1') || titleLower.includes('encabezado') || titleLower.includes('jerarquía')) {
    return {
      simpleTitle: 'El cartel principal de tu negocio está confuso para Google y tus clientes',
      analogy:
        'Es como una tienda que tiene 4 letreros gigantes que dicen cosas diferentes al mismo tiempo. El cliente no sabe qué vendes exactamente.',
      businessImpact:
        'Google no entiende cuál es tu servicio principal y no te recomienda en búsquedas. Los visitantes se desorientan en los primeros 5 segundos.',
      simpleFix:
        'Organizamos una sola promesa clara y directa en el título principal (H1) y subtítulos ordenados (H2 y H3) que guían la lectura.',
      urgencyPlain: 'MODERADO: Afecta tu posición en Google y la claridad de tu oferta',
    };
  }

  // 7. CTAs / Llamadas a la acción
  if (titleLower.includes('cta') || titleLower.includes('llamada') || descLower.includes('acción')) {
    return {
      simpleTitle: 'No le dices claramente al cliente qué debe hacer para comprarte',
      analogy:
        'Es como un vendedor que te muestra un catálogo hermoso pero nunca te pregunta: "¿Te lo empaco? ¿Cómo deseas pagar?". La venta se queda fría.',
      businessImpact:
        'La gente mira tu página, le gusta lo que ve, pero como no hay un botón claro que diga "Comprar ahora" o "Pedir cotización", cierran la pestaña.',
      simpleFix:
        'Colocamos botones con colores contrastantes y textos de alta intención ("Pedir Cotización Gratis", "Hablar con un Asesor") en lugares estratégicos.',
      urgencyPlain: 'CRÍTICO: Tienes visitas pero no se convierten en dinero',
    };
  }

  // 8. Imágenes pesadas / sin comprimir
  if (titleLower.includes('imágen') || titleLower.includes('fotos') || descLower.includes('webp')) {
    return {
      simpleTitle: 'Las fotos de tu página son demasiado pesadas y gastan los datos del cliente',
      analogy:
        'Es como intentar enviar un cuadro al óleo enmarcado en madera maciza por correo tradicional en lugar de mandar una foto digital.',
      businessImpact:
        'Tu página consume megas del plan telefónico del visitante y se queda en blanco varios segundos mientras carga la foto grande.',
      simpleFix:
        'Convertimos todas las fotos a formato moderno WebP (que pesa hasta 80% menos sin perder calidad) y configuramos que carguen solo cuando el usuario baje la pantalla.',
      urgencyPlain: 'MEDIO: Hace la página pesada y lenta en conexiones móviles',
    };
  }

  // Fallback default
  return {
    simpleTitle: issue.title,
    analogy:
      'Un detalle técnico en los engranajes internos de la página que está frenando su rendimiento óptimo frente a los estándares actuales de internet.',
    businessImpact:
      'Resta puntos a la calificación global de salud de tu sitio y puede generar pequeñas fricciones en la experiencia de tus prospectos.',
    simpleFix: issue.recommendation,
    urgencyPlain: issue.severity === 'critical' ? 'URGENTE: Requiere atención' : 'ADVERTENCIA: Conviene optimizar',
  };
}
