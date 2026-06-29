# Backend — API de Tareas

API REST básica con Express para gestionar tareas (CRUD completo).

## Archivos

| Archivo | Descripción |
|---|---|
| `index.js` | Servidor Express con las rutas de la API |
| `lector.js` | Script para leer y mostrar `data.json` en consola |
| `data.json` | Archivo JSON de ejemplo con tareas |

## Cómo ejecutar

```bash
node index.js
```

El servidor arranca en `http://localhost:3000`.

## Endpoints

| Método | Ruta | Descripción | Códigos de respuesta |
|---|---|---|---|
| `GET` | `/tareas` | Obtener todas las tareas | `200` |
| `POST` | `/tareas` | Crear una tarea nueva | `201` / `400` |
| `PUT` | `/tareas/:id` | Editar texto o estado de una tarea | `200` / `404` |
| `DELETE` | `/tareas/:id` | Eliminar una tarea | `204` / `404` |

### POST /tareas

El body debe incluir el campo `texto` o `titulo`:

```json
{ "texto": "Mi nueva tarea" }
```

### PUT /tareas/:id

Se puede enviar `texto`, `completada` o ambos:

```json
{ "completada": true }
```

```json
{ "texto": "Texto actualizado" }
```

## Datos

Las tareas se guardan en **memoria** (se pierden al reiniciar el servidor). Al iniciar, se cargan dos tareas de ejemplo:

```js
{ id: 1, texto: 'Aprender Node', completada: false }
{ id: 2, texto: 'Conquistar Express', completada: false }
```

## Middlewares

- `cors()` — permite peticiones desde otros orígenes (como el frontend Vue)
- `express.json()` — convierte el body de las peticiones a objeto JavaScript

## Puerto

Por defecto usa el puerto `3000`. Se puede cambiar con la variable de entorno `PORT`:

```bash
PORT=4000 node index.js
```
