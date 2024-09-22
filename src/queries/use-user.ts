import { backend_url } from '@/lib/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useUser = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialData() {
      const user = queryClient.getQueryData<User>(['profile']);
      if (user?.id === id) return user;
      return undefined;
    }
  });
};

const fetchUser = async (id: string): Promise<User | null> => {
  try {
    const { data } = await axios.get(`${backend_url}/api/users/${id}`, {
      withCredentials: true
    });
    return data.player || null;
  } catch (error) {
    return null;
  }
};
