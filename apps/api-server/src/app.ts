import express from 'express';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';

import timeLog from './middleware/timeLog';

// routes
import defaultRoute from './routes/default';
import imageRoutes from './routes/api/image';

import { host, port } from './constants';

export const app = express();

const swaggerFile = path.join(__dirname, 'assets/api-swagger.json');

if (fs.existsSync(swaggerFile)) {
  const swaggerOptionsJson = fs.readFileSync(swaggerFile, { encoding: 'utf8' });
  app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(JSON.parse(swaggerOptionsJson))
  );
}

// setup global middleware
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(timeLog);

// register the routes
app.use('/', defaultRoute);
app.use('/api', imageRoutes);

// start the server
export const server = app.listen(port, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

server.on('error', console.error);
