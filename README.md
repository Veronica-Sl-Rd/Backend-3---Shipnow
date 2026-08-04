# ShipNow - API REST desarrollada con Node.js, Express y MongoDB siguiendo una arquitectura por capas

## Descripción

Este proyecto corresponde a las pre-entregas de los Módulos 1 y 2 de Backend III (Testing y Escalabilidad).

En el Módulo 1 se refactorizó la API utilizando una arquitectura por capas (Controller - Service - Repository), para las entidades **Products** y **Users**, centralizando además la configuración del entorno y las constantes de la aplicación.

En el Módulo 2 se incorporó un sistema de mocking, generación de datos de prueba y tests unitarios utilizando Jest, aplicando distintos tipos de dobles de prueba (Mocks, Stubs, Fakes y Data Fixtures). 

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Jest
- dotenv
- cors

---

## Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/Veronica-Sl-Rd/Backend-3---Shipnow.git
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

## Testing

Para ejecutar los tests del proyecto:

```bash
npm test
```

Los tests fueron desarrollados utilizando Jest y contemplan distintos tipos de dobles de prueba:

- Mock
- Stub
- Fake
- Data Fixture

---

## Endpoints de Mocking

Se incorporó un router específico bajo:

```text
/api/mocks
```

### Obtener usuarios simulados

```http
GET /api/mocks/mockingusers
```

Devuelve usuarios y repartidores simulados sin almacenarlos en la base de datos.

### Obtener pedidos simulados

```http
GET /api/mocks/mockingorders
```

Genera pedidos de prueba asociados a usuarios simulados sin persistirlos en MongoDB.

### Generar datos de prueba

```http
POST /api/mocks/generateData
```

Inserta en MongoDB usuarios, repartidores, pedidos y entregas respetando las relaciones entre las entidades.

---

## Módulo de Mocking

El sistema de generación de datos utiliza la arquitectura por capas implementada en el proyecto.

Los datos se generan mediante un Service especializado y se almacenan utilizando Repositories, evitando que los Controllers accedan directamente a los modelos de Mongoose.

Se utilizan constantes centralizadas para roles, estados y prioridades, evitando valores hardcodeados.

---

Pre-entrega Backend III - Coderhouse