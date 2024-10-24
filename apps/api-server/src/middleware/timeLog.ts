import { Request, Response } from 'express';

export default function timeLog(req: Request, res: Response, next) {
  console.log(`\nReq: ${Date.now()}: ${req.method} ${req.url}`);
  next();
}
