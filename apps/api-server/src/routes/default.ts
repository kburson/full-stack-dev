import { Request, Response, Router } from 'express';

const router = Router();

/**
 * GET /
 * @summary default route for api-server
 * @return {string} 200 - success response
 */
router.get('/', (_req: Request, res: Response) => {
  res.send(
    'This is an api server for the full stack developer course on udacity.'
  );
  // TODO:  Add swaggerUI to the endpoints.
});

export default router;
