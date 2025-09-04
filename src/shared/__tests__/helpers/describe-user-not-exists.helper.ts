import { JwtService } from '@nestjs/jwt';

import { describe, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { expectUserNotFound, SupertestResponse } from './expect-errors.helper';

interface DescribeUserNotExistsParams {
  getServer: () => Server;
  getJWTService: () => JwtService;
  route: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  getData?: () => Record<string, string | number>;
}

export function describeUserNotExists({
  getServer,
  getJWTService,
  route,
  method = 'get',
  getData,
}: DescribeUserNotExistsParams) {
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
