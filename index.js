const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Połączenie z MySQL
const db = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'example',
  database: 'myapp'
});

db.connect(err => {
  if (err) throw err;
  console.log('Połączono z bazą danych MySQL');
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      imie VARCHAR(255),
      nazwisko VARCHAR(255),
      czas DATETIME
    )
  `;
  db.query(createTableQuery);
});

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routing główny
app.get('/', (req, res) => {
  const teraz = new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' });

  db.query('SELECT * FROM users ORDER BY czas DESC', (err, results) => {
    if (err) throw err;
    res.render('index', {
      users: results,
      currentTime: teraz
    });
  });
});

// Dodawanie użytkownika
app.post('/dodaj', (req, res) => {
  const { imie, nazwisko } = req.body;
  const teraz = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Warsaw' }); // Format YYYY-MM-DD HH:mm:ss

  db.query(
    'INSERT INTO users (imie, nazwisko, czas) VALUES (?, ?, ?)',
    [imie, nazwisko, teraz],
    err => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

// Usuwanie użytkownika
app.post('/usun/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], err => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.listen(3000, function() {
  console.log('Aplikacja działa na http://localhost:${3000}');
});