import { Test } from '@nestjs/testing';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { UsersService } from '../users.service';
import { UsersMockFactory } from 'src/shared/__factories__/users-mock.factory';

import { describeUserNotExistsInUsers } from 'src/shared/__tests__/helpers/unit/describe-user-not-exists-in-users.helper';

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

    describeUserNotExistsInUsers({
      request: () => usersService.findUserById(mockUserId),
      classMethod: 'findUserById',
      repositorySpy: UsersMockFactory.repository.getUserById,
      repositoryMethod: UsersMockFactory.responses.repository.getUserById,
      userId: () => mockUserId,
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

    describeUserNotExistsInUsers({
      request: () => usersService.findUserLevelAndExperience(mockUserId),
      classMethod: 'findUserLevelAndExperience',
      repositorySpy: UsersMockFactory.repository.getUserExperience,
      repositoryMethod: UsersMockFactory.responses.repository.getUserExperience,
      userId: () => mockUserId,
    });
  });

  describe('deleteActiveUser', () => {
    it('should delete the active user', async () => {
      UsersMockFactory.responses.repository.delete.success();
      UsersMockFactory.responses.repository.getUserById.success();

      await usersService.deleteActiveUser(mockUserId);

      expect(UsersMockFactory.repository.delete).toHaveBeenCalled();
    });

    describeUserNotExistsInUsers({
      request: () => usersService.deleteActiveUser(mockUserId),
      classMethod: 'delete',
      repositorySpy: UsersMockFactory.repository.getUserById,
      repositoryMethod: UsersMockFactory.responses.repository.getUserById,
      userId: () => mockUserId,
    });
  });
});
