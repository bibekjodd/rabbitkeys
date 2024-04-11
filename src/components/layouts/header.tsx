'use client';
import { backend_url } from '@/lib/constants';
import { robotoMono, rubikGlitch } from '@/lib/fonts';
import { useProfile } from '@/queries/useProfile';
import { useGameStore } from '@/store/useGameStore';
import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuLogIn } from 'react-icons/lu';
import InviteKickPlayerDialog from '../dialogs/invite-kick-player-dialog';
import { JoinTrackDialog } from '../dialogs/join-track-dialog';
import ProfileDialog from '../dialogs/profile-dialog';
import CreateTrackButton from '../utils/create-track-button';
import LeaderboardButton from '../utils/leaderboard-button';
import LeaveTrackButton from '../utils/leave-track-button';
import StartButton from '../utils/start-button';
import StopReplayButton from '../utils/stop-replay-button';

export default function Header() {
  const pathname = usePathname();
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const isReady = useGameStore((state) => state.isReady);
  const isStarted = useGameStore((state) => state.isStarted);

  return (
    <div className="flex h-20 items-center px-3.5 text-sm sm:px-5 md:h-24 md:px-5 lg:text-base">
      <header className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
        <h1>
          <span
            className={`${rubikGlitch.className} bg-gradient-to-r 
            from-rose-600 via-pink-500 to-sky-500 
            bg-clip-text text-3xl text-transparent lg:text-4xl`}
          >
            {pathname === '/' && 'Rabbit_keys'}
            {pathname !== '/' && <Link href="/">Rabbit_keys</Link>}
          </span>
        </h1>

        <nav className={`${robotoMono.className} flex items-center space-x-3`}>
          <StartButton className="flex h-10 items-center rounded-md border-2 border-transparent bg-black/30 px-5 font-medium text-neutral-300 transition hover:border-neutral-300 hover:text-neutral-200 focus:border-neutral-300 focus:outline-none active:scale-90 lg:h-11 lg:px-6 lg:text-base">
            Start
          </StartButton>

          <JoinTrackDialog>
            <button className="flex h-10 items-center rounded-md border-2 border-transparent bg-black/30 px-5 font-medium text-neutral-300 transition hover:border-neutral-300 hover:text-neutral-200 focus:border-neutral-300 focus:outline-none active:scale-90 lg:h-11 lg:px-6 lg:text-base">
              <span>Join</span>
              <span className="hidden lg:inline">Track</span>
            </button>
          </JoinTrackDialog>
          <CreateTrackButton className="flex h-10 items-center rounded-md border-2 border-transparent bg-black/30 px-5 font-medium text-neutral-300 transition hover:border-neutral-300 hover:text-neutral-200 focus:border-neutral-300 focus:outline-none active:scale-90 lg:h-11 lg:px-6 lg:text-base">
            <span>Host</span>
            <span className="hidden lg:inline">Race</span>
          </CreateTrackButton>

          <InviteKickPlayerDialog>
            <button className="flex h-10 items-center rounded-md border-2 border-transparent bg-black/30 px-5 font-medium text-neutral-300 transition hover:border-neutral-300 hover:text-neutral-200 focus:border-neutral-300 focus:outline-none active:scale-90 lg:h-11 lg:px-6 lg:text-base">
              Invite Players
            </button>
          </InviteKickPlayerDialog>

          <LeaveTrackButton className="flex h-10 items-center rounded-md border-2 border-transparent bg-black/30 px-5 font-medium text-neutral-300 transition hover:border-neutral-300 hover:text-neutral-200 focus:border-neutral-300 focus:outline-none active:scale-90 lg:h-11 lg:px-6 lg:text-base">
            <span>Leave </span> <span className="hidden lg:inline">Track</span>
          </LeaveTrackButton>

          {pathname !== '/' && (
            <Link
              className="flex h-10 items-center space-x-2 rounded-md border-2 border-transparent bg-black/50 px-5 font-medium text-neutral-300 transition hover:border-neutral-300 hover:text-neutral-200 focus:border-neutral-300 focus:outline-none active:scale-90 lg:h-11 lg:px-6 lg:text-base"
              href="/"
            >
              Race Track
            </Link>
          )}
          <LeaderboardButton>
            <Link
              className="flex h-10 items-center space-x-2 rounded-md border-2 border-transparent bg-black/50 px-5 font-medium text-neutral-300 transition hover:border-neutral-300 hover:text-neutral-200 focus:border-neutral-300 focus:outline-none active:scale-90 lg:h-11 lg:px-6 lg:text-base"
              href="/leaderboard"
            >
              Leaderboard
            </Link>
          </LeaderboardButton>

          <StopReplayButton className="flex h-10 items-center space-x-2 rounded-md border-2 border-transparent bg-black/50 px-5 font-medium text-neutral-300 transition hover:border-neutral-300 hover:text-neutral-200 focus:border-neutral-300 focus:outline-none active:scale-90 lg:h-11 lg:px-6 lg:text-base">
            Stop Replay
          </StopReplayButton>

          <span className="ml-5" />

          {!profile && !isLoadingProfile && !isReady && !isStarted && (
            <button
              onClick={() => window.open(`${backend_url}/api/login/google`, '_self')}
              className="flex h-10 items-center space-x-2 rounded-md border-2 border-transparent bg-black/50 px-5 font-medium text-neutral-300 transition hover:border-neutral-300 hover:text-neutral-200 focus:border-neutral-300 focus:outline-none active:scale-90 lg:h-11 lg:px-6 lg:text-base"
            >
              <span>Login</span>
              <LuLogIn className="h-5 w-5" />
            </button>
          )}

          {profile && !isReady && !isStarted && (
            <ProfileDialog profile={profile}>
              <button>
                {profile?.image && (
                  <img src={profile.image} className="h-8 w-8 rounded-full object-contain" alt="" />
                )}
                {!profile?.image && <User className="h-6 w-6" />}
              </button>
            </ProfileDialog>
          )}
        </nav>
      </header>
    </div>
  );
}
