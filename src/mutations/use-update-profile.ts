import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-profile'],
    mutationFn: updateProfile,

    onMutate(data) {
      const profile = queryClient.getQueryData<User>(['profile']);
      if (!profile) return null;
      const newProfile: User = {
        ...profile,
        name: data.name || profile.name,
        image: data.image || profile.image,
        carImage: data.carImage || profile.carImage
      };
      queryClient.setQueryData<User>(['profile'], newProfile);
      return profile;
    },

    onSuccess(user) {
      queryClient.setQueryData<User>(['profile'], user);
    },

    onError(err, variables, oldProfileData) {
      if (oldProfileData) {
        queryClient.setQueryData<User>(['profile'], oldProfileData);
      }
      toast.dismiss();
      toast.error(`Could not update profile! ${err.message}`);
    }
  });
};

type UpdateOptions = Partial<{ name: string; image: string; carImage: string }>;
const updateProfile = async (data: UpdateOptions): Promise<User> => {
  try {
    const res = await axios.put<{ user: User }>(`${backend_url}/api/users/profile`, data, {
      withCredentials: true
    });
    return res.data.user;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
