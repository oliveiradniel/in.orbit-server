import { vi } from 'vitest';

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
