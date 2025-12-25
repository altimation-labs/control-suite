import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Altimation Control Suite Backend API',
    version: '0.1.0',
    endpoints: {
      health: '/api/health',
      serial: '/api/serial',
      firmware: '/api/firmware',
      config: '/api/config'
    }
  });
});

// Placeholder routes (will be implemented in Phase 2)
app.use('/api/serial', (req: Request, res: Response) => {
  res.json({ message: 'Serial API - Coming soon' });
});

app.use('/api/firmware', (req: Request, res: Response) => {
  res.json({ message: 'Firmware API - Coming soon' });
});

app.use('/api/config', (req: Request, res: Response) => {
  res.json({ message: 'Config API - Coming soon' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date()
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;