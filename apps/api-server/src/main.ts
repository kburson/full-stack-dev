import express from 'express';
import path from 'node:path';

// routes
import defaultRoute from './routes/default';
import imageRouteHandler from './routes/api/image';


const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

function timeLog(req,res,next) {
  console.log(`\nReq: ${Date.now()}: ${req.method} ${req.url}`);
  next();
};

app.use(timeLog);

app.get('/',defaultRoute);
app.get('/api/image/:imageName',(req,res) => {
  imageRouteHandler(req,res)
});


const server = app.listen(port, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

server.on('error', console.error);
