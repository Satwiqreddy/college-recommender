import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const safeImages = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1000&auto=format&fit=crop"
];

async function main() {
  console.log("Fixing broken images for all 90+ colleges...");
  
  const allColleges = await prisma.college.findMany();
  
  let count = 0;
  for (let i = 0; i < allColleges.length; i++) {
    const college = allColleges[i];
    
    // Generate a beautiful generic logo based on the college name
    const safeLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(college.name)}&background=random&color=fff&size=200&font-size=0.4`;
    const safeImage = safeImages[i % safeImages.length];

    await prisma.college.update({
      where: { id: college.id },
      data: {
        imageUrl: safeImage,
        logoUrl: safeLogo
      }
    });
    count++;
  }

  console.log(`Successfully updated images and logos for ${count} colleges!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
