import { NotFoundException } from '@nestjs/common';

import { describe, expect, it } from 'vitest';

import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';
import { GoalsMockFactory } from 'src/shared/__factories__/goals-mock.factory';

import { type UnitDescribeGoalNotExistsParams } from '../../interfaces/unit-describe-goal-not-exists-params.interface';

export function unitDescribeGoalNotExists({
  request,
  classMethod,
  mockNotCalled,
}: UnitDescribeGoalNotExistsParams): void {
  describe(`Goal not found - ${classMethod}`, () => {
    it('should to throw NotFound an error when the goal does not exists', async () => {
      UsersMockFactory.responses.service.findUserById.success();
      GoalsMockFactory.responses.repository.getGoalById.null();

      await expect(request()).rejects.toThrow(NotFoundException);

      expect(UsersMockFactory.service.findUserById).toHaveBeenCalled();
      expect(GoalsMockFactory.repository.getGoalById).toHaveBeenCalled();
      expect(mockNotCalled).not.toHaveBeenCalled();
    });
  });
}
