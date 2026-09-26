import { ApiClient } from "./client.js";

function timeAgo(rawDate) {
  const date = new Date(rawDate);
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * 60 * 60 * 1000;
  const diffInMiliseconds = date.getTime() - new Date().getTime();
  const hours = Math.round(Math.abs(diffInMiliseconds / oneHour));
  const days = Math.round(Math.abs(diffInMiliseconds / oneDay));
  if (days > 0) {
    return days == 1 ? `${days} dia` : `${days} dias`;
  }
  return hours == 1 ? `${hours} hora` : `${hours} horas`;
}

const alertSection = document.querySelector("#incidencias");
const estados = ["Sin Resolver", "En Proceso", "Resuelto"];
const template = document.querySelector("#card");

const inputBusqueda = document.getElementById("filtro-busqueda");
const selectBarrio = document.getElementById("filtro-barrio");
const botonesEstado = document.querySelectorAll(".filtro-estado-btn");
const botonesCategoria = document.querySelectorAll(".filtro-categoria-btn");

const sesion = ApiClient.obtenerSesion();
const esAdmin = sesion?.usuario?.idRol === 1;

let todasLasIncidencias = [];
let estadoActivo = "todos";
let categoriaActiva = "todos";

function renderizarIncidencias(lista) {
  alertSection.innerHTML = "";

  lista.forEach((item) => {
    const t = document.importNode(template.content, true);
    const estadoIndex = parseInt(item.idEstado - 1);

    t.querySelector(".idCard").textContent = `#INC-${item.id}`;
    t.querySelector(".titulo").textContent = item.titulo;

    const estadoEl = t.querySelector(".estado");
    estadoEl.textContent = estados[estadoIndex];
    switch (estadoIndex) {
      case 0: estadoEl.classList.add("bg-primary-container", "animate-pulse"); break;
      case 1: estadoEl.classList.add("bg-secondary"); break;
      case 2: estadoEl.classList.add("bg-emerald-700"); break;
    }

    t.querySelector(".categoria").textContent = item.categoria.nombre;
    t.querySelector(".direccion").textContent = item.direccion;
    t.querySelector(".tiempoRegistrado").textContent = `Registrado hace ${timeAgo(item.fechaCreacion)}`;

    if (esAdmin) {
      const adminActions = t.querySelector(".admin-actions");
      adminActions.classList.remove("hidden");

      const selectEstado = t.querySelector(".select-estado");
      selectEstado.value = item.idEstado;

      t.querySelector(".btn-guardar-estado").addEventListener("click", async () => {
        try {
          await ApiClient.cambiarEstadoIncidencia(item.id, parseInt(selectEstado.value));
          cargarIncidencias();
        } catch (err) {
          alert("No se pudo actualizar el estado: " + err.message);
        }
      });

      t.querySelector(".btn-eliminar-incidencia").addEventListener("click", async () => {
        if (!confirm(`¿Eliminar la incidencia #INC-${item.id}?`)) return;
        try {
          await ApiClient.eliminarIncidencia(item.id);
          cargarIncidencias();
        } catch (err) {
          alert("No se pudo eliminar: " + err.message);
        }
      });
    }

    alertSection.appendChild(t);
  });
}

function categoriaKey(nombreCategoria) {
  const n = (nombreCategoria || "").toLowerCase();
  if (n.includes("alumbrado")) return "alumbrado";
  if (n.includes("bache") || n.includes("calzada")) return "baches";
  if (n.includes("residuo") || n.includes("basura")) return "residuos";
  if (n.includes("árbol") || n.includes("arbol")) return "arbolado";
  return "otros";
}

function aplicarFiltros() {
  const query = inputBusqueda ? inputBusqueda.value.trim().toLowerCase() : "";
  const barrio = selectBarrio ? selectBarrio.value : "todos";

  const filtradas = todasLasIncidencias.filter((item) => {
    const coincideTexto =
      !query ||
      item.titulo.toLowerCase().includes(query) ||
      item.direccion.toLowerCase().includes(query) ||
      (item.descr || "").toLowerCase().includes(query) ||
      `inc-${item.id}`.includes(query);

    const coincideBarrio = barrio === "todos" || item.direccion.toLowerCase().includes(barrio.toLowerCase());

    const coincideEstado = estadoActivo === "todos" || item.idEstado === parseInt(estadoActivo);

    const coincideCategoria = categoriaActiva === "todos" || categoriaKey(item.categoria.nombre) === categoriaActiva;

    return coincideTexto && coincideBarrio && coincideEstado && coincideCategoria;
  });

  renderizarIncidencias(filtradas);
}

if (inputBusqueda) inputBusqueda.addEventListener("input", aplicarFiltros);
if (selectBarrio) selectBarrio.addEventListener("change", aplicarFiltros);

botonesEstado.forEach((btn) => {
  btn.addEventListener("click", () => {
    estadoActivo = btn.dataset.estado;
    botonesEstado.forEach((b) => {
      b.classList.remove("bg-surface-container-lowest", "shadow-xs", "border", "border-surface-container-high/60", "font-bold", "text-on-surface");
      b.classList.add("text-secondary");
    });
    btn.classList.add("bg-surface-container-lowest", "shadow-xs", "border", "border-surface-container-high/60", "font-bold", "text-on-surface");
    btn.classList.remove("text-secondary");
    aplicarFiltros();
  });
});

botonesCategoria.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoriaActiva = btn.dataset.categoria;
    botonesCategoria.forEach((b) => {
      b.classList.remove("bg-primary-container", "text-on-primary", "glow-red-button");
      b.classList.add("bg-surface", "text-on-surface", "border", "border-surface-container-high");
    });
    btn.classList.add("bg-primary-container", "text-on-primary", "glow-red-button");
    btn.classList.remove("bg-surface", "text-on-surface", "border", "border-surface-container-high");
    aplicarFiltros();
  });
});

function actualizarMetricas(lista) {
  const totalRecibidos = lista.length;
  let solucionados = 0;
  let enProceso = 0;
  let pendientes = 0;

  lista.forEach((item) => {
    const estadoId = Number(item.idEstado);
    if (estadoId === 3) solucionados++;
    else if (estadoId === 2) enProceso++;
    else if (estadoId === 1) pendientes++;
  });

  const elRecibidos = document.getElementById("metrica-recibidos");
  const elSolucionados = document.getElementById("metrica-solucionados");
  const elSolucionadosPct = document.getElementById("metrica-solucionados-pct");
  const elProceso = document.getElementById("metrica-proceso");
  const elPendientes = document.getElementById("metrica-pendientes");
  const badgeTotal = document.getElementById("metrica-badge-total");

  if (elRecibidos) elRecibidos.textContent = totalRecibidos;
  if (elSolucionados) elSolucionados.textContent = solucionados;
  if (elProceso) elProceso.textContent = enProceso;
  if (elPendientes) elPendientes.textContent = pendientes;

  const pct = totalRecibidos > 0 ? Math.round((solucionados / totalRecibidos) * 100) : 0;
  if (elSolucionadosPct) elSolucionadosPct.textContent = `${pct}%`;

  if (badgeTotal) badgeTotal.textContent = `${totalRecibidos} REPORTES ACTIVOS AUDITADOS`;
}

async function cargarIncidencias() {
  try {
    todasLasIncidencias = await ApiClient.obtenerAlertas();
    actualizarMetricas(todasLasIncidencias);
    aplicarFiltros();
  } catch (err) {
    console.error("Error al cargar incidencias:", err);
  }
}

cargarIncidencias();