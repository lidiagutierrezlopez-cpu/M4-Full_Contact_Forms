import { z } from "zod";

export const esquemaAcceso = z.object({
    nombre: z.string().trim().min(2, "Escribe el nombre con el que hiciste la reserva"),
});