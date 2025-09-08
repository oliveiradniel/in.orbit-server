import { vi } from 'vitest';

import { FakerFactory } from './faker.factory';

export class JWTMockFactory {
  static service = {
    signAsync: vi.fn(),
  };

  static create = {
    accessToken: (accessToken = FakerFactory.data.token()): string =>
      accessToken,
  };

  static responses = {
    service: {
      signAsync: {
        success: (accessToken?: string) =>
          JWTMockFactory.service.signAsync.mockResolvedValue(
            JWTMockFactory.create.accessToken(accessToken),
          ),
      },
    },
  };
}
