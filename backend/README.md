# Portfolio Backend API

This is the backend API for the Portfolio testimonials system. It provides endpoints for submitting, managing, and retrieving testimonials with admin authentication.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your configuration:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/portfolio-testimonials
   JWT_SECRET=your-secret-key
   RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
   RECAPTCHA_SITE_KEY=your-recaptcha-site-key
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000
   ```

3. Start MongoDB locally or use MongoDB Atlas

4. Run the server:
   ```bash
   # Development with auto-reload
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Public Routes

- `GET /api/testimonials`
  - Get all approved testimonials
  - No authentication required

- `POST /api/testimonials`
  - Submit a new testimonial
  - Requires reCAPTCHA token
  - Body: `{ name, company, text, token }`

### Protected Routes (Admin Only)

- `POST /api/auth/login`
  - Admin login
  - Body: `{ username, password }`
  - Returns JWT token

- `GET /api/testimonials/pending`
  - Get pending testimonials
  - Requires JWT token

- `PUT /api/testimonials/:id/approve`
  - Approve a testimonial
  - Requires JWT token

- `DELETE /api/testimonials/:id`
  - Delete a testimonial
  - Requires JWT token

## Security Features

- JWT authentication for admin routes
- reCAPTCHA protection for submissions
- Rate limiting
- CORS protection
- Security headers with Helmet
- Input validation
- MongoDB injection protection
- Safe error handling

## Production Deployment

1. Update environment variables
2. Set up MongoDB Atlas cluster
3. Deploy to your preferred hosting (e.g., Heroku, DigitalOcean, AWS)
4. Enable reCAPTCHA
5. Set up proper monitoring and logging

## Frontend Integration

Update your frontend code to use these API endpoints instead of localStorage:

```javascript
const API_URL = 'http://localhost:3000/api';

// Submit testimonial
async function submitTestimonial(data) {
  const response = await fetch(`${API_URL}/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Admin login
async function login(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
}

// Get testimonials (public)
async function getTestimonials() {
  const response = await fetch(`${API_URL}/testimonials`);
  return response.json();
}

// Admin: Get pending testimonials
async function getPendingTestimonials(token) {
  const response = await fetch(`${API_URL}/testimonials/pending`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

// Admin: Approve testimonial
async function approveTestimonial(id, token) {
  const response = await fetch(`${API_URL}/testimonials/${id}/approve`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

// Admin: Delete testimonial
async function deleteTestimonial(id, token) {
  const response = await fetch(`${API_URL}/testimonials/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```