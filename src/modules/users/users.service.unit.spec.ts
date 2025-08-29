import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { UsersService } from './users.service';
import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';
import { USERS_REPOSITORY } from 'src/shared/contracts/users-repository.contract';

describe('UsersService', () => {
  let usersService: UsersService;

  let mockUserId: string;
  let mockUser: ReturnType<typeof UsersMockFactory.createUser>;

  beforeEach(async () => {
    mockUserId = UsersMockFactory.createUserId();
    mockUser = UsersMockFactory.createUser();

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

  it('should be able to get a user', async () => {
    UsersMockFactory.repositoryResponses().getUserByIdSuccess();

    const user = await usersService.findUserById(mockUserId);

    expect(UsersMockFactory.repository.getUserById).toHaveBeenCalledWith(
      mockUserId,
    );
    expect(user).toEqual(mockUser);
  });

  it('should be able to throw an error when the user does not exist', async () => {
    UsersMockFactory.repositoryResponses().getUserByIdNull();

    await expect(usersService.findUserById(mockUserId)).rejects.toThrow(
      NotFoundException,
    );
    expect(UsersMockFactory.repository.getUserById).toHaveBeenCalledWith(
      mockUserId,
    );
  });
});
