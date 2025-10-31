import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  company: {
    type: String,
    trim: true,
    maxLength: 100
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
testimonialSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Testimonial', testimonialSchema);