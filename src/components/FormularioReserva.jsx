import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { esquemaReserva } from "../schemas/reserva";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearReserva } from "../services/reservas";
import { PRECIOS } from "../datos/museo";

export default function FormularioReserva() {
    const { register, reset, handleSubmit, formState: { errors }, watch } = useForm({
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

    const tipo = watch("tipo");
    const entradas = watch("entradas");
    const total = (Number(entradas) || 0) * PRECIOS[tipo];

    const queryClient = useQueryClient();

    const mutacion = useMutation({
        mutationFn: crearReserva,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservas"] });
            reset();
        },
    });

    function onSubmit(datos) {
        mutacion.mutate(datos);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
                <label htmlFor="nombre">Nombre</label>
                <input 
                    id="nombre" 
                    type="text" 
                    autoComplete="name" 
                    aria-invalid={!!errors.nombre} 
                    aria-describedby={errors.nombre ? "error-nombre" : undefined} 
                    {...register("nombre")}
                />
                {errors.nombre && <p id="error-nombre" role="alert" className="error">{errors.nombre.message}</p>}
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input 
                    id="email" 
                    type="email" 
                    autoComplete="email" 
                    aria-invalid={!!errors.email} 
                    aria-describedby={errors.email ? "error-email" : undefined} 
                    {...register("email")}
                />
                {errors.email && <p id="error-email" role="alert" className="error">{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="fecha">Fecha</label>
                <input 
                    id="fecha" 
                    type="date" 
                    aria-invalid={!!errors.fecha} 
                    aria-describedby={errors.fecha ? "error-fecha" : undefined} 
                    {...register("fecha")}
                />
                {errors.fecha && <p id="error-fecha" role="alert" className="error">{errors.fecha.message}</p>}
            </div>
            <div>
                <label htmlFor="entradas">Entradas</label>
                <input 
                    id="entradas" 
                    type="number" 
                    min="1"
                    max="10"
                    aria-invalid={!!errors.entradas} 
                    aria-describedby={errors.entradas ? "error-entradas" : undefined} 
                    {...register("entradas")}
                />
                {errors.entradas && <p id="error-entradas" role="alert" className="error">{errors.entradas.message}</p>}
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
                    <input
                        type="checkbox"
                        value="impresionismo"
                        aria-invalid={!!errors.exposiciones}
                        aria-describedby={errors.exposiciones ? "error-exposiciones" : undefined}
                        {...register("exposiciones")}
                    />
                    Impresionismo
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="escultura"
                        aria-invalid={!!errors.exposiciones}
                        aria-describedby={errors.exposiciones ? "error-exposiciones" : undefined}
                        {...register("exposiciones")}
                    />
                    Escultura
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="renacimiento"
                        aria-invalid={!!errors.exposiciones}
                        aria-describedby={errors.exposiciones ? "error-exposiciones" : undefined}
                        {...register("exposiciones")}
                    />
                    Renacimiento
                </label>
                {errors.exposiciones && <p id="error-exposiciones" role="alert" className="error">{errors.exposiciones.message}</p>}
            </fieldset>
            
            <div>
                <label htmlFor="comentario">Comentario (opcional)</label>
                <textarea 
                    id="comentario" 
                    aria-invalid={!!errors.comentario} 
                    aria-describedby={errors.comentario ? "error-comentario" : undefined} 
                    {...register("comentario")}
                />
                {errors.comentario && <p id="error-comentario" role="alert" className="error">{errors.comentario.message}</p>}
            </div>

            <div>
                <label>
                    <input 
                        type="checkbox" 
                        aria-invalid={!!errors.normas} 
                        aria-describedby={errors.normas ? "error-normas" : undefined} 
                        {...register("normas")}
                    />
                    Acepto las normas del museo
                </label>
                {errors.normas && <p id="error-normas" role="alert" className="error">{errors.normas.message}</p>}
            </div>

            <p className="precio" aria-live="polite">
                Total: {total.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
            </p>

            <button type="submit" disabled={mutacion.isPending}>
                {mutacion.isPending ? "Reservando…" : "Reservar"}
            </button>
            {mutacion.isSuccess 
                && (<p role="status" className="ok">¡Reserva confirmada! Te esperamos en el museo.</p>)}
            {mutacion.isError
                && (<p role="alert" className="error-general">No se ha podido guardar la reserva. Inténtalo de nuevo.</p>)}
        </form>
    );
}