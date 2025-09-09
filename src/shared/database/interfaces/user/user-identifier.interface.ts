import { type User } from 'src/modules/users/entities/user.entity';

export type UserIdentifier = Pick<User, 'id'> | null;
