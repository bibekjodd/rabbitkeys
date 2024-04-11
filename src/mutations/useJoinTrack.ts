import { fetchParagraph } from '@/queries/useParagraph';
import { fetchTrackData } from '@/queries/useTrack';
import { useGameStore } from '@/store/useGameStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useJoinTrack = () => {
  const queryClient = useQueryClient();
  const switchMode = useGameStore((state) => state.switchMode);
  const router = useRouter();

  return useMutation({
    mutationKey: ['join-track'],
    mutationFn: fetchTrackData,
    onSuccess(track) {
      switchMode({ isMultiplayer: true, trackId: track.id });
      queryClient.setQueryData<Track>(['track'], track);
      router.replace(`/?track=${track.id}`);
      queryClient.prefetchQuery({
        queryKey: ['paragraph', track.paragraphId],
        queryFn: () => fetchParagraph(track.paragraphId)
      });
    }
  });
};
