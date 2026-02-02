const Project = require('../models/Project');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('tasks');
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Le nom du projet est obligatoire' });
    }
    const project = new Project({ name, description });
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    
    console.log(' Tentative de suppression du projet:', projectId);
    
    //  Utiliser findByIdAndDelete (déclenche le middleware)
    const deletedProject = await Project.findByIdAndDelete(projectId);
    
    if (!deletedProject) {
      console.log(' Projet non trouvé:', projectId);
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    
    console.log(' Projet supprimé avec succès:', projectId);
    
    res.json({ 
      success: true,
      message: 'Projet supprimé avec succès',
      projectId: projectId
    });
    
  } catch (error) {
    console.error(' Erreur lors de la suppression du projet:', error);
    console.error(' Détails de l\'erreur:', error.message);
    
    // Gestion spécifique des erreurs
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de projet invalide' 
      });
    }
    
    res.status(500).json({ 
      message: 'Erreur serveur lors de la suppression',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};