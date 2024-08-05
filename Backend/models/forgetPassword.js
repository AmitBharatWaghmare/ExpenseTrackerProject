const mongoose = require('mongoose');
const { Schema } = mongoose;

const forgotPasswordSchema = new Schema({
  id: {
    type: String, // UUIDs can be stored as strings in MongoDB
    required: true,
    unique: true,  // Ensure the id is unique
    default: () => new mongoose.Types.ObjectId() // Mongoose automatically generates a unique _id
  },
  active: {
    type: Boolean,
    default: true  // Assuming the default value should be true
  }, userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true  // Automatically manage createdAt and updatedAt fields
});

const Forgotpassword = mongoose.model('Forgotpassword', forgotPasswordSchema);

module.exports = Forgotpassword;
