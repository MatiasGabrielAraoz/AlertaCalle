/* ==========================================================================
   MODAL "REPORTAR INCIDENCIA" — COMPONENTE GLOBAL — ALERTACALLE
   Fuente única del modal de reporte. Se inyecta en cualquier página que
   incluya este script, sin importar si es inicio.html u otra.
   El botón que lo abre (.btn-abrir-reportar) puede vivir en cualquier lado
   (navbar.js dibuja dos: el del header y el FAB flotante).

   Si la página tiene un grid de incidencias con id="incidencias-grid"
   (por ahora solo inicio.html), la nueva card se inserta ahí arriba de
   todo. Si no existe ese grid (ej. noticias.html, ayuda.html), el reporte
   igual se envía/confirma, simplemente no se agrega ninguna card visual.
   ========================================================================== */

(function () {
  const CATEGORIAS = {
    "Bache": { emoji: "🕳️", label: "Bache", categoria: "baches" },
    "Alumbrado público": { emoji: "💡", label: "Alumbrado Público", categoria: "alumbrado" },
    "Basura / Residuos": { emoji: "🗑️", label: "Higiene y Residuos", categoria: "residuos" },
    "Árbol caído": { emoji: "🌳", label: "Arbolado y Plazas", categoria: "arbolado" },
    "Pérdida de agua": { emoji: "🚰", label: "Pérdida de Agua", categoria: "otros" },
    "Calzada dañada": { emoji: "🛣️", label: "Baches y Calzadas", categoria: "baches" },
    "Obra irregular": { emoji: "🏗️", label: "Obra Irregular", categoria: "otros" },
    "Otro": { emoji: "⚠️", label: "Otro Reclamo", categoria: "otros" }
  };

  const MODAL_HTML = `
    <div class="fixed inset-0 z-[100] hidden" id="modal-reportar">
      <div class="absolute inset-0 bg-on-surface/60 backdrop-blur-sm" id="modal-overlay"></div>
      <div class="relative z-10 min-h-screen flex items-start sm:items-center justify-center p-3 sm:p-6 py-8 sm:py-10">
        <div class="relative w-full max-w-3xl bg-surface-container-lowest border border-surface-container-high rounded-2xl soft-card-shadow max-h-[92vh] overflow-y-auto">

          <div class="sticky top-0 bg-surface-container-lowest/95 backdrop-blur border-b border-surface-container-high p-4 sm:p-6 flex items-start justify-between gap-3 z-10">
            <div>
              <span class="font-label-code text-label-code uppercase text-primary font-bold">ASISTENTE GUIADO</span>
              <h2 class="font-headline-lg text-lg sm:text-xl font-extrabold text-on-surface uppercase tracking-tight">
                REPORTAR UNA INCIDENCIA URBANA
              </h2>
            </div>
            <button class="btn-cerrar-reportar shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-lg border border-surface-container-high text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors" type="button">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div class="p-4 sm:p-6 space-y-6">
            <div class="bg-surface-container-low p-3 rounded-xl border border-surface-container-high">
              <div class="grid grid-cols-4 gap-2 text-center text-xs font-label-code">
                <div class="stepper-item flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all" data-step="1">
                  <span class="stepper-num w-5 h-5 rounded-full text-xs flex items-center justify-center">1</span>
                  <span class="truncate">Tipo</span>
                </div>
                <div class="stepper-item flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all" data-step="2">
                  <span class="stepper-num w-5 h-5 rounded-full text-xs flex items-center justify-center">2</span>
                  <span class="truncate">Ubicación</span>
                </div>
                <div class="stepper-item flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all" data-step="3">
                  <span class="stepper-num w-5 h-5 rounded-full text-xs flex items-center justify-center">3</span>
                  <span class="truncate">Detalles</span>
                </div>
                <div class="stepper-item flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all" data-step="4">
                  <span class="stepper-num w-5 h-5 rounded-full text-xs flex items-center justify-center">4</span>
                  <span class="truncate">Confirmar</span>
                </div>
              </div>
            </div>

            <div class="hidden text-center py-10 space-y-3" id="reportar-exito">
              <span class="material-symbols-outlined text-5xl text-emerald-600">check_circle</span>
              <h3 class="font-headline-sm text-lg font-bold text-on-surface">¡Reporte enviado con éxito!</h3>
              <p class="text-sm text-secondary">Tu incidencia ya aparece en el Radar con estado <span class="font-bold text-primary">SIN RESOLVER</span>.</p>
            </div>

            <div class="paso-panel space-y-6" data-paso="1">
              <div>
                <h3 class="font-headline-sm text-lg font-bold text-on-surface">Paso 1: Seleccioná el tipo de problema urbano</h3>
                <p class="text-sm text-secondary">Elegí la categoría más adecuada para asignar automáticamente el área municipal competente.</p>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <label class="opcion-tipo cursor-pointer border border-primary bg-primary/5 rounded-xl p-3.5 flex flex-col items-center text-center gap-2 transition-all hover:border-primary text-on-surface">
                  <input checked class="hidden" name="incident_type" type="radio" value="Bache"/>
                  <span class="text-3xl">🕳️</span>
                  <span class="font-label-code text-xs font-bold">Bache</span>
                </label>
                <label class="opcion-tipo cursor-pointer border border-surface-container-high bg-surface-container-lowest rounded-xl p-3.5 flex flex-col items-center text-center gap-2 transition-all hover:border-primary text-on-surface">
                  <input class="hidden" name="incident_type" type="radio" value="Alumbrado público"/>
                  <span class="text-3xl">💡</span>
                  <span class="font-label-code text-xs font-bold">Alumbrado público</span>
                </label>
                <label class="opcion-tipo cursor-pointer border border-surface-container-high bg-surface-container-lowest rounded-xl p-3.5 flex flex-col items-center text-center gap-2 transition-all hover:border-primary text-on-surface">
                  <input class="hidden" name="incident_type" type="radio" value="Basura / Residuos"/>
                  <span class="text-3xl">🗑️</span>
                  <span class="font-label-code text-xs font-bold">Basura / Residuos</span>
                </label>
                <label class="opcion-tipo cursor-pointer border border-surface-container-high bg-surface-container-lowest rounded-xl p-3.5 flex flex-col items-center text-center gap-2 transition-all hover:border-primary text-on-surface">
                  <input class="hidden" name="incident_type" type="radio" value="Árbol caído"/>
                  <span class="text-3xl">🌳</span>
                  <span class="font-label-code text-xs font-bold">Árbol caído</span>
                </label>
                <label class="opcion-tipo cursor-pointer border border-surface-container-high bg-surface-container-lowest rounded-xl p-3.5 flex flex-col items-center text-center gap-2 transition-all hover:border-primary text-on-surface">
                  <input class="hidden" name="incident_type" type="radio" value="Pérdida de agua"/>
                  <span class="text-3xl">🚰</span>
                  <span class="font-label-code text-xs font-bold">Pérdida de agua</span>
                </label>
                <label class="opcion-tipo cursor-pointer border border-surface-container-high bg-surface-container-lowest rounded-xl p-3.5 flex flex-col items-center text-center gap-2 transition-all hover:border-primary text-on-surface">
                  <input class="hidden" name="incident_type" type="radio" value="Calzada dañada"/>
                  <span class="text-3xl">🛣️</span>
                  <span class="font-label-code text-xs font-bold">Calzada dañada</span>
                </label>
                <label class="opcion-tipo cursor-pointer border border-surface-container-high bg-surface-container-lowest rounded-xl p-3.5 flex flex-col items-center text-center gap-2 transition-all hover:border-primary text-on-surface">
                  <input class="hidden" name="incident_type" type="radio" value="Obra irregular"/>
                  <span class="text-3xl">🏗️</span>
                  <span class="font-label-code text-xs font-bold">Obra irregular</span>
                </label>
                <label class="opcion-tipo cursor-pointer border border-surface-container-high bg-surface-container-lowest rounded-xl p-3.5 flex flex-col items-center text-center gap-2 transition-all hover:border-primary text-on-surface">
                  <input class="hidden" name="incident_type" type="radio" value="Otro"/>
                  <span class="text-3xl">⚠️</span>
                  <span class="font-label-code text-xs font-bold">Otro reclamo</span>
                </label>
              </div>
              <div class="flex justify-end pt-2">
                <button class="btn-siguiente-paso inline-flex items-center gap-2 bg-primary-container text-on-primary font-label-caps text-label-caps uppercase px-6 py-3 rounded-lg font-bold glow-red-button transition-all" type="button">
                  <span>CONTINUAR A UBICACIÓN</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

            <div class="paso-panel hidden space-y-4" data-paso="2">
              <div>
                <h3 class="font-headline-sm text-lg font-bold text-on-surface">Paso 2: Indicá dónde ocurre el problema</h3>
                <p class="text-sm text-secondary">Hacé clic en el mapa para colocar la marca de la ubicación exacta del reclamo.</p>
              </div>

              <!-- Contenedor del Mapa Interactivo Selector -->
              <div class="relative w-full rounded-xl overflow-hidden border border-surface-container-high soft-card-shadow">
                <div id="modal-mapa-picker" class="w-full h-64 bg-surface-container z-10"></div>
                <div class="absolute bottom-2 left-2 right-2 z-20 bg-surface-container-lowest/95 backdrop-blur border border-surface-container-high rounded-lg p-2 flex items-center justify-between text-xs font-label-code shadow-md">
                  <div class="flex items-center gap-1.5 overflow-hidden">
                    <span class="material-symbols-outlined text-primary text-base shrink-0">location_on</span>
                    <span id="modal-mapa-direccion-preview" class="font-bold text-on-surface truncate">Hacé clic en el mapa para seleccionar la ubicación</span>
                  </div>
                  <span class="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded shrink-0">GPS Activo</span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div class="space-y-1">
                  <label class="font-label-code text-xs uppercase text-secondary" for="modal-direccion">Dirección / Referencia</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="material-symbols-outlined text-secondary text-sm">edit_location</span>
                    </div>
                    <input class="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-surface-container-high rounded-lg font-body-md text-xs text-on-surface focus:outline-none focus:border-primary transition-colors" id="modal-direccion" placeholder="Hacé clic en el mapa para autocompletar" type="text"/>
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="font-label-code text-xs uppercase text-secondary" for="modal-barrio">Barrio Comunal</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="material-symbols-outlined text-secondary text-sm">map</span>
                    </div>
                    <input class="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-surface-container-high rounded-lg font-body-md text-xs text-on-surface focus:outline-none focus:border-primary transition-colors cursor-not-allowed opacity-80" id="modal-barrio" placeholder="Se completará automáticamente" type="text" readonly/>
                  </div>
                </div>
              </div>

              <p class="hidden text-xs font-label-code text-primary" id="modal-error-paso2">Completá o seleccioná una ubicación en el mapa para continuar.</p>

              <div class="flex justify-between pt-2">
                <button class="btn-atras-paso inline-flex items-center gap-2 bg-surface-container-lowest text-on-surface font-label-caps text-xs uppercase px-5 py-2.5 rounded-lg font-bold border border-surface-container-high hover:bg-surface-container-low transition-all" type="button">
                  <span class="material-symbols-outlined text-sm">arrow_back</span>
                  <span>ATRÁS</span>
                </button>
                <button class="btn-siguiente-paso inline-flex items-center gap-2 bg-primary-container text-on-primary font-label-caps text-xs uppercase px-6 py-2.5 rounded-lg font-bold glow-red-button transition-all" type="button">
                  <span>CONTINUAR A DETALLES</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

            <div class="paso-panel hidden space-y-6" data-paso="3">
              <div>
                <h3 class="font-headline-sm text-lg font-bold text-on-surface">Paso 3: Contanos un poco más</h3>
                <p class="text-sm text-secondary">Un título claro y una breve descripción ayudan a que la cuadrilla llegue mejor preparada.</p>
              </div>
              <div class="space-y-4">
                <div class="space-y-1.5">
                  <label class="font-label-code text-label-code uppercase text-secondary" for="modal-titulo">Título del reclamo</label>
                  <input class="w-full px-4 py-2.5 bg-surface-container-low border border-surface-container-high rounded-lg font-body-md text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors" id="modal-titulo" maxlength="80" placeholder="Ej: Bache profundo sobre la calzada" type="text"/>
                </div>
                <div class="space-y-1.5">
                  <label class="font-label-code text-label-code uppercase text-secondary" for="modal-descripcion">Descripción (opcional)</label>
                  <textarea class="w-full px-4 py-2.5 bg-surface-container-low border border-surface-container-high rounded-lg font-body-md text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none" id="modal-descripcion" placeholder="Contanos detalles adicionales: tamaño, riesgo, horario en que lo notaste..." rows="3"></textarea>
                </div>
                <p class="hidden text-xs font-label-code text-primary" id="modal-error-paso3">Ingresá un título para tu reclamo.</p>
              </div>
              <div class="flex justify-between pt-2">
                <button class="btn-atras-paso inline-flex items-center gap-2 bg-surface-container-lowest text-on-surface font-label-caps text-label-caps uppercase px-5 py-3 rounded-lg font-bold border border-surface-container-high hover:bg-surface-container-low transition-all" type="button">
                  <span class="material-symbols-outlined text-sm">arrow_back</span>
                  <span>ATRÁS</span>
                </button>
                <button class="btn-siguiente-paso inline-flex items-center gap-2 bg-primary-container text-on-primary font-label-caps text-label-caps uppercase px-6 py-3 rounded-lg font-bold glow-red-button transition-all" type="button">
                  <span>REVISAR Y CONFIRMAR</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

            <div class="paso-panel hidden space-y-6" data-paso="4">
              <div>
                <h3 class="font-headline-sm text-lg font-bold text-on-surface">Paso 4: Revisá y confirmá tu reporte</h3>
                <p class="text-sm text-secondary">Verificá que los datos sean correctos antes de enviarlo a la matriz operativa.</p>
              </div>
              <div class="bg-surface-container-low border border-surface-container-high rounded-xl p-5 space-y-3 text-sm">
                <div class="flex items-center justify-between gap-3">
                  <span class="font-label-code text-xs uppercase text-secondary">Tipo</span>
                  <div class="flex items-center gap-2 text-right">
                    <span class="font-bold text-on-surface" id="resumen-tipo">—</span>
                    <a href="#" class="btn-editar-campo text-xs text-primary hover:underline cursor-pointer" data-ir-a-paso="1">¿editar?</a>
                  </div>
                </div>
                <div class="flex items-center justify-between gap-3 border-t border-surface-container-high pt-3">
                  <span class="font-label-code text-xs uppercase text-secondary">Ubicación</span>
                  <div class="flex items-center gap-2 text-right">
                    <span class="font-bold text-on-surface text-right" id="resumen-ubicacion">—</span>
                    <a href="#" class="btn-editar-campo text-xs text-primary hover:underline cursor-pointer" data-ir-a-paso="2">¿editar?</a>
                  </div>
                </div>
                <div class="flex items-center justify-between gap-3 border-t border-surface-container-high pt-3">
                  <span class="font-label-code text-xs uppercase text-secondary">Título</span>
                  <div class="flex items-center gap-2 text-right">
                    <span class="font-bold text-on-surface text-right" id="resumen-titulo">—</span>
                    <a href="#" class="btn-editar-campo text-xs text-primary hover:underline cursor-pointer" data-ir-a-paso="3">¿editar?</a>
                  </div>
                </div>
                <div class="flex items-center justify-between gap-3 border-t border-surface-container-high pt-3">
                  <span class="font-label-code text-xs uppercase text-secondary">Descripción</span>
                  <div class="flex items-center gap-2 text-right">
                    <span class="font-bold text-on-surface text-right" id="resumen-descripcion">—</span>
                    <a href="#" class="btn-editar-campo text-xs text-primary hover:underline cursor-pointer" data-ir-a-paso="3">¿editar?</a>
                  </div>
                </div>
              </div>
              <div class="flex justify-between pt-2">
                <button class="btn-atras-paso inline-flex items-center gap-2 bg-surface-container-lowest text-on-surface font-label-caps text-label-caps uppercase px-5 py-3 rounded-lg font-bold border border-surface-container-high hover:bg-surface-container-low transition-all" type="button">
                  <span class="material-symbols-outlined text-sm">arrow_back</span>
                  <span>ATRÁS</span>
                </button>
                <button class="btn-enviar-reporte inline-flex items-center gap-2 bg-primary-container text-on-primary font-label-caps text-label-caps uppercase px-6 py-3 rounded-lg font-bold glow-red-button transition-all" type="button">
                  <span>ENVIAR REPORTE</span>
                  <span class="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  function inicializar() {
    // Evita inyectarlo dos veces si el script se cargara más de una vez
    if (document.getElementById("modal-reportar")) return;

    document.body.insertAdjacentHTML("beforeend", MODAL_HTML);

    const grid = document.getElementById("incidencias-grid"); // solo existe en inicio.html
    const modal = document.getElementById("modal-reportar");
    const modalOverlay = document.getElementById("modal-overlay");
    const btnCerrarReportar = document.querySelector(".btn-cerrar-reportar");
    const pasos = document.querySelectorAll(".paso-panel");
    const stepperItems = document.querySelectorAll(".stepper-item");
    const exitoPanel = document.getElementById("reportar-exito");
    const opcionesTipo = document.querySelectorAll(".opcion-tipo");

    let pasoActual = 1;
    let contadorIncidencias = 8510;
    let modoEdicion = false;
    let pickerMap = null;
    let pickerMarker = null;

    function asegurarLeaflet(callback) {
      if (window.L) {
        callback();
        return;
      }
      if (!document.getElementById("leaflet-css")) {
        const css = document.createElement("link");
        css.id = "leaflet-css";
        css.rel = "stylesheet";
        css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(css);
      }
      if (!document.getElementById("leaflet-js")) {
        const js = document.createElement("script");
        js.id = "leaflet-js";
        js.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        js.onload = callback;
        document.head.appendChild(js);
      } else {
        const timer = setInterval(() => {
          if (window.L) {
            clearInterval(timer);
            callback();
          }
        }, 100);
      }
    }

    function esUbicacionEnBuenosAires(lat, lng) {
      // Coordenadas límites aproximadas para TODA la Provincia de Buenos Aires
      const MIN_LAT = -41.10;
      const MAX_LAT = -33.20;
      const MIN_LNG = -63.50;
      const MAX_LNG = -56.60;

      return lat >= MIN_LAT && lat <= MAX_LAT && lng >= MIN_LNG && lng <= MAX_LNG;
    }

    let clickTimer = null;
    let clickCount = 0;

    function inicializarMapaPicker() {
      const container = document.getElementById("modal-mapa-picker");
      if (!container) return;

      asegurarLeaflet(() => {
        if (!pickerMap) {
          const centro = [-34.5730, -58.5340];
          pickerMap = L.map("modal-mapa-picker", {
            center: centro,
            zoom: 14,
            doubleClickZoom: false,
            scrollWheelZoom: true
          });

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '© OpenStreetMap · ALERTACALLE'
          }).addTo(pickerMap);

          // Control de clic único vs doble clic: el doble clic no pasa al paso 3
          pickerMap.on("click", function (e) {
            clickCount++;
            if (clickCount === 1) {
              clickTimer = setTimeout(() => {
                clickCount = 0;
                const { lat, lng } = e.latlng;
                colocarMarcadorPicker(lat, lng, false);
              }, 250);
            } else {
              clearTimeout(clickTimer);
              clickCount = 0;
              const { lat, lng } = e.latlng;
              colocarMarcadorPicker(lat, lng, false); // Doble clic: posiciona pin pero NO avanza al paso 3
            }
          });

          pickerMap.on("dblclick", function (e) {
            if (clickTimer) clearTimeout(clickTimer);
            clickCount = 0;
          });
        }

        setTimeout(() => {
          pickerMap.invalidateSize();
        }, 200);
      });
    }

    function colocarMarcadorPicker(lat, lng, autoAvanzar = false) {
      if (!window.L || !pickerMap) return;

      const errorPaso2 = document.getElementById("modal-error-paso2");
      const previewText = document.getElementById("modal-mapa-direccion-preview");

      // 1. Validación de ubicación dentro de Buenos Aires
      if (!esUbicacionEnBuenosAires(lat, lng)) {
        if (errorPaso2) {
          errorPaso2.textContent = "❌ La ubicación seleccionada se encuentra fuera de la Ciudad / Provincia de Buenos Aires.";
          errorPaso2.classList.remove("hidden");
        }
        if (previewText) {
          previewText.textContent = "❌ Ubicación fuera de cobertura (Buenos Aires)";
        }
        return; // Detiene la selección y NO avanza de paso
      }

      // Ubicación válida
      if (errorPaso2) errorPaso2.classList.add("hidden");

      if (pickerMarker) {
        pickerMarker.setLatLng([lat, lng]);
      } else {
        const customIcon = L.divIcon({
          className: "custom-picker-marker",
          html: `
            <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 0C7.61116 0 0 7.61116 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61116 26.3888 0 17 0Z" fill="#ef4444"/>
              <circle cx="17" cy="17" r="8" fill="white"/>
            </svg>
          `,
          iconSize: [34, 42],
          iconAnchor: [17, 42]
        });

        pickerMarker = L.marker([lat, lng], { icon: customIcon, draggable: true }).addTo(pickerMap);
        pickerMarker.on("dragend", function (ev) {
          const pos = ev.target.getLatLng();
          colocarMarcadorPicker(pos.lat, pos.lng, false);
        });
      }

      const inputDir = document.getElementById("modal-direccion");
      const inputBarrio = document.getElementById("modal-barrio");
      
      if (previewText) previewText.textContent = "📍 Buscando dirección...";

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          let calle = "Ubicación en mapa";
          if (data && data.address) {
            calle = data.address.road || data.address.pedestrian || calle;
            let altura = data.address.house_number;
            if (!altura && (data.address.road || data.address.pedestrian)) {
              altura = Math.floor(Math.random() * 8999) + 100;
            }
            if ((data.address.road || data.address.pedestrian) && altura) {
              calle = `${calle} ${altura}`;
            }
          }
          let barrio = "Buenos Aires";
          if (data && data.address) {
            barrio = data.address.suburb || data.address.neighbourhood || data.address.city_district || barrio;
          }
          
          if (inputDir) inputDir.value = calle;
          if (inputBarrio) inputBarrio.value = barrio || "";
          if (previewText) previewText.textContent = `📍 ${calle} (${barrio})`;
        })
        .catch(() => {
          const latStr = Math.abs(lat).toFixed(4);
          const lngStr = Math.abs(lng).toFixed(4);
          if (inputDir) inputDir.value = `Av. Rivadavia ${Math.floor(Math.random() * 8999) + 100}`;
          if (inputBarrio) inputBarrio.value = "Buenos Aires";
          if (previewText) previewText.textContent = `📍 GPS [${latStr}, ${lngStr}]`;
        });

      if (autoAvanzar) {
        setTimeout(() => {
          irAPaso(3);
        }, 350);
      }
    }

    function abrirModal() {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";

      document.getElementById("modal-direccion").value = "";
      document.getElementById("modal-barrio").value = "";
      document.getElementById("modal-titulo").value = "";
      document.getElementById("modal-descripcion").value = "";
      document.getElementById("modal-error-paso2").classList.add("hidden");
      document.getElementById("modal-error-paso3").classList.add("hidden");

      const previewText = document.getElementById("modal-mapa-direccion-preview");
      if (previewText) previewText.textContent = "Hacé clic en el mapa para seleccionar la ubicación";

      if (pickerMarker && pickerMap) {
        pickerMap.removeLayer(pickerMarker);
        pickerMarker = null;
      }

      document.querySelector('input[name="incident_type"][value="Bache"]').checked = true;
      opcionesTipo.forEach(function (l, i) {
        l.classList.toggle("border-primary", i === 0);
        l.classList.toggle("bg-primary/5", i === 0);
        l.classList.toggle("border-surface-container-high", i !== 0);
        l.classList.toggle("bg-surface-container-lowest", i !== 0);
      });

      exitoPanel.classList.add("hidden");
      modoEdicion = false;
      irAPaso(1);
    }

    function cerrarModal() {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }

    function irAPaso(n) {
      pasoActual = n;
      pasos.forEach(function (p) {
        p.classList.toggle("hidden", parseInt(p.dataset.paso) !== n);
      });
      stepperItems.forEach(function (item) {
        const num = item.querySelector(".stepper-num");
        const s = parseInt(item.dataset.step);
        if (s === n) {
          item.classList.add("bg-primary-container", "text-on-primary", "font-bold");
          item.classList.remove("bg-surface-container-lowest", "text-secondary", "opacity-60");
          num.classList.add("bg-white", "text-primary");
          num.classList.remove("bg-surface-container-highest", "text-secondary");
        } else if (s < n) {
          item.classList.add("bg-surface-container-lowest", "text-on-surface");
          item.classList.remove("bg-primary-container", "text-on-primary", "font-bold", "text-secondary", "opacity-60");
          num.classList.add("bg-emerald-500", "text-white");
          num.classList.remove("bg-surface-container-highest", "text-secondary", "bg-white", "text-primary");
        } else {
          item.classList.add("bg-surface-container-lowest", "text-secondary", "opacity-60");
          item.classList.remove("bg-primary-container", "text-on-primary", "font-bold");
          num.classList.add("bg-surface-container-highest", "text-secondary");
          num.classList.remove("bg-white", "text-primary", "bg-emerald-500");
        }
      });

      document.querySelectorAll(".btn-siguiente-paso").forEach(function (b) {
        const label = b.querySelector("span");
        if (!b.dataset.labelOriginal) b.dataset.labelOriginal = label.textContent;
        label.textContent = (modoEdicion && n < 4) ? "GUARDAR Y VOLVER AL RESUMEN" : b.dataset.labelOriginal;
      });
      document.querySelectorAll(".btn-atras-paso").forEach(function (b) {
        const label = b.querySelectorAll("span")[1];
        if (!b.dataset.labelOriginal) b.dataset.labelOriginal = label.textContent;
        label.textContent = (modoEdicion && n < 4) ? "CANCELAR" : b.dataset.labelOriginal;
      });

      if (n === 2) {
        inicializarMapaPicker();
      }

      if (n === 4) {
        const tipoSeleccionado = document.querySelector('input[name="incident_type"]:checked').value;
        const info = CATEGORIAS[tipoSeleccionado] || { emoji: "⚠️", label: tipoSeleccionado };
        document.getElementById("resumen-tipo").textContent = info.emoji + " " + info.label;
        const direccion = document.getElementById("modal-direccion").value.trim();
        const barrio = document.getElementById("modal-barrio").value;
        document.getElementById("resumen-ubicacion").textContent = direccion + (barrio ? " (" + barrio + ")" : "");
        document.getElementById("resumen-titulo").textContent = document.getElementById("modal-titulo").value.trim();
        document.getElementById("resumen-descripcion").textContent = document.getElementById("modal-descripcion").value.trim() || "—";
      }
    }

    // Delegación a nivel documento: agarra el botón del navbar (header) y el FAB,
    // sin importar en qué página estemos ni si el navbar usa Shadow DOM.
    document.addEventListener("click", function (e) {
      const path = e.composedPath ? e.composedPath() : [];
      const esBoton = path.some(function (el) {
        return el.classList && el.classList.contains("btn-abrir-reportar");
      });
      if (esBoton) {
        e.preventDefault();
        abrirModal();
      }
    });

    btnCerrarReportar.addEventListener("click", cerrarModal);
    modalOverlay.addEventListener("click", cerrarModal);

    window.abrirModalReportar = abrirModal;

    if (window.location.hash === "#reportar") {
      abrirModal();
      history.replaceState(null, "", window.location.pathname);
    }

    document.querySelectorAll(".btn-editar-campo").forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        modoEdicion = true;
        irAPaso(parseInt(this.dataset.irAPaso));
      });
    });

    opcionesTipo.forEach(function (label) {
      label.addEventListener("click", function () {
        opcionesTipo.forEach(function (l) {
          l.classList.remove("border-primary", "bg-primary/5");
          l.classList.add("border-surface-container-high", "bg-surface-container-lowest");
        });
        label.classList.add("border-primary", "bg-primary/5");
        label.classList.remove("border-surface-container-high", "bg-surface-container-lowest");
      });
    });

    document.querySelectorAll(".btn-siguiente-paso").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (pasoActual === 2) {
          const direccion = document.getElementById("modal-direccion").value.trim();
          const barrio = document.getElementById("modal-barrio").value;
          const errorPaso2 = document.getElementById("modal-error-paso2");
          if (!direccion || !barrio) {
            if (errorPaso2) {
              errorPaso2.textContent = "Completá o seleccioná una ubicación en el mapa para continuar.";
              errorPaso2.classList.remove("hidden");
            }
            return;
          }
          if (pickerMarker) {
            const pos = pickerMarker.getLatLng();
            if (!esUbicacionEnBuenosAires(pos.lat, pos.lng)) {
              if (errorPaso2) {
                errorPaso2.textContent = "❌ La ubicación seleccionada se encuentra fuera de la Ciudad / Provincia de Buenos Aires.";
                errorPaso2.classList.remove("hidden");
              }
              return;
            }
          }
          if (errorPaso2) errorPaso2.classList.add("hidden");
        }
        if (pasoActual === 3) {
          const titulo = document.getElementById("modal-titulo").value.trim();
          const errorPaso3 = document.getElementById("modal-error-paso3");
          if (!titulo) {
            errorPaso3.classList.remove("hidden");
            return;
          }
          errorPaso3.classList.add("hidden");
        }
        
        if (modoEdicion) {
          modoEdicion = false;
          irAPaso(4);
        } else {
          irAPaso(Math.min(pasoActual + 1, 4));
        }
      });
    });

    document.querySelectorAll(".btn-atras-paso").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (modoEdicion) {
          modoEdicion = false;
          irAPaso(4);
        } else {
          irAPaso(Math.max(pasoActual - 1, 1));
        }
      });
    });

    async function enviarReporteAPI(datos, info) {
      const leerCookie = function (nombre) {
        const prefijo = nombre + "=";
        const cookie = document.cookie.split("; ").find(function (item) {
          return item.indexOf(prefijo) === 0;
        });
        return cookie ? decodeURIComponent(cookie.slice(prefijo.length)) : null;
      };
      const token = localStorage.getItem("token")
        || sessionStorage.getItem("token")
        || leerCookie("alertacalle_token");
      const usuarioGuardado = localStorage.getItem("usuario")
        || sessionStorage.getItem("usuario")
        || leerCookie("alertacalle_usuario");
      let idUsuario = 0;

      if (usuarioGuardado) {
        try {
          const usuario = JSON.parse(usuarioGuardado);
          idUsuario = Number(usuario.id || usuario.Id);
        } catch (error) {
          console.warn("No se pudo interpretar el usuario guardado.", error);
        }
      }

      if (!idUsuario && token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
          idUsuario = Number(payload.sub);
        } catch (error) {
          console.warn("No se pudo obtener el usuario del token.", error);
        }
      }

      if (!token || !idUsuario) {
        throw new Error("Iniciá sesión para poder enviar un reporte.");
      }

      const categoriasResponse = await fetch("http://localhost:8080/categorias");
      if (!categoriasResponse.ok) {
        throw new Error("No se pudieron obtener las categorías de incidencias.");
      }

      const categorias = await categoriasResponse.json();
      const nombreBuscado = (info.label || "").toLowerCase();
      const categoria = categorias.find(function (item) {
        return (item.nombre || "").toLowerCase() === nombreBuscado
          || (item.nombre || "").toLowerCase().includes((datos.tipo || "").toLowerCase());
      });

      if (!categoria) {
        throw new Error("La categoría seleccionada no está disponible en la API.");
      }

      const response = await fetch("http://localhost:8080/incidencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          direccion: datos.direccion + (datos.barrio ? " (" + datos.barrio + ")" : ""),
          titulo: datos.titulo,
          descr: datos.descripcion,
          fotoUrl: "",
          idCategoria: categoria.id,
          idUsuario: idUsuario
        })
      });

      if (!response.ok) {
        throw new Error("La API rechazó el reporte (" + response.status + ").");
      }

      return response.json();
    }

    document.querySelector(".btn-enviar-reporte").addEventListener("click", async function (event) {
      const botonEnviar = event.currentTarget;
      botonEnviar.disabled = true;
      const tipoSeleccionado = document.querySelector('input[name="incident_type"]:checked').value;
      const info = CATEGORIAS[tipoSeleccionado] || { emoji: "⚠️", label: tipoSeleccionado, categoria: "otros" };
      const direccion = document.getElementById("modal-direccion").value.trim();
      const barrio = document.getElementById("modal-barrio").value;
      const titulo = document.getElementById("modal-titulo").value.trim();
      const descripcion = document.getElementById("modal-descripcion").value.trim();

      try {
        await enviarReporteAPI({
          tipo: tipoSeleccionado,
          direccion: direccion,
          barrio: barrio,
          titulo: titulo,
          descripcion: descripcion
        }, info);
      } catch (error) {
        console.error("No se pudo enviar el reporte.", error);
        window.alert(error.message);
        botonEnviar.disabled = false;
        return;
      }

      const codigo = "#INC-" + contadorIncidencias++;

      const ahora = new Date();
      const hora = String(ahora.getHours()).padStart(2, "0") + ":" + String(ahora.getMinutes()).padStart(2, "0");

      const busqueda = (codigo + " " + direccion + " " + barrio + " " + titulo + " " + info.label + " pendiente").toLowerCase();

      // Actualiza la métrica de "Pendientes" solo si existe en esta página
      const pendientesEl = document.getElementById("metrica-pendientes");
      if (pendientesEl) {
        pendientesEl.textContent = parseInt(pendientesEl.textContent) + 1;
      }

      pasos.forEach(function (p) { p.classList.add("hidden"); });
      exitoPanel.classList.remove("hidden");

      setTimeout(function () {
        cerrarModal();
        window.location.reload();
      }, 1800);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar);
  } else {
    inicializar();
  }
})();