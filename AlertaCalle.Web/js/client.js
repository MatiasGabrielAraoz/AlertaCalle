const API_BASE_URL = "http://localhost:8080";

function cookieOptions(maxAge) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  return `Path=/; SameSite=Lax${maxAge === undefined ? "" : `; Max-Age=${maxAge}`}${secure}`;
}

function setCookie(name, value, maxAge) {
  document.cookie = `${name}=${encodeURIComponent(value)}; ${cookieOptions(maxAge)}`;
}

function getCookie(name) {
  const prefix = `${name}=`;
  const cookie = document.cookie.split("; ").find((item) => item.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}

function removeCookie(name) {
  document.cookie = `${name}=; ${cookieOptions(0)}`;
}

export const ApiClient = {
  async iniciarSesion(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Las credenciales no son válidas.");
    }
    return res.json();
  },

  async registrarse(nombre, apellido, dni, email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nombre, surname: apellido, dni, email, password }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "No se pudo completar el registro.");
    }
  },

  async obtenerUsuarioActual(token) {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  },

  guardarSesion(token, usuario, recordar) {
    const usuarioJson = JSON.stringify(usuario);
    const storage = recordar ? localStorage : sessionStorage;
    const otherStorage = recordar ? sessionStorage : localStorage;

    otherStorage.removeItem("token");
    otherStorage.removeItem("usuario");
    storage.setItem("token", token);
    storage.setItem("usuario", usuarioJson);
    setCookie("alertacalle_token", token, recordar ? 60 * 60 * 24 * 30 : undefined);
    setCookie("alertacalle_usuario", usuarioJson, recordar ? 60 * 60 * 24 * 30 : undefined);
  },

  obtenerSesion() {
    const token = localStorage.getItem("token")
      || sessionStorage.getItem("token")
      || getCookie("alertacalle_token");
    const usuarioJson = localStorage.getItem("usuario")
      || sessionStorage.getItem("usuario")
      || getCookie("alertacalle_usuario");

    if (!token) return null;
    return { token, usuario: usuarioJson ? JSON.parse(usuarioJson) : null };
  },

  cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    removeCookie("alertacalle_token");
    removeCookie("alertacalle_usuario");
  },

  async crearAlerta(data) {
    const res = await fetch(`${API_BASE_URL}/incidencias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
  },

  async obtenerAlertas() {
    const res = await fetch(`${API_BASE_URL}/incidencias`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  },

  async obtenerAlertaPorId(id) {
    const res = await fetch(`${API_BASE_URL}/incidencias/${id}`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  },

  async eliminarIncidencia(id) {
    const sesion = this.obtenerSesion();
    const res = await fetch(`${API_BASE_URL}/incidencias/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${sesion.token}` },
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
  },

  async cambiarEstadoIncidencia(id, nuevoIdEstado) {
    const sesion = this.obtenerSesion();
    const res = await fetch(`${API_BASE_URL}/incidencias/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesion.token}`,
      },
      body: JSON.stringify({ idEstado: nuevoIdEstado }),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
  },

    async obtenerNoticias() {
    const res = await fetch(`${API_BASE_URL}/noticias`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  },

  async crearNoticia(data) {
    const sesion = this.obtenerSesion();
    const res = await fetch(`${API_BASE_URL}/noticias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesion.token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `Error ${res.status}`);
    }
    return res.json();
  },

  async eliminarNoticia(id) {
    const sesion = this.obtenerSesion();
    const res = await fetch(`${API_BASE_URL}/noticias/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${sesion.token}` },
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
  },

  async uploadImagenNoticia(file) {
    const sesion = this.obtenerSesion();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/noticias/upload-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${sesion.token}` },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error al subir la imagen");
    }
    const data = await res.json();
    return data.url;
  },
};