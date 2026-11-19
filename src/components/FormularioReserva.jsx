import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { esquemaReserva } from "../schemas/reserva";


export default function FormularioReserva() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(esquemaReserva),
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
            <div>
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" type="text" autoComplete="name" {...register("nombre")} />
                {errors.nombre && <p className="error">{errors.nombre.message}</p>}
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" autoComplete="email" {...register("email")} />
                {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="fecha">Fecha</label>
                <input id="fecha" type="date" {...register("fecha")} />
                {errors.fecha && <p className="error">{errors.fecha.message}</p>}
            </div>
            <div>
                <label htmlFor="entradas">Entradas</label>
                <input id="entradas" type="number" min="1" max="10" {...register("entradas")} />
                {errors.entradas && <p className="error">{errors.entradas.message}</p>}
            </div>

            <fieldset>
                <legend>Tipo de entrada</legend>
                <label>
                    <input type="radio" value="general" {...register("tipo", {deps: ["entradas"]})} />
                    General
                </label>
                <label>
                    <input type="radio" value="reducida" {...register("tipo", {deps: ["entradas"]})} />
                    Reducida
                </label>
                <label>
                    <input type="radio" value="grupo" {...register("tipo", {deps: ["entradas"]})} />
                    Grupo
                </label>
            </fieldset>

            <fieldset>
                <legend>Exposiciones que quieres ver</legend>
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
                {errors.exposiciones && <p className="error">{errors.exposiciones.message}</p>}
            </fieldset>
            
            <div>
                <label htmlFor="comentario">Comentario (opcional)</label>
                <textarea id="comentario" {...register("comentario")} />
                {errors.comentario && <p className="error">{errors.comentario.message}</p>}
            </div>

            <div>
                <label>
                    <input type="checkbox" {...register("normas")} />
                    Acepto las normas del museo
                </label>
                {errors.normas && <p className="error">{errors.normas.message}</p>}
            </div>

            <button type="submit">Reservar</button>
        </form>
    );
}