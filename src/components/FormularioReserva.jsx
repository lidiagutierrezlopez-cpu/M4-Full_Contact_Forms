import { useForm } from "react-hook-form";


export default function FormularioReserva() {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            nombre: "",
            email: "",
            fecha: "",
            entradas: 1,
            tipo: "general",
            exposiciones: [],
            comentario: "",
            normas: false,
        },
    });

    function onSubmit(datos) {
        console.log(datos);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <fieldset>
                <legend>Tipo de entrada</legend>
                <label>
                    <input type="radio" value="general" {...register("tipo")} />
                    General
                </label>
                <label>
                    <input type="radio" value="reducida" {...register("tipo")} />
                    Reducida
                </label>
                <label>
                    <input type="radio" value="grupo" {...register("tipo")} />
                    Grupo
                </label>
            </fieldset>

            <fieldset>
                <legend>Esposiciones que quieres ver</legend>
                <label>
                    <input type="checkbox" value="impresionismo" {...register("exposiciones")} />
                    Impresionismo
                </label>
                <label>
                    <input type="checkbox" value="escultura" {...register("exposiciones")} />
                    Escultura
                </label>
                <label>
                    <input type="checkbox" value="renacimiento" {...register("exposiciones")} />
                    Renacimiento
                </label>
            </fieldset>
            
            <div>
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" type="text" autoComplete="name" {...register("nombre")} />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" autoComplete="email" {...register("email")} />
            </div>
            <div>
                <label htmlFor="fecha">Fecha</label>
                <input id="fecha" type="date" {...register("fecha")} />
            </div>
            <div>
                <label htmlFor="entradas">Entradas</label>
                <input id="entradas" type="number" min="1" max="10" {...register("entradas")} />
            </div>

            <label htmlFor="comentario">Comentario (opcional)</label>
            <textarea id="comentario" {...register("comentario")} />

            <div>
                <label>
                    <input type="checkbox" {...register("normas")} />
                    Acepto las normas del museo
                </label>
            </div>

            <button type="submit">Reservar</button>
        </form>
    );
}