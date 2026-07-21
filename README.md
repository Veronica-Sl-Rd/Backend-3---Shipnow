# ShipNow - Refactorización por Capas

## Descripción

Este proyecto corresponde a la pre-entrega del Módulo 1 de Backend III (Testing y Escalabilidad).

Se realizó una refactorización de la API siguiendo una arquitectura por capas (Controller - Service - Repository) para las entidades **Products** y **Users**, centralizando además la configuración del entorno y las constantes de la aplicación.

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- cors

---

## Instalación

1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

2. Ingresar a la carpeta del proyecto


3. Instalar dependencias

```bash
npm install
```

4. Crear el archivo `.env` tomando como referencia `.env.example`

---

5. Ejecutar el proyecto

```bash
npm start
```

---

## Arquitectura

El proyecto fue organizado siguiendo una arquitectura por capas:

- **Routes:** definen los endpoints de la API.
- **Controllers:** reciben la solicitud HTTP y envían la respuesta correspondiente.
- **Services:** contienen la lógica de negocio y las validaciones.
- **Repositories:** concentran todas las operaciones de acceso a MongoDB mediante Mongoose.
- **Models:** definen únicamente los esquemas de la base de datos.

---

## Decisión de diseño

Se decidió separar la lógica de negocio del acceso a la base de datos para mejorar la organización, reutilización y mantenimiento del código.

Los **Services** se encargan de realizar las validaciones y reglas de negocio, mientras que los **Repositories** concentran exclusivamente las operaciones sobre la base de datos utilizando Mongoose. De esta forma, los Controllers no conocen detalles de persistencia y únicamente gestionan las solicitudes y respuestas HTTP.

---


Pre-entrega Backend III - Coderhouse