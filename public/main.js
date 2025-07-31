document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formulario');
  const tablaEquipos = document.querySelector('#tablaEquipos');

  let modoEdicion = false;
  let equipoEditandoId = null;

  async function cargarEquipos() {
    const res = await fetch('/api/equipos');
    const equipos = await res.json();
    tablaEquipos.innerHTML = '';
    equipos.forEach(equipo => agregarFila(equipo));
  }



    function agregarFila(equipo) {
  const tr = document.createElement('tr');
  tr.dataset.id = equipo.id;

  tr.innerHTML = `
    <td>${equipo.tipo}</td>
    <td>${equipo.marca}</td>
    <td>${equipo.modelo}</td>
    <td>${equipo.serie}</td>
    <td>${equipo.usuario}</td>
    <td>${equipo.estado}</td>
    <td>${equipo.fechaIngreso}</td>
    <td>${equipo.ubicacion}</td>
    <td>${equipo.caracteristicas || ''}</td>
    <td>${equipo.observaciones || ''}</td>
    <td>
      <button class="btn-editar">✏️ Editar</button>
      <button class="btn-eliminar">🗑️ Eliminar</button>
    </td>
  `;

  


    tablaEquipos.appendChild(tr);

    tr.querySelector('.btn-eliminar').addEventListener('click', async () => {
      if (!confirm('¿Seguro que quieres eliminar este equipo?')) return;
      const res = await fetch(`/api/equipos/${equipo.id}`, { method: 'DELETE' });
      if (res.ok) cargarEquipos();
      else alert('Error al eliminar equipo');
    });

   tr.querySelector('.btn-editar').addEventListener('click', () => {
  modoEdicion = true;
  equipoEditandoId = equipo.id;

  formulario.tipo.value = equipo.tipo;
  formulario.marca.value = equipo.marca;
  formulario.modelo.value = equipo.modelo;
  formulario.serie.value = equipo.serie;
  formulario.usuario.value = equipo.usuario;
  formulario.estado.value = equipo.estado;
  formulario.fechaIngreso.value = equipo.fechaIngreso;
  formulario.ubicacion.value = equipo.ubicacion;

  formulario.caracteristicas.value = equipo.caracteristicas || '';
  formulario.observaciones.value = equipo.observaciones || '';

  formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
   });
  }

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formulario);
    const equipo = {};
    formData.forEach((value, key) => equipo[key] = value);

    if (modoEdicion) {
      const res = await fetch(`/api/equipos/${equipoEditandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipo)
      });
      if (res.ok) {
        cargarEquipos();
        modoEdicion = false;
        equipoEditandoId = null;
        formulario.reset();
        formulario.querySelector('button[type="submit"]').textContent = 'Agregar Equipo';
      } else {
        alert('Error al actualizar equipo');
      }
    } else {
      const res = await fetch('/api/equipos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipo)
      });
      if (res.ok) {
        const nuevoEquipo = await res.json();
        agregarFila(nuevoEquipo);
        formulario.reset();
      } else {
        alert('Error al agregar equipo');
      }
    }
  });

  cargarEquipos();
});