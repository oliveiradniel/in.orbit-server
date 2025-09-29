import { describe, expect, it } from 'vitest';

import { type IntDescribeGoalNotExistsParams } from '../../interfaces/int-describe-goal-not-exists-params.interface';

export function intDescribeGoalNotExists({
  request,
  httpMethod,
  route,
}: IntDescribeGoalNotExistsParams): void {
  describe(`Goal not found - ${httpMethod} - ${route}`, () => {
    it('should to throw NotFound error when goal does not exists', async () => {
      const response = await request();

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        message: 'Goal not found.',
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });
}
