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
  const { data, error } = await supabase
    .from('equipos')
    .select('*');

  if (error) return res.status(500).json({ mensaje: 'Error al obtener equipos', error });
  res.json(data);
});

app.post('/api/equipos', async (req, res) => {
  const nuevoEquipo = {
    id: Date.now().toString(), // o usa uuid
    ...req.body
  };

  const { data, error } = await supabase
    .from('equipos')
    .insert([nuevoEquipo]);

  if (error) return res.status(500).json({ mensaje: 'Error al insertar', error });
  res.status(201).json(data[0]);
});

app.delete('/api/equipos/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('equipos')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ mensaje: 'Error al eliminar', error });
  res.json({ mensaje: 'Equipo eliminado' });
});

app.put('/api/equipos/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('equipos')
    .update(req.body)
    .eq('id', id);

  if (error) return res.status(500).json({ mensaje: 'Error al actualizar', error });
  res.json(data[0]);
});
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);

  
});