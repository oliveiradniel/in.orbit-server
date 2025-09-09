import { type User } from 'src/modules/users/entities/user.entity';
import { type UserWithoutExternalAccountId } from '../database/interfaces/user/user-without-external-account-id.interface';
import { type UserIdentifier } from '../database/interfaces/user/user-identifier.interface';
import { type DataToCreateUser } from '../database/interfaces/user/data-to-create-user.interface';

export abstract class UsersRepository {
  abstract getUserById(userId: string): Promise<UserWithoutExternalAccountId>;

  abstract getUserByExternalAccountId(
    githubUserId: number,
  ): Promise<UserIdentifier>;

  abstract create(dataToCreateUser: DataToCreateUser): Promise<User>;
}
