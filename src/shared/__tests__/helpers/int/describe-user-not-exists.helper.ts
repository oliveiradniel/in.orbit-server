import { describe, it } from 'vitest';
import request from 'supertest';

import { expectUserNotFound } from './expect-errors.helper';

import { type DescribeUserNotExistsParams } from 'src/shared/interfaces/helpers/describe-user-not-exists-params.interface';
import { type SupertestResponse } from 'src/shared/interfaces/supertest-response.interface';

export function describeUserNotExists({
  getServer,
  getJWTService,
  route,
  method = 'get',
  getData,
}: DescribeUserNotExistsParams): void {
  describe('User not found', () => {
    it('should to throw NotFound error', async () => {
      const payload = { sub: crypto.randomUUID() };
      const token = await getJWTService().signAsync(payload);

      let response: SupertestResponse;

      if (method === 'get' || method === 'delete') {
        response = await request(getServer())
          [method](route)
          .set('Authorization', `Bearer ${token}`);
      } else if (getData) {
        response = await request(getServer())
          [method](route)
          .send(getData())
          .set('Authorization', `Bearer ${token}`);
      }

      expectUserNotFound(response!);
    });
  });
}
