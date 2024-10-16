import { fetchParagraph, paragraphKey } from '@/queries/use-paragraph';
import { fetchTrackData, trackKey } from '@/queries/use-track';
import { switchMode } from '@/store/use-game-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const joinTrackKey = ['join-track'];

export const useJoinTrack = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: joinTrackKey,
    mutationFn: fetchTrackData,
    onSuccess(track) {
      switchMode({ isMultiplayer: true, trackId: track.id });
      queryClient.setQueryData<Track>(trackKey, track);
      router.replace(`/?track=${track.id}`);
      queryClient.prefetchQuery({
        queryKey: paragraphKey(track.paragraphId),
        queryFn: ({ signal }) => fetchParagraph({ paragraphId: track.paragraphId, signal })
      });
    }
  });
};
