import express from 'express';
import cors from 'cors';
import { createRoutes } from './routes';
import { MemStorage } from './storage';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const port = parseInt(process.env.PORT || '3000', 10);

  // Initialize storage
  const storage = new MemStorage();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API routes
  app.use(createRoutes(storage));

  // Serve static assets
  app.use('/api/assets', express.static(path.join(__dirname, '../attached_assets')));

  // Create Vite server for frontend in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: path.join(__dirname, '../client')
    });

    app.use(vite.ssrFixStacktrace);
    app.use('/', vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Sattvic Foods delivery server running on http://0.0.0.0:${port}`);
  });
}

createServer().catch(console.error);