const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  expense: {
    type: Number,
    required: true
  },
  item: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true  // Automatically manages createdAt and updatedAt fields
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
