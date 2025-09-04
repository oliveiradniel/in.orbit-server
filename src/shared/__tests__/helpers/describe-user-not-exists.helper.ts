import { JwtService } from '@nestjs/jwt';

import { describe, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { expectUserNotFound } from './expect-errors.helper';

interface DescribeUserNotExistsParams {
  getServer: () => Server;
  getJWTService: () => JwtService;
  route: string;
  method?: 'get' | 'post' | 'put' | 'delete';
}

export function describeUserNotExists({
  getServer,
  getJWTService,
  route,
  method = 'get',
}: DescribeUserNotExistsParams) {
  describe('User not found', () => {
    it('should to throw NotFound error', async () => {
      const payload = { sub: crypto.randomUUID() };
      const token = await getJWTService().signAsync(payload);

      const response = await request(getServer())
        [method](route)
        .set('Authorization', `Bearer ${token}`);

      expectUserNotFound(response);
    });
  });
}
