const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du projet est obligatoire'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Relation virtuelle avec les tâches
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project'
});

// ✅ CORRECTION : Middleware pour supprimer les tâches associées
projectSchema.pre('findOneAndDelete', async function(next) {
  try {
    console.log('🧹 Middleware pre-findOneAndDelete déclenché');
    
    // Récupérer l'ID du projet
    const projectId = this.getQuery()["_id"];
    console.log('📋 Suppression des tâches du projet:', projectId);
    
    if (projectId) {
      // Supprimer toutes les tâches associées à ce projet
      await mongoose.model('Task').deleteMany({ project: projectId });
      console.log('✅ Tâches supprimées pour le projet:', projectId);
    }
    
    // Appeler next() pour continuer
    if (next && typeof next === 'function') {
      next();
    }
  } catch (error) {
    console.error('❌ Erreur dans le middleware:', error);
    
    // Passer l'erreur à next() si c'est une fonction
    if (next && typeof next === 'function') {
      next(error);
    }
  }
});

// ✅ ALTERNATIVE : Middleware plus simple (si le précédent ne fonctionne pas)
projectSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    console.log('🧹 Middleware pre-deleteOne (document) déclenché');
    const projectId = this._id;
    
    if (projectId) {
      await mongoose.model('Task').deleteMany({ project: projectId });
      console.log('✅ Tâches supprimées pour le projet:', projectId);
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Project', projectSchema);