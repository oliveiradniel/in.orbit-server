import { JwtService } from '@nestjs/jwt';

import { describe, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { expectUnauthorized, expectUserNotFound } from './expect-errors.helper';

interface DescribeAuthGuardParams {
  getServer: () => Server;
  route: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  getJWTService: () => JwtService;
}

export function describeAuthGuard({
  getServer,
  route,
  method = 'get',
  getJWTService,
}: DescribeAuthGuardParams) {
  describe('AuthGuard', () => {
    it(`should be able to throw Unauthorized when token is missing`, async () => {
      const response = await request(getServer())
        [method](route)
        .set('Authorization', 'Bearer');

      expectUnauthorized(response);
    });

    it(`should be able to throw Unauthorized when is token is signed with a different secret`, async () => {
      const response = await request(getServer())
        [method](route)
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
        );

      expectUnauthorized(response);
    });

    it(`shoud ble able to throw NotFound when user not exists`, async () => {
      const payload = { sub: crypto.randomUUID() };
      const accessTokenWithInvalidUserId =
        await getJWTService().signAsync(payload);

      const response = await request(getServer())
        [method](route)
        .set('Authorization', `Bearer ${accessTokenWithInvalidUserId}`);

      expectUserNotFound(response);
    });
  });
}
