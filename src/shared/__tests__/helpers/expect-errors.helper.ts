import { expect } from 'vitest';

import { type SupertestResponse } from 'src/shared/interfaces/supertest-response.interface';

function expectUnauthorized(response: SupertestResponse): void {
  expect(response.statusCode).toBe(401);
  expect(response.body).toEqual({
    message: 'Unauthorized',
    statusCode: 401,
  });
}

function expectUserNotFound(response: SupertestResponse): void {
  expect(response.statusCode).toBe(404);
  expect(response.body).toEqual({
    message: 'User not found.',
    error: 'Not Found',
    statusCode: 404,
  });
}

export { expectUnauthorized, expectUserNotFound };
