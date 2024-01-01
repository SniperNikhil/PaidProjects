const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    teacher: { type: String, required: true },
    userswhosubmittedfeedback: Array,
    question1: {
      A: { type: Number, default: 0 },
      B: { type: Number, default: 0 },
      C: { type: Number, default: 0 },
      D: { type: Number, default: 0 },
    },
    question2: {
      A: { type: Number, default: 0 },
      B: { type: Number, default: 0 },
      C: { type: Number, default: 0 },
      D: { type: Number, default: 0 },
    },
    question3: {
      A: { type: Number, default: 0 },
      B: { type: Number, default: 0 },
      C: { type: Number, default: 0 },
      D: { type: Number, default: 0 },
    },
    question4: {
      A: { type: Number, default: 0 },
      B: { type: Number, default: 0 },
      C: { type: Number, default: 0 },
      D: { type: Number, default: 0 },
    },
    question5: {
      A: { type: Number, default: 0 },
      B: { type: Number, default: 0 },
      C: { type: Number, default: 0 },
      D: { type: Number, default: 0 },
    },
    suggestion: { type: String },
  });
  


const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
