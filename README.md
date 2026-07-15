# Hogar360 - Frontend

Plataforma web de gestión inmobiliaria para el mercado colombiano. Permite publicar propiedades, gestionar visitas y reservar citas con vendedores.

## Arquitectura

```
hogar360-frontend/
├── src/app/
│   ├── core/                    # Servicios, guards e interceptores (singletones)
│   │   ├── guards/              # auth, role, no-auth
│   │   ├── interceptors/        # Bearer token + manejo de errores HTTP
│   │   └── services/            # auth, house, category, location, user, visit
│   ├── shared/                  # Modelos, constantes y utilidades
│   │   ├── models/              # Interfaces tipadas (PageResult<T>, HouseFilters, etc.)
│   │   ├── utils/               # Validadores personalizados y HttpParams util
│   │   └── constants/           # Paginación (PAGE=0, SIZE=10)
│   └── components/
│       ├── atoms/               # Button, InputText, Select, DatePicker, Modal, HouseCard...
│       ├── molecules/           # LoginForm, CreateHouseForm, ListTable, Pagination...
│       ├── organisms/           # NavbarWrapper, Sidebar, Footer, Filters...
│       ├── templates/           # MainTemplate (layout autenticado)
│       └── pages/               # Home, Login, Dashboard, Category, House, Visit, Location, Seller
├── src/styles/
│   └── _variables.scss          # Tokens de diseño (colores, fuentes, sombras)
├── src/assets/
│   ├── fonts/                   # Manrope, Montserrat, Poppins
│   ├── icons/                   # SVG (bathroom, bedroom)
│   ├── images/                  # Avatares, imágenes por defecto
│   └── i18n/                    # es.json (traducciones de estados de propiedades)
└── src/environments/
    └── environment.ts           # URLs de los 3 microservicios
```

El proyecto sigue **Atomic Design** para la estructura de componentes y **Arquitectura por Módulos** de Angular.

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework | Angular | ^16.2.0 |
| Lenguaje | TypeScript (strict mode) | ~5.1.3 |
| UI | Angular Material | ^16.2.14 |
| Iconos | FontAwesome | ^0.13.0 |
| i18n | @ngx-translate | ^16.0.4 |
| Notificaciones | ngx-toastr | ^19.0.0 |
| Date/Time | Moment.js + ngx-material-timepicker | ^2.30.1 |
| Testing | Jest | ^29.7.0 |
| Estilos | SCSS + Material Theme (Indigo-Pink) | — |

## Microservicios Backend

La aplicación se comunica con **3 microservicios independientes**:

| Servicio | Puerto | Endpoints |
|---|---|---|
| **Houses API** | `localhost:8090` | CRUD propiedades, categorías, ubicaciones, búsqueda con filtros |
| **Users API** | `localhost:8091` | Autenticación JWT, gestión de usuarios/vendedores |
| **Visits API** | `localhost:8092` | CRUD visitas, disponibilidad, reservas |

Configurados en `src/environments/environment.ts`.

## Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** `npm install -g @angular/cli@16`
- Los 3 microservicios backend corriendo en los puertos 8090, 8091, 8092

## Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd hogar360-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear src/environments/environment.ts con las URLs de tus microservicios

# Iniciar servidor de desarrollo
npm start
# La app estará disponible en http://localhost:4200
```

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo (`ng serve`) |
| `npm run build` | Genera el build de producción en `dist/` |
| `npm run watch` | Build en modo watch (development) |
| `npm test` | Ejecuta tests unitarios con Jest |
| `npm run test:watch` | Ejecuta tests en modo watch |
| `npm run test:coverage` | Genera reporte de cobertura en `coverage/` |

## Funcionalidades

### Público (sin autenticación)

- **Home** (`/home`): Explorar propiedades disponibles en tarjetas, con filtros por categoría, precio, habitaciones, baños y ciudad, y ordenamiento.
- **Reservar visita**: Seleccionar una propiedad, ver horarios disponibles y reservar una cita ingresando el email.
- **Login** (`/login`): Autenticación JWT.

### Autenticado (roles ADMIN y VENDEDOR)

- **Dashboard** (`/dashboard`): Página de bienvenida post-login.
- **Categorías** (`/categories`): Crear y listar categorías de propiedades.
- **Ubicaciones** (`/locations`): Crear y buscar ubicaciones con selección en cascada: Departamento → Ciudad → Sector.
- **Usuarios** (`/users`): Crear cuentas de vendedor (solo ADMIN).
- **Propiedades** (`/houses`): Crear y listar propiedades con paginación y ordenamiento.
- **Visitas** (`/visits`): Crear y listar visitas programadas con filtros por departamento/ciudad/sector.

### Roles

| Rol | Permisos |
|---|---|
| **ADMIN** | Acceso total a todas las funcionalidades |
| **VENDEDOR** | Puede crear propiedades y visitas. No puede gestionar usuarios. |

## Rutas

| Ruta | Componente | Acceso |
|---|---|---|
| `/home` | HomeComponent | Público |
| `/login` | LoginComponent | Solo sin autenticación |
| `/dashboard` | DashboardComponent | Autenticado |
| `/categories` | CategoryComponent | Autenticado |
| `/locations` | LocationComponent | Autenticado |
| `/users` | SellerComponent | Autenticado + ADMIN |
| `/houses` | HouseComponent | Autenticado |
| `/visits` | VisitComponent | Autenticado |
| `**` | Redirect → `/login` | — |

## Patrones de Código

- **Inyección de dependencias**: Función `inject()` (patrón moderno Angular)
- **Formularios reactivos tipados**: `FormGroup<{...}>`, `FormControl<string | null>`
- **Componente genérico de tabla**: `ListTableComponent<T>` con definición de columnas `TableColumn<T>`
- **Cascadas de selección**: Departamento → Ciudad → Sector (reutilizado en creación de propiedades y filtros de visitas)
- **Paginación server-side**: `PageResult<T>` con `BehaviorSubject` para cambios reactivos de página
- **Manejo de errores**: Toastr notifications con extracción de mensajes del servidor
- **Validadores personalizados**: 7 validators (mayoría de edad, fechas, coincidencia de contraseñas, rangos de tiempo)

## Testing

Configurado con **Jest** (no Karma). Cobertura de 46 archivos `.spec.ts` cubriendo servicios, guards, interceptores, componentes y utilidades.

```bash
npm test                    # Ejecutar todos los tests
npm run test:watch          # Modo watch
npm run test:coverage       # Generar reporte de cobertura
```

El reporte de cobertura se genera en `coverage/`.

## Variables de Entorno

Crear `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  housesApiUrl: 'http://localhost:8090/api/v1',
  usersApiUrl: 'http://localhost:8091/api/v1',
  visitsApiUrl: 'http://localhost:8092/api/v1',
};
```

## Licencia

Proyecto privado.
