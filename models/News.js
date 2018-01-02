const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  __v: { type: Number, select: false },
  theme: { type: String, required: true },
  text: { type: String, required: true },
  date: Date,
  // userId: Number
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

NewsSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('News', NewsSchema);
