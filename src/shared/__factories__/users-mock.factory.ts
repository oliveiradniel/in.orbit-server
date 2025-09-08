import { NotFoundException } from '@nestjs/common';

import { User } from 'src/modules/users/entities/user.entity';

import { vi } from 'vitest';
import { FakerFactory } from './faker.factory';

export class UsersMockFactory {
  static repository = {
    getUserById: vi.fn(),
    getUserByExternalAccountId: vi.fn(),
    create: vi.fn(),
  };

  static service = {
    findUserById: vi.fn(),
  };

  static create = {
    id: (id = FakerFactory.data.uuid()): string => id,

    user: (override: Partial<User> = {}): User => {
      return {
        id: UsersMockFactory.create.id(),
        name: FakerFactory.user.name(),
        email: FakerFactory.user.email(),
        avatarURL: FakerFactory.github.avatarURL(),
        externalAccountId: FakerFactory.github.id(),
        ...override,
      };
    },
  };

  static responses = {
    repository: {
      getUserById: {
        success: (override: Partial<User> = {}) =>
          UsersMockFactory.repository.getUserById.mockResolvedValue(
            UsersMockFactory.create.user(override),
          ),
        null: () =>
          UsersMockFactory.repository.getUserById.mockResolvedValue(null),
      },

      getUserByExternalAccountId: {
        success: (override: Partial<User> = {}) =>
          UsersMockFactory.repository.getUserByExternalAccountId.mockResolvedValue(
            UsersMockFactory.create.user(override),
          ),
        null: () => {
          UsersMockFactory.repository.getUserByExternalAccountId.mockResolvedValue(
            null,
          );
        },
      },

      create: {
        success: (override: Partial<User> = {}) =>
          UsersMockFactory.repository.create.mockResolvedValue(
            UsersMockFactory.create.user(override),
          ),
      },
    },

    service: {
      findUserById: {
        success: () => {
          UsersMockFactory.responses.repository.getUserById.success();
          UsersMockFactory.service.findUserById.mockResolvedValue(
            UsersMockFactory.create.user(),
          );
        },
        failure: () => {
          UsersMockFactory.responses.repository.getUserById.null();
          UsersMockFactory.service.findUserById.mockRejectedValue(
            new NotFoundException(),
          );
        },
      },
    },
  };
}
