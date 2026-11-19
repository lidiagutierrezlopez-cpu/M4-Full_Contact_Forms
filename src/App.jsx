import FormularioReserva from "./components/FormularioReserva.jsx";
import ListaReservas from "./components/ListaReservas.jsx";

export default function App() {
    return (
        <>
            <header>
                <h1>Museo U-Tad</h1>
                <p>Reserva tu visita</p>
            </header>

            <main>
                <FormularioReserva />
                <section>
                    <h2>Reservas</h2>
                    <ListaReservas />
                </section>
            </main>
        </>
    );
}
