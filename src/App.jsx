import FormularioReserva from "./components/FormularioReserva.jsx";
import MisReservas from "./components/MisReservas.jsx";

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
                    <h2>Mis reservas</h2>
                    <MisReservas />
                </section>
            </main>
        </>
    );
}
