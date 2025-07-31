const express = require('express');
const fs = require('fs');
const path = require('path');

const supabase = require('./supabaseClient');

const app = express();
console.log("Servidor iniciando...");
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dataFile = path.join(__dirname, 'data', 'equipos.json');

app.get('/api/equipos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('equipos')
      .select('*');

    if (error) {
      console.error('Error al obtener equipos desde Supabase:', error);
      return res.status(500).json({ mensaje: 'Error al obtener equipos' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error en el endpoint GET:', error);
    res.status(500).json({ mensaje: 'Error al obtener equipos' });
  }
});

app.post('/api/equipos', async (req, res) => {
  const nuevoEquipo = {
    id: Date.now().toString(),
    tipo: req.body.tipo,
    marca: req.body.marca,
    modelo: req.body.modelo,
    serie: req.body.serie,
    usuario: req.body.usuario,
    estado: req.body.estado,
    fechaIngreso: req.body.fechaIngreso,
    ubicacion: req.body.ubicacion,
    caracteristicas: req.body.caracteristicas || '',
    observaciones: req.body.observaciones || '',
  };

  try {
    const { data, error } = await supabase
      .from('equipos')
      .insert([nuevoEquipo]);

    if (error) throw error;

    res.status(201).json(nuevoEquipo);
  } catch (err) {
    console.error('Error al insertar en Supabase:', err);
    res.status(500).json({ mensaje: 'Error al guardar equipo en Supabase' });
  }
});

app.delete('/api/equipos/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const { error } = await supabase
      .from('equipos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar en Supabase:', error);
      return res.status(500).json({ mensaje: 'Error al eliminar equipo' });
    }

    res.json({ mensaje: 'Equipo eliminado' });
  } catch (error) {
    console.error('Error en el endpoint DELETE:', error);
    res.status(500).json({ mensaje: 'Error al eliminar equipo' });
  }
});

app.put('/api/equipos/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const { error } = await supabase
      .from('equipos')
      .update({
        tipo: req.body.tipo,
        marca: req.body.marca,
        modelo: req.body.modelo,
        serie: req.body.serie,
        usuario: req.body.usuario,
        estado: req.body.estado,
        fechaIngreso: req.body.fechaIngreso,
        ubicacion: req.body.ubicacion,
        caracteristicas: req.body.caracteristicas,
        observaciones: req.body.observaciones
      })
      .eq('id', id);

    if (error) {
      console.error('Error al actualizar en Supabase:', error);
      return res.status(500).json({ mensaje: 'Error al actualizar equipo' });
    }

    // Obtener el equipo actualizado para enviar como respuesta
    const { data, error: errorData } = await supabase
      .from('equipos')
      .select('*')
      .eq('id', id)
      .single();

    if (errorData) {
      console.error('Error al obtener equipo actualizado:', errorData);
      return res.status(500).json({ mensaje: 'Error al obtener equipo actualizado' });
    }

    res.json(data);

  } catch (error) {
    console.error('Error en el endpoint PUT:', error);
    res.status(500).json({ mensaje: 'Error al actualizar equipo' });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);

  
});