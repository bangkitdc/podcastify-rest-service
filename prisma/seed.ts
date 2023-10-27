import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { genSalt, hash } from 'bcryptjs';

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

const PODCAST_SEED_SIZE = 15;
const EPISODE_PER_PODCAST_SEED_SIZE = 2;

const createPodcastSeeds = (count: number, creatorId: number) => {
  const podcastSeeds = [];

  for (let i = 0; i < count; i++) {
    podcastSeeds.push({
      title: faker.music.songName(),
      description: faker.lorem.paragraph(),
      creator_id: creatorId,
      category_id: Math.floor(Math.random() * CATEGORY_SEED_SIZE) + 1
    })
  }

  return podcastSeeds;
}

const createEpisodeSeeds = (count: number, podcastId: number) => {
  const episodeSeeds = [];

  for (let i = 0; i < count; i++) {
    episodeSeeds.push({
      podcast_id: podcastId,
      title: faker.music.songName(),
      description: faker.lorem.paragraph(),
      duration: (Math.floor(Math.random() * 30) + 1) * 60,
      audio_url: ''
    })
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

    const sampleCreator = await prisma.user.create({
      data: userCreator
    });

    // Categories
    const categorySeeds = createCategorySeeds(CATEGORY_SEED_SIZE);
    await prisma.category.createMany({
      data: categorySeeds,
    });

    // Podcasts & Episodes
    const podcastSeeds = createPodcastSeeds(PODCAST_SEED_SIZE, sampleCreator.user_id);
    await Promise.all(
      podcastSeeds.map(async (podcast) => {
        const createdPodcast = await prisma.podcast.create({
          data: podcast
        });

        const episodeSeeds = createEpisodeSeeds(EPISODE_PER_PODCAST_SEED_SIZE, createdPodcast.podcast_id);
        await Promise.all(
          episodeSeeds.map(async (episode) => {
            await prisma.episode.create({
              data: episode
            });
          })
        );
      })
    );

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