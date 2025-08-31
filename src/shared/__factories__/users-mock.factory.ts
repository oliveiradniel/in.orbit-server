import { NotFoundException } from '@nestjs/common';

import { User } from 'src/modules/users/entities/user.entity';

import { vi } from 'vitest';

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
    id: (id = 'john-doe'): string => id,

    user: (override?: Partial<User>): User => {
      return {
        id: this.create.id(),
        name: 'John Doe',
        email: 'johndoe@email.com',
        avatarURL: 'https://avatars.githubusercontent.com/u/189175871?v=4',
        externalAccountId: 1232143123,
        ...override,
      };
    },
  };

  static responses = {
    repository: {
      getUserById: {
        success: () =>
          this.repository.getUserById.mockResolvedValue(this.create.user()),
        null: () => this.repository.getUserById.mockResolvedValue(null),
      },

      getUserByExternalAccountId: {
        success: () =>
          this.repository.getUserByExternalAccountId.mockResolvedValue(
            this.create.user(),
          ),
        null: () => {
          UsersMockFactory.repository.getUserByExternalAccountId.mockResolvedValue(
            null,
          );
        },
      },

      create: {
        success: () =>
          this.repository.create.mockResolvedValue(this.create.user()),
      },
    },

    service: {
      findUserById: {
        success: () => {
          this.responses.repository.getUserById.success();
          this.service.findUserById.mockResolvedValue(this.create.user());
        },
        failure: () => {
          this.responses.repository.getUserById.null();
          this.service.findUserById.mockRejectedValue(new NotFoundException());
        },
      },
    },
  };
}
