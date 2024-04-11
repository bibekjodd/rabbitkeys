import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useGameStore } from '@/store/useGameStore';
import { useTypingStore } from '@/store/useTypingStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { fetchTrackData } from '../queries/useTrack';

export const useUpdateScore = () => {
  const [previousProgress, setPreviousProgress] = useState<number | null>(null);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-score'],
    mutationFn: async () => {
      const { speed, topSpeed, progress, accuracy } = useTypingStore.getState();
      const { isReady, isFinished, startedAt, trackId } = useGameStore.getState();
      const duration = (Date.now() - new Date(startedAt || Date.now()).getTime()) / 1000;

      if (!trackId || isReady || speed === 0 || progress === previousProgress) return null;
      setPreviousProgress(progress);
      return updateScore({
        speed,
        progress: isFinished ? 100 : progress,
        trackId,
        duration,
        topSpeed,
        accuracy
      });
    },
    onError() {
      const { trackId } = useGameStore.getState();
      if (!trackId) return;
      queryClient.fetchQuery({
        queryKey: ['track'],
        queryFn: () => fetchTrackData(trackId)
      });
    }
  });
};

type Options = {
  speed: number;
  progress: number;
  trackId: string;
  duration: number;
  topSpeed: number;
  accuracy: number;
};
const updateScore = async (data: Options) => {
  try {
    const response = await axios.put(`${backend_url}/api/race/${data.trackId}`, data, {
      withCredentials: true
    });
    return response.data.track;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
