const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Routes pour les tâches (sans les routes de projet)
router.get('/', taskController.getAllTasks);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;