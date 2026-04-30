import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up generated 'Campus' duplicates...");
  
  const allColleges = await prisma.college.findMany();
  let deletedCount = 0;
  let renamedCount = 0;

  for (const college of allColleges) {
    // Check if the college name ends with "Campus X"
    const campusMatch = college.name.match(/(.+) Campus \d+$/i);
    
    if (campusMatch) {
      const baseName = campusMatch[1].trim();
      
      // Check if a college with the base name already exists
      const existingBase = allColleges.find(c => c.name.toLowerCase() === baseName.toLowerCase() && c.id !== college.id);
      
      if (existingBase) {
        // A clean version already exists, or we already renamed Campus 1 to be the clean version. Delete this one.
        console.log(`Deleting duplicate: ${college.name}`);
        await prisma.college.delete({ where: { id: college.id } });
        deletedCount++;
      } else {
        // No clean version exists yet! Let's rename this one to remove the "Campus X" part.
        console.log(`Renaming to base name: ${college.name} -> ${baseName}`);
        await prisma.college.update({
          where: { id: college.id },
          data: { name: baseName, shortName: baseName } // update shortName too just in case
        });
        
        // Update it in our local array so subsequent loops see the new base name
        college.name = baseName;
        renamedCount++;
      }
    }
  }

  console.log(`\nCleanup Complete!`);
  console.log(`Renamed/Consolidated: ${renamedCount} colleges`);
  console.log(`Deleted duplicates: ${deletedCount} colleges`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
