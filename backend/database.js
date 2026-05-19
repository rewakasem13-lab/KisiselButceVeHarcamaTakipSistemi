const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./butce.db", (err) => {
  if (err) {
    console.log("Veritabanı bağlantı hatası:", err.message);
  } else {
    console.log("SQLite veritabanına bağlandı.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS harcamalar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      baslik TEXT NOT NULL,
      miktar REAL NOT NULL,
      kategori TEXT NOT NULL,
      tarih TEXT NOT NULL,
      aciklama TEXT
    )
  `);
});

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS gelirler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    miktar REAL NOT NULL,
    tarih TEXT NOT NULL
  )
`);

db.run(`ALTER TABLE harcamalar ADD COLUMN user_id INTEGER`, () => {});
db.run(`ALTER TABLE gelirler ADD COLUMN user_id INTEGER`, () => {});


db.run(`ALTER TABLE gelirler ADD COLUMN baslik TEXT`, () => {});

module.exports = db;