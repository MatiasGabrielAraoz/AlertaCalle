const API_BASE_URL = "http://localhost:5208";
const REFRESH_BEFORE_EXPIRATION_MS = 5 * 60 * 1000;
const REFRESH_CHECK_INTERVAL_MS = 5 * 60 * 1000;

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

function getTokenExpiration(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, "="));
    return JSON.parse(decoded).exp * 1000;
  } catch {
    return 0;
  }
}

function saveRefreshedTokens(tokenResponse) {
  const useLocalStorage = Boolean(localStorage.getItem("token"));
  const storage = useLocalStorage ? localStorage : sessionStorage;
  const refreshTokenExpiresAt = new Date(tokenResponse.refreshTokenExpiresAt).getTime();
  const cookieMaxAge = useLocalStorage
    ? Math.max(0, Math.floor((refreshTokenExpiresAt - Date.now()) / 1000))
    : undefined;

  storage.setItem("token", tokenResponse.token);
  storage.setItem("refreshToken", tokenResponse.refreshToken);
  setCookie("alertacalle_token", tokenResponse.token, cookieMaxAge);
  setCookie("alertacalle_refresh_token", tokenResponse.refreshToken, cookieMaxAge);
}

async function refreshSessionIfNeeded() {
  const session = ApiClient.obtenerSesion();
  if (!session) return null;
  if (getTokenExpiration(session.token) > Date.now() + REFRESH_BEFORE_EXPIRATION_MS) {
    return session.token;
  }
  if (!session.refreshToken) {
    ApiClient.cerrarSesion();
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  });
  if (response.status === 401) {
    ApiClient.cerrarSesion();
    return null;
  }
  if (!response.ok) throw new Error(`No se pudo renovar la sesión (error ${response.status}).`);

  const tokenResponse = await response.json();
  saveRefreshedTokens(tokenResponse);
  return tokenResponse.token;
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

  async obtenerUsuarioActual(token) {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  },

  guardarSesion(tokenResponse, usuario, recordar) {
    const usuarioJson = JSON.stringify(usuario);
    const storage = recordar ? localStorage : sessionStorage;
    const otherStorage = recordar ? sessionStorage : localStorage;
    const cookieMaxAge = recordar
      ? Math.max(
          0,
          Math.floor((new Date(tokenResponse.refreshTokenExpiresAt).getTime() - Date.now()) / 1000),
        )
      : undefined;

    otherStorage.removeItem("token");
    otherStorage.removeItem("usuario");
    otherStorage.removeItem("refreshToken");
    storage.setItem("usuario", usuarioJson);
    storage.setItem("refreshToken", tokenResponse.refreshToken);
    storage.setItem("token", tokenResponse.token);
    setCookie("alertacalle_token", tokenResponse.token, cookieMaxAge);
    setCookie("alertacalle_refresh_token", tokenResponse.refreshToken, cookieMaxAge);
    setCookie("alertacalle_usuario", usuarioJson, cookieMaxAge);
    scheduleSessionRefresh();
  },

  obtenerSesion() {
    const token = localStorage.getItem("token")
      || sessionStorage.getItem("token")
      || getCookie("alertacalle_token");
    const usuarioJson = localStorage.getItem("usuario")
      || sessionStorage.getItem("usuario")
      || getCookie("alertacalle_usuario");
    const refreshToken = localStorage.getItem("refreshToken")
      || sessionStorage.getItem("refreshToken")
      || getCookie("alertacalle_refresh_token");

    if (!token) return null;
    return { token, refreshToken, usuario: usuarioJson ? JSON.parse(usuarioJson) : null };
  },

  async obtenerTokenValido() {
    return refreshSessionIfNeeded();
  },

  cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("refreshToken");
    removeCookie("alertacalle_token");
    removeCookie("alertacalle_refresh_token");
    removeCookie("alertacalle_usuario");
  },

  async crearAlerta(data) {
    const token = await this.obtenerTokenValido();
    if (!token) throw new Error("La sesión venció. Iniciá sesión nuevamente.");
    const res = await fetch(`${API_BASE_URL}/incidencias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

  async actualizarEstado(id, nuevoEstado) {
    const token = await this.obtenerTokenValido();
    if (!token) throw new Error("La sesión venció. Iniciá sesión nuevamente.");
    const res = await fetch(`${API_BASE_URL}/incidencias/${id}/estado`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
  },
};

let refreshTimeoutId;

function scheduleSessionRefresh() {
  window.clearTimeout(refreshTimeoutId);
  const session = ApiClient.obtenerSesion();
  if (!session) return;

  const timeUntilRefresh = Math.min(
    REFRESH_CHECK_INTERVAL_MS,
    Math.max(1000, getTokenExpiration(session.token) - Date.now() - REFRESH_BEFORE_EXPIRATION_MS),
  );
  refreshTimeoutId = window.setTimeout(async () => {
    try {
      await ApiClient.obtenerTokenValido();
    } catch (error) {
      console.error("No se pudo renovar la sesión automáticamente.", error);
    }
    scheduleSessionRefresh();
  }, timeUntilRefresh);
}

scheduleSessionRefresh();
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    ApiClient.obtenerTokenValido().catch((error) => {
      console.error("No se pudo renovar la sesión al volver a la aplicación.", error);
    });
  }
});