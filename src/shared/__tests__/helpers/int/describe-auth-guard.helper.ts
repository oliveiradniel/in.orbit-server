import { describe, it } from 'vitest';
import request from 'supertest';

import { expectUnauthorized } from './expect-errors.helper';

import { type DescribeAuthGuardParams } from 'src/shared/interfaces/helpers/describe-auth-guard-params.inteface';

export function describeAuthGuard({
  getServer,
  route,
  httpMethod = 'get',
}: DescribeAuthGuardParams): void {
  describe('AuthGuard', () => {
    it(`should throw Unauthorized when token is missing`, async () => {
      const response = await request(getServer())
        [httpMethod](route)
        .set('Authorization', 'Bearer');

      expectUnauthorized(response);
    });

    it(`should throw Unauthorized when is token is signed with a different secret`, async () => {
      const response = await request(getServer())
        [httpMethod](route)
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
        );

      expectUnauthorized(response);
    });
  });
}
