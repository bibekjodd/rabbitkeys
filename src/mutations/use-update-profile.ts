import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { profileKey } from '@/queries/use-profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const updateProfileKey = ['update-profile'];

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: updateProfileKey,
    mutationFn: updateProfile,

    onMutate(data) {
      const profile = queryClient.getQueryData<User>(profileKey);
      if (!profile) return null;
      const newProfile: User = {
        ...profile,
        name: data.name || profile.name,
        image: data.image || profile.image,
        carImage: data.carImage || profile.carImage
      };
      queryClient.setQueryData<User>(profileKey, newProfile);
      return profile;
    },

    onSuccess(user) {
      queryClient.setQueryData<User>(profileKey, user);
    },

    onError(err, variables, oldProfileData) {
      if (oldProfileData) {
        queryClient.setQueryData<User>(profileKey, oldProfileData);
      }
      toast.dismiss();
      toast.error(`Could not update profile! ${err.message}`);
    }
  });
};

type UpdateOptions = Partial<{ name: string; image: string; carImage: string }>;
const updateProfile = async (data: UpdateOptions): Promise<User> => {
  try {
    const res = await axios.put<{ user: User }>(`${backendUrl}/api/users/profile`, data, {
      withCredentials: true
    });
    return res.data.user;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
