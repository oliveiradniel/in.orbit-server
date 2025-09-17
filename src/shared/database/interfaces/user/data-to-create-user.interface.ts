import { type User } from 'src/modules/users/entities/user.entity';

export type DataToCreateUser = Omit<User, 'id' | 'experiencePoints'> & {
  id?: string;
};
