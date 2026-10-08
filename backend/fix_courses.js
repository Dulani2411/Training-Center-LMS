const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.course.deleteMany({});
  const courses = [
    'Refinery Operation Technician - C11S003',
    'Refinery Engineering Technician(Mechanical)-C11T004',
    'Refinery Engineering Technician(Electrical)',
    'Refinery Engineering Technician(Instrument)-C11S002',
    'Refinery Laboratory Analyst',
    'Industrial Boiler Operator(High Pressure)',
    'Oil and Gas Plant Inspection Technology',
    '6-G Industrial Welder'
  ];
  for (const c of courses) {
    await prisma.course.create({
      data: { courseName: c, status: 'ACTIVE' }
    });
  }
  console.log('Courses fixed');
}

main().catch(console.error).finally(() => prisma.$disconnect());
