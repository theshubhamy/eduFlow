import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password', 10);
  
  // 1. Create School
  const school = await prisma.school.create({
    data: {
      name: 'Springfield Academy',
      address: '742 Evergreen Terrace, Springfield',
      phone: '555-0199',
      email: 'info@springfieldacademy.edu',
      website: 'www.springfieldacademy.edu',
    },
  });

  // 2. Create Team
  const team = await prisma.team.create({
    data: {
      name: 'Springfield Admin Team',
      slug: 'springfield-admin-team',
      isPersonal: false,
    },
  });

  // 3. Create User (Owner)
  const user = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'admin',
      schoolId: school.id,
      currentTeamId: team.id,
    },
  });

  // 4. Create Team Member (Owner role)
  await prisma.teamMember.create({
    data: {
      teamId: team.id,
      userId: user.id,
      role: 'owner',
    },
  });

  // 5. Create some School Classes
  const classA = await prisma.schoolClass.create({
    data: {
      schoolId: school.id,
      name: 'Class 10',
      section: 'A',
      roomNumber: '101',
    },
  });

  const classB = await prisma.schoolClass.create({
    data: {
      schoolId: school.id,
      name: 'Class 10',
      section: 'B',
      roomNumber: '102',
    },
  });

  // 6. Create some Teachers (Users)
  const teacherUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: passwordHash,
      role: 'teacher',
      schoolId: school.id,
      currentTeamId: team.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team.id,
      userId: teacherUser.id,
      role: 'faculty',
    },
  });

  // 7. Create Subjects
  await prisma.subject.create({
    data: {
      schoolId: school.id,
      classId: classA.id,
      teacherId: teacherUser.id,
      name: 'Mathematics',
      code: 'MATH-101',
    },
  });

  await prisma.subject.create({
    data: {
      schoolId: school.id,
      classId: classA.id,
      teacherId: teacherUser.id,
      name: 'Science',
      code: 'SCI-101',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
