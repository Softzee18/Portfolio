import Testimonial from '../models/testimonial.js';

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial
      .find({ status: 'approved' })
      .sort('-createdAt')
      .limit(50);

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials'
    });
  }
};

export const getPendingTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial
      .find({ status: 'pending' })
      .sort('-createdAt');

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending testimonials'
    });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { name, company, text } = req.body;

    // Validate input
    if (!name || !text) {
      return res.status(400).json({
        success: false,
        message: 'Name and testimonial text are required'
      });
    }

    const testimonial = new Testimonial({
      name,
      company,
      text,
      // Auto-approve in development so submissions are visible during local testing
      status: process.env.NODE_ENV === 'development' ? 'approved' : 'pending'
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial'
    });
  }
};

export const approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    testimonial.status = 'approved';
    await testimonial.save();

    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve testimonial'
    });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    await testimonial.deleteOne();

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial'
    });
  }
};