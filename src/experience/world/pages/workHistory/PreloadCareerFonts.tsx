'use client';

import { useEffect } from 'react';
// @ts-expect-error troika-three-text does not ship TypeScript declarations.
import { preloadFont } from 'troika-three-text';

const FONT_CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@•-.,:!() ';

const FONTS = ['/fonts/BlenderPro-Bold.ttf', '/fonts/Blender Pro Medium.ttf'];

const PreloadCareerFonts = () => {
  useEffect(() => {
    FONTS.forEach((font) => {
      preloadFont(
        {
          font,
          characters: FONT_CHARACTERS,
        },
        () => {
          console.log(`Font preloaded: ${font}`);
        },
      );
    });
  }, []);

  return null;
};

export default PreloadCareerFonts;
