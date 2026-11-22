import { z } from "zod";

const camposComunes = z.object({
    nombre: z.string().trim().min(2, "El nombre es demasiado corto"),
    email: z.email("Introduce un email válido"),
    tipo: z.enum(["general", "reducida", "grupo"], { error: "Elige un tipo de entrada" }),
    exposiciones: z.array(z.string()).min(1, "Elige al menos una exposición"),
    comentario: z.string().trim().max(200, "Máximo 200 caracteres")
});

const entradasValidas = z
    .number({ error: "Escribe cuántas entradas quieres" })
    .int("Tiene que ser un número entero")
    .min(1, "Mínimo 1 entrada")
    .max(10, "Máximo 10 entradas por reserva");

function grupoConMinimo(datos) {
    return datos.tipo !== "grupo" || datos.entradas >= 5;
}

const errorGrupo = {
    error: "Las reservas de grupo son de 5 entradas o más",
    path: ["entradas"],
};

const fechaVisita = z.string().superRefine((texto, ctx) => {
    if (!texto) {
        ctx.addIssue({ code: "custom", message: "Elige una fecha" });
        return;
    }

    const dia = new Date(texto + "T00:00");
    if (Number.isNaN(dia.getTime())) {
        ctx.addIssue({ code: "custom", message: "La fecha no es válida" });
        return;
    }

    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    if (dia < hoy) {
        ctx.addIssue({ code: "custom", message: "No puedes reservar en una fecha pasada" });
        return;
    }

    if (dia.getDay() === 1) {
        ctx.addIssue({ code: "custom", message: "Los lunes el museo está cerrado" });
    }
});

export const esquemaReserva = camposComunes
    .extend({
        fecha: fechaVisita,
        entradas: z .coerce
                    .number({ error: "Escribe cuántas entradas quieres" })
                    .pipe(entradasValidas),
        normas: z.boolean().refine((valor) => valor === true, "Tienes que aceptar las normas del museo"),
    })
    .refine(grupoConMinimo, errorGrupo);

export const esquemaReservaApi = camposComunes
    .extend({
        id: z.string(),
        fecha: z.string(),
        entradas: entradasValidas,
        normas: z.boolean(), 
    })
    .refine(grupoConMinimo, errorGrupo);