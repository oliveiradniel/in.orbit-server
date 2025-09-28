import { JwtService } from '@nestjs/jwt';

import { vi } from 'vitest';

import { type Server } from 'http';
import { type HTTPMethods } from '../http-methods.interface';

export interface IntDescribeUserNotExistsParams {
  getServer: () => Server;
  getJWTService: () => JwtService;
  getData?: () => Record<string, string | number>;
  route: string;
  httpMethod?: HTTPMethods;
}

export interface UnitDescribeUserNotExistsParams {
  request: () => Promise<any>;
  classMethod: string;
}

export type UnitDescribeUserNotInUsersExistsParams =
  UnitDescribeUserNotExistsParams & {
    userId: () => string;
    repositorySpy: ReturnType<typeof vi.spyOn>;
    repositoryMethod: {
      null: () => void;
    };
  };

export type UnitDescribeUserNotInGoalsExistsParams =
  UnitDescribeUserNotExistsParams;
