import sharp from 'sharp';

export interface ImageOptions {
  resizeOptions: sharp.ResizeOptions;
  formatInfo: sharp.AvailableFormatInfo;
  thumbnailPath: string;
  originalImage: {
    fileName: string;
    fileExtension: string;
    filePath: string;
  };
}
