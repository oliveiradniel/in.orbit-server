import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { UsersService } from '../users.service';
import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';

import { USERS_REPOSITORY } from 'src/shared/constants/tokens';

describe('UsersService', () => {
  let usersService: UsersService;

  let mockUser: ReturnType<typeof UsersMockFactory.create.user>;
  let mockUserId: ReturnType<typeof UsersMockFactory.create.id>;

  beforeEach(async () => {
    mockUser = UsersMockFactory.create.user();
    mockUserId = mockUser.id!;

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
    it('should to get a user and return it', async () => {
      UsersMockFactory.responses.repository.getUserById.success(mockUser);

      const user = await usersService.findUserById(mockUserId);

      expect(UsersMockFactory.repository.getUserById).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(user).toEqual(mockUser);
    });

    it('should to throw an error when the user does not exist', async () => {
      UsersMockFactory.responses.repository.getUserById.null();

      await expect(usersService.findUserById(mockUserId)).rejects.toThrow(
        NotFoundException,
      );

      expect(UsersMockFactory.repository.getUserById).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });

  describe('findUserLevelAndExperience', () => {
    it('should to get level and XP from a user at level 1', async () => {
      const userExperiencePoints = 14;

      UsersMockFactory.responses.repository.getUserExperience.sucess(
        userExperiencePoints,
      );

      const user = await usersService.findUserLevelAndExperience(mockUserId);

      expect(
        UsersMockFactory.repository.getUserExperience,
      ).toHaveBeenCalledWith(mockUserId);

      expect(user).toMatchObject({
        experiencePoints: 14,
        level: 1,
        experienceToNextLevel: 26,
      });
    });

    it('should to get level and XP from a user at level 4', async () => {
      const userExperiencePoints = 71;

      UsersMockFactory.responses.repository.getUserExperience.sucess(
        userExperiencePoints,
      );

      const user = await usersService.findUserLevelAndExperience(mockUserId);

      expect(
        UsersMockFactory.repository.getUserExperience,
      ).toHaveBeenCalledWith(mockUserId);

      expect(user).toMatchObject({
        experiencePoints: 71,
        level: 3,
        experienceToNextLevel: 102,
      });
    });

    it('should to throw an error when the user does not exist', async () => {
      UsersMockFactory.responses.repository.getUserExperience.null();

      await expect(
        usersService.findUserLevelAndExperience(mockUserId),
      ).rejects.toThrow(NotFoundException);

      expect(
        UsersMockFactory.repository.getUserExperience,
      ).toHaveBeenCalledWith(mockUserId);
    });
  });
});
