import { JwtService } from '@nestjs/jwt';

import { type Server } from 'http';
import { type HTTPMethods } from '../http-methods.interface';

export interface DescribeUserNotExistsParams {
  getServer: () => Server;
  getJWTService: () => JwtService;
  getData?: () => Record<string, string | number>;
  route: string;
  method?: HTTPMethods;
}
