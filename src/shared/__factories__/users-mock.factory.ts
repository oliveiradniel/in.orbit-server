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

  static createUserId(id = 'john-doe'): string {
    return id;
  }

  static createUser(override?: Partial<User>, id?: string): User {
    return {
      id: id ?? this.createUserId(),
      name: 'John Doe',
      email: 'johndoe@email.com',
      avatarURL: 'https://avatars.githubusercontent.com/u/189175871?v=4',
      externalAccountId: 1232143123,
      ...override,
    };
  }

  static repositoryResponses() {
    return {
      getUserByIdSuccess: () =>
        this.repository.getUserById.mockResolvedValue(this.createUser()),
      getUserByIdNull: () =>
        this.repository.getUserById.mockResolvedValue(null),
      getUserByIdFailure: () =>
        this.repository.getUserById.mockRejectedValue(new NotFoundException()),
    };
  }

  static serviceResponses() {
    return {
      findUserByIdSuccess: () =>
        this.service.findUserById.mockResolvedValue(this.createUser()),
      findUserByIdFailure: () =>
        this.service.findUserById.mockRejectedValue(new NotFoundException()),
    };
  }
}
