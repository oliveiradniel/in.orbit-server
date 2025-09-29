import { type Server } from 'http';
import { type HTTPMethods } from '../http-methods.interface';

export interface DescribeAuthGuardParams {
  getServer: () => Server;
  route: string;
  httpMethod?: HTTPMethods;
}
