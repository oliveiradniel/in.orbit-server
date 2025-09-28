import { NotFoundException } from '@nestjs/common';

import { describe, expect, it } from 'vitest';

import { type UnitDescribeUserNotInUsersExistsParams } from 'src/shared/interfaces/helpers/describe-user-not-exists-params.interface';

export function describeUserNotExistsInUsers({
  request,
  classMethod,
  repositorySpy,
  repositoryMethod,
  userId,
}: UnitDescribeUserNotInUsersExistsParams): void {
  describe(`User not found - ${classMethod}`, () => {
    it('should to throw an error when the user does not exist', async () => {
      repositoryMethod.null();

      await expect(request()).rejects.toThrow(NotFoundException);

      expect(repositorySpy).toHaveBeenCalledWith(userId());
    });
  });
}
