export function exposicionMasPopular(reservas) {
    const conteo = {};

    for (const reserva of reservas) {
        for (const exposicion of reserva.exposiciones) {
            conteo[exposicion] = (conteo[exposicion] || 0) + reserva.entradas;
        }
    }

    let ganadora = null;
    let maximo = 0;

    for (const [exposicion, total] of Object.entries(conteo)) {
        if (total > maximo) {
            ganadora = exposicion;
            maximo = total;
        }
    }

    return ganadora;
}