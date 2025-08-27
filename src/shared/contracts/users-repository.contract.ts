import { type User } from 'src/modules/users/entities/user.entity';
import { type CreateUserDTO } from 'src/modules/users/dtos/create-user.dto';

export abstract class UsersRepository {
  abstract getUserById(
    userId: string,
  ): Promise<Omit<User, 'externalAccountId'> | null>;

  abstract getUserByExternalAccountId(
    githubUserId: number,
  ): Promise<User | null>;

  abstract create(createUserDTO: CreateUserDTO): Promise<User>;
}
