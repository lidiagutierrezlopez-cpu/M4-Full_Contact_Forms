export const PRECIOS = { general: 12, reducida: 6, grupo: 8 };

export const EXPOSICIONES = [
    {
        id: "impresionismo",
        nombre: "Impresionismo",
        sala: "Sala 1",
        descripcion: "Una descripción corta de la exposición.",
    },
    {
        id: "escultura",
        nombre: "Escultura",
        sala: "Sala 2",
        descripcion: "Una descripción corta de la exposición.",
    },
    {
        id: "renacimiento",
        nombre: "Renacimiento",
        sala: "Sala 3",
        descripcion: "Una descripción corta de la exposición.",
    },
];

export function nombreExposicion(id) {
    const expo = EXPOSICIONES.find((e) => e.id === id);
    return expo ? expo.nombre : id;
}