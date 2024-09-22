'use client';
import { Keyboard, MoveLeft, MoveRight, Space } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';

export default function KeyboardShortcutDialog() {
  const [showButton, setShowButton] = useState(true);

  const onScroll = () => {
    const showButton = window.scrollY < 10;
    console.log(window.scrollY);
    console.log({ showButton });
    setShowButton(showButton);
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  console.log({ showButton });
  if (!showButton) return <></>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={`fixed bottom-10 right-10 z-30 rounded-full bg-black/20 p-4 transition active:scale-90 ${showButton ? 'hidden lg:block' : 'hidden'}`}
        >
          <Keyboard className="h-6 w-6 text-neutral-300 hover:text-neutral-200" />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-gray-200">Keyboard shortcuts</DialogTitle>
        </DialogHeader>

        <section className="text-gray-300">
          <div className="flex items-center space-x-3">
            <MoveLeft className="h-5 w-5" />
            <span className="text-gray-400">Skip backward by one word</span>
          </div>
          <div className="flex items-center space-x-3">
            <Space className="h-5 w-5" />
            <span className="text-gray-400">Play/pause replay</span>
          </div>
          <div className="flex items-center space-x-3">
            <MoveRight className="h-5 w-5" />
            <span className="text-gray-400">Skip forward by one word</span>
          </div>
        </section>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="font-medium">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
