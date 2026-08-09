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

### Opción recomendada: Blueprint de Render (`render.yaml`)

En la raíz de `PROYECTO III` hay un archivo `render.yaml` que define **ambos
servicios ya configurados correctamente** (build command, start command,
tipo de servicio). Esto evita el error más común: que el servicio del
frontend intente ejecutar el comando de Java (o viceversa).

1. Sube toda la carpeta `PROYECTO III` (con `mayte_api`, `Alex_api` y
   `render.yaml` en la raíz) a un repositorio de GitHub.
2. En [Render](https://render.com): **New → Blueprint** → selecciona el
   repositorio.
3. Render crea automáticamente:
   - `mayte-api`: servicio Docker (usa `mayte_api/Dockerfile`).
   - `alex-api`: sitio estático (build con `npm ci && npm run build:prod`,
     publica `Alex_api/dist/alex-api/browser`).
4. Cuando `mayte-api` tenga su URL pública, edita
   `Alex_api/src/environments/environment.prod.ts` con esa URL, sube el
   cambio a GitHub, y Render volverá a desplegar el frontend automáticamente.

### Opción manual (si no usas Blueprint)

**Backend (`mayte_api`) — como servicio Docker:**
- Runtime: **Docker**
- Dockerfile path: `mayte_api/Dockerfile`
- Docker context: `mayte_api`
- No hace falta definir Start Command: el `ENTRYPOINT` del Dockerfile ya
  lo hace (`java -jar app.jar`).
- **Importante:** el `Dockerfile` compila con `maven:3.9-eclipse-temurin-21`
  porque el `pom.xml` exige Java 21 (`<java.version>21</java.version>`).
  Si alguna vez ves el error `release version 21 not supported`, es porque
  la imagen de build quedó en una versión de Java distinta a 21 — deben
  coincidir siempre.
- Por defecto la base de datos H2 es en memoria y se borra al reiniciar el
  servicio. Para persistencia real (requisito de la actividad), migra a
  PostgreSQL (Render la ofrece gratis) o MongoDB Atlas, y actualiza
  `application.properties` con las credenciales de conexión.

**Frontend (`Alex_api`) — como sitio ESTÁTICO (no como servicio Java):**
- Runtime: **Static Site** (no "Web Service" con comando de Java — ese fue
  el error anterior: un servicio de frontend no ejecuta `java -jar ...`).
- Root Directory: `Alex_api`
- Build Command: `npm ci && npm run build:prod` (usa `npm`, no `yarn` — el
  proyecto trae `package-lock.json`, no `yarn.lock`; mezclar ambos genera
  advertencias e inconsistencias de versiones).
- Publish Directory: `dist/alex-api/browser`
- Antes de compilar, edita `src/environments/environment.prod.ts` con la
  URL pública real del backend:
  ```ts
  export const environment = {
    production: true,
    apiUrl: 'https://mayte-api.onrender.com/tickets'
  };
  ```

**Alternativas al frontend en Render:** Vercel, Netlify o GitHub Pages
funcionan igual de bien — en todos los casos el proyecto es un sitio
estático (Build Command `npm run build:prod`, output `dist/alex-api/browser`),
nunca un servicio que ejecute Java.

**CORS:** el backend ya tiene `@CrossOrigin(origins = "*")` en
`TicketController`, así que acepta peticiones desde cualquier dominio del
frontend desplegado. Para producción real se recomienda restringirlo al
dominio final (ej. `https://alex-api.onrender.com`) en vez de `"*"`.

### Checklist final de la actividad
- [ ] Backend accesible por URL pública (no localhost)
- [ ] Base de datos persistente en la nube (no H2 en memoria)
- [ ] Frontend publicado en hosting estático (como sitio estático, no como
      servicio que ejecuta `java -jar`)
- [ ] `environment.prod.ts` apuntando al backend público
- [ ] CORS restringido al dominio final del frontend
