import { esquemaReservaApi } from "../schemas/reserva";

const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerReservas() {
    const respuesta = await fetch(`${API_URL}/reservas`);
    if (!respuesta.ok) {
        throw new Error("No se pudieron cargar las reservas");
    }

    const json = await respuesta.json();
    if (!Array.isArray(json)) {
        throw new Error("La respuesta del servidor no tiene el formato esperado");
    }

    const reservas = [];
    let descartadas = 0;

    for (const item of json) {
        const resultado = esquemaReservaApi.safeParse(item);
        if(resultado.success) {
            reservas.push(resultado.data);
        } else {
            descartadas++;
            console.warn("Reserva descartada:", item, resultado.error.issues);
        }
    }

    return { reservas, descartadas };
}

export async function crearReserva(nueva) {
    const respuesta = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nueva),
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo guardar la reserva");
    }

    return respuesta.json();
}