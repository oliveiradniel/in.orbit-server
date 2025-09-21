import 'express';

declare module 'express' {
  interface Request {
    cookies: {
      token?: string;
    };
  }
}
