# Alex_api

Frontend Angular del **Sistema de Gestión de Incidentes TI - MISY S.A.**
Actividad 9 - Universidad Técnica de Manabí, Facultad de Ciencias Informáticas.
Consume la API REST desarrollada en la Actividad 8 (`mayte_api`).

## Estructura de componentes

| Componente | Ruta | Función |
|---|---|---|
| `navegacion` | (barra superior, en todas las páginas) | Menú de navegación responsive |
| `dashboard` | `/dashboard` | Resumen general e indicadores de tickets |
| `registro-incidentes` | `/registro` | Formulario para crear un nuevo ticket |
| `listado-tickets` | `/tickets` | Tabla con filtro, cambio de estado y eliminación |

## Requisitos previos

- Node.js 18 o superior
- Angular CLI: `npm install -g @angular/cli`
- El backend `mayte_api` corriendo (ver carpeta hermana en este mismo proyecto)

## Instalación y ejecución local

```bash
cd Alex_api
npm install
npm start
```

Esto levanta la app en `http://localhost:4200`, apuntando por defecto a
`http://localhost:8081/tickets` (ver `src/environments/environment.ts`).

Asegúrate de tener el backend corriendo en paralelo:
```bash
cd ../mayte_api
mvn spring-boot:run
```

## Seguridad (XSS)

- Angular escapa automáticamente cualquier interpolación `{{ }}` en las
  plantillas, por lo que nunca se usa `[innerHTML]` con datos del usuario.
- Adicionalmente, `TicketService` limpia (sanitiza) los campos de texto
  libre (`titulo`, `descripcion`) antes de enviarlos al backend, quitando
  etiquetas HTML/script.
- El backend valida nuevamente los datos con `@NotBlank` / `@NotNull`
  (defensa en profundidad: nunca confiar solo en el frontend).

## Despliegue en la nube

### 1. Backend (`mayte_api`) → Render / Railway
1. Sube `mayte_api` a un repositorio de GitHub (rama independiente o
   repo propio).
2. En [Render](https://render.com) o [Railway](https://railway.app),
   crea un servicio "Web Service" apuntando a ese repositorio.
   - Build command: `mvn clean package -DskipTests`
   - Start command: `java -jar target/mayte_api-0.0.1-SNAPSHOT.jar`
3. Copia la URL pública que te asigna (ej.
   `https://mayte-api.onrender.com`).
4. **Importante:** por defecto la base de datos H2 es en memoria y se
   borra al reiniciar el servicio. Para persistencia real en la nube
   (requisito de la actividad), migra a una base gestionada como
   PostgreSQL (Render/Railway la ofrecen gratis) o MongoDB Atlas, y
   actualiza `application.properties` con las credenciales de conexión.

### 2. Frontend (`Alex_api`) → Vercel / Netlify / GitHub Pages
1. Antes de compilar, edita `src/environments/environment.prod.ts` y
   reemplaza `apiUrl` con la URL pública real del backend desplegado:
   ```ts
   export const environment = {
     production: true,
     apiUrl: 'https://mayte-api.onrender.com/tickets'
   };
   ```
2. Compila para producción:
   ```bash
   npm run build:prod
   ```
   Esto genera la carpeta `dist/alex-api/browser`.
3. Sube esa carpeta (o conecta el repo) a Vercel, Netlify o GitHub Pages.
   - En Vercel/Netlify: framework preset "Angular", output directory
     `dist/alex-api/browser`.
4. **CORS:** el backend ya tiene `@CrossOrigin(origins = "*")` en
   `TicketController`, así que aceptará peticiones desde cualquier
   dominio del frontend desplegado. Para producción real se recomienda
   restringirlo al dominio final (ej. `https://alex-api.vercel.app`)
   en vez de `"*"`.

### 3. Checklist final de la actividad
- [ ] Backend accesible por URL pública (no localhost)
- [ ] Base de datos persistente en la nube (no H2 en memoria)
- [ ] Frontend publicado en hosting estático
- [ ] `environment.prod.ts` apuntando al backend público
- [ ] CORS restringido al dominio final del frontend
