const express = require('express');
const cors = require('cors');

const app = express();
//const PORT = 3000;
const PORT = process.env.PORT || 3000;
// MIDDLEWARES (traducción: "cosas que pasan siempre antes de llegar a tus rutas")
app.use(cors());           // Permite que tu frontend (Vue) hable con este backend sin bloqueos
app.use(express.json());   // Convierte el cuerpo de las peticiones (body) a objeto JSON automáticamente

// -------- BASE DE DATOS EN MEMORIA (se resetea cada vez que reinicies el servidor) --------
let tareas = [
  { id: 1, texto: 'Aprender Node', completada: false },
  { id: 2, texto: 'Conquistar Express', completada: false }
];
let contadorId = 3;

// -------- RUTAS (los endpoints que llamarás desde el navegador o Vue) --------

// Ruta 1: Obtener todas las tareas (GET)
app.get('/tareas', (req, res) => {
  res.json(tareas);  // res.json() convierte el array a JSON y lo envía
});

// Ruta 2: Añadir una nueva tarea (POST)
app.post('/tareas', (req, res) => {
  const  texto   = req.body.titulo || req.body.texto;  // Extrae "texto" del body que envía el frontend

  if (!texto) {
    return res.status(400).json({ error: 'El campo "texto" o "titulo" es obligatorio' });
  }

  const nuevaTarea = {
    id: contadorId++,
    texto: texto,
    completada: false
  };

  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);  // 201 = "Creado con éxito"
});

// PUT: Editar una tarea existente
app.put('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { texto, completada } = req.body;

  const tarea = tareas.find(t => t.id === id);
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  if (texto !== undefined) tarea.texto = texto;
  if (completada !== undefined) tarea.completada = completada;

  res.json(tarea);
});

// DELETE: Eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tareas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  tareas.splice(index, 1);
  res.status(204).send(); // 204 = Sin contenido (éxito, pero no devuelve nada)
});


// Ruta 3: Arrancar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});