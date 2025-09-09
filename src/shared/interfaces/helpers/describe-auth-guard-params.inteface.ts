import { type Server } from 'http';

export interface DescribeAuthGuardParams {
  getServer: () => Server;
  route: string;
  method?: 'get' | 'post' | 'put' | 'delete';
}
