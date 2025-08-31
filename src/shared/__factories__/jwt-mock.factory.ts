import { vi } from 'vitest';

export const JWT_SERVICE = Symbol('JWT_SERVICE');

export class JWTMockFactory {
  static service = {
    signAsync: vi.fn(),
  };

  static create = {
    accessToken: (accessToken = 'jwt-access-token'): string => accessToken,
  };

  static responses = {
    service: {
      signAsync: {
        success: () =>
          this.service.signAsync.mockResolvedValue(this.create.accessToken()),
      },
    },
  };
}
