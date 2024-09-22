'use client';
import { dummyUserImage, flagImage, lightspreadImage } from '@/lib/constants';
import { useEffect } from 'react';

const images = [flagImage, dummyUserImage, lightspreadImage];

const preloadImage = (src: string) => {
  const image = new Image();
  image.src = src;
};

export default function PreloadImages() {
  useEffect(() => {
    images.forEach((src) => {
      preloadImage(src);
    });
  }, []);

  return null;
}
