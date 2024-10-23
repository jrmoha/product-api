import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.schema';

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}

export {};
