import { describe, it, expect } from "vitest";
import { esquemaReserva, esquemaReservaApi } from "./reserva";

const reservaBuena = {
    id: "1",
    nombre: "Ana García",
    email: "ana@ejemplo.com",
    fecha: "2026-12-04",
    entradas: 2,
    tipo: "general",
    exposiciones: ["impresionismo", "escultura"],
    comentario: "",
    normas: true,
};

const reservaCorrupta = {
    id: "corrupta",
    nombre: "Reserva rota",
    email: "esto-no-es-un-email",
    fecha: "2026-12-10",
    entradas: "muchas",
    tipo: "vip",
    exposiciones: "impresionismo",
    comentario: "",
    normas: true,
};

const formularioValido = {
    nombre: "Ana García",
    email: "ana@ejemplo.com",
    fecha: "2030-01-08",
    entradas: "2",
    tipo: "general",
    exposiciones: ["impresionismo"],
    comentario: "",
    normas: true,
};

function mensajes(resultado) {
    return resultado.error.issues.map((issue) => issue.message);
}

describe("esquemaReservaApi (bonus)", () => {
    it("acepta una reserva correcta", () => {
        expect(esquemaReservaApi.safeParse(reservaBuena).success).toBe(true);
    });

    it("atrapa la reserva corrupta de db.json", () => {
        const resultado = esquemaReservaApi.safeParse(reservaCorrupta);
        expect(resultado.success).toBe(false);

        const campos = resultado.error.issues.map((issue) => issue.path[0]);
        expect(campos).toEqual(expect.arrayContaining(["email", "entradas", "tipo", "exposiciones"]));
    });
});

describe("esquemaReserva (formulario)", () => {
    it("acepta un formulario correcto", () => {
        expect(esquemaReserva.safeParse(formularioValido).success).toBe(true);
    });

    it("rechaza los lunes", () => {
        const resultado = esquemaReserva.safeParse({ ...formularioValido, fecha: "2030-01-07" });
        expect(mensajes(resultado)).toContain("Los lunes el museo está cerrado");
    });

    it("rechaza una fecha que no es válida", () => {
        const resultado = esquemaReserva.safeParse({ ...formularioValido, fecha: "hola" });
        expect(mensajes(resultado)).toContain("La fecha no es válida");
    });

    it("exige 5 entradas en las reservas de grupo", () => {
        const resultado = esquemaReserva.safeParse({ ...formularioValido, tipo: "grupo", entradas: "3" });
        expect(mensajes(resultado)).toContain("Las reservas de grupo son de 5 entradas o más");
    });
});

describe("reglas compartidas", () => {
    it("la API también rechaza un grupo de 3 entradas", () => {
        const resultado = esquemaReservaApi.safeParse({ ...reservaBuena, tipo: "grupo", entradas: 3 });
        expect(mensajes(resultado)).toContain("Las reservas de grupo son de 5 entradas o más");
    });

    it("la API rechaza más de 10 entradas", () => {
        const resultado = esquemaReservaApi.safeParse({ ...reservaBuena, entradas: 12 });
        expect(mensajes(resultado)).toContain("Máximo 10 entradas por reserva");
    });
});