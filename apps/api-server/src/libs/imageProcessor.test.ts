import path from 'node:path';
import { rimrafSync } from 'rimraf';
import sharp from 'sharp';
import images from './imageProcessor';

const originalImageFolder = path.join(__dirname, '../assets/originals');
const thumbnailImageFolder = path.join(__dirname, '../assets/thumbnails');

function cleanAssetDir() {
  const assetDir = path.resolve(thumbnailImageFolder);
  rimrafSync(path.join(assetDir, '*.*'), { preserveRoot: true, glob: true });
}

describe('imageProcessor', () => {
  // Mocking console output to both block it from output to screen and to query it for each invocation

  // const mockedConsoleLog = jest
  //   .spyOn(console, 'log')
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   .mockImplementation(() => {});
  // const mockedConsoleError = jest
  //   .spyOn(console, 'error')
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   .mockImplementation(() => {});

  // Mocking the saveImageToDisk module method to prevent I/O to disk during tests.
  // Because sharp module only exposes the 'toFile' method from the instance we had to wrap it.
  const saveImageToDiskSpy = jest
    .spyOn(images, 'saveImageToDisk')
    .mockImplementation(() => {
      console.log('saveImageToDisk invoked');
      return Promise.resolve({
        format: '',
        width: 0,
        height: 0,
        size: 0,
        channels: 1,
        premultiplied: false,
      } as sharp.OutputInfo);
    });

  beforeAll(() => {
    cleanAssetDir();
  });

  afterAll(() => {
    cleanAssetDir();
  });

  beforeEach(() => {
    // mockedConsoleError.mockReset();
    // mockedConsoleLog.mockReset();
    saveImageToDiskSpy.mockReset();
  });

  describe('isValidFormat', () => {
    it('should return true for [jpg,png,gif,tiff,webp]', () => {
      expect(images.isValidFormat('jpg')).toBe(true);
      expect(images.isValidFormat('png')).toBe(true);
      expect(images.isValidFormat('gif')).toBe(true);
      expect(images.isValidFormat('tiff')).toBe(true);
      expect(images.isValidFormat('webp')).toBe(true);
    });
    it('should return false for unsupported image format', () => {
      expect(images.isValidFormat('raw')).toBe(false);
    });
  });

  describe('getFileExtension', () => {
    it('should return the file extension for a file path', () => {
      expect(images.getFileExtension('/path/to/my/file.jpg')).toBe('jpg');
    });
    it('should return empty string if no extension is found', () => {
      expect(images.getFileExtension('/path/to/my/file')).toBe('');
    });
  });

  describe('getOriginalmagePath', () => {
    it('should return absolute path for an original image file', () => {
      const fileName = 'fjord.jpg';
      const expectedPath = path.resolve(
        path.join(originalImageFolder, fileName)
      );

      expect(images.getOriginalImagePath(fileName)).toEqual(expectedPath);
    });
  });

  describe('getThumbnailPath', () => {
    it('should return absolute path for an prospective thumbnail image file', () => {
      const fileName = 'fjord.jpg';
      const resizeOptions: sharp.ResizeOptions = {
        width: 200,
        height: 100,
        fit: images.fitEnum['cover'],
      };
      const expectedPath = path.resolve(
        path.join(thumbnailImageFolder, `fjord.w200.h100.cover.jpg`)
      );

      expect(images.getThumbnailPath(fileName, resizeOptions)).toEqual(
        expectedPath
      );
    });
  });

  //readImageFromDisk
  //saveImageToDisk

  describe('createNewImage', () => {
    it('should', () => {
      expect(true).toBeTruthy();
    });
  });

  describe('getImageOptions', () => {
    it('should', () => {
      expect(true).toBeTruthy();
    });
  });

  describe('getImage', () => {
    it('should return filepath for the newly created image', async () => {
      const thumbnailImagePath = await images.getImage(
        'fjord.jpg',
        600,
        400,
        'gif',
        'inside'
      );
      expect(thumbnailImagePath).toEqual(
        path.join(thumbnailImageFolder, 'fjord.w600.h400.inside.gif')
      );
    });

    it('should return filepath for the original image', async () => {
      const foundImagePath = await images.getImage('fjord.jpg');
      expect(foundImagePath).toEqual(
        path.join(originalImageFolder, 'fjord.jpg')
      );
    });

    xit('should throw error if named image cannot be found', async () => {
      // TODO: This is not catching the thrown error
      expect(await images.getImage('foo.jpg', 200)).toThrow();
    });
  });
});
