import express from 'express';

const router = express.Router();

// Health check route
router.get('/', (req, res) => {
  res.json({ 
    status: 'OK',
    database: 'Connected',
    timestamp: new Date().toISOString()
  });
});

export default router;