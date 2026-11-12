
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Stockage temporaire des tâches
let todos = [];

// Vérification du fonctionnement du serveur
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur opérationnel'
  });
});

// Récupération de toutes les tâches
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Création d'une tâche
app.post('/api/todos', (req, res) => {
  const text = req.body.text;

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({
      message: 'Le texte de la tâche est obligatoire.'
    });
  }

  const newTodo = {
    id: Date.now(),
    text: text.trim(),
    status: 'in-progress'
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});

// Modification d'une tâche
app.put('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({
      message: 'Tâche non trouvée.'
    });
  }

  const { text, status } = req.body;

  if (text !== undefined) {
    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        message: 'Le texte ne peut pas être vide.'
      });
    }

    todo.text = text.trim();
  }

  if (status !== undefined) {
    if (!['in-progress', 'done'].includes(status)) {
      return res.status(400).json({
        message: 'Statut invalide.'
      });
    }

    todo.status = status;
  }

  res.json(todo);
});

// Suppression d'une tâche
app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: 'Tâche non trouvée.'
    });
  }

  todos.splice(index, 1);

  res.status(204).send();
});

// Gestion des routes inconnues
app.use((req, res) => {
  res.status(404).json({
    message: 'Route introuvable.'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur Node démarré sur le port ${PORT}`);
});
