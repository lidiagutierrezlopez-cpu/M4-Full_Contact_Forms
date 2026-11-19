import { z } from "zod";


function noEsPasada(texto) {
    const dia = new Date(texto + "T00:00");
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    return dia >= hoy;
}

function noEsLunes(texto) {
    const dia = new Date(texto + "T00:00");
    return dia.getDay() !== 1;
}

export const esquemaReserva = z
    .object({
        nombre: z.string().trim().min(2, "El nombre es demasiado corto"),
        email: z.email("Introduce un email válido"),
        fecha: z.string()
                .min(1, "Elige una fecha")
                .refine(noEsPasada, "No puedes reservar en una fecha pasada")
                .refine(noEsLunes, "Los lunes el museo está cerrado"),
        entradas: z .coerce
                    .number()
                    .int("Tiene que ser un número entero")
                    .min(1, "Mínimo 1 entrada")
                    .max(10, "Máximo 10 entradas por reserva"),
        tipo: z.enum(["general", "reducida", "grupo"]),
        exposiciones: z.array(z.string()).min(1, "Elige al menos una exposición"),
        comentario: z.string().trim().max(200, "Máximo 200 caracteres"),
        normas: z.boolean().refine((valor) => valor === true, "Tienes que aceptar las normas del museo"),
    })
    .refine((datos) => datos.tipo !== "grupo" || datos.entradas >=5, {
        error: "Las reservas de grupo son de 5 entradas o más",
        path: ["entradas"],
    });