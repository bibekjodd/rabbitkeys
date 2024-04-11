'use client';
import { useJoinTrack } from '@/mutations/useJoinTrack';
import { useGameStore } from '@/store/useGameStore';
import { Check, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export default function Invitation() {
  const invitation = useGameStore((state) => state.invitation);
  const updateInvitation = useGameStore((state) => state.updateInvitation);
  const { mutate } = useJoinTrack();

  const joinTrack = useCallback(() => {
    if (!invitation) return;
    const { isReady, isStarted } = useGameStore.getState();
    if (isReady || isStarted) return;

    toast.dismiss();
    toast.loading('Joining track...');
    mutate(invitation.trackId, {
      onSuccess() {
        toast.dismiss();
      },
      onError(err) {
        toast.dismiss();
        const { isStarted, isReady } = useGameStore.getState();
        if (!isStarted && !isReady) {
          toast.error(`Could not join track! ${err.message}`);
        }
      },
      onSettled() {
        updateInvitation(null);
      }
    });
  }, [invitation, mutate, updateInvitation]);

  useEffect(() => {
    if (!invitation) return;
    toast.dismiss();
    toast.custom(
      () => (
        <div className="flex items-center space-x-5 rounded-lg border border-gray-600 bg-black/80 px-4 py-3 text-sm text-neutral-200 filter backdrop-blur-md">
          <div className="">
            <p>{invitation.message}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => toast.dismiss()}>
              <X className="h-6 w-6 text-rose-600" />
            </button>
            <button onClick={joinTrack}>
              <Check className="h-6 w-6 text-green-600" />
            </button>
          </div>
        </div>
      ),
      { duration: 10_000 }
    );
  }, [invitation, mutate, updateInvitation, joinTrack]);

  return null;
}
