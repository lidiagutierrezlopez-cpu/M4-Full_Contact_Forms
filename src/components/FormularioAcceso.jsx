import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { esquemaAcceso } from "../schemas/acceso";
import { useEffect } from "react";

export default function FormularioAcceso({ onAcceder, onCancelar}) {
    const { register, handleSubmit, formState: { errors }, setFocus } = useForm({
        resolver: zodResolver(esquemaAcceso),
        defaultValues: { nombre: "" },
    });

    useEffect(() => {
        setFocus("nombre");
    }, [setFocus]);

    function onSubmit(datos) {
        onAcceder(datos.nombre);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
                <label htmlFor="acceso-nombre">Tu nombre</label>
                <input
                    id="acceso-nombre"
                    type="text"
                    autoComplete="name"
                    aria-invalid={!!errors.nombre}
                    aria-describedby={errors.nombre ? "error-acceso-nombre" : undefined}
                    {...register("nombre")}
                />
                {errors.nombre && (
                    <p id="error-acceso-nombre" role="alert" className="error">{errors.nombre.message}</p>
                )}
            </div>
            <div className="acciones">
                <button type="button" className="boton-secundario" onClick={onCancelar}>Volver</button>
                <button type="submit">Ver mis reservas</button>
            </div>
        </form>
    )
}