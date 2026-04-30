import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const collegeList = [
  { name: "IIT Roorkee", location: "Roorkee, Uttarakhand", type: "Public" },
  { name: "IIT Guwahati", location: "Guwahati, Assam", type: "Public" },
  { name: "IIT Hyderabad", location: "Hyderabad, Telangana", type: "Public" },
  { name: "NIT Warangal", location: "Warangal, Telangana", type: "Public" },
  { name: "NIT Calicut", location: "Kozhikode, Kerala", type: "Public" },
  { name: "JNU New Delhi", location: "New Delhi, Delhi", type: "Public" },
  { name: "Jamia Millia Islamia", location: "New Delhi, Delhi", type: "Public" },
  { name: "Aligarh Muslim University", location: "Aligarh, Uttar Pradesh", type: "Public" },
  { name: "Banaras Hindu University", location: "Varanasi, Uttar Pradesh", type: "Public" },
  { name: "University of Hyderabad", location: "Hyderabad, Telangana", type: "Public" },
  { name: "Calcutta University", location: "Kolkata, West Bengal", type: "Public" },
  { name: "Panjab University", location: "Chandigarh, Punjab", type: "Public" },
  { name: "Osmania University", location: "Hyderabad, Telangana", type: "Public" },
  { name: "Pune University", location: "Pune, Maharashtra", type: "Public" },
  { name: "Mumbai University", location: "Mumbai, Maharashtra", type: "Public" },
  { name: "Bangalore University", location: "Bangalore, Karnataka", type: "Public" },
  { name: "Madras University", location: "Chennai, Tamil Nadu", type: "Public" },
  { name: "Amrita University", location: "Coimbatore, Tamil Nadu", type: "Private" },
  { name: "Thapar University", location: "Patiala, Punjab", type: "Private" },
  { name: "Manipal University", location: "Manipal, Karnataka", type: "Private" },
  { name: "SRM University", location: "Chennai, Tamil Nadu", type: "Private" },
  { name: "KIIT Bhubaneswar", location: "Bhubaneswar, Odisha", type: "Private" },
  { name: "SOA Bhubaneswar", location: "Bhubaneswar, Odisha", type: "Private" },
  { name: "Shiv Nadar University", location: "Greater Noida, UP", type: "Private" },
  { name: "UPES Dehradun", location: "Dehradun, Uttarakhand", type: "Private" },
  { name: "Graphic Era University", location: "Dehradun, Uttarakhand", type: "Private" },
  { name: "LPU Jalandhar", location: "Jalandhar, Punjab", type: "Private" },
  { name: "Chandigarh University", location: "Mohali, Punjab", type: "Private" },
  { name: "Amity University Noida", location: "Noida, UP", type: "Private" },
  { name: "Galgotias University", location: "Greater Noida, UP", type: "Private" },
  { name: "Sharda University", location: "Greater Noida, UP", type: "Private" },
  { name: "Nirma University", location: "Ahmedabad, Gujarat", type: "Private" },
  { name: "PDEU Gandhinagar", location: "Gandhinagar, Gujarat", type: "Private" },
  { name: "DA-IICT", location: "Gandhinagar, Gujarat", type: "Private" },
  { name: "PEC Chandigarh", location: "Chandigarh, Punjab", type: "Public" },
  { name: "DTU Delhi", location: "New Delhi, Delhi", type: "Public" },
  { name: "NSUT Delhi", location: "New Delhi, Delhi", type: "Public" },
  { name: "IIIT Hyderabad", location: "Hyderabad, Telangana", type: "Public" },
  { name: "IIIT Bangalore", location: "Bangalore, Karnataka", type: "Public" },
  { name: "IIIT Delhi", location: "New Delhi, Delhi", type: "Public" },
  { name: "IIIT Allahabad", location: "Prayagraj, UP", type: "Public" },
  { name: "NIT Rourkela", location: "Rourkela, Odisha", type: "Public" },
  { name: "NIT Kurukshetra", location: "Kurukshetra, Haryana", type: "Public" },
  { name: "NIT Durgapur", location: "Durgapur, West Bengal", type: "Public" },
  { name: "NIT Silchar", location: "Silchar, Assam", type: "Public" },
  { name: "IISc Bangalore", location: "Bangalore, Karnataka", type: "Public" },
  { name: "IISER Pune", location: "Pune, Maharashtra", type: "Public" },
  { name: "IISER Kolkata", location: "Kolkata, West Bengal", type: "Public" },
  { name: "BITS Goa", location: "Zuarinagar, Goa", type: "Private" },
  { name: "BITS Hyderabad", location: "Hyderabad, Telangana", type: "Private" }
];

const genericImages = [
  "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log(`Adding ${collegeList.length} colleges to the database...`);

  let addedCount = 0;
  for (let i = 0; i < collegeList.length; i++) {
    const c = collegeList[i];
    
    // Check if it already exists
    const existing = await prisma.college.findFirst({
      where: { name: c.name }
    });

    if (!existing) {
      const tuition = c.type === "Private" ? getRandomInt(150000, 350000) : getRandomInt(40000, 150000);
      const rating = (getRandomInt(75, 98) / 10).toFixed(1);
      const avgPlacement = c.type === "Private" ? getRandomInt(5, 12) : getRandomInt(7, 20);
      const highPlacement = getRandomInt(avgPlacement * 3, 150); // up to 1.5 CPA
      const reviewCount = getRandomInt(100, 5000);
      const estYear = getRandomInt(1940, 2010);
      
      const imageUrl = genericImages[i % genericImages.length];
      const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random&color=fff&size=200&font-size=0.4`;

      const tags = [c.type, c.name.includes("IIT") || c.name.includes("NIT") || c.name.includes("IIIT") ? "Engineering" : "Multi-Disciplinary"];

      await prisma.college.create({
        data: {
          name: c.name,
          shortName: c.name.split(' ')[0] + (c.name.split(' ')[1] ? ' ' + c.name.split(' ')[1] : ''),
          location: c.location,
          description: `${c.name} is a premier ${c.type.toLowerCase()} institution located in ${c.location}. It is renowned for its excellent faculty, sprawling campus, and vibrant student life.`,
          rating: parseFloat(rating),
          reviewCount: reviewCount,
          tuition: tuition,
          imageUrl: imageUrl,
          logoUrl: logoUrl,
          tags: tags,
          type: c.type,
          approvals: ["UGC", "AICTE"],
          highestPlacement: highPlacement >= 100 ? `₹${(highPlacement/100).toFixed(2)} CPA` : `₹${highPlacement} LPA`,
          averagePlacement: `₹${avgPlacement} LPA`,
          establishedYear: estYear,
          ranking: `#${getRandomInt(10, 100)} in NIRF`,
          courses: {
            create: [
              { name: "B.Tech Computer Science", duration: "4 Years", fees: tuition, eligibility: "10+2 with 75%" },
              { name: "MBA", duration: "2 Years", fees: tuition * 1.5, eligibility: "Graduation with 60%" }
            ]
          }
        }
      });
      console.log(`Added ${c.name}`);
      addedCount++;
    } else {
      console.log(`${c.name} already exists. Skipping.`);
    }
  }

  console.log(`\nSuccessfully generated and added ${addedCount} colleges!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
