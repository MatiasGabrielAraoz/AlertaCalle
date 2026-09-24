/* ==========================================================================
   NAVBAR GLOBAL — ALERTACALLE
   Fuente única del navbar. Para agregar/sacar links se edita NAV_LINKS.
   Incluye el modo claro/oscuro (se guarda en localStorage) y el botón
   flotante de "Reportar" que sigue el scroll en todas las páginas.
   ========================================================================== */

(function () {
  const NAV_LINKS = [
    { label: "Inicio", href: "inicio.html" },
    { label: "Reportes de vecinos", href: "reportes.html" },
    { label: "Noticias", href: "noticias.html" },
    { label: "Ayuda y FAQ", href: "ayuda.html" },
  ];

  /* ---------------- TEMA CLARO / OSCURO ---------------- */
  const CLAVE_TEMA = "alertacalle-tema";

  function temaGuardado() {
    try {
      const t = localStorage.getItem(CLAVE_TEMA);
      if (t === "dark" || t === "light") return t;
    } catch (e) {}
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function aplicarTema(tema) {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(tema);
    try { localStorage.setItem(CLAVE_TEMA, tema); } catch (e) {}
  }

  aplicarTema(temaGuardado());

  /* ---------------- NAVBAR ---------------- */
  function paginaActual() {
    const partes = window.location.pathname.split("/");
    let archivo = partes[partes.length - 1];
    if (!archivo) archivo = "inicio.html";
    return archivo;
  }

  class AlertaNavbar extends HTMLElement {
    connectedCallback() {
      const actual = paginaActual();
      const miCuentaActivo = actual === "cuenta.html";

      const linksHTML = NAV_LINKS.map(function (link) {
        const activo = link.href === actual;
        const clases = activo
          ? "text-primary font-bold font-label-caps text-label-caps uppercase tracking-wider border-b-2 border-primary pb-0.5"
          : "text-secondary hover:text-primary font-label-caps text-label-caps uppercase tracking-wider transition-colors";
        return `<a class="${clases}" href="${link.href}">${link.label}</a>`;
      }).join("");

      const miCuentaClases = miCuentaActivo
        ? "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary bg-primary/5 font-label-code text-xs font-bold transition-colors"
        : "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-container-high text-on-surface font-label-code text-xs hover:bg-surface-container-low transition-colors";
      const miCuentaIconoClase = miCuentaActivo ? "material-symbols-outlined text-base text-primary" : "material-symbols-outlined text-base text-secondary";

      this.innerHTML = `
        <header class="site-header-nav w-full bg-surface-container-lowest sticky top-0 z-50 border-b border-surface-container-high/80 backdrop-blur-md">
          <div class="flex items-center w-full px-4 sm:px-6 lg:px-8 py-3.5 max-w-7xl mx-auto gap-4">
            <a class="text-headline-sm font-headline-sm font-extrabold uppercase tracking-tight text-on-surface border-l-4 border-primary pl-3 flex items-center gap-1.5 shrink-0" href="inicio.html">
              ALERTA<span class="text-primary">CALLE</span>
            </a>

            <nav class="hidden md:flex items-center justify-start gap-6 flex-1 ml-6 lg:ml-10">
              ${linksHTML}
            </nav>

            <div class="flex items-center gap-2.5 sm:gap-3 shrink-0 ml-auto md:ml-0">
              <button class="btn-tema inline-flex items-center justify-center w-9 h-9 rounded-lg border border-surface-container-high text-on-surface hover:bg-surface-container-low transition-colors hover:scale-110 active:scale-95 duration-200" type="button" aria-label="Cambiar modo claro/oscuro" title="Cambiar modo claro/oscuro">
                <span class="btn-tema-icono material-symbols-outlined text-lg"></span>
              </button>
              <button class="btn-abrir-reportar inline-flex items-center gap-1.5 bg-primary-container text-on-primary px-3.5 py-2 font-label-caps text-label-caps uppercase glow-red-button transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95 rounded-lg font-bold text-xs" type="button">
                <span class="material-symbols-outlined text-sm font-bold">add</span>
                <span class="hidden sm:inline">REPORTAR INCIDENCIA</span>
                <span class="sm:hidden">REPORTAR</span>
              </button>
              <a class="${miCuentaClases} transition-transform duration-200 hover:scale-105" href="cuenta.html">
                <span class="${miCuentaIconoClase}">account_circle</span>
                <span>Mi Cuenta</span>
              </a>
            </div>
          </div>
        </header>

        <!-- ===== BOTÓN FLOTANTE (FAB) — sigue el scroll, mismo estilo que el navbar ===== -->
        <button
          id="fab-reportar"
          class="btn-abrir-reportar fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 bg-primary-container text-on-primary px-4 py-3.5 rounded-full shadow-lg glow-red-button font-label-caps text-label-caps uppercase font-bold text-xs
                 transition-all duration-300 ease-out
                 opacity-0 translate-y-4 pointer-events-none
                 hover:scale-110 hover:-translate-y-1 active:scale-95"
          type="button"
          aria-label="Reportar incidencia"
          title="Reportar incidencia"
        >
          <span class="material-symbols-outlined text-lg">add_circle</span>
          <span class="hidden sm:inline">REPORTAR</span>
        </button>
      `;

      // Botón modo claro/oscuro
      const btnTema = this.querySelector(".btn-tema");
      const iconoTema = this.querySelector(".btn-tema-icono");

      function actualizarIcono() {
        const oscuro = document.documentElement.classList.contains("dark");
        iconoTema.textContent = oscuro ? "light_mode" : "dark_mode";
      }

      btnTema.addEventListener("click", function () {
        const oscuro = document.documentElement.classList.contains("dark");
        aplicarTema(oscuro ? "light" : "dark");
        actualizarIcono();
      });

      actualizarIcono();
    }
  }

  if (!customElements.get("alerta-navbar")) {
    customElements.define("alerta-navbar", AlertaNavbar);
  }
})();