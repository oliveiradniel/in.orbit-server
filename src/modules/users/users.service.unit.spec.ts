import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { UsersService } from './users.service';
import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';
import { USERS_REPOSITORY } from 'src/shared/constants/tokens';

describe('UsersService', () => {
  let usersService: UsersService;

  let mockUserId: string;
  let mockUser: ReturnType<typeof UsersMockFactory.create.user>;

  beforeEach(async () => {
    mockUserId = UsersMockFactory.create.id();
    mockUser = UsersMockFactory.create.user();

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USERS_REPOSITORY,
          useValue: UsersMockFactory.repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('findUserById', () => {
    it('should be able to get a user', async () => {
      UsersMockFactory.responses.repository.getUserById.success();

      const user = await usersService.findUserById(mockUserId);

      expect(UsersMockFactory.repository.getUserById).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(user).toEqual(mockUser);
    });

    it('should be able to throw an error when the user does not exist', async () => {
      UsersMockFactory.responses.repository.getUserById.null();

      await expect(usersService.findUserById(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(UsersMockFactory.repository.getUserById).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });
});
