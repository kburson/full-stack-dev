import { Request, Response, Router } from 'express';

const router = Router();

//export default function (router: Router): Router {
  router.get('/', (_req:Request, res:Response) => {
    res.send(
      'This is an api server for the full stack developer course on udacity.'
    );
    // TODO:  Add swaggerUI to the endpoints.
  })
  //return router;
//};

export default router;

