// import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { genSalt, hash } from 'bcryptjs';

const prisma = new PrismaClient();

const createRoleSeeds = () => {
  const roleSeeds = [];

  roleSeeds.push({
    name: 'admin'
  });

  roleSeeds.push({
    name: 'creator'
  });

  return roleSeeds;
}

const main = async () => {
  console.log('Start seeding ...');

  try {
    // Roles
    const rolesSeed = createRoleSeeds();

    rolesSeed.map(async (role) => {
      await prisma.role.create({
        data: role
      })
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

    userAdmin.password = await hash(userAdmin.password, await genSalt());

    await prisma.user.create({
      data: userAdmin
    });

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