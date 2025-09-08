import { FakerFactory } from 'src/shared/__factories__/faker.factory';

import { CreateTestUserParams } from 'src/shared/interfaces/helpers/create-test-user.interface';

export async function createTestUser({
  prismaService,
  jwtService,
  override,
}: CreateTestUserParams) {
  const user = await prismaService.user.create({
    data: {
      name: FakerFactory.user.name(),
      email: FakerFactory.user.email(),
      avatarURL: FakerFactory.github.avatarURL(),
      externalAccountId: FakerFactory.github.id(),
      ...override,
    },
  });

  const payload = { sub: user.id };
  const accessToken = await jwtService.signAsync(payload);

  return { user, accessToken };
}
