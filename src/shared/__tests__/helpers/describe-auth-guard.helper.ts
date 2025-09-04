import { describe, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { expectUnauthorized } from './expect-errors.helper';

interface DescribeAuthGuardParams {
  getServer: () => Server;
  route: string;
  method?: 'get' | 'post' | 'put' | 'delete';
}

export function describeAuthGuard({
  getServer,
  route,
  method = 'get',
}: DescribeAuthGuardParams) {
  describe('AuthGuard', () => {
    it(`should throw Unauthorized when token is missing`, async () => {
      const response = await request(getServer())
        [method](route)
        .set('Authorization', 'Bearer');

      expectUnauthorized(response);
    });

    it(`should throw Unauthorized when is token is signed with a different secret`, async () => {
      const response = await request(getServer())
        [method](route)
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
        );

      expectUnauthorized(response);
    });
  });
}
