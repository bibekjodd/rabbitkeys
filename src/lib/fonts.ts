import { Inter, Roboto_Mono, Rubik_Glitch } from 'next/font/google';
export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '600']
});
export const rubikGlitch = Rubik_Glitch({
  weight: ['400'],
  subsets: ['latin']
});

export const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });
