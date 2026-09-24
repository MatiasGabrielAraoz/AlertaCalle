const API_BASE_URL = "http://localhost:5208";

export const ApiClient = {
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

  async actualizarEstado(id, nuevoEstado) {
    const res = await fetch(`${API_BASE_URL}/incidencias/${id}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
  },
};