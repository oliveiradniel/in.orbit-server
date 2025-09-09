import { type User } from 'src/modules/users/entities/user.entity';

export type UserResponse = Omit<User, 'externalAccountId'>;
