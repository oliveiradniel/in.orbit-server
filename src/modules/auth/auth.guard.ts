import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

import { getConfig } from 'src/shared/config/config.helper';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/is-public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { JWT_SECRET } = getConfig(this.configService);

      const payload = await this.jwtService.verifyAsync<{ sub: string }>(
        token,
        { secret: JWT_SECRET },
      );

      request['userId'] = payload.sub;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(
    request: Request & { cookies: { token?: string } },
  ): string | undefined {
    const cookieToken = request.cookies?.token;
    const headerToken = request.headers['authorization']?.split(' ')[1];

    return cookieToken || headerToken;
  }
}
