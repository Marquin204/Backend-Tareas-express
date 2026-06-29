const { createApp, ref, onMounted, computed } = Vue;

//const API_URL = 'http://localhost:3000/tareas';
const API_URL = 'https://mi-api-tareas.onrender.com/tareas';

const app = createApp({
  setup() {
    const tareas = ref([]);
    const nuevaTarea = ref('');
    const cargando = ref(true);
    const mensajeExito = ref('');
    const filtro = ref('todas');
    let timeoutMensaje = null;

    const tareasFiltradas = computed(() => {
      if (filtro.value === 'pendientes') return tareas.value.filter(t => !t.completada);
      if (filtro.value === 'completadas') return tareas.value.filter(t => t.completada);
      return tareas.value;
    });

    const mostrarMensaje = (msg) => {
      mensajeExito.value = msg;
      if (timeoutMensaje) clearTimeout(timeoutMensaje);
      timeoutMensaje = setTimeout(() => { mensajeExito.value = ''; }, 3000);
    };

    const guardarEnLocalStorage = () => {
      localStorage.setItem('tareas', JSON.stringify(tareas.value));
    };

    const cambiarFiltro = (nuevoFiltro) => {
      filtro.value = nuevoFiltro;
    };

    const cargarTareas = async () => {
      cargando.value = true;
      try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error al cargar');
        tareas.value = await respuesta.json();
        guardarEnLocalStorage();
      } catch (error) {
        console.error('Error:', error);
        const guardadas = localStorage.getItem('tareas');
        if (guardadas) {
          tareas.value = JSON.parse(guardadas);
          mostrarMensaje('🔄 Mostrando datos guardados localmente');
        } else {
          alert('No pude conectar con el servidor. ¿Está corriendo?');
        }
      } finally {
        cargando.value = false;
      }
    };

    const agregarTarea = async () => {
      const texto = nuevaTarea.value.trim();
      if (!texto) return alert('Escribe algo primero');

      try {
        const respuesta = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texto })
        });

        if (!respuesta.ok) throw new Error('Error al guardar');

        nuevaTarea.value = '';
        await cargarTareas();
        mostrarMensaje('✅ Tarea añadida con éxito');
      } catch (error) {
        console.error('Error:', error);
        alert('No se pudo añadir la tarea');
      }
    };

    const toggleCompletada = async (tarea) => {
      try {
        const respuesta = await fetch(`${API_URL}/${tarea.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completada: !tarea.completada })
        });

        if (!respuesta.ok) throw new Error('Error al actualizar');
        await cargarTareas();
        mostrarMensaje(tarea.completada ? '↩️ Tarea marcada como pendiente' : '✅ Tarea completada');
      } catch (error) {
        console.error('Error:', error);
        alert('No se pudo actualizar la tarea');
      }
    };

    const eliminarTarea = async (id) => {
      if (!confirm('¿Seguro que quieres eliminar esta tarea?')) return;

      try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        });

        if (!respuesta.ok) throw new Error('Error al eliminar');
        await cargarTareas();
        mostrarMensaje('🗑️ Tarea eliminada');
      } catch (error) {
        console.error('Error:', error);
        alert('No se pudo eliminar la tarea');
      }
    };

    const editarTarea = (tarea) => {
      const nuevoTexto = prompt('Editar tarea:', tarea.texto);
      if (nuevoTexto === null || nuevoTexto.trim() === '') return;
      actualizarTarea(tarea.id, { texto: nuevoTexto.trim() });
    };

    const actualizarTarea = async (id, datos) => {
      try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });

        if (!respuesta.ok) throw new Error('Error al actualizar');
        await cargarTareas();
        mostrarMensaje('✏️ Tarea actualizada');
      } catch (error) {
        console.error('Error:', error);
        alert('No se pudo actualizar la tarea');
      }
    };

    onMounted(() => {
      const guardadas = localStorage.getItem('tareas');
      if (guardadas) {
        tareas.value = JSON.parse(guardadas);
      }
      cargarTareas();
    });

    return {
      tareas,
      nuevaTarea,
      cargando,
      mensajeExito,
      filtro,
      tareasFiltradas,
      agregarTarea,
      toggleCompletada,
      eliminarTarea,
      editarTarea,
      cambiarFiltro
    };
  }
});

app.mount('#app');