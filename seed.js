const { PrismaClient } = require('@prisma/client');
const { mockColleges } = require('./src/lib/mock-data');

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Database with Colleges...");
  
  for (const college of mockColleges) {
    const existing = await prisma.college.findFirst({ where: { name: college.name } });
    
    if (!existing) {
      console.log(\`Adding \${college.name}...\`);
      await prisma.college.create({
        data: {
          id: college.id,
          name: college.name,
          shortName: college.shortName,
          location: college.location,
          description: college.description,
          rating: college.rating,
          reviewCount: college.reviewCount,
          tuition: college.tuition,
          imageUrl: college.imageUrl,
          logoUrl: college.logoUrl,
          tags: college.tags,
          type: college.type,
          approvals: college.approvals,
          highestPlacement: college.highestPlacement,
          averagePlacement: college.averagePlacement,
          establishedYear: college.establishedYear,
          ranking: college.ranking,
          courses: {
            create: college.courses.map(course => ({
              name: course.name,
              duration: course.duration,
              fees: course.fees,
              eligibility: course.eligibility
            }))
          }
        }
      });
    } else {
      console.log(\`\${college.name} already exists. Skipping.\`);
    }
  }
  console.log("Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
