import { JwtPayload } from 'jsonwebtoken';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer')
      throw new UnauthorizedException('Invalid token type');
    if (!token) throw new UnauthorizedException('Token not found');

    try {
      const payload = (await this.jwtService.verifyAsync(token)) as JwtPayload;
      request.user = payload;
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
