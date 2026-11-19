import { useQuery } from "@tanstack/react-query";
import { obtenerReservas } from "../services/reservas";


export default function ListaReservas() {
    const { data, isPending, isError, error, isFetching, refetch } = useQuery({
        queryKey: ["reservas"],
        queryFn: obtenerReservas,
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
        return <p>Aún no hay reservas.</p>;
    }

    return (
        <>
            {isFetching && <p className="cargando">Actualizando...</p>}
            {data.descartadas > 0 && (
                <p role="status" className="aviso">
                    Reservas descartadas por datos incorrectos: {data.descartadas}
                </p>
            )}
            <ul>
                {data.reservas.map((reserva) => (
                    <li key={reserva.id}>
                        <strong>{reserva.nombre}</strong>
                        <p>{reserva.fecha} · {reserva.entradas} entradas · {reserva.tipo}</p>
                        <p>{reserva.exposiciones.join(", ")}</p>
                    </li>
                ))}
            </ul>
        </>
    );
}