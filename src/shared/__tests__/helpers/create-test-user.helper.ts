import { CreateTestUserParams } from 'src/shared/interfaces/helpers/create-test-user.interface';

export async function createTestUser({
  usersRepository,
  prismaService,
  jwtService,
  override,
}: CreateTestUserParams) {
  await prismaService.user.deleteMany();

  const user = await usersRepository.create({
    id: crypto.randomUUID(),
    name: 'John Doe',
    email: 'johndoe@email.com',
    avatarURL: 'https://avatars.githubusercontent.com/u/189175871?v=4',
    externalAccountId: 123456789,
    ...override,
  });

  const payload = { sub: user.id };
  const accessToken = await jwtService.signAsync(payload);

  return { user, accessToken };
}
