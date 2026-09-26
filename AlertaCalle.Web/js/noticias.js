/* ==========================================================================
   ALERTACALLE — noticias.js
   Carga noticias reales desde la API, maneja búsqueda, filtrado por
   categorías, modal de detalle, y creación/eliminación (solo Admin).
   ========================================================================== */

import { ApiClient } from "./client.js";

const sesion = ApiClient.obtenerSesion();
const esAdmin = sesion?.usuario?.idRol === 1;

const CATEGORIA_INFO = {
  Obras: { icono: "construction", badge: "OBRAS", colorClase: "bg-primary-container text-on-primary" },
  Servicios: { icono: "home_repair_service", badge: "SERVICIOS", colorClase: "bg-emerald-600 text-white" },
  Avisos: { icono: "campaign", badge: "AVISOS", colorClase: "bg-amber-600 text-white" },
};

let TODAS_LAS_NOTICIAS = [];
let categoriaActiva = "todas";

function formatearFecha(rawDate) {
  if (!rawDate) return "Reciente";
  const fecha = new Date(rawDate);
  return fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

function crearTarjetaNoticia(item) {
  const info = CATEGORIA_INFO[item.categoria] || CATEGORIA_INFO.Avisos;
  const article = document.createElement("article");
  article.className = "noticia-card group bg-surface-container-lowest border border-surface-container-high rounded-2xl overflow-hidden soft-card-shadow soft-card-shadow-hover hover:border-primary/40 transition-all flex flex-col justify-between cursor-pointer";
  article.dataset.categoria = item.categoria;
  article.dataset.id = item.id;

  const imagenHTML = item.imagenUrl
    ? `<img src="${item.imagenUrl}" alt="${item.titulo}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>`
    : `<div class="absolute inset-0 opacity-20 map-grid-pattern"></div>
       <div class="relative w-16 h-16 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-center">
         <span class="material-symbols-outlined text-primary text-4xl">${info.icono}</span>
       </div>`;

  article.innerHTML = `
    <div>
      <div class="relative h-48 ${item.imagenUrl ? "overflow-hidden" : "bg-surface-container-low flex items-center justify-center"}">
        ${imagenHTML}
        ${item.imagenUrl ? `<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>` : ""}
        <span class="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${info.colorClase} font-label-code text-xs uppercase font-bold">
          <span class="material-symbols-outlined text-sm">${info.icono}</span>
          ${item.categoria}
        </span>
      </div>

      <div class="p-5 space-y-3">
        <div class="flex items-center gap-2 text-xs font-label-code">
          <span class="text-primary font-bold">${formatearFecha(item.fechaCreacion)}</span>
        </div>

        <h3 class="font-extrabold text-lg text-on-surface leading-snug group-hover:text-primary transition-colors">
          ${item.titulo}
        </h3>

        <p class="text-xs text-secondary leading-relaxed line-clamp-3">
          ${item.descr}
        </p>
      </div>
    </div>

    <div class="p-5 pt-0 mt-auto flex items-center justify-between gap-2">
      <button type="button" class="btn-leer-noticia inline-flex items-center gap-1.5 text-primary font-label-caps text-xs uppercase font-bold group-hover:gap-2.5 transition-all">
        <span>Leer información completa</span>
        <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
      ${esAdmin ? `
        <button type="button" class="btn-eliminar-noticia inline-flex items-center gap-1 text-red-600 hover:bg-red-600 hover:text-white px-2 py-1 rounded-lg transition-colors" title="Eliminar noticia">
          <span class="material-symbols-outlined text-base">delete</span>
        </button>
      ` : ""}
    </div>
  `;

  return article;
}

function abrirModalNoticia(item) {
  const overlay = document.getElementById("overlay-noticia");
  if (!overlay) return;

  const info = CATEGORIA_INFO[item.categoria] || CATEGORIA_INFO.Avisos;
  const imgEl = document.getElementById("overlay-noticia-imagen");
  const imgContainer = imgEl ? imgEl.closest(".h-56") : null;
  const badgeEl = document.getElementById("overlay-noticia-badge");
  const tituloEl = document.getElementById("overlay-noticia-titulo");
  const cuerpoEl = document.getElementById("overlay-noticia-cuerpo");
  const footerEl = document.getElementById("overlay-noticia-footer");

  if (imgEl && imgContainer) {
    if (item.imagenUrl) {
      imgEl.src = item.imagenUrl;
      imgEl.alt = item.titulo;
      imgContainer.classList.remove("hidden");
    } else {
      imgContainer.classList.add("hidden");
    }
  }

  if (badgeEl) {
    badgeEl.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 mb-1">
        <span class="bg-primary/10 text-primary text-[11px] font-label-code px-2.5 py-0.5 rounded-full font-bold">
          ${info.badge}
        </span>
        <span class="text-xs font-label-code text-secondary font-medium">
          ${formatearFecha(item.fechaCreacion)}
        </span>
      </div>
    `;
  }

  if (tituloEl) tituloEl.textContent = item.titulo;
  if (cuerpoEl) cuerpoEl.innerHTML = `<p>${item.descr}</p>`;

  if (footerEl) {
    footerEl.innerHTML = item.infoImportante
      ? `
        <div class="bg-surface-container-low p-4 rounded-xl border border-surface-container-high space-y-1 text-xs">
          <p class="font-bold text-on-surface mb-1">📋 Información importante:</p>
          <p class="text-secondary">${item.infoImportante}</p>
        </div>
      `
      : "";
  }

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

window.cerrarNoticia = function () {
  const overlay = document.getElementById("overlay-noticia");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
};

function actualizarContadoresTabs() {
  const conteos = { todas: TODAS_LAS_NOTICIAS.length, Obras: 0, Servicios: 0, Avisos: 0 };
  TODAS_LAS_NOTICIAS.forEach((item) => {
    if (conteos[item.categoria] !== undefined) conteos[item.categoria]++;
  });

  document.querySelectorAll(".noticia-tab").forEach((tab) => {
    const cat = tab.dataset.categoria;
    const countSpan = tab.querySelector(".tab-count");
    const key = cat === "todas" ? "todas" : cat;
    if (countSpan && conteos[key] !== undefined) {
      countSpan.textContent = `(${conteos[key]})`;
    }
  });
}

function aplicarFiltros() {
  const searchInput = document.getElementById("noticias-search");
  const grid = document.getElementById("noticias-grid");
  const vacio = document.getElementById("noticias-vacio");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const filtradas = TODAS_LAS_NOTICIAS.filter((item) => {
    const coincideCategoria = categoriaActiva === "todas" || item.categoria === categoriaActiva;
    const coincideTexto = !query ||
      item.titulo.toLowerCase().includes(query) ||
      item.descr.toLowerCase().includes(query);
    return coincideCategoria && coincideTexto;
  });

  grid.innerHTML = "";
  filtradas.forEach((item) => grid.appendChild(crearTarjetaNoticia(item)));

  if (vacio) {
    vacio.classList.toggle("hidden", filtradas.length > 0);
    vacio.classList.toggle("flex", filtradas.length === 0);
  }
}

async function cargarNoticias() {
  try {
    TODAS_LAS_NOTICIAS = await ApiClient.obtenerNoticias();
    actualizarContadoresTabs();
    aplicarFiltros();
  } catch (err) {
    console.error("Error al cargar noticias:", err);
  }
}

function inicializarNoticias() {
  const searchInput = document.getElementById("noticias-search");
  const tabsContainer = document.getElementById("noticias-tabs");
  const grid = document.getElementById("noticias-grid");

  if (!grid) return;

  if (searchInput) searchInput.addEventListener("input", aplicarFiltros);

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

  // Delegación de clicks en el grid: abrir modal o eliminar
  grid.addEventListener("click", function (e) {
    const card = e.target.closest("article.noticia-card");
    if (!card) return;

    const id = parseInt(card.dataset.id);
    const item = TODAS_LAS_NOTICIAS.find((n) => n.id === id);
    if (!item) return;

    if (e.target.closest(".btn-eliminar-noticia")) {
      e.stopPropagation();
      if (!confirm(`¿Eliminar la noticia "${item.titulo}"?`)) return;
      ApiClient.eliminarNoticia(id)
        .then(cargarNoticias)
        .catch((err) => alert("No se pudo eliminar: " + err.message));
      return;
    }

    abrirModalNoticia(item);
  });

  const overlay = document.getElementById("overlay-noticia");
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) window.cerrarNoticia();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") window.cerrarNoticia();
  });

  // ================= Botón y modal de CREAR NOTICIA (solo Admin) =================
  const btnCrearNoticia = document.getElementById("btn-crear-noticia");
  if (esAdmin && btnCrearNoticia) {
    btnCrearNoticia.classList.remove("hidden");
    btnCrearNoticia.classList.add("inline-flex");
  }

  const modalCrear = document.getElementById("modal-crear-noticia");
  const modalCrearOverlay = document.getElementById("modal-crear-noticia-overlay");
  const btnCerrarCrear = document.getElementById("btn-cerrar-crear-noticia");
  const formCrear = document.getElementById("form-crear-noticia");
  const alertaCrear = document.getElementById("alerta-crear-noticia");

  function abrirModalCrear() {
    if (modalCrear) {
      modalCrear.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  }

  function cerrarModalCrear() {
    if (modalCrear) {
      modalCrear.classList.add("hidden");
      document.body.style.overflow = "";
    }
    if (formCrear) formCrear.reset();
    if (alertaCrear) alertaCrear.classList.add("hidden");
  }

  if (btnCrearNoticia) btnCrearNoticia.addEventListener("click", abrirModalCrear);
  if (btnCerrarCrear) btnCerrarCrear.addEventListener("click", cerrarModalCrear);
  if (modalCrearOverlay) modalCrearOverlay.addEventListener("click", cerrarModalCrear);

  if (formCrear) {
    formCrear.addEventListener("submit", async function (e) {
      e.preventDefault();

      const categoria = document.getElementById("noticia-categoria").value;
      const titulo = document.getElementById("noticia-titulo").value.trim();
      const descr = document.getElementById("noticia-descr").value.trim();
      const imagenUrl = document.getElementById("noticia-imagen").value.trim();
      const infoImportante = document.getElementById("noticia-info-importante").value.trim();

      const submitButton = formCrear.querySelector('button[type="submit"]');
      submitButton.disabled = true;

      try {
        await ApiClient.crearNoticia({
          categoria,
          titulo,
          descr,
          imagenUrl: imagenUrl || null,
          infoImportante: infoImportante || null,
        });
        cerrarModalCrear();
        cargarNoticias();
      } catch (error) {
        alertaCrear.className = "p-3 rounded-lg text-xs font-label-code bg-red-100 text-red-800 border border-red-200 block";
        alertaCrear.textContent = error.message;
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  cargarNoticias();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarNoticias);
} else {
  inicializarNoticias();
}