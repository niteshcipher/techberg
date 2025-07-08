import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  roadmap: {
    type: Array, // or [Object] if structured steps
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
