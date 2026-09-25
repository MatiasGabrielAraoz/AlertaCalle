/* ==========================================================================
   ALERTACALLE — noticias.js
   Manejo de búsqueda por texto, filtrado por categorías y modal de noticia
   ========================================================================== */

(function () {
  // Datos extendidos de las noticias para mostrar en el modal al hacer click
  const DETALLES_NOTICIAS = {
    "noticia-1": {
      titulo: "Repavimentación en distintos sectores de la ciudad",
      categoria: "obras",
      categoriaLabel: "Obras Públicas",
      fecha: "24 SEP 2026",
      area: "Dirección de Vialidad e Infraestructura",
      imagen: "img/noticias/repavimentacion.jpg",
      badge: "OBRAS VIALES",
      duracion: "48 a 72 hs",
      cuerpo: `
        <p class="mb-3">El Municipio informa que se inician las tareas de repavimentación, bacheo profundo y nivelación de losa sobre las avenidas principales del municipio, priorizando aquellos tramos con mayor deterioro registrado en la matriz pública de incidencias.</p>
        <p class="mb-3"><strong>Sectores afectados:</strong> Av. San Martín entre Belgrano y Moreno, y corte parcial en intersección con Av. Rivadavia. Se han habilitado desvíos señalizados por calle Lavalle con presencia de agentes de tránsito.</p>
        <p class="mb-3">Los trabajos contemplan el fresado de la carpeta asfáltica dañada, acondicionamiento de la sub-base hidráulica y colocación de concreto asfáltico en caliente de alta durabilidad, concluyendo con la pintura de demarcación vial horizontal.</p>
        <div class="bg-surface-container-low p-4 rounded-xl border border-surface-container-high my-4 space-y-1 text-xs">
          <p class="font-bold text-on-surface">📋 Información importante para conductores:</p>
          <ul class="list-disc list-inside text-secondary space-y-1 mt-1">
            <li>Evitar circular por el cuadrante centro en horario pico (08:00 a 17:00 hs).</li>
            <li>El transporte público modificará temporalmente sus paradas sobre Av. San Martín.</li>
            <li>En caso de lluvias intensas, los plazos operativos se reprogramarán automáticamente.</li>
          </ul>
        </div>
      `,
      contacto: "Consultas de tránsito: obras@municipio.gob.ar | Tel: 0800-444-2483"
    },

    "noticia-2": {
      titulo: "Nuevos horarios para la recolección nocturna",
      categoria: "servicios",
      categoriaLabel: "Higiene Urbana",
      fecha: "23 SEP 2026",
      area: "Secretaría de Gestión Ambiental y Servicios",
      imagen: "img/noticias/recoleccion-nocturna.jpg",
      badge: "CRONOGRAMA URBANO",
      duracion: "Vigente desde esta semana",
      cuerpo: `
        <p class="mb-3">A partir de esta semana se reestructura el recorrido y los turnos del servicio de recolección nocturna de residuos domiciliarios y secos en los cuadrantes Norte, Centro y Sur del municipio.</p>
        <p class="mb-3"><strong>Nuevo horario de paso:</strong> De domingos a viernes entre las 21:00 y las 03:00 hs. Se solicita a los vecinos sacar bolsas a los cestos únicamente entre las 19:30 y las 20:30 hs para evitar roturas y acumulación en vía pública.</p>
        <p class="mb-3">El plan incluye además operativos especiales de baldeo e higienización de contenedores peatonales de basura en corredores comerciales los días martes y jueves de madrugada.</p>
        <div class="bg-surface-container-low p-4 rounded-xl border border-surface-container-high my-4 space-y-1 text-xs">
          <p class="font-bold text-on-surface">♻️ Recomendaciones de separación:</p>
          <ul class="list-disc list-inside text-secondary space-y-1 mt-1">
            <li>Disponer residuos secos (cartón, plástico, vidrio limpio) en bolsa verde.</li>
            <li>No depositar escombros ni restas de poda en los contenedores domiciliarios.</li>
            <li>Para recolección de voluminosos, solicitar turno telefónico previo.</li>
          </ul>
        </div>
      `,
      contacto: "Consultas de higiene: ambiente@municipio.gob.ar | Línea Verde: 147"
    },

    "noticia-3": {
      titulo: "Continúa el recambio de luminarias LED",
      categoria: "servicios",
      categoriaLabel: "Alumbrado Público",
      fecha: "22 SEP 2026",
      area: "Dirección de Energía y Electromecánica",
      imagen: "img/noticias/luminarias-led.jpg",
      badge: "EFICIENCIA ENERGÉTICA",
      duracion: "Avance del 65%",
      cuerpo: `
        <p class="mb-3">Avanza a ritmo sostenido el Plan Maestro de Modernización del Alumbrado Público, sustituyendo los antiguos dispositivos de vapor de sodio por tecnología LED de alta potencia y bajo consumo energético.</p>
        <p class="mb-3"><strong>Beneficios alcanzados:</strong> Se logra un ahorro del 60% en el consumo eléctrico de la red municipal y un incremento sustancial en el nivel de iluminancia nocturna, aportando mayor seguridad en senderos escolares y comerciales.</p>
        <p class="mb-3">Las nuevas unidades cuentan con sensores de telegestión remota, permitiendo detectar fallas o apagones en tiempo real desde el centro de monitoreo comunal sin requerir reclamo manual del vecino.</p>
        <div class="bg-surface-container-low p-4 rounded-xl border border-surface-container-high my-4 space-y-1 text-xs">
          <p class="font-bold text-on-surface">💡 Resumen de la obra:</p>
          <ul class="list-disc list-inside text-secondary space-y-1 mt-1">
            <li>Más de 450 artefactos de 150W instalados este mes.</li>
            <li>Cobertura actual: Barrios Parque Norte, San Andrés Centro y Villa Belgrano.</li>
            <li>Próxima etapa: Corredores perimetrales y accesos principales.</li>
          </ul>
        </div>
      `,
      contacto: "Reportes de luminarias apagadas: alumbrado@municipio.gob.ar"
    },

    "noticia-4": {
      titulo: "Recomendaciones ante trabajos en la vía pública",
      categoria: "avisos",
      categoriaLabel: "Comunicado Oficial",
      fecha: "21 SEP 2026",
      area: "Defensa Civil y Prevención Ciudadana",
      imagen: null,
      badge: "PREVENCIÓN VIAL",
      duracion: "Permanente",
      cuerpo: `
        <p class="mb-3">La Dirección de Defensa Civil y la Jefatura de Seguridad Vial emiten una serie de recomendaciones esenciales dirigidas a peatones, ciclistas y automovilistas que circulan cerca de sectores con cuadrillas de trabajo activo.</p>
        <p class="mb-3">Ante la presencia de vallados, conos o señalizaciones amarillas/rojas, se recuerda reducir inmediatamente la velocidad y mantener distancia de seguridad con maquinarias pesadas o excavaciones.</p>
        <p class="mb-3">Queda estrictamente prohibido remover señalización oficial o transitar sobre carpetas de hormigón/asfalto fresco antes de su fraguado total.</p>
        <div class="bg-surface-container-low p-4 rounded-xl border border-surface-container-high my-4 space-y-1 text-xs">
          <p class="font-bold text-on-surface">🚨 Teléfonos útiles de emergencia 24hs:</p>
          <ul class="list-disc list-inside text-secondary space-y-1 mt-1">
            <li>Emergencias médicas / Policiales: 911</li>
            <li>Defensa Civil (Riesgo en vía pública): 103</li>
            <li>Guardia de auxilio vial municipal: +54 9 11 4000-CIUDAD</li>
          </ul>
        </div>
      `,
      contacto: "Atención al vecino: defensa.civil@municipio.gob.ar"
    },

    "noticia-5": {
      titulo: "Ampliación de la red de agua potable en Barrio Sur",
      categoria: "obras",
      categoriaLabel: "Obras de Saneamiento",
      fecha: "19 SEP 2026",
      area: "Secretaría de Infraestructura e Hidráulica",
      imagen: "img/noticias/repavimentacion.jpg",
      badge: "SANEAMIENTO",
      duracion: "30 días",
      cuerpo: `
        <p class="mb-3">Iniciamos las obras de empalme y extensión del tendido maestro de agua potable en la zona sur, beneficiando directamente a más de 450 familias de la comunidad.</p>
        <p class="mb-3">Las cuadrillas trabajarán en la apertura de zanjas y colocación de cañerías de PEAD de alta resistencia en veredas y cruces de calle.</p>
        <p class="mb-3">Se prevén cortes puntuales en el suministro durante el horario de 09:00 a 14:00 hs los días de empalme final, los cuales serán notificados con 48 hs de antelación.</p>
      `,
      contacto: "Consultas hídricas: hidraulica@municipio.gob.ar"
    },

    "noticia-6": {
      titulo: "Corte programado por evento comunitario en Plaza Central",
      categoria: "avisos",
      categoriaLabel: "Prensa y Cultura",
      fecha: "18 SEP 2026",
      area: "Dirección de Cultura y Participación Vecinal",
      imagen: null,
      badge: "EVENTO COMUNITARIO",
      duracion: "Fin de semana",
      cuerpo: `
        <p class="mb-3">Con motivo de la realización de la Feria Anual de Entidades de la Comunidad, las calles perimetrales a la Plaza Central permanecerán cerradas al tránsito vehicular.</p>
        <p class="mb-3"><strong>Horario del corte:</strong> Desde el sábado a las 07:00 hs hasta el domingo a las 22:00 hs.</p>
        <p class="mb-3">Habrá puestos gastronómicos, emprendedores locales, talleres participativos y espectáculos musicales con entrada libre y gratuita.</p>
      `,
      contacto: "Prensa y cultura: cultura@municipio.gob.ar"
    }
  };

  function inicializarNoticias() {
    const searchInput = document.getElementById("noticias-search");
    const tabsContainer = document.getElementById("noticias-tabs");
    const grid = document.getElementById("noticias-grid") || document.querySelector(".module-noticias-obras .grid");
    const vacio = document.getElementById("noticias-vacio");
    const overlay = document.getElementById("overlay-noticia");

    if (!grid) return;

    let categoriaActiva = "todas";

    // Actualizar contadores en los tabs
    function actualizarContadoresTabs() {
      const articles = grid.querySelectorAll("article.noticia-card");
      const conteos = { todas: articles.length, obras: 0, servicios: 0, avisos: 0 };

      articles.forEach(function (art) {
        const cat = art.dataset.categoria;
        if (conteos[cat] !== undefined) conteos[cat]++;
      });

      document.querySelectorAll(".noticia-tab").forEach(function (tab) {
        const cat = tab.dataset.categoria;
        const countSpan = tab.querySelector(".tab-count");
        if (countSpan && conteos[cat] !== undefined) {
          countSpan.textContent = `(${conteos[cat]})`;
        }
      });
    }

    // Filtrar noticias por categoría y texto
    function aplicarFiltros() {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      const articles = grid.querySelectorAll("article.noticia-card");
      let visibles = 0;

      articles.forEach(function (art) {
        const catMatch = (categoriaActiva === "todas" || art.dataset.categoria === categoriaActiva);
        const textMatch = !query || art.textContent.toLowerCase().includes(query);

        if (catMatch && textMatch) {
          art.classList.remove("hidden");
          visibles++;
        } else {
          art.classList.add("hidden");
        }
      });

      if (vacio) {
        vacio.classList.toggle("hidden", visibles > 0);
        vacio.classList.toggle("flex", visibles === 0);
      }
    }

    // Eventos de selección de tabs
    if (tabsContainer) {
      tabsContainer.addEventListener("click", function (e) {
        const btn = e.target.closest(".noticia-tab");
        if (!btn) return;

        categoriaActiva = btn.dataset.categoria;

        document.querySelectorAll(".noticia-tab").forEach(function (t) {
          t.classList.remove("active", "bg-primary-container", "text-on-primary", "border-primary");
          t.classList.add("bg-surface-container-lowest", "text-secondary", "border-surface-container-high");
          t.setAttribute("aria-selected", "false");
        });

        btn.classList.add("active", "bg-primary-container", "text-on-primary", "border-primary");
        btn.classList.remove("bg-surface-container-lowest", "text-secondary", "border-surface-container-high");
        btn.setAttribute("aria-selected", "true");

        aplicarFiltros();
      });
    }

    // Evento de búsqueda por texto
    if (searchInput) {
      searchInput.addEventListener("input", aplicarFiltros);
    }

    // Abrir modal con detalle completo de la noticia al hacer click en la card
    grid.addEventListener("click", function (e) {
      const card = e.target.closest("article.noticia-card");
      if (!card) return;

      const id = card.dataset.id || card.id;
      const data = DETALLES_NOTICIAS[id] || {
        titulo: card.querySelector("h3") ? card.querySelector("h3").textContent : "Noticia Municipal",
        categoriaLabel: "Comunicación Oficial",
        fecha: "Vigente",
        area: "Área Municipal Responsable",
        imagen: card.querySelector("img") ? card.querySelector("img").src : null,
        badge: "INFORMACIÓN",
        duracion: "Noticia activa",
        cuerpo: `<p>${card.querySelector("p") ? card.querySelector("p").textContent : "Detalles de la publicación no disponibles."}</p>`,
        contacto: "Para más información, contactar al 0800-MUNICIPIO"
      };

      abrirModalNoticia(data);
    });

    function abrirModalNoticia(data) {
      if (!overlay) return;

      const imgEl = document.getElementById("overlay-noticia-imagen");
      const imgContainer = imgEl ? imgEl.closest(".h-56") : null;
      const badgeEl = document.getElementById("overlay-noticia-badge");
      const tituloEl = document.getElementById("overlay-noticia-titulo");
      const cuerpoEl = document.getElementById("overlay-noticia-cuerpo");
      const footerEl = document.getElementById("overlay-noticia-footer");

      if (imgEl && imgContainer) {
        if (data.imagen) {
          imgEl.src = data.imagen;
          imgEl.alt = data.titulo;
          imgContainer.classList.remove("hidden");
        } else {
          imgContainer.classList.add("hidden");
        }
      }

      if (badgeEl) {
        badgeEl.innerHTML = `
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <span class="bg-primary/10 text-primary text-[11px] font-label-code px-2.5 py-0.5 rounded-full font-bold">
              ${data.badge || "INFORMACIÓN"}
            </span>
            <span class="text-xs font-label-code text-secondary font-medium">
              ${data.fecha} • ${data.area}
            </span>
          </div>
        `;
      }

      if (tituloEl) tituloEl.textContent = data.titulo;
      if (cuerpoEl) cuerpoEl.innerHTML = data.cuerpo;
      if (footerEl) {
        footerEl.innerHTML = `
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-surface-container-high pt-3">
            <span class="text-xs font-label-code text-secondary">${data.contacto || "Atención Ciudadana"}</span>
            <span class="text-xs font-label-code text-primary font-bold">Plazo: ${data.duracion || "Vigente"}</span>
          </div>
        `;
      }

      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    window.cerrarNoticia = function () {
      if (overlay) overlay.classList.remove("active");
      document.body.style.overflow = "";
    };

    if (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) window.cerrarNoticia();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") window.cerrarNoticia();
    });

    actualizarContadoresTabs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarNoticias);
  } else {
    inicializarNoticias();
  }
})();
