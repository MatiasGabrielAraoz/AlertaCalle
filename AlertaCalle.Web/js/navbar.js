import { ApiClient } from "./client.js";

(function () {
  const NAV_LINKS = [
    { label: "Inicio", href: "inicio.html" },
    { label: "Reportes de vecinos", href: "reportes.html" },
    { label: "Noticias", href: "noticias.html" },
    { label: "Ayuda y FAQ", href: "ayuda.html" },
  ];

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
      const sesion = ApiClient.obtenerSesion();

      const linksDesktopHTML = NAV_LINKS.map(function (link) {
        const activo = link.href === actual;
        const clases = activo
          ? "text-primary font-bold font-label-caps text-label-caps uppercase tracking-wider border-b-2 border-primary pb-0.5"
          : "text-secondary hover:text-primary font-label-caps text-label-caps uppercase tracking-wider transition-colors";
        return `<a class="${clases}" href="${link.href}">${link.label}</a>`;
      }).join("");

      const linksMobileHTML = NAV_LINKS.map(function (link) {
        const activo = link.href === actual;
        const clases = activo
          ? "text-primary font-bold font-label-caps text-xs uppercase px-3 py-2 rounded-lg bg-primary/10 border-l-4 border-primary"
          : "text-secondary hover:text-primary font-label-caps text-xs uppercase px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors";
        return `<a class="${clases}" href="${link.href}">${link.label}</a>`;
      }).join("");

      const miCuentaClases = miCuentaActivo
        ? "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary bg-primary/5 font-label-code text-xs font-bold transition-colors"
        : "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-container-high text-on-surface font-label-code text-xs hover:bg-surface-container-low transition-colors";
      const miCuentaIconoClase = miCuentaActivo ? "material-symbols-outlined text-base text-primary" : "material-symbols-outlined text-base text-secondary";

      const nombreUsuario = sesion?.usuario?.nombre || "Mi Cuenta";
      const bloqueSesionHTML = sesion
        ? `<a class="${miCuentaClases} transition-transform duration-200 hover:scale-105" href="cuenta.html">
             <span class="${miCuentaIconoClase}">account_circle</span>
             <span>${nombreUsuario}</span>
           </a>`
        : `<a class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-container-high text-on-surface font-label-code text-xs hover:bg-surface-container-low transition-colors" href="login.html">
             <span class="material-symbols-outlined text-base text-secondary">login</span>
             <span>Iniciar Sesión</span>
           </a>
           <a class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-code text-xs font-bold hover:opacity-90 transition-colors" href="register.html">
             <span>Registrarse</span>
           </a>`;

      const sesionMobileHTML = sesion
        ? `<a class="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-primary/30 text-primary font-label-code text-xs font-bold bg-primary/5" href="cuenta.html">
             <span class="material-symbols-outlined text-base">account_circle</span>
             <span>${nombreUsuario} (Mi Cuenta)</span>
           </a>`
        : `<div class="grid grid-cols-2 gap-2 pt-2 border-t border-surface-container-high">
             <a class="inline-flex justify-center items-center gap-1 px-3 py-2 rounded-lg border border-surface-container-high text-on-surface font-label-code text-xs font-bold" href="login.html">Ingresar</a>
             <a class="inline-flex justify-center items-center gap-1 px-3 py-2 rounded-lg bg-primary-container text-on-primary font-label-code text-xs font-bold" href="register.html">Registrarse</a>
           </div>`;

      this.innerHTML = `
        <header class="site-header-nav w-full bg-surface-container-lowest sticky top-0 z-50 border-b border-surface-container-high/80 backdrop-blur-md">
          <div class="flex items-center justify-between w-full px-4 sm:px-6 lg:px-8 py-3.5 max-w-7xl mx-auto gap-4">
            <a class="text-headline-sm font-headline-sm font-extrabold uppercase tracking-tight text-on-surface border-l-4 border-primary pl-3 flex items-center gap-1.5 shrink-0" href="inicio.html">
              ALERTA<span class="text-primary">CALLE</span>
            </a>

            <nav class="hidden md:flex items-center justify-start gap-6 flex-1 ml-6 lg:ml-10">
              ${linksDesktopHTML}
            </nav>

            <div class="flex items-center gap-2 sm:gap-3 shrink-0">
              <button class="btn-tema inline-flex items-center justify-center w-9 h-9 rounded-lg border border-surface-container-high text-on-surface hover:bg-surface-container-low transition-colors hover:scale-105 duration-200" type="button" aria-label="Cambiar modo claro/oscuro" title="Cambiar modo claro/oscuro">
                <span class="btn-tema-icono material-symbols-outlined text-lg"></span>
              </button>

              <button class="btn-abrir-reportar inline-flex items-center gap-1.5 bg-primary-container text-on-primary px-3 py-2 sm:px-3.5 font-label-caps text-label-caps uppercase glow-red-button transition-all duration-200 hover:scale-105 rounded-lg font-bold text-xs" type="button">
                <span class="material-symbols-outlined text-sm font-bold">add</span>
                <span class="hidden sm:inline">REPORTAR INCIDENCIA</span>
                <span class="sm:hidden">REPORTAR</span>
              </button>

              ${bloqueSesionHTML}

              <!-- Botón Menú Hamburguesa para Móviles -->
              <button id="btn-menu-mobile" class="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-surface-container-high text-on-surface hover:bg-surface-container-low transition-colors" type="button" aria-label="Abrir menú de navegación">
                <span class="material-symbols-outlined text-xl">menu</span>
              </button>
            </div>
          </div>

          <!-- Menú Desplegable Móvil -->
          <div id="nav-mobile-drawer" class="hidden md:hidden border-t border-surface-container-high bg-surface-container-lowest px-4 py-4 space-y-3 soft-card-shadow">
            <div class="flex flex-col space-y-1">
              ${linksMobileHTML}
            </div>
            ${sesionMobileHTML}
          </div>
        </header>

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

      const btnTema = this.querySelector(".btn-tema");
      const iconoTema = this.querySelector(".btn-tema-icono");
      const btnMenuMobile = this.querySelector("#btn-menu-mobile");
      const drawerMobile = this.querySelector("#nav-mobile-drawer");

      function actualizarIcono() {
        const oscuro = document.documentElement.classList.contains("dark");
        iconoTema.textContent = oscuro ? "light_mode" : "dark_mode";
      }

      btnTema.addEventListener("click", function () {
        const oscuro = document.documentElement.classList.contains("dark");
        aplicarTema(oscuro ? "light" : "dark");
        actualizarIcono();
      });

      if (btnMenuMobile && drawerMobile) {
        btnMenuMobile.addEventListener("click", function () {
          const abierto = !drawerMobile.classList.contains("hidden");
          drawerMobile.classList.toggle("hidden", abierto);
          btnMenuMobile.querySelector(".material-symbols-outlined").textContent = abierto ? "menu" : "close";
        });
      }

      actualizarIcono();
    }
  }

  if (!customElements.get("alerta-navbar")) {
    customElements.define("alerta-navbar", AlertaNavbar);
  }
})();