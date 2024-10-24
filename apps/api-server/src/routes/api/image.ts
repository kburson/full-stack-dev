import { Request, Response } from 'express';
import { isEmpty } from 'lodash';
import fs from 'node:fs';
import processImage, {
  getOriginalImagePath,
  getFileExtension,
  isValidFormat,
} from '../../libs/imageProcessor';

async function imageRouteHandler(_req: Request, res: Response) {

  const imageName: string = _req.params.imageName;
  const imagePath = getOriginalImagePath(imageName);

  if (isEmpty(imageName) || !fs.existsSync(imagePath)) {
    console.error(`Requested image not found: "${imageName}" @ "${imagePath}"`);
    res.status(204);
    res.send(`image not found: "${imageName}"`);
    return;
  }

  const format: string = isEmpty(_req.query.format)
    ? getFileExtension(imageName)
    : (_req.query.format as string);

  if (!isValidFormat(format)) {
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
    const thumbnailPath = await processImage(imageName, width, height, format, _req.query.fit as string);
    res.sendFile(thumbnailPath);
  } catch (err) {
    console.error("cannot resize image\n", err.message);
    res.status(400);
    res.send(err.message);
  }
}

export default imageRouteHandler;
