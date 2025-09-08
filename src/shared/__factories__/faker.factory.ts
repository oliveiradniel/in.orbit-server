import { faker } from '@faker-js/faker';

export class FakerFactory {
  static data = {
    token: () =>
      [
        faker.string.alphanumeric(20),
        faker.string.alphanumeric(20),
        faker.string.alphanumeric(20),
      ].join('.'),

    uuid: () => faker.string.uuid(),
  };

  static user = {
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
  };

  static github = {
    id: () => faker.number.int({ min: 1, max: 1_000_000 }),
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
    avatarURL: () => faker.image.avatar(),
    code: () => String(faker.number.int({ min: 1, max: 1_000_000 })),
  };

  static goal = {
    title: () => faker.lorem.word(),
    desiredWeeklyFrequency: (max: number = 7) =>
      faker.number.int({ min: 1, max: max }),
  };
}
