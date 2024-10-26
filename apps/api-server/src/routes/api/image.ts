import { Router, Request, Response } from 'express';
import { isEmpty } from 'lodash';
import fs from 'node:fs';
import image from '../../libs/imageProcessor';

const router = Router();

router.get('/image/:imageName', async (_req: Request, res: Response) => {
  /*
  #swagger.tags = ['Image Processor']
  #swagger.summary = 'Fetch image and resize or trasnform to file type before returning transformed image file'

  #swagger.parameters['imageName'] = {
    in: 'path',
    description: 'full name of image file, including extension, you want to fetch',
    required: true,
    type: 'string'
  }
  #swagger.parameters['width'] = {
    in: 'query',
    description: 'Width in pixels that you want to resize image to',
    required: false,
    type: 'integer'
  }
  #swagger.parameters['height'] = {
    in: 'query',
    description: 'Height in pixels that you want to resize image to',
    required: false,
    type: 'integer'
  }
  #swagger.parameters['fit'] = {
    in: 'query',
    description: 'name of algorithm used to fit the image into the resized frame',
    required: false,
    schema: {
      '@enum': ['cover','fill','inside','outside','contain']
    }
  }
  #swagger.parameters['format'] = {
    in: 'query',
    description: 'file format to transforme the image to.',
    required: false,
    schema: {
      '@enum': ['jpg', 'png', 'gif', 'tiff', 'webp']
    }
  }
  #swagger.responses[200] = {
    description: 'OK',
    content: {
      oneOf: [
        { "image/jpg": {"schema": {"type": "string"}}},
        { "image/png": {"schema": {"type": "string"}}},
        { "image/gif": {"schema": {"type": "string"}}},
        { "image/tiff": {"schema": {"type": "string"}}},
        { "image/webp":{"schema": {"type": "string"}}},
      ]
    }
  }
  #swagger.responses[204] = {
    description: '"No content": The file could not be found'
  }
  #swagger.responses[400] = {
    description: '"Bad Request"'
  }
  #swagger.responses[404] = {
    description: '"Not Found": Could not find the endpoint requested'
  }
  */
  const imageName: string = _req.params.imageName;
  const imagePath = image.getOriginalImagePath(imageName);

  if (isEmpty(imageName) || !fs.existsSync(imagePath)) {
    console.error(`Requested image not found: "${imageName}" @ "${imagePath}"`);
    res.status(400);
    res.send(`image not found: "${imageName}"`);
    return;
  }

  const format: string = isEmpty(_req.query.format)
    ? image.getFileExtension(imageName)
    : (_req.query.format as string);

  if (!image.isValidFormat(format)) {
    const errMsg = `unsupported format "${format}"`;
    console.log(errMsg);
    res.status(404);
    res.send(errMsg);
    return;
  }

  const width = isEmpty(_req.query.width)
    ? 0
    : parseInt(_req.query.width as string);
  const height = isEmpty(_req.query.height)
    ? 0
    : parseInt(_req.query.height as string);

  try {
    const thumbnailPath = await image.getImage(
      imageName,
      width,
      height,
      format,
      _req.query.fit as string
    );
    res.sendFile(thumbnailPath);
  } catch (err) {
    console.error('cannot resize image\n', err.message);
    res.status(400);
    res.send(err.message);
  }
});

export default router;
