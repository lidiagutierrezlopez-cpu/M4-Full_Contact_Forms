import { useState } from "react";
import FormularioAcceso from "./FormularioAcceso";
import ListaReservas from "./ListaReservas";

export default function MisReservas(){
    const [abierto, setAbierto] = useState(false);
    const [nombre, setNombre] = useState("");

    function salir() {
        setNombre("");
        setAbierto(false);
    }

    if (!abierto) {
        return (
            <button type="button" onClick={() => setAbierto(true)}>Ver mis reservas</button>
        );
    }

    if (!nombre) {
        return <FormularioAcceso onAcceder={setNombre} onCancelar={() => setAbierto(false)} />;
    }

    return (
        <>
            <div className="cabecera-lista">
                <p>Reservas a nombre de <strong>{nombre}</strong></p>
                <button type="button" className="boton-secundario" onClick={salir}>Salir</button>
            </div>
            <ListaReservas nombre={nombre} />
        </>
    )
}