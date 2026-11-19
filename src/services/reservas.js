const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerReservas() {
    const respuesta = await fetch(`${API_URL}/reservas`);
    if (!respuesta.ok) {
        throw new Error("No se pudieron cargar las reservas");
    }
    return respuesta.json();
}