'use client';
import { useLogout } from '@/mutations/use-logout';
import React, { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog';

type Props = { children: React.ReactNode };
export default function LogoutDialog({ children }: Props) {
  const { mutate } = useLogout();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const logout = () => {
    mutate();
    closeButtonRef.current?.click();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Logout</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription>
          Are you sure you want to logout? You need to be logged in to save results and play
          multiplayer mode.
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel ref={closeButtonRef}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={logout}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
