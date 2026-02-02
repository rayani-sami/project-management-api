const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
// Routes pour les projets
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Routes pour les tâches d'un projet
router.get('/:projectId/tasks', taskController.getTasksByProject);
router.post('/:projectId/tasks', taskController.createTask);
module.exports = router;