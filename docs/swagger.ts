import { Router } from 'express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'image formatter',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/**/*.[jt]s'], // files containing annotations in JSDOC
};
const openapiSpecification = swaggerJSDoc(swaggerOptions);

const setupOptions = {
    explorer: true,
  };

const router = Router();

router.get(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(openapiSpecification, setupOptions)
);

export default router;