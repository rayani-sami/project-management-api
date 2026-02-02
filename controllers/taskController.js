const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getAllTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }
    const tasks = await Task.find(filter)
      .populate('project', 'name description')
      .sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    const tasks = await Task.find({ project: projectId }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { title, status, dueDate } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    if (!title) {
      return res.status(400).json({ message: 'Le titre de la tâche est obligatoire' });
    }
    if (!dueDate) {
      return res.status(400).json({ message: 'La date d\'échéance est obligatoire' });
    }
    const task = new Task({
      title,
      status: status || 'TODO',
      dueDate: new Date(dueDate),
      project: projectId
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    console.log('🔄 Mise à jour de la tâche - ID:', req.params.id);
    console.log('📝 Données reçues:', req.body);
    
    const { title, status, dueDate } = req.body;
    
    // Vérifiez que le titre est bien présent et valide
    if (title !== undefined && (!title || title.trim() === '')) {
      return res.status(400).json({ message: 'Le titre ne peut pas être vide' });
    }
    
    // Créer l'objet de mise à jour
    const updateData = {};
    if (title !== undefined) {
      updateData.title = title.trim(); // Nettoyer le titre
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (dueDate !== undefined) {
      updateData.dueDate = new Date(dueDate);
    }
    
    console.log('📤 Données à mettre à jour:', updateData);
    
    // Trouver la tâche existante pour vérifier
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    
  //  console.log(' Tâche existante - titre actuel:', existingTask.title);
  //  console.log(' Tâche existante - nouveau titre:', title);
    
    // Mettre à jour avec les nouvelles valeurs
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, // Retourner le document mis à jour
        runValidators: true, // Exécuter les validations
        context: 'query' // Important pour les validations
      }
    ).populate('project', 'name description');
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée après mise à jour' });
    }
    
    console.log(' Tâche mise à jour avec succès:', task);
    res.json(task);
  } catch (error) {
    console.error(' Erreur détaillée lors de la mise à jour:', error.message);
    console.error(' Validation errors:', error.errors);
    
    // Gestion spécifique des erreurs
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Erreur de validation', 
        errors: messages 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID invalide' });
    }
    
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};