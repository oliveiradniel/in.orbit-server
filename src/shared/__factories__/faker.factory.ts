import { faker } from '@faker-js/faker';

export class FakerFactory {
  static data = {
    token: (): string =>
      [
        faker.string.alphanumeric(20),
        faker.string.alphanumeric(20),
        faker.string.alphanumeric(20),
      ].join('.'),

    uuid: (): string => faker.string.uuid(),
  };

  static user = {
    name: (): string => faker.person.fullName(),
    email: (): string => faker.internet.email(),
  };

  static github = {
    id: (): number => faker.number.int({ min: 1, max: 1_000_000 }),
    name: (): string => faker.person.fullName(),
    email: (): string => faker.internet.email(),
    avatarURL: (): string => faker.image.avatar(),
    code: (): string => String(faker.number.int({ min: 1, max: 1_000_000 })),
  };

  static goal = {
    title: (): string => faker.lorem.word(),
    desiredWeeklyFrequency: (max: number = 7): number =>
      faker.number.int({ min: 1, max: max }),
  };
}
