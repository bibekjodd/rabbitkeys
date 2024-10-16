import { useDebounce } from '@/hooks/use-debounce';
import { invitePlayerKey, useInvitePlayer } from '@/mutations/use-invite-player';
import { kickPlayerKey, useKickPlayer } from '@/mutations/use-kick-player';
import { startRaceKey } from '@/mutations/use-start-race';
import { useActivePlayers } from '@/queries/use-active-players';
import { useProfile } from '@/queries/use-profile';
import { useTrack } from '@/queries/use-track';
import { useGameStore } from '@/store/use-game-store';
import { useReplayStore } from '@/store/use-replay-store';
import { useIsMutating } from '@tanstack/react-query';
import { ClipboardList, Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';

type Props = { children: React.ReactNode };
export default function InviteKickPlayerDialog({ children }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isReady = useGameStore((state) => state.isReady);
  const isStarted = useGameStore((state) => state.isStarted);
  const isMultiplayer = useGameStore((state) => state.isMultiplayer);
  const [searchQuery, setSearchQuery] = useState('');
  const searchEnabled = useDebounce(searchQuery, 250);
  const pathname = usePathname();
  const isReplayStarted = useReplayStore((state) => state.isStarted);
  const trackId = useGameStore((state) => state.trackId);
  const isStartingRace = useIsMutating({ mutationKey: startRaceKey });
  const { data: searchResults, isLoading } = useActivePlayers(
    searchQuery,
    searchEnabled && isDialogOpen
  );
  const { data: track } = useTrack();
  const { data: profile } = useProfile();
  const isCreator = track?.creator === profile?.id;

  const finalSearchResults = useMemo(() => {
    return (searchResults || []).filter((player) => {
      if (profile?.id === player.id) return false;
      return !track?.players.find((trackPlayer) => trackPlayer.id === player.id);
    });
  }, [searchResults, track?.players, profile?.id]);

  const joinedPlayers = useMemo(() => {
    return (track?.players || []).filter((player) => player.id !== profile?.id);
  }, [profile?.id, track?.players]);

  const copyLink = () => {
    navigator.clipboard.writeText(`${location.origin}/?track=${trackId}`);
    toast.dismiss();
    toast.success('Link copied. Share this link to join the track');
  };

  if (
    isStarted ||
    isReady ||
    !isMultiplayer ||
    isReplayStarted ||
    isStartingRace ||
    pathname !== '/'
  )
    return null;
  return (
    <Dialog
      onOpenChange={(value) => {
        setSearchQuery('');
        setIsDialogOpen(value);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-black/20 text-sm filter backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-center">Invite Players</DialogTitle>
        </DialogHeader>

        <input
          autoFocus
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 rounded border border-gray-400 bg-transparent p-2 text-neutral-100 focus:border-gray-200"
          placeholder="Search players..."
        />

        {!isLoading && searchEnabled && !searchResults?.length && !searchQuery && (
          <p>No players are online currently</p>
        )}
        {!isLoading && searchEnabled && !searchResults?.length && searchQuery && (
          <p className="line-clamp-1">No players online found for search: {searchQuery}</p>
        )}
        {!isLoading && !!searchResults?.length && (
          <h1 className="font-medium text-neutral-100">
            {searchQuery ? 'Search reults' : 'Players Online'}
          </h1>
        )}
        <div className="flex max-h-[300px] flex-col space-y-3 overflow-y-auto">
          {joinedPlayers.map((player) => (
            <Player
              key={player.id}
              isCreator={isCreator}
              player={{
                id: player.id,
                name: player.name,
                image: player.image
              }}
              isJoined={true}
            />
          ))}
          {finalSearchResults.map((player) => (
            <Player
              key={player.id}
              isCreator={isCreator}
              player={{
                id: player.id,
                name: player.name,
                image: player.image
              }}
              isJoined={false}
            />
          ))}
        </div>

        <DialogFooter className="pt-3 text-base">
          <button
            onClick={copyLink}
            className="flex h-10 flex-grow items-center justify-center space-x-2 rounded-md bg-gray-700/50 font-medium text-white transition active:scale-95"
          >
            <span>Copy track link</span>
            <ClipboardList className="h-4 w-4" />
          </button>
          <DialogClose asChild>
            <button
              id="close-invite-dialog"
              className="h-10 rounded-md bg-neutral-200 px-4 font-medium text-black"
            >
              Close
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Player({
  player,
  isCreator,
  isJoined
}: {
  isCreator: boolean;
  player: { id: string; name: string; image: string | null };
  isJoined: boolean;
}) {
  const trackId = useGameStore((state) => state.trackId);
  const isInvitingPlayer = !!useIsMutating({
    mutationKey: invitePlayerKey({ playerId: player.id, trackId: trackId! })
  });
  const isKickingPlayer = !!useIsMutating({
    mutationKey: kickPlayerKey({ playerId: player.id, trackId: trackId! })
  });
  const { mutate: invitePlayer } = useInvitePlayer({ playerId: player.id, trackId: trackId! });
  const { mutate: kickPlayer } = useKickPlayer({ trackId: trackId!, playerId: player.id });

  const handleOnInvite = () => {
    invitePlayer(undefined, {
      onError(err) {
        toast.dismiss();
        toast.error(`Player invitation failed! ${err.message}`);
      },
      onSuccess() {
        toast.dismiss();
        toast.success(`Invitation sent to ${player.name}`);
      }
    });
  };

  const handleOnKick = () => {
    if (!isCreator) return;
    kickPlayer();
  };

  return (
    <div className="flex items-center">
      <div className="flex flex-grow items-center space-x-2">
        <img src={player.image || ''} alt="player image" className="h-8 w-8 rounded-full" />
        <span className="text-sm font-medium text-neutral-100">{player.name}</span>
      </div>

      {!isJoined && (
        <button
          disabled={isInvitingPlayer}
          onClick={handleOnInvite}
          className="relative h-8 rounded-md bg-sky-600 px-3 text-sm disabled:opacity-50"
        >
          <span className={`${isInvitingPlayer ? 'opacity-0' : ''} text-neutral-100`}>Invite</span>
          {isInvitingPlayer && (
            <span className="absolute inset-0 grid place-items-center">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            </span>
          )}
        </button>
      )}

      {isJoined && (
        <button
          onClick={handleOnKick}
          disabled={isCreator ? isKickingPlayer : isJoined}
          className={`relative h-8 rounded-md px-3 text-sm disabled:opacity-50 ${isCreator ? 'bg-rose-600' : 'bg-sky-600'} `}
        >
          <span className={`${isKickingPlayer ? 'opacity-0' : ''}`}>
            {isCreator ? 'Kick' : 'Joined'}
          </span>
          {isKickingPlayer && (
            <span className="absolute inset-0 grid place-items-center">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            </span>
          )}
        </button>
      )}
    </div>
  );
}
