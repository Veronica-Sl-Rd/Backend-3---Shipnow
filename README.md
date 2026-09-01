# ShipNow - API REST desarrollada con Node.js, Express y MongoDB siguiendo una arquitectura por capas

## Descripción

<<<<<<< HEAD
Este proyecto corresponde a las pre-entregas de los Módulos 1, 2, 3, 4, 5 y 6 de Backend III (Testing y Escalabilidad).
=======
Este proyecto corresponde a las pre-entregas de los Módulos 1, 2, 3, 4, 5, 6 y 7 de Backend III (Testing y Escalabilidad).
>>>>>>> 974782e (pre entrega 7)

En el Módulo 1 se refactorizó la API utilizando una arquitectura por capas (Controller - Service - Repository), para las distintas entidades del sistema y centralizando además la configuración del entorno y las constantes de la aplicación.

En el Módulo 2 se incorporó un sistema de mocking, generación de datos de prueba y tests unitarios utilizando Jest, aplicando distintos tipos de dobles de prueba (Mocks, Stubs, Fakes y Data Fixtures). Los tests unitarios desarrollados durante este módulo se conservan en `Modulo_2_test/` como referencia de las técnicas de testing aplicadas, mientras que la suite de testing activa del proyecto se encuentra en `test/` y utiliza Mocha, Chai y Supertest.

En el Módulo 3 se incorporó un sistema centralizado de manejo de errores mediante errores personalizados, códigos de error, un diccionario de errores y un middleware global, aplicándolo también al módulo de mocking.

En el Módulo 4 se incorporó un sistema profesional de logging utilizando **Winston**, con distintos niveles de registro, persistencia de logs en archivos, rotación automática y diferenciación del comportamiento según el entorno de ejecución.

En el Módulo 5 se incorporó documentación interactiva de la API utilizando Swagger y OpenAPI, incluyendo schemas reutilizables, documentación de endpoints y respuestas de error.

En el Módulo 6 se incorporaron tests funcionales utilizando **Mocha**, **Chai** y **Supertest**, ejecutados sobre una base de datos exclusiva de testing. Se validan los principales endpoints de Users, Orders, Deliveries, Mocks, Logger y Swagger, incluyendo casos exitosos, errores y rutas inexistentes.

En el Módulo 7 se incorporó un sistema de carga de archivos, documentos y comprobantes utilizando **Multer** y `multipart/form-data`. Se implementó una configuración centralizada para definir destinos de almacenamiento, nombres únicos, tipos de archivo permitidos y tamaño máximo. Los documentos se asocian a usuarios y los comprobantes a entregas, almacenando en MongoDB únicamente sus metadatos. También se incorporaron validaciones y errores específicos de archivos integrados al sistema centralizado de errores, eliminación de archivos huérfanos ante operaciones fallidas, registro de eventos mediante Winston, documentación Swagger para los nuevos endpoints y tests funcionales de los flujos de carga.

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Jest
- Mocha
- Chai
- Supertest
- dotenv
- cors
- Winston
- Swagger
- OpenAPI
- swagger-jsdoc
- swagger-ui-express

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

El proyecto cuenta con tests funcionales desarrollados utilizando **Mocha**, **Chai** y **Supertest**.

Los tests permiten verificar el comportamiento real de los endpoints de la aplicación realizando solicitudes HTTP sobre la API y utilizando una base de datos MongoDB exclusiva para el entorno de testing.

Para ejecutar los tests del proyecto:

```bash
npm test
```
El script configurado en package.json es:

```text
"test": "cross-env NODE_ENV=test mocha --file ./test/setup.js \"test/**/*.test.js\""
```
Al ejecutar los tests se establece automáticamente:

```text
NODE_ENV=test
```
Esto permite utilizar una configuración independiente del entorno de desarrollo.

### Entorno de testing

Las variables específicas para los tests se encuentran en:

```text
.env.test
```
Este archivo no se versiona en el repositorio. Para facilitar la configuración del entorno de testing se incluye:

```text
.env.test.example
Este archivo contiene las variables necesarias para ejecutar la suite de tests:

- MONGODB_URI
- PORT
- NODE_ENV

Para configurar el entorno de testing, se debe copiar .env.test.example como .env.test y completar los valores correspondientes.
Los tests utilizan una base de datos independiente:

```text
shipnow_test
```
De esta forma, la ejecución de la suite no modifica los datos utilizados durante el desarrollo normal de la aplicación.

Las dependencias necesarias para ejecutar los tests se encuentran declaradas localmente en el proyecto, por lo que no requieren instalaciones globales. Luego de instalar las dependencias mediante:

```text
npm install
```
la suite puede ejecutarse con:

```text
npm test
```
La conexión y limpieza de la base de datos se gestionan desde:

```text
test/setup.js
```
Al finalizar la ejecución de los tests, la base de datos utilizada para testing es eliminada y la conexión con MongoDB se cierra.

### Módulos testeados

La suite incluye tests funcionales para los principales módulos de la aplicación.

**Users**

Se validan operaciones como:

- Obtener todos los usuarios.
- Obtener un usuario por ID.
- Crear usuarios.
- Validar datos obligatorios.
- Impedir la creación de usuarios con rol admin.
- Detectar emails duplicados.
- Eliminar usuarios.
- Manejar usuarios inexistentes.

**Orders**

Se validan operaciones como:

- Obtener todos los pedidos.
- Obtener un pedido por ID.
- Crear pedidos.
- Validar el cálculo automático del total.
- Validar pedidos sin items.
- Validar clientes inexistentes.
- Actualizar pedidos.
- Cancelar pedidos.
- Impedir la cancelación de pedidos ya entregados.
- Eliminar pedidos.
- Manejar pedidos inexistentes.

**Deliveries**

Se validan operaciones como:

- Obtener todas las entregas.
- Obtener una entrega por ID.
- Crear entregas.
- Validar pedidos inexistentes.
- Validar repartidores inexistentes.
- Actualizar entregas.
- Eliminar entregas.
- Verificar si una entrega puede realizarse según disponibilidad de repartidores y condiciones climáticas.

**Mocks**

Se validan los endpoints de generación de datos de prueba:

- Generación de usuarios.
- Generación de pedidos.
- Generación y persistencia de datos.
- Validación de cantidades inválidas.
- Validación de cantidades negativas, iguales a cero o no enteras.

**Logger**

Se valida el endpoint:

```http
GET /api/logger/test
```

El test verifica que el endpoint ejecute correctamente los distintos niveles configurados en Winston y devuelva la respuesta esperada.

**Swagger**

Se valida que la documentación Swagger se encuentre disponible mediante:

```http
GET /api/docs/
```

y que el servidor entregue correctamente la interfaz Swagger UI.

**Rutas inexistentes**

También se valida el comportamiento global de la aplicación frente a rutas no definidas.

### Datos de prueba

Cada test genera los datos necesarios para ejecutarse, evitando depender de información creada manualmente o de un orden específico de ejecución.

Los tests que requieren usuarios, pedidos o entregas crean previamente los recursos necesarios y utilizan los identificadores generados durante la propia ejecución.

Esto permite mantener una suite controlada y repetible.

### Servicios externos durante testing

Para evitar que los resultados de los tests dependan de servicios externos reales, durante la ejecución con:

```text
NODE_ENV=test
```
se utilizan respuestas controladas para las integraciones externas.

Esto se aplica principalmente a:

- Payment Gateway.
- Servicio de notificaciones.
- API meteorológica.

De esta forma, los tests pueden ejecutarse de manera repetible sin depender de conectividad, credenciales externas o disponibilidad de servicios de terceros.

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

## Manejo centralizado de errores

El proyecto cuenta con un sistema centralizado de manejo de errores para evitar respuestas de error dispersas en los Controllers y Routes.

El sistema está compuesto por:

**CustomError:** clase para representar errores personalizados de la aplicación.
**Error Codes:** constantes que identifican cada tipo de error.
**Error Dictionary:** define el código HTTP y el mensaje correspondiente a cada error.
**Error Handler:** middleware global encargado de transformar los errores en respuestas HTTP uniformes.

Los errores se detectan en la capa correspondiente, principalmente dentro de los Services, y son derivados mediante next(error) hasta el middleware global.

Las respuestas de error mantienen una estructura uniforme:

```text
{
  "status": "error",
  "error": "ERROR_CODE",
  "message": "Descripción del error"
}
```

Este sistema también se aplica al módulo de mocking para controlar errores relacionados con cantidades inválidas y fallas durante la carga de datos en MongoDB.

---

## Sistema de Logging

El proyecto incorpora un sistema centralizado de logging utilizando Winston.

El logger se encuentra configurado en un módulo independiente y puede ser utilizado desde los distintos componentes de la aplicación sin repetir la configuración.

Se utilizan los siguientes niveles:

- debug: información detallada útil principalmente durante el desarrollo.
- http: eventos relacionados con solicitudes HTTP.
- info: información general sobre el funcionamiento de la aplicación.
- warning: situaciones inesperadas o advertencias que no interrumpen la ejecución.
- error: errores que afectan una operación pero permiten continuar ejecutando la aplicación.
- fatal: fallas críticas que pueden impedir el funcionamiento correcto del sistema.

### Diferenciación por entorno

El comportamiento del logger depende de la variable NODE_ENV.

En desarrollo se habilitan logs más detallados, incluyendo el nivel debug.

En producción se utiliza un nivel más controlado, registrando principalmente eventos info, warning, error y fatal.

---

### Persistencia y rotación de logs

Los logs se muestran por consola y también se almacenan en archivos dentro de la carpeta:

```text
logs/
```

Se generan archivos de aplicación y archivos específicos para errores.

La aplicación utiliza **winston-daily-rotate-file** para realizar una rotación automática de los archivos de log.

Los archivos se organizan por fecha y se conserva un historial limitado para evitar que los registros crezcan indefinidamente.

Los archivos generados por el sistema de logging no se incluyen en el repositorio de GitHub y la carpeta logs/ se encuentra contemplada en .gitignore.

---

### Endpoint de prueba del logger

Se incorporó un endpoint específico para verificar el funcionamiento de todos los niveles del sistema de logging:

```text
GET /api/logger/test
```
Este endpoint tiene como objetivo facilitar la comprobación del sistema de logging durante el desarrollo y la evaluación del proyecto.

---

### Integración entre Logging y manejo de errores

El sistema de logging se encuentra integrado con el middleware global de errores.

Los errores esperados o relacionados con reglas de negocio pueden registrarse como advertencias, mientras que los errores inesperados del servidor se registran como errores.

Las fallas críticas de configuración o funcionamiento pueden registrarse mediante el nivel fatal.

El logger complementa al sistema de manejo de errores, pero no reemplaza la respuesta HTTP enviada al cliente.

---

## Documentación de la API

La API cuenta con documentación interactiva utilizando **Swagger UI** y **OpenAPI 3.0**.

La documentación puede consultarse desde:

```text
http://localhost:8080/api/docs
```

Swagger permite consultar y probar los endpoints directamente desde la interfaz web.

La documentación se encuentra organizada mediante tags según los principales módulos de la aplicación:

- Users: gestión de usuarios.
- Orders: gestión de pedidos.
- Deliveries: gestión de entregas.
- Mocks: generación e inserción de datos de prueba.
- Logger: endpoint utilizado para validar los distintos niveles del sistema de logging.

Se definieron schemas reutilizables para evitar duplicar estructuras dentro de la documentación:
Los schemas permiten mantener una documentación consistente con los modelos y las respuestas reales de la API.

También se documentaron las principales respuestas de error utilizadas por la API.

### Organización de la documentación

La configuración principal de Swagger se encuentra separada de la lógica de la aplicación.

Los archivos de documentación se encuentran dentro de:

```text
src/docs/
```

Los endpoints se documentan mediante archivos YAML, mientras que swagger-jsdoc se utiliza para generar la especificación OpenAPI y swagger-ui-express permite visualizar y probar la documentación desde el navegador.

--- 

## Carga de archivos, documentos y comprobantes

En este módulo se incorporó la carga de archivos mediante **Multer**, utilizando solicitudes `multipart/form-data` y manteniendo la configuración de uploads separada de los routers.

### Configuración de archivos

La configuración de Multer se encuentra centralizada en:

```text
src/config/multer.config.js
```

Desde allí se definen:

- Carpetas de destino para los archivos.
- Generación de nombres únicos.
- Tipos MIME permitidos.
- Tamaño máximo de archivo.
- Filtros de archivos.
- Configuración de almacenamiento mediante `diskStorage`.

Los valores reutilizables relacionados con archivos se encuentran centralizados en:

```text
src/constants/file.constants.js
```

Los formatos permitidos son:

- JPEG
- PNG
- PDF

El tamaño máximo permitido por archivo es de **5 MB**.

Los archivos se almacenan dentro de `uploads/`, directorio excluido del repositorio mediante `.gitignore`.

### Documentos de usuarios

Se incorporó el endpoint:

```http
POST /api/users/:uid/documents
```
Permite asociar un documento a un usuario existente mediante `multipart/form-data`.

La solicitud recibe:

- `file`: archivo a cargar.
- `documentType`: tipo de documento (`dni`, `license` u `other`).

MongoDB no almacena el contenido del archivo. Únicamente se persisten sus metadatos:

- Nombre original.
- Nombre generado.
- Ruta.
- Tipo MIME.
- Tamaño.
- Tipo de documento.
- Fecha de carga.

### Comprobantes de entrega

Se incorporó el endpoint:

```http
POST /api/deliveries/:id/proof
```
Permite cargar un comprobante y asociarlo a una entrega existente.

El archivo se almacena físicamente en el servidor y la entidad Delivery conserva únicamente los metadatos correspondientes al comprobante.

### Validación y manejo de errores

La carga de archivos se encuentra integrada al sistema centralizado de errores de la aplicación.

Se contemplan, entre otros, los siguientes casos:

- Archivo obligatorio.
- Tipo de archivo no permitido.
- Archivo que supera el tamaño máximo.
- Campo de archivo incorrecto.
- Tipo de documento inválido.
- Usuario o entrega inexistente.
- Error durante la carga del archivo.

Los errores propios de Multer son procesados mediante un middleware específico y posteriormente derivados al manejador global de errores.
Cuando un archivo ya fue almacenado pero la operación posterior falla, se elimina del servidor para evitar archivos huérfanos.

### Logging

Los eventos relacionados con la carga de archivos se integran al sistema de logging con Winston.
Se registran tanto operaciones exitosas como errores de carga y validación, incluyendo la asociación de documentos y comprobantes a sus respectivas entidades.

### Documentación

Los endpoints de carga se encuentran documentados mediante **Swagger/OpenAPI**, incluyendo:

- Uso de `multipart/form-data`.
- Campos requeridos.
- Archivos binarios.
- Tipos de documentos permitidos.
- Respuestas exitosas.
- Posibles respuestas de error.

La documentación interactiva puede consultarse en:

```http
GET /api/docs
```
### Tests funcionales

Se incorporaron tests funcionales para validar los nuevos flujos de carga utilizando **Mocha**, **Chai** y **Supertest**.
Los tests contemplan:

- Carga correcta de documentos.
- Solicitud sin archivo.
- Tipo de documento inválido.
- Carga correcta de comprobantes.
- Asociación de comprobantes a entidades inexistentes.

Los archivos generados durante los tests exitosos se eliminan posteriormente para evitar residuos en el directorio de uploads.

--- 

Pre-entrega Backend III - Coderhouse
