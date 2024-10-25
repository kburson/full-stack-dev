import express from 'express';
import path from 'node:path';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import {expressJSDocSwaggerOptions} from './constants';

import timeLog from './middleware/timeLog';
// routes
import defaultRoute from './routes/default';
import imageRoutes from './routes/api/image';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;


const app = express();

// setup swagger ui 
expressJSDocSwagger(app)(expressJSDocSwaggerOptions);


app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(timeLog);

app.use('/',defaultRoute);
app.use('/api',imageRoutes);

const server = app.listen(port, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

server.on('error', console.error);
