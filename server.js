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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/equipos', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  res.json(data);
});

app.post('/api/equipos', (req, res) => {
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
  observaciones: req.body.observaciones || ''
};

  let data = [];

  if (fs.existsSync(dataFile)) {
    const contenido = fs.readFileSync(dataFile, 'utf8');
    data = contenido ? JSON.parse(contenido) : [];
  }

  data.push(nuevoEquipo);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  res.status(201).json(nuevoEquipo); // Aquí devuelves el equipo completo
});

app.delete('/api/equipos/:id', (req, res) => {
  try {
    const id = req.params.id;
    let data = [];

    if (fs.existsSync(dataFile)) {
      const contenido = fs.readFileSync(dataFile, 'utf8');
      data = contenido ? JSON.parse(contenido) : [];
    }

    // Filtramos para eliminar el equipo con el id dado
    const nuevosDatos = data.filter(equipo => equipo.id !== id);

    fs.writeFileSync(dataFile, JSON.stringify(nuevosDatos, null, 2));

    res.json({ mensaje: 'Equipo eliminado' });
  } catch (error) {
    console.error('Error al eliminar equipo:', error);
    res.status(500).json({ mensaje: 'Error al eliminar equipo' });
  }
});

app.put('/api/equipos/:id', (req, res) => {
  try {
    const id = req.params.id;
    let data = [];

    if (fs.existsSync(dataFile)) {
      const contenido = fs.readFileSync(dataFile, 'utf8');
      data = contenido ? JSON.parse(contenido) : [];
    }

    const index = data.findIndex(equipo => equipo.id === id);
    if (index === -1) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }

    // Actualiza el equipo con los nuevos datos
    data[index] = {
  ...data[index], // conserva id
  tipo: req.body.tipo,
  marca: req.body.marca,
  modelo: req.body.modelo,
  serie: req.body.serie,
  usuario: req.body.usuario,
  estado: req.body.estado,
  fechaIngreso: req.body.fechaIngreso,
  ubicacion: req.body.ubicacion,
  caracteristicas: req.body.caracteristicas || '',
  observaciones: req.body.observaciones || ''
};

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

    res.json(data[index]);

  } catch (error) {
    console.error('Error al actualizar equipo:', error);
    res.status(500).json({ mensaje: 'Error al actualizar equipo' });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);

  
});