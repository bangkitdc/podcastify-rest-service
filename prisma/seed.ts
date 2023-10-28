import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { genSalt, hash } from 'bcryptjs';
import { IEpisodeForm } from '../src/types/episode';
import { IUserForm } from '../src/types/user';

const prisma = new PrismaClient();

const createRoleSeeds = () => {
  const roleSeeds = [
    { name: 'admin' },
    { name: 'creator' }
  ];

  return roleSeeds;
}

const CATEGORY_SEED_SIZE = 5;

const createCategorySeeds = (count: number) => {
  const categorySeeds = [];

  for (let i = 0; i < count; i++) {
    categorySeeds.push({
      name: faker.music.genre()
    })
  }

  return categorySeeds;
}

const CREATOR_SEED_SIZE = 10;

const createCreatorSeeds = (count: number, hashedPass: string) => {
  const creatorSeeds: IUserForm[] = [];

  while (creatorSeeds.length < count) {
    const random = Math.random() < 0.5;
    const sex = random ? "female" : "male";

    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName(sex);
    const email = faker.internet.email({ firstName: firstName, lastName: lastName });
    const username = faker.person.fullName({ firstName: firstName, lastName: lastName });

    const isUnique = !creatorSeeds.some(seed => seed.email === email || seed.username === username);
    
    if (isUnique) {
      creatorSeeds.push({
        email: email,
        username: username,
        first_name: firstName,
        last_name: lastName,
        password: hashedPass
      });
    }
  }

  return creatorSeeds;
}

const EPISODE_PER_CREATOR_SEED_SIZE = 3;

const createEpisodeSeeds = (count: number, creatorId: number) => {
  const episodeSeeds: IEpisodeForm[] = [];

  while (episodeSeeds.length < count) {
    const title = faker.music.songName();
    const description = faker.lorem.paragraph();
    const category_id = (Math.floor(Math.random() * CATEGORY_SEED_SIZE) + 1);
    const duration = (Math.floor(Math.random() * 30) + 1) * 60;

    const isUnique = !episodeSeeds.some(seed => seed.title === title);

    if (isUnique) {
      episodeSeeds.push({
        title,
        description,
        creator_id: creatorId,
        category_id,
        duration,
        audio_url: '',
      });
    }
  }

  return episodeSeeds;
}

const main = async () => {
  console.log('Start seeding ...');

  try {
    // Roles
    const roleSeeds = createRoleSeeds();

    await prisma.role.createMany({
      data: roleSeeds,
    });

    // Users
    const userAdmin = {
      email: 'admin@gmail.com',
      username: 'admin',
      first_name: 'admin',
      last_name: 'podcastify',
      password: 'admin',
      role_id: 1
    }

    const userCreator = {
      email: 'creator@gmail.com',
      username: 'creator',
      first_name: 'creator',
      last_name: 'podcastify',
      password: 'creator',
      role_id: 2
    }

    userAdmin.password = await hash(userAdmin.password, await genSalt());

    await prisma.user.create({
      data: userAdmin
    });

    userCreator.password = await hash(userCreator.password, await genSalt());

    await prisma.user.create({
      data: userCreator
    });

    // Categories
    const categorySeeds = createCategorySeeds(CATEGORY_SEED_SIZE);
    await prisma.category.createMany({
      data: categorySeeds,
    });

    // Creators & Episodes
    const creatorSeeds = createCreatorSeeds(CREATOR_SEED_SIZE, userCreator.password);

    for (const user of creatorSeeds) {
      const createdCreator = await prisma.user.create({
        data: user,
      });

      const episodeSeeds = createEpisodeSeeds(EPISODE_PER_CREATOR_SEED_SIZE, createdCreator.user_id);

      for (const episode of episodeSeeds) {
        await prisma.episode.create({
          data: episode,
        });
      }
    }

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error while seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(async (error) => {
  console.error('Script execution failed:', error);
  process.exit(1);
})