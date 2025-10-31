import express from 'express';
import { authenticateToken, validateRecaptcha } from '../middleware/auth.js';
import {
  getTestimonials,
  getPendingTestimonials,
  createTestimonial,
  approveTestimonial,
  deleteTestimonial
} from '../controllers/testimonials.js';

const router = express.Router();

// Public routes
router.get('/', getTestimonials);
router.post('/', validateRecaptcha, createTestimonial);

// Protected routes (admin only)
router.get('/pending', authenticateToken, getPendingTestimonials);
router.put('/:id/approve', authenticateToken, approveTestimonial);
router.delete('/:id', authenticateToken, deleteTestimonial);

export default router;