const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/***** Middleware */
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);




// Connexion à MongoDB
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/projet_management'
)
.then(() => console.log(' MongoDB connecté'))
.catch(err => console.error(' Erreur MongoDB :', err));

// Route de base
app.get('/', (req, res) => {
  res.send('API de gestion de projets');
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});
