const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre de la tâche est obligatoire'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  status: {
    type: String,
    enum: {
      values: ['TODO', 'IN_PROGRESS', 'DONE'],
      message: 'Le statut doit être TODO, IN_PROGRESS ou DONE'
    },
    default: 'TODO'
  },
  dueDate: {
    type: Date,
    required: [true, 'La date d\'échéance est obligatoire']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Le projet est obligatoire']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);