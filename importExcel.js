// Importa le librerie necessarie
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const Game = require('./models/game'); // Assicurati di usare il tuo modello 'game'
require('dotenv').config(); // Per caricare le variabili d'ambiente dal file .env

// Usa la variabile MONGO_URI dal file .env
const URI = process.env.MONGO_URI;  // Assicurati che nel tuo .env ci sia una variabile chiamata MONGO_URI

// Connessione a MongoDB
mongoose.connect(URI)
  .then(() => console.log('Connesso a MongoDB'))
  .catch(err => console.error('Errore nella connessione a MongoDB:', err));

// Leggere il file Excel
const workbook = XLSX.readFile("C:/Users/gamba/OneDrive/Documenti/App GiS/lista-giochi.xlsx"); // Sostituisci con il percorso del tuo file Excel
const sheetName = workbook.SheetNames[0]; // Prendi il primo foglio del file
const worksheet = workbook.Sheets[sheetName];

// Converti il foglio Excel in un array di oggetti
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Elimina la prima riga (intestazioni)
const headers = data.shift();

// Mappa i dati dal file Excel agli oggetti che MongoDB può accettare
const formattedData = data.map(row => {
  return {
    nome: row[headers.indexOf('Nome')],
    durataMedia: row[headers.indexOf('Durata Media')],
    difficolta: row[headers.indexOf('Difficoltà')],
    tipologia: row[headers.indexOf('Tipologia')],
    giocatoriMin: row[headers.indexOf('Giocatori Min')],
    giocatoriMax: row[headers.indexOf('Giocatori Max')],
    proprietario: row[headers.indexOf('Proprietario')],
    posizione: row[headers.indexOf('Posizione')],
  };
});

// Inserire i dati nella collection MongoDB
Game.insertMany(formattedData)
  .then(() => {
    console.log('Dati importati correttamente');
    mongoose.connection.close(); // Chiudi la connessione al database
  })
  .catch(err => {
    console.error('Errore nell\'importazione:', err);
    mongoose.connection.close(); // Chiudi la connessione in caso di errore
  });
