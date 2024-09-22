import { rubikGlitch } from '@/lib/fonts';
import { useParagraph } from '@/queries/use-paragraph';
import { useProfile } from '@/queries/use-profile';
import { useTrack } from '@/queries/use-track';
import { useEffect, useState } from 'react';

export default function InitialOverlay() {
  const { isLoading: isLoadingProfile } = useProfile();
  const { data: track, isLoading: isLoadingTrack } = useTrack();
  const { isLoading: isLoadingParagraph } = useParagraph(track?.paragraphId);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    if (!isLoadingParagraph && !isLoadingTrack && !isLoadingParagraph) {
      setIsInitial(false);
    }
  }, [isLoadingProfile, isLoadingTrack, isLoadingParagraph]);

  if (isInitial)
    return (
      <>
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-900 px-5 py-10">
          <section className="flex flex-col space-y-3">
            <h1 className="z-50 flex items-center space-x-2">
              <span
                className={`${rubikGlitch.className} bg-gradient-to-r from-rose-600 via-pink-500 to-sky-500 bg-clip-text text-3xl text-transparent md:text-4xl`}
              >
                Rabbit_keys
              </span>
            </h1>

            <div className="flex w-full items-center space-x-3">
              <div className="relative h-1 w-full rounded-full bg-neutral-700">
                <div className="absolute left-0 top-0 z-10 h-full animate-initial-loading-bar rounded-full bg-white" />
              </div>
              <span className="-translate-y-1 text-2xl">🥕</span>
            </div>
            <span>Loading game...</span>
          </section>
        </div>

        <div className="fixed inset-0 z-50 flex flex-wrap">
          {new Array(1000).fill('nothing').map((_, i) => (
            <div key={i} className="grid h-10 w-10 border border-gray-700/10"></div>
          ))}
        </div>
      </>
    );
}
