# GestionOpiniones

Sistema de gestión de publicaciones y comentarios basado en arquitectura de microservicios, desarrollado como parte del curso **IN6AV - Kinal Guatemala 2026**.

### (El como funciona cada API/Servicio estara al final del Readme.)

---

## Arquitectura del Proyecto

El sistema está compuesto por microservicios independientes que se comunican mediante HTTP y JWT para autenticación.

### Microservicios Implementados

* **AuthService** → Autenticación, registro y gestión de usuarios.
* **PublishingService** → Gestión de publicaciones y comentarios.

---

## Base de Datos

* **PostgreSQL** → Gestión de usuarios, roles y autenticación (AuthService).
* **MongoDB** → Gestión de publicaciones y comentarios (PublishingService).

---

# Estado del Proyecto

* Registro y login con JWT implementado.
* Protección de endpoints con middleware JWT.
* CRUD completo de publicaciones.
* CRUD completo de comentarios.
* Validaciones con `express-validator`.
* Soft delete (`isActive`) en publicaciones y comentarios.
* Arquitectura modular y organizada por capas.

---

# AuthService

Microservicio encargado de la autenticación y gestión de usuarios.

## Funcionalidades

* Registro de usuarios.
* Verificación de correo electrónico.
* Login con generación de JWT.
* Sistema de roles.
* Protección de endpoints mediante JWT.
* Hash seguro de contraseñas.
* Manejo global de errores.

## Tecnologías

* **ASP.NET Core 8**
* **PostgreSQL**
* **Entity Framework Core**
* **JWT**
* **FluentValidation**
* **Swagger**

---

# PublishingService

Microservicio encargado de la gestión de publicaciones y comentarios.

Base URL:

```
http://localhost:3021/gos/v1
```

---

## Cómo funciona PublishingService

### Autenticación

* Todos los endpoints de creación, edición y eliminación requieren JWT.
* El token se envía en el header:

```
Authorization: Bearer <token>
```

* El `userId` se obtiene del `sub` del JWT y se guarda como `author`.

---

## Publicaciones (Posts)

Cada publicación contiene:

* `title`
* `category`
* `content`
* `author`
* `isActive`
* `createdAt`
* `updatedAt`

### Reglas de negocio

* Solo el autor puede editar o eliminar su publicación.
* Eliminación lógica mediante `isActive = false`.
* Soporte de paginación y filtros por categoría y autor.

---

## Comentarios

Cada comentario contiene:

* `content`
* `author`
* `post`
* `isActive`
* `createdAt`
* `updatedAt`

### Reglas de negocio

* Solo el autor puede editar o eliminar su comentario.
* No se pueden comentar publicaciones inactivas.
* Eliminación lógica con `isActive = false`.

---

# Endpoints Principales

## AuthService

Base URL (ejemplo):

```
http://localhost:5064/api/v1
```

| Método | Ruta              | Descripción       | Auth |
| ------ | ----------------- | ----------------- | ---- |
| POST   | /auth/register    | Registrar usuario | No   |
| POST   | /auth/login       | Iniciar sesión    | No   |
| GET    | /users/{id}/roles | Ver roles         | Sí   |

---

## PublishingService

Base URL:

```
http://localhost:3021/gos/v1
```

---

### Posts

| Método | Ruta       | Descripción            | Auth |
| ------ | ---------- | ---------------------- | ---- |
| GET    | /posts     | Listar publicaciones   | No   |
| GET    | /posts/:id | Obtener publicación    | No   |
| POST   | /posts     | Crear publicación      | Sí   |
| PUT    | /posts/:id | Actualizar publicación | Sí   |
| DELETE | /posts/:id | Eliminar publicación   | Sí   |

---

### Comments

| Método | Ruta                   | Descripción           | Auth |
| ------ | ---------------------- | --------------------- | ---- |
| GET    | /comments/post/:postId | Listar comentarios    | No   |
| POST   | /comments              | Crear comentario      | Sí   |
| PUT    | /comments/:id          | Actualizar comentario | Sí   |
| DELETE | /comments/:id          | Eliminar comentario   | Sí   |

---

# Modelos de Request

## Crear Post

```json
{
  "title": "Mi publicación",
  "category": "TECNOLOGIA",
  "content": "Contenido mayor a 10 caracteres."
}
```

---

## Crear Comentario

```json
{
  "post": "POST_ID",
  "content": "Buen post!"
}
```

---

# Estructura del Proyecto

```
GestionOpiniones/
├── auth-service/
│   ├── src/
│   │   ├── AuthService.Api/
│   │   ├── AuthService.Application/
│   │   ├── AuthService.Domain/
│   │   └── AuthService.Persistence/
│   └── AuthService.sln
│
├── publishing-service/
│   ├── configs/
│   ├── middlewares/
│   ├── src/
│   │   ├── posts/
│   │   └── comments/
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

# Instalación y Ejecución

## Prerrequisitos

* Node.js 18+
* MongoDB 6+
* PostgreSQL 13+
* .NET 8 SDK

---

## Clonar repositorio

```bash
git clone <url-repo>
```

---

## AuthService

```bash
cd auth-service/src/AuthService.Api
dotnet restore
dotnet build
dotnet run
```

---

## PublishingService

```bash
cd publishing-service
npm install
npm run dev
```

---

# ---> Cómo funciona cada servicio? <---

## Asi funciona generalmente

El proyecto estara dividido en dos servicios que trabajan juntos. Cada uno tiene una funcion especifica, y entre ellos se hablan para que funcionen bien.

### AuthService

El AuthService es el que hace todo lo relacionado con los users. Aquí es donde las personas se pueden registrar, iniciar sesión y obtener su token de acceso por medio de correo. Cuando el user hace un login, el sistema generara un JWT Token que luego se utilizara para poder acceder a los servicios que estan protegidos por el Token.

---

### PublishingService

El PublisingService es donde se pueden manejar las publicaciones y los comentarios. Cuando un user crea un post, el service guarda la información junto con el Token del user que se logeo. Lo mismo sucedera con los comentarios. Y luego de eso, el sistema verificara que solo el autor pueda editar/eliminar el contenido que el mismo creo. Si se elimina una publicacion/comentario, no se borra completamente de la Base de Datos, si no que se marca como inactivo (Soft-Delete). El servicio dependera completamente del Token generado por AuthService, para saber quien esta realizando cada acción.