import { expect } from 'vitest';

export interface SupertestResponse {
  statusCode: number;
  body: any;
  text: string;
}

function expectUnauthorized(response: SupertestResponse) {
  expect(response.statusCode).toBe(401);
  expect(response.body).toEqual({
    message: 'Unauthorized',
    statusCode: 401,
  });
}

function expectUserNotFound(response: SupertestResponse) {
  expect(response.statusCode).toBe(404);
  expect(response.body).toEqual({
    message: 'User not found.',
    error: 'Not Found',
    statusCode: 404,
  });
}

export { expectUnauthorized, expectUserNotFound };
