import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { includes, isEmpty } from 'lodash';


const fitEnum: sharp.FitEnum = {
  contain: 'contain',
  cover: 'cover',
  fill: 'fill',
  inside: 'inside',
  outside: 'outside',
};

const validFormats = ['jpg', 'png', 'gif', 'tiff', 'webp'];
export function isValidFormat(format: string) {
  return includes(validFormats, format);
}

export function getFileExtension(filePath: string) {
  return path.extname(filePath).slice(1);
}


export function getOriginalImagePath(imageName: string): string {
  return path.join(__dirname, `../assets/originals/${imageName}`);
}



export function getThumbnailPath(
  imageName: string,
  resizeOptions:sharp.ResizeOptions,
  format?: string
): string {
  const thumbnailDir = path.join(__dirname, '../assets/thumbnails');
  const imgBaseName = path.parse(imageName).name;
  format = isValidFormat(format) ? format : path.extname(imageName).slice(1);

  let imgSize = resizeOptions.width > 0 ? '.w' + resizeOptions.width : '';
  imgSize =
  resizeOptions.height > 0
      ? imgSize + '.h' + resizeOptions.height
      : imgSize;

  return path.join(
    thumbnailDir,
    `${imgBaseName}${imgSize}${!isEmpty(resizeOptions.fit) && !isEmpty(imgSize) ? '.' + resizeOptions.fit : ''}.${format}`
  );
}



async function resizeImage(
  imageName: string,
  width: number,
  height?: number,
  format?: string,
  fit?: string
) {

  const formatInfo: sharp.AvailableFormatInfo = {
    id: format,
    input: { file: false, buffer: true, stream: false },
    output: { file: false, buffer: true, stream: false },
  };

  const resizeOptions: sharp.ResizeOptions = {
    //width,  // this will be added later
    //height, // this will be added later
    fit: fitEnum[fit] || 'fill', //validImageMask(indexOf(validImageMask,fit)) || 'fill',
    //position: 'center', // not sure if I want this, but it is available.
    background: { r: 255, g: 0, b: 0, alpha: 0.25 },
  };
  if (width > 0) {
    resizeOptions.width = width;
  }
  if (height > 0) {
    resizeOptions.height = height;
  }

  const thumbnailPath = getThumbnailPath(imageName,resizeOptions,format);

  if (fs.existsSync(thumbnailPath)) {
    console.log(`returning cached image "${thumbnailPath}"`);
  } else {
    const originalImagePath = getOriginalImagePath(imageName);

    if (!fs.existsSync(originalImagePath)) {
      const errMsg = `could not find original image path:\nabsolute path: "${originalImagePath}\ndirname: ${__dirname}\nrelative Image Path: ${originalImagePath}`;
      console.error(errMsg);
      throw new Error(errMsg);
    }

    const img = sharp(originalImagePath);

    try {
      await img
        .resize(resizeOptions)
        .toFormat(formatInfo)
        .toFile(thumbnailPath);
    } catch (err) {
      console.error(`failed to save resized image file to ${thumbnailPath}`);
      throw err;
    }
  }
  return thumbnailPath;
}

export default async function processImage(
  imageName: string,
  width = 0,
  height = 0,
  format?: string,
  fit?: string
): Promise<string> {

  format = !isEmpty(format) ? format : getFileExtension(imageName);
  if (!isValidFormat(format)) {
    const errMsg = `unsupported image format "${format}"`;
    console.error(errMsg);
    throw new Error(errMsg);
  }

  if (width <= 0 && height <= 0 && format === getFileExtension(imageName)) {
    console.log('sending original image as no "valid" modifications were requested');
    const filePath = getOriginalImagePath(imageName);
    return filePath;
  }

  const thumbnailPath = await resizeImage(
    imageName,
    width,
    height,
    format,
    fit
  );

  return Promise.resolve(thumbnailPath);
}

