import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { obtenerReservasDe, borrarReserva } from "../services/reservas";
import { nombreExposicion } from "../datos/museo";

export default function ListaReservas({ nombre }) {
    const { data, isPending, isError, error, isFetching, refetch } = useQuery({
        queryKey: ["reservas", nombre],
        queryFn: () => obtenerReservasDe(nombre),
        enable: !!nombre,
    });

    const queryClient = useQueryClient();

    const cancelar = useMutation({
        mutationFn: borrarReserva,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservas"]});
        },
    });

    if (isPending) {
        return <p role="status" className="cargando">Cargando reservas...</p>;
    }

    if (isError) {
        return (
            <div role="alert" className="error-general">
                <p>{error.message}</p>
                <button type="button" onClick={() => refetch()}>Reintentar</button>
            </div>
        );
    }

    if (data.reservas.length === 0 && data.descartadas === 0) {
        return <p>No hay reservas a nombre de {nombre}.</p>;
    }

    return (
        <>
            {isFetching && <p className="cargando">Actualizando...</p>}
            {data.descartadas > 0 && (
                <p role="status" className="aviso">
                    Reservas descartadas por datos incorrectos: {data.descartadas}
                </p>
            )}
            {cancelar.isError && <p role="alert" className="error-general">No se ha podido cancelar la reserva.</p>}
            <ul>
                {data.reservas.map((reserva) => (
                    <li key={reserva.id}>
                        <strong>{reserva.nombre}</strong>
                        <p>{reserva.fecha} · {reserva.entradas} entradas · {reserva.tipo}</p>
                        <p>{reserva.exposiciones.map(nombreExposicion).join(", ")}</p>
                        <button
                            type="button"
                            className="boton-secundario"
                            aria-label={`Cancelar la reserva de ${reserva.nombre}`}
                            disabled={cancelar.isPending && cancelar.variables === reserva.id}
                            onClick={() => cancelar.mutate(reserva.id)}
                        >
                            {cancelar.isPending && cancelar.variables === reserva.id ? "Cancelando..." : "Cancelar"}
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
}