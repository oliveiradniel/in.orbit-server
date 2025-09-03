import { randomInt } from 'crypto';

import { CreateTestUserParams } from 'src/shared/interfaces/helpers/create-test-user.interface';

export async function createTestUser({
  usersRepository,
  prismaService,
  jwtService,
  override,
}: CreateTestUserParams) {
  const id = override.id;

  await prismaService.user.deleteMany({
    where: {
      id,
    },
  });

  const MIN_NUMBER = 0;
  const MAX_NUMBER = 1_000_000_000;

  const user = await usersRepository.create({
    name: 'John Doe',
    email: 'johndoe@email.com',
    avatarURL: 'https://avatars.githubusercontent.com/u/189175871?v=4',
    externalAccountId: Number(String(randomInt(MIN_NUMBER, MAX_NUMBER))),
    ...override,
  });

  const payload = { sub: user.id };
  const accessToken = await jwtService.signAsync(payload);

  return { user, accessToken };
}
