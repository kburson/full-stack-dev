import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { includes, isEmpty } from 'lodash';
import { ImageOptions } from './ImageOptions';

const basePathForOriginalImages = `../assets/originals`;
const basePathForThumbnailImages = `../assets/thumbnails`;

const validFormats = ['jpg', 'png', 'gif', 'tiff', 'webp'];

const fitEnum: sharp.FitEnum = {
  contain: 'contain',
  cover: 'cover',
  fill: 'fill',
  inside: 'inside',
  outside: 'outside',
};

function isValidFormat(format: string) {
  return includes(validFormats, format);
}

function isValidFit(fit: string) {
  return !isEmpty(fitEnum[fit]);
}

function getFileExtension(filePath: string) {
  return path.extname(filePath).slice(1);
}

function getOriginalImagePath(imageName: string): string {
  return path.join(__dirname, `${basePathForOriginalImages}/${imageName}`);
}

function getThumbnailPath(
  imageName: string,
  resizeOptions: sharp.ResizeOptions,
  format?: string
): string {
  const thumbnailDir = path.join(__dirname, basePathForThumbnailImages);
  const imgBaseName = path.parse(imageName).name;
  format = isValidFormat(format) ? format : path.extname(imageName).slice(1);

  let imgSize = resizeOptions.width > 0 ? '.w' + resizeOptions.width : '';
  imgSize =
    resizeOptions.height > 0 ? imgSize + '.h' + resizeOptions.height : imgSize;

  return path.join(
    thumbnailDir,
    `${imgBaseName}${imgSize}${
      !isEmpty(resizeOptions.fit) && !isEmpty(imgSize)
        ? '.' + resizeOptions.fit
        : ''
    }.${format}`
  );
}

// We want to mock this function in our tests.
async function readImageFromDisk(filePath: string): Promise<sharp.Sharp> {
  return sharp(filePath);
}

// We want to mock this function in our tests.
async function saveImageToDisk(
  img: sharp.Sharp,
  filePath: string
): Promise<sharp.OutputInfo> {
  console.log('saving new image file to cache');
  return await img.toFile(filePath);
}

function getImageOptions(
  imageName: string,
  width: number,
  height?: number,
  format?: string,
  fit?: string
): ImageOptions {
  const originalFileExtension = getFileExtension(imageName);

  format = !isEmpty(format) ? format : originalFileExtension;
  if (!isValidFormat(format)) {
    const errMsg = `unsupported image format "${format}"`;
    console.error(errMsg);
    throw new Error(errMsg);
  }

  const formatInfo: sharp.AvailableFormatInfo = {
    id: format,
    input: { file: false, buffer: true, stream: false },
    output: { file: false, buffer: true, stream: false },
  };

  if (!isEmpty(fit) && !isValidFit(fit)) {
    const errMsg = `unsupported image fit "${fit}"`;
    console.error(errMsg);
    throw new Error(errMsg);
  }

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

  const originalImagePath = getOriginalImagePath(imageName);
  const thumbnailPath = getThumbnailPath(imageName, resizeOptions, format);

  return {
    imageName,
    formatInfo,
    resizeOptions,
    thumbnailPath,
    originalImage: {
      fileName: imageName,
      fileExtension: originalFileExtension,
      filePath: originalImagePath,
    },
  } as ImageOptions;
}

async function createNewImage(imageOptions: ImageOptions) {
  if (!fs.existsSync(imageOptions.originalImage.filePath)) {
    const errMsg = `could not find image "${imageOptions.originalImage.fileName}"`;
    console.error(errMsg);
    throw new Error(errMsg);
  }

  const img = await readImageFromDisk(imageOptions.originalImage.filePath);

  console.log(`creating a new image`);
  await saveImageToDisk(
    img.resize(imageOptions.resizeOptions).toFormat(imageOptions.formatInfo),
    imageOptions.thumbnailPath
  );
}

async function getImage(
  imageName: string,
  width = 0,
  height = 0,
  format?: string,
  fit?: string
): Promise<string> {
  const imageOptions = getImageOptions(imageName, width, height, format, fit);

  if (
    width <= 0 &&
    height <= 0 &&
    (isEmpty(format) || format === imageOptions.originalImage.fileExtension)
  ) {
    console.log('sending original image as is');
    return imageOptions.originalImage.filePath;
  }

  if (fs.existsSync(imageOptions.thumbnailPath)) {
    console.log(`returning cached image`);
  } else {
    await createNewImage(imageOptions);
  }

  return Promise.resolve(imageOptions.thumbnailPath);
}

// We are exporting all methods as an object so that we can mock individual methods
// This does not seem to be possible when exporting constants or function literals.
export default {
  basePathForOriginalImages,
  basePathForThumbnailImages,
  fitEnum,
  isValidFormat,
  getFileExtension,
  getOriginalImagePath,
  getThumbnailPath,
  readImageFromDisk,
  saveImageToDisk,
  getImageOptions,
  createNewImage,
  getImage,
};
