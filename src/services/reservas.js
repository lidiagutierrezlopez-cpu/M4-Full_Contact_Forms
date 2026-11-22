import { esquemaReservaApi } from "../schemas/reserva";

const API_URL = import.meta.env.VITE_API_URL;

async function pedirReservas(url) {
    const respuesta = await fetch(url);
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

export function obtenerReservas() {
    return pedirReservas(`${API_URL}/reservas`);
}

export function obtenerReservasDe(nombre) {
    return pedirReservas(`${API_URL}/reservas?nombre=${encodeURIComponent(nombre)}`);
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

    const json = await respuesta.json();
    return esquemaReservaApi.parse(json);
}

export async function borrarReserva(id) {
    const respuesta = await fetch(`${API_URL}/reservas/${id}`, { method: "DELETE" });
    if(!respuesta.ok) {
        throw new Error("No se pudo cancelar la reserva");
    }
}