import { UserRole } from '../user/user.schema';

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    _id: string;
    email: string;
    role: UserRole;
  }
}
