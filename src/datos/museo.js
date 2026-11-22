export const PRECIOS = { general: 12, reducida: 6, grupo: 8 };

export const EXPOSICIONES = [
    {
        id: "impresionismo",
        nombre: "Impresionismo",
        sala: "Sala 1",
        descripcion: "Paisajes, luz y pinceladas sueltas de finales del siglo XIX. Obras que intentan captar un instante tal y como se veía.",
    },
    {
        id: "escultura",
        nombre: "Escultura",
        sala: "Sala 2",
        descripcion: "Piezas en mármol, bronce y madera, desde la Antigüedad hasta hoy. Un recorrido por cómo ha cambiado la forma de representar el cuerpo.",
    },
    {
        id: "renacimiento",
        nombre: "Renacimiento",
        sala: "Sala 3",
        descripcion: "Pintura italiana y flamenca de los siglos XV y XVI. Retratos, escenas religiosas y los primeros grandes estudios de perspectiva.",
    },
];

export const TIPOS = [
    { id: "general", nombre: "General" },
    { id: "reducida", nombre: "Reducida" },
    { id: "grupo", nombre: "Grupo" },
];

export function nombreExposicion(id) {
    const expo = EXPOSICIONES.find((e) => e.id === id);
    return expo ? expo.nombre : id;
}