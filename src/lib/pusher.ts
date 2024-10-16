import Pusher from 'pusher-js';

const createPusherClient = (): Pusher => {
  if (!globalThis.__PUSHER_CLIENT__)
    globalThis.__PUSHER_CLIENT__ = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    });
  return globalThis.__PUSHER_CLIENT__;
};

export const pusher = createPusherClient();
