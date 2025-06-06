const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a SQLite (archivo bd)
const db = new sqlite3.Database('./places.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Base de datos SQLite abierta');
  }
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Ruta para guardar lugar
app.post('/api/places', (req, res) => {
  const { name, description, type, lat, lng } = req.body;

  if (!name || !type || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const sql = 'INSERT INTO places (name, description, type, lat, lng) VALUES (?, ?, ?, ?, ?)';
  const params = [name, description || '', type, lat, lng];

  db.run(sql, params, function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Error al guardar en base de datos' });
    }
    res.json({ message: 'Lugar guardado', id: this.lastID });
  });
});

// Ruta para obtener todos los lugares guardados
app.get('/api/places', (req, res) => {
  db.all('SELECT * FROM places ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener datos' });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
