import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from 'src/shared/contracts/users-repository.contract';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockUsersRepository: Pick<UsersRepository, 'getUserById'>;

  let mockGetUserById: ReturnType<typeof vi.fn>;

  let userId: string;
  let mockUser: User;

  beforeEach(async () => {
    userId = 'john-doe';
    mockUser = {
      id: userId,
      avatarURL: 'https://avatars.githubusercontent.com/u/189175871?v=4',
      externalAccountId: 1232143123,
    };

    mockUsersRepository = {
      getUserById: vi.fn(),
    };

    mockGetUserById = mockUsersRepository.getUserById as ReturnType<
      typeof vi.fn
    >;

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USERS_REPOSITORY,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);

    vi.clearAllMocks();
  });

  it('should be able to get a user', async () => {
    mockGetUserById.mockResolvedValue(mockUser);

    const user = await usersService.findUserById(userId);

    expect(mockGetUserById).toHaveBeenCalledWith(userId);
    expect(user).toEqual(mockUser);
  });

  it('should be able to throw an error when the user does not exist', async () => {
    mockGetUserById.mockResolvedValue(null);

    const user = usersService.findUserById(userId);

    expect(mockGetUserById).toHaveBeenCalledWith(userId);
    await expect(user).rejects.toThrow(NotFoundException);
  });
});
