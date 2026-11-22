# Museo U-Tad

Misión M4 "Full Contact Forms" de Desarrollo Web I. Aplicación React para reservar visitas a un museo, con un formulario validado con React Hook Form y Zod, y datos remotos gestionados con TanStack Query contra una API local de json-server.

## Formulario y validación

El formulario recoge nombre, email, fecha de la visita, número de entradas, tipo de entrada, exposiciones, un comentario opcional y la aceptación de las normas del museo.

- El nombre debe tener al menos 2 caracteres.
- El email debe tener un formato válido.
- La fecha se valida con un único `superRefine`, que comprueba en orden que se haya elegido una fecha, que sea una fecha válida, que no sea pasada y que no caiga en lunes, que es el día de cierre del museo. Se detiene en el primer fallo, así que siempre se muestra el mensaje adecuado.
- Las entradas son un número entero entre 1 y 10. Se usa `z.coerce.number()` porque los inputs siempre devuelven texto, y después `.pipe()` le aplica las mismas reglas (`entradasValidas`) que usa el esquema de la API.
- Hay que elegir un tipo de entrada y al menos una exposición.
- El comentario admite un máximo de 200 caracteres.
- Hay que aceptar las normas del museo.
- Validación cruzada: las reservas de grupo necesitan 5 entradas o más. El error se asigna al campo de entradas con `path`, y los radios del tipo declaran `deps: ["entradas"]` para que el error se recalcule al cambiar de tipo.

Los campos que comparten el formulario y la API están en un esquema base, `camposComunes`. Tanto `esquemaReserva` como `esquemaReservaApi` se crean a partir de él con `.extend()`, de modo que las reglas comunes solo están escritas una vez.

La regla del grupo también es compartida: la función `grupoConMinimo` se usa en el `.refine` de los dos esquemas, así que la API tampoco acepta un grupo de menos de 5 entradas.



## Accesibilidad

- Cada campo tiene su `label` asociado con `htmlFor` e `id`. El placeholder no se usa como etiqueta.
- Los grupos de radios y checkboxes van en `fieldset` con su `legend`. En los grupos (tipo de entrada y exposiciones), `aria-describedby` va en el `fieldset` y `aria-invalid` en cada opción.
- `autocomplete` en el nombre y el email.
- Los campos con error llevan `aria-invalid` y `aria-describedby` apuntando a su mensaje, que tiene `role="alert"`.
- Al enviar con errores, el foco va al primer campo incorrecto (opción `shouldFocusError` de React Hook Form, activada por defecto).
- El botón de envío solo se deshabilita mientras se envía, nunca hasta que el formulario sea válido.
- La ventana de confirmación usa `<dialog>` con `showModal()`: bloquea el fondo, mantiene el foco dentro y se cierra con Esc.
- Los botones de más información usan `aria-expanded` y `aria-controls`, con texto oculto para lectores de pantalla que indica a qué exposición se refiere cada uno.
- El formulario se ha probado completo usando solo el teclado.
- Al abrir "Mis reservas", el foco pasa al campo del nombre con `setFocus`, porque el botón que lo abre desaparece y el foco se quedaría perdido.



## Peticiones con TanStack Query

Las llamadas a la API están separadas en `services/reservas.js`. Todas comprueban `response.ok` y leen la URL base desde `VITE_API_URL`.

Queries:

- `["reservas"]`: todas las reservas, para calcular la exposición más popular.
- `["reservas", nombre]`: las reservas de una persona. Usa `enabled` para no lanzarse hasta que hay un nombre, y el filtro lo hace json-server con `?nombre=`.

Mutations:

- Crear reserva (POST) desde el formulario.
- Cancelar reserva (DELETE) desde la ventana de confirmación y desde el listado.

Tras cada mutación se ejecuta `invalidateQueries({ queryKey: ["reservas"] })`. Como invalida todas las claves que empiezan por `"reservas"`, se actualizan a la vez el listado y la exposición más popular.

La interfaz muestra en cada momento qué está pasando: "Cargando reservas…", error con botón de reintentar, lista vacía, "Actualizando…" durante el refresco en segundo plano, "Reservando…" y "Cancelando…" en los botones, y mensajes de error si falla un envío.

La respuesta del POST se valida con `safeParse`. Si no encaja con el esquema, no se lanza un error: la reserva ya está guardada en el servidor, y avisar de un fallo haría que el usuario la repitiera. Se muestra un mensaje de éxito sin los datos y se invita a consultarla en "Mis reservas".

Los mensajes de error distinguen la causa: sin conexión con el servidor, error del servidor (con su código) o reserva que ya no existe al cancelar.

El `QueryClient` tiene un `staleTime` de 30 segundos, para no volver a descargar las reservas cada vez que se cambia de ventana. Al reservar o cancelar se refrescan al momento, porque `invalidateQueries` no espera a ese tiempo.



## Extras

- Precio total en vivo, que se calcula según el tipo y el número de entradas. Usa `useWatch` en lugar de `watch()`, porque `watch()` no es compatible con el React Compiler.
- Ventana de confirmación con los datos de la reserva (código, fecha, entradas, exposiciones y total) y opción de cancelarla.
- "Mis reservas": el listado está oculto y solo muestra las reservas del nombre introducido.
- Etiqueta "La más popular" en la exposición con más entradas reservadas, que se actualiza al reservar o cancelar.
- Botón de más información en cada exposición, con su descripción y su sala.
- Las exposiciones se generan desde `datos/museo.js`, así que añadir una nueva solo requiere tocar ese archivo.
- Tests automáticos de los esquemas con Vitest.



## Bonus: validación de la respuesta del API

Las reservas que devuelve la API se validan con un segundo esquema, `esquemaReservaApi`, usando `safeParse` reserva por reserva. Las válidas se muestran y las incorrectas se descartan, con un aviso en pantalla y el detalle del fallo en la consola (`console.warn`).

Comparte los campos comunes con el esquema del formulario, pero cambia tres cosas:

- La fecha no se compara con hoy, porque una reserva antigua sigue siendo válida.
- Las entradas no usan `coerce`, porque deben llegar como número y no como texto, aunque comparten las mismas reglas que el formulario.
- Incluye el `id`, que solo existe en los datos del servidor.

Se usa `safeParse` en lugar de `parse` porque `parse` lanza un error y una sola reserva incorrecta haría fallar el listado entero.

### Cómo comprobarlo

`db.json` incluye a propósito una reserva con `id` "corrupta" que tiene cuatro fallos: un email no válido, las entradas como texto, un tipo de entrada que no existe y las exposiciones sin formato de lista.

- En la aplicación: entra en "Mis reservas" con el nombre "Reserva rota". Aparece el aviso "Reservas descartadas por datos incorrectos: 1" y en la consola se ve qué campos han fallado.
- Con los tests: `npm test` ejecuta `src/schemas/reserva.test.js`, que comprueba que `esquemaReservaApi` acepta una reserva correcta y rechaza la corrupta en esos cuatro campos. También comprueba las reglas del formulario: los lunes, las fechas no válidas y el mínimo de entradas en grupo. Además, comprueba que la API aplica las reglas compartidas: rechaza un grupo de 3 entradas y más de 10 entradas.


## Problemas y decisiones

### Filtrar las reservas en el servidor

Las reservas de cada persona se piden con `?nombre=` en lugar de descargarlas todas y filtrarlas en el navegador. Así el navegador solo recibe las reservas de esa persona. Antes veías todas las reservas que se habían hecho, y encuentro que eso no era muy realista.

### `<dialog>` nativo para la ventana de confirmación

Se usa la etiqueta `<dialog>` con `showModal()` en lugar de construir la ventana con un `div`. El navegador ya gestiona el fondo bloqueado, el foco dentro de la ventana, el cierre con Esc y la devolución del foco al cerrarla.

### Los datos del museo en un único archivo

Las exposiciones (nombre, sala y descripción) y los precios están en `datos/museo.js`. Los checkboxes del formulario se generan con un `map` a partir de esa lista, y el mismo archivo lo usan la ventana de confirmación y el listado.



## Declaración de uso de IA

He utilizado Claude como asistente durante el desarrollo de esta práctica, de la siguiente forma:

- Para planificar el proyecto a partir del enunciado.
- Para que me explicara los conceptos que iba necesitando (React Hook Form, Zod, TanStack Query, accesibilidad).
- Para obtener fragmentos de código, que he integrado, adaptado y probado yo misma en el proyecto.
- Para revisar mi código y resolver errores durante el desarrollo.
- El CSS y el código de los tests los ha generado la IA, y yo los he revisado y ajustado.