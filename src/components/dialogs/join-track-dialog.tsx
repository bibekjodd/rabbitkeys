import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { validateUrl } from '@/lib/utils';
import { useJoinTrack } from '@/mutations/use-join-track';
import { useProfile } from '@/queries/use-profile';
import { useGameStore } from '@/store/use-game-store';
import { useReplayStore } from '@/store/use-replay-store';
import { useIsMutating } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LuClipboardList, LuLoader2, LuX } from 'react-icons/lu';
import { toast } from 'sonner';

type Props = { children: React.ReactNode };
export function JoinTrackDialog({ children }: Props) {
  const isReady = useGameStore((state) => state.isReady);
  const [input, setInput] = useState('');
  const [trackId, setTrackId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const isStarted = useGameStore((state) => state.isStarted);
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  const { data: profile, isError: isProfileError } = useProfile();
  const { mutate, isPending: isJoiningTrack } = useJoinTrack();
  const isCreatingTrack = useIsMutating({ mutationKey: ['create-track'] });
  const isLeavingTrack = useIsMutating({ mutationKey: ['leave-track'] });
  const isStartingRace = useIsMutating({ mutationKey: ['start-race'] });
  const pathname = usePathname();
  const isReplayStarted = useReplayStore((state) => state.isStarted);

  useEffect(() => {
    if (!input) {
      setTrackId(null);
      return;
    }
    const url = validateUrl(input);
    const trackId = url?.searchParams.get('track') || input;
    if (!trackId || !trackId.match(/^[a-z0-9]*$/) || trackId.length < 20) {
      setTrackId(null);
      return;
    }
    setTrackId(trackId);
  }, [input]);

  const joinTrack = useCallback(() => {
    if (isJoiningTrack) return;
    if (!trackId) {
      toast.dismiss();
      toast.error('Provide the track link or track id to join');
      return;
    }
    mutate(trackId, {
      onSuccess() {
        closeButtonRef.current?.click();
      },
      onError(err) {
        toast.dismiss();
        toast.error(err.message);
      }
    });
  }, [isJoiningTrack, mutate, trackId]);

  if (
    !profile ||
    isProfileError ||
    isReady ||
    isStarted ||
    isMultiplayer ||
    isCreatingTrack ||
    isLeavingTrack ||
    isJoiningTrack ||
    isStartingRace ||
    isReplayStarted ||
    pathname !== '/'
  )
    return null;

  return (
    <Dialog
      onOpenChange={() => {
        setInput('');
        setTrackId(null);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Join Track</DialogTitle>
        </DialogHeader>

        <section className="space-y-2">
          <p className="text-sm font-medium text-gray-500">
            Paste the track link or track id below
          </p>
          <div className="flex space-x-3">
            <div className="relative w-full">
              <input
                autoFocus
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`w-full rounded-md border-2 border-neutral-300 bg-transparent p-2 pl-3 pr-6 ${isJoiningTrack ? 'opacity-50' : ''}`}
                placeholder="Enter track id or link"
              />
              {input && (
                <button
                  onClick={() => setInput('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-200"
                >
                  <LuX className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.readText().then((text) => setInput(text));
              }}
              className="text-gray-400"
            >
              <LuClipboardList className="h-6 w-6" />
            </button>
          </div>
          <p
            className={`text-sm font-medium text-rose-500 ${!trackId && input ? '' : 'opacity-0'}`}
          >
            {!trackId && input ? 'Invalid url' : ''}
          </p>
        </section>

        <DialogFooter>
          <DialogClose disabled={isJoiningTrack} asChild>
            <button
              disabled={isJoiningTrack}
              ref={closeButtonRef}
              className={`relative flex h-10 items-center rounded-md bg-gray-900 px-6 font-semibold text-white transition hover:bg-gray-800 active:scale-90 disabled:opacity-50`}
            >
              Close
            </button>
          </DialogClose>

          <button
            onClick={joinTrack}
            disabled={isJoiningTrack}
            className={`relative flex h-10 items-center rounded-md bg-white/80 px-6 font-semibold text-black transition active:scale-90 disabled:opacity-50`}
          >
            <span className={`${isJoiningTrack ? 'opacity-0' : ''}`}>Join</span>
            {isJoiningTrack && (
              <span className="absolute inset-0 grid place-items-center">
                <LuLoader2 className="h-4 w-4 animate-spin" />
              </span>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
