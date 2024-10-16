import Pusher from 'pusher-js';

export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_PUSHER_KEY: string;
      readonly NEXT_PUBLIC_PUSHER_CLUSTER: string;
      readonly NEXT_PUBLIC_BACKEND_URL: string;
    }
  }

  var __PUSHER_CLIENT__: Pusher | undefined;
}
