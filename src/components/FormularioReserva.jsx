import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { esquemaReserva } from "../schemas/reserva";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crearReserva, obtenerReservas } from "../services/reservas";
import { EXPOSICIONES, PRECIOS } from "../datos/museo";
import VentanaConfirmacion from "./VentanaConfirmacion";
import { exposicionMasPopular } from "../utils/popularidad";

export default function FormularioReserva() {
    const [infoAbierta, setInfoAbierta] = useState(null);
    const [mensaje, setMensaje] = useState("");

    function alternarInfo(id) {
        setInfoAbierta(infoAbierta === id ? null : id);
    }

    const { register, reset, handleSubmit, formState: { errors }, control } = useForm({
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

    const tipo = useWatch({ control, name: "tipo" });
    const entradas = useWatch({ control, name: "entradas" });
    const total = (Number(entradas) || 0) * PRECIOS[tipo];

    const queryClient = useQueryClient();

    const mutacion = useMutation({
        mutationFn: crearReserva,
        onSuccess: (reserva) => {
            queryClient.invalidateQueries({ queryKey: ["reservas"] });
            reset();
            setMensaje(`Reserva ${reserva.id} confirmada. Puedes consultarla en "Mis reservas".`);
        },
    });

    const { data: todas, isError: errorPopularidad } = useQuery({
        queryKey: ["reservas"],
        queryFn: obtenerReservas,
    });

    const popular = todas ? exposicionMasPopular(todas.reservas) : null;
    
    function onSubmit(datos) {
        setMensaje("");
        mutacion.mutate(datos);
    }

    return (
        <>
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

                <fieldset aria-describedby={errors.tipo ? "error-tipo" : undefined}>
                    <legend>Tipo de entrada</legend>
                    <label>
                        <input type="radio" value="general" aria-invalid={!!errors.tipo} {...register("tipo", {deps: ["entradas"]})} />
                        General
                    </label>
                    <label>
                        <input type="radio" value="reducida" aria-invalid={!!errors.tipo} {...register("tipo", {deps: ["entradas"]})} />
                        Reducida
                    </label>
                    <label>
                        <input type="radio" value="grupo" aria-invalid={!!errors.tipo} {...register("tipo", {deps: ["entradas"]})} />
                        Grupo
                    </label>
                    {errors.tipo && <p id="error-tipo" role="alert" className="error">{errors.tipo.message}</p>}
                </fieldset>

                <fieldset>
                    <legend aria-describedby={errors.exposiciones ? "error-exposiciones" : undefined}>Exposiciones que quieres ver</legend>
                    {errorPopularidad && <p role="status" className="cargando">No se ha podido calcular la exposición más popular.</p>}
                    {EXPOSICIONES.map((expo) => (
                        <div key={expo.id} className="exposicion">
                            <label>
                                <input
                                    type="checkbox"
                                    value={expo.id}
                                    aria-invalid={!!errors.exposiciones}
                                    aria-describedby={errors.exposiciones ? "error-exposiciones" : undefined}
                                    {...register("exposiciones")}
                                />
                                {expo.nombre}
                                {popular === expo.id && (
                                    <span className="popular">
                                        <span aria-hidden="true">★ </span>La más popular
                                    </span>
                                )}
                            </label>
                            <button
                                type="button"
                                className="boton-info"
                                aria-expanded={infoAbierta === expo.id}
                                aria-controls={`info-${expo.id}`}
                                onClick={() => alternarInfo(expo.id)}
                            >
                                {infoAbierta === expo.id ? "Menos info" : "Más info"}
                                <span className="sr-only"> sobre {expo.nombre}</span>
                            </button>

                            <p id={`info-${expo.id}`} className="info-expo" hidden={infoAbierta !== expo.id}>
                                {expo.descripcion}
                                <span>{expo.sala}</span>
                            </p>
                                                  
                        </div>
                    ))}
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
                {mensaje && <p role="status" className="ok">{mensaje}</p>}
                {mutacion.isError
                    && (<p role="alert" className="error-general">No se ha podido guardar la reserva. Inténtalo de nuevo.</p>)}
            </form>
            {mutacion.isSuccess && (
                <VentanaConfirmacion reserva={mutacion.data} onCerrar={() => mutacion.reset()} onCancelada={() => setMensaje("La reserva se ha cancelado.")} />
            )}
        </>
    );
}