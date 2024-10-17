import { Image } from './types';

export const targetHeight = 200;
export const targetWidth = 300;

export const findClosestImage = (images: Image[]): Image | null => {
  let closestImage: Image | null = null;
  let closestDifference = Number.MAX_SAFE_INTEGER;

  for (const image of images) {
    const widthDifference = Math.abs(image.width - targetWidth);
    const heightDifference = Math.abs(image.height - targetHeight);
    const totalDifference = widthDifference + heightDifference;

    if (totalDifference < closestDifference) {
      closestDifference = totalDifference;
      closestImage = image;
    }
  }

  return closestImage;
};
