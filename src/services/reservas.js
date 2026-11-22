import { esquemaReservaApi } from "../schemas/reserva";

const API_URL = import.meta.env.VITE_API_URL;

async function llamarApi(url, opciones) {
    try {
        return await fetch(url, opciones);
    } catch {
        throw new Error("No hay conexión con el servidor. Comprueba que la API está arrancada.");
    }
}

async function pedirReservas(url) {
    const respuesta = await llamarApi(url);
    if (!respuesta.ok) {
        throw new Error(`El servidor no ha podido cargar las reservas (error ${respuesta.status}).`);
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
    const respuesta = await llamarApi(`${API_URL}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nueva),
    });

    if (!respuesta.ok) {
        throw new Error(`El servidor no ha podido guardar la reserva (error ${respuesta.status}).`);
    }

    const json = await respuesta.json();
    const resultado = esquemaReservaApi.safeParse(json);

    if (!resultado.success) {
        console.warn("La reserva se ha guardado, pero la respuesta no es válida:", json, resultado.error.issues);
        return null;
    }

    return resultado.data;
}

export async function borrarReserva(id) {
    const respuesta = await llamarApi(`${API_URL}/reservas/${id}`, { method: "DELETE" });
    
    if (respuesta.status === 404) {
        throw new Error("Esta reserva ya no existe. Puede que ya se hubiera cancelado.");
    }

    if(!respuesta.ok) {
        throw new Error(`El servidor no ha podido cancelar la reserva (error ${respuesta.status}).`);
    }
}