import { NotFoundException } from '@nestjs/common';

import { describe, expect, it } from 'vitest';

import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';
import { GoalsMockFactory } from 'src/shared/__factories__/goals-mock.factory';

import { type UnitDescribeUserNotInGoalsExistsParams } from 'src/shared/interfaces/helpers/describe-user-not-exists-params.interface';

export function describeUserNotExistsInGoals({
  request,
  classMethod,
}: UnitDescribeUserNotInGoalsExistsParams): void {
  describe(`User not found - ${classMethod}`, () => {
    it('should to throw an error when the user does not exist', async () => {
      UsersMockFactory.responses.service.findUserById.failure();

      expect(UsersMockFactory.repository.getUserById).not.toHaveBeenCalled();
      expect(GoalsMockFactory.repository.create).not.toHaveBeenCalled();
      await expect(request()).rejects.toThrow(NotFoundException);
    });
  });
}
