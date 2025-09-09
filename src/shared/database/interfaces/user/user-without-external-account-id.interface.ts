import { type User } from 'src/modules/users/entities/user.entity';

export type UserWithoutExternalAccountId = Omit<
  User,
  'externalAccountId'
> | null;
