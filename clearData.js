// Importa le librerie necessarie
const mongoose = require('mongoose');
require('dotenv').config(); // Carica le variabili d'ambiente

const Game = require('./models/game'); // Assicurati di usare il tuo modello 'game'

// Usa la variabile MONGO_URI dal file .env
const URI = process.env.MONGO_URI;

// Connessione a MongoDB
mongoose.connect(URI)
  .then(() => console.log('Connesso a MongoDB'))
  .catch(err => console.error('Errore nella connessione a MongoDB:', err));

// Ripulire la collection games
Game.deleteMany({}) // Rimuove tutti i documenti nella collection
  .then(() => {
    console.log('Tutti i giochi sono stati rimossi dalla collection!');
    mongoose.connection.close(); // Chiudi la connessione
  })
  .catch(err => {
    console.error('Errore nella rimozione dei dati:', err);
    mongoose.connection.close(); // Chiudi la connessione in caso di errore
  });
