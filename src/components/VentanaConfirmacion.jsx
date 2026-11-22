import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { borrarReserva } from "../services/reservas";
import { PRECIOS, nombreExposicion } from "../datos/museo";

export default function VentanaConfirmacion({ reserva, onCerrar, onCancelada }) {
    const dialogo = useRef(null);

    useEffect(() => {
        if(!dialogo.current.open) {
            dialogo.current.showModal();
        }
    }, []);

    const queryClient = useQueryClient();

    const cancelar = useMutation({
        mutationFn: borrarReserva,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservas"] });
            onCancelada();
            onCerrar();
        },
    });

    const total = reserva.entradas * PRECIOS[reserva.tipo];
    
    const fecha = new Date(reserva.fecha + "T00:00").toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <dialog ref={dialogo} onClose={onCerrar} aria-labelledby="titulo-confirmacion">
            <h2 id="titulo-confirmacion">¡Reserva confirmada!</h2>

            <dl>
                <dt>Código</dt>
                <dd>{reserva.id}</dd>

                <dt>A nombre de</dt>
                <dd>{reserva.nombre}</dd>

                <dt>Fecha</dt>
                <dd>{fecha}</dd>

                <dt>Entradas</dt>
                <dd>{reserva.entradas} ({reserva.tipo})</dd>
                
                <dt>Exposiciones</dt>
                <dd>{reserva.exposiciones.map(nombreExposicion).join(", ")}</dd>
                
                <dt>Total</dt>
                <dd>{total.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</dd>
            </dl>

            {cancelar.isError && (
                <p role="alert" className="error-general">{cancelar.error.message}</p>
            )}

            <div className="acciones">
                <button type="button" onClick={onCerrar}>Cerrar</button>
                <button
                    type="button"
                    className="boton-secundario"
                    disabled={cancelar.isPending}
                    onClick={() => cancelar.mutate(reserva.id)}
                >
                    {cancelar.isPending ? "Cancelando..." : "Cancelar reserva"}
                </button>
            </div>
        </dialog>
    )
}