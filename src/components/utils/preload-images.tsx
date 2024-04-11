'use client';
import { dummyUserImage, flagImage } from '@/lib/constants';
import { useEffect } from 'react';

const images = [flagImage, dummyUserImage];

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
