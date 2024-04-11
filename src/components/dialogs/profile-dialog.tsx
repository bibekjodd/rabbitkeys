import { inter, robotoMono } from '@/lib/fonts';
import { DialogClose } from '@radix-ui/react-dialog';
import React from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import ResultsDialog from './results-dialog';
import UpdateProfileDialog from './update-profile-dialog';

export default function ProfileDialog({
  profile,
  children
}: {
  profile: User;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="filter backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Profile</DialogTitle>
        </DialogHeader>
        {profile.image && (
          <img
            className="absolute left-4 top-4 h-8 w-8 rounded-full object-cover"
            src={profile.image}
          />
        )}

        <section className="flex items-center space-x-10 py-3 text-gray-100">
          <img src={profile.carImage || ''} className="w-40" />
          <div className="flex flex-col">
            <h4 className="line-clamp-1">{profile.name}</h4>
            <div>
              <span className="text-gray-300">Average Speed:</span>{' '}
              <span className={`font-semibold text-sky-500 ${robotoMono.className}`}>
                {Math.round(profile.speed)} wpm
              </span>
            </div>
            <div>
              <span className="text-gray-300">Top Speed:</span>{' '}
              <span className={`font-semibold text-purple-500 ${robotoMono.className}`}>
                {Math.round(profile.topSpeed)} wpm
              </span>
            </div>
          </div>
        </section>

        <DialogFooter className={`${inter.className}`}>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <ResultsDialog>
            <Button variant="outline">See Results</Button>
          </ResultsDialog>
          <UpdateProfileDialog profile={profile}>
            <Button>Update Profile</Button>
          </UpdateProfileDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
