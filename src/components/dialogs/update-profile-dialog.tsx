import { carImages } from '@/lib/constants';
import { inter } from '@/lib/fonts';
import { useUpdateProfile } from '@/mutations/use-update-profile';
import { DialogClose } from '@radix-ui/react-dialog';
import { ChevronRight } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function UpdateProfileDialog({
  profile,
  children
}: {
  profile: User;
  children: React.ReactNode;
}) {
  const [name, setName] = useState(profile.name);
  const [carImage, setCarImage] = useState(profile.carImage);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const { mutate } = useUpdateProfile();

  const updateProfile = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    mutate({ name, carImage: carImage });
    closeButtonRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[100%-40px] overflow-y-auto bg-neutral-950/70 filter backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Update Profile</DialogTitle>
        </DialogHeader>
        {profile.image && (
          <img
            className="absolute left-4 top-4 h-8 w-8 rounded-full object-cover"
            src={profile.image}
            alt=""
          />
        )}

        <form onSubmit={updateProfile} className="space-y-5 py-3">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex items-center space-x-5">
            <Label className="select-vehicle">
              <span className="cursor-pointer hover:underline">Select vehicle </span>
              <ChevronRight className="ml-1 inline h-4 w-4 cursor-pointer" />
            </Label>
            <input type="file" hidden className="hidden" id="select-vehicle" />
            {carImage && <img src={carImage} className="w-16" alt="" />}
          </div>

          <div className="grid grid-cols-4 items-center">
            {carImages.map((image) => (
              <button key={image} type="button" onClick={() => setCarImage(image)}>
                <img src={image} className="m-3 w-16" alt="" />
              </button>
            ))}
          </div>
        </form>

        <DialogFooter className={`${inter.className}`}>
          <DialogClose ref={closeButtonRef} asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={updateProfile}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
