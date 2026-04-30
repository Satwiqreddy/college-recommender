import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newColleges = [
  {
    name: "Indian Institute of Technology Kanpur",
    shortName: "IIT Kanpur",
    location: "Kanpur, Uttar Pradesh",
    description: "IIT Kanpur is a public technical and research university located in Kanpur, Uttar Pradesh. It is declared to be an Institute of National Importance by the Government of India under the Institutes of Technology Act.",
    rating: 9.6,
    reviewCount: 4200,
    tuition: 220000,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/IIT_Kanpur_Main_Gate.JPG",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/IIT_Kanpur_Logo.svg/200px-IIT_Kanpur_Logo.svg.png",
    tags: ["IIT", "Engineering", "Public"],
    type: "Public",
    approvals: ["UGC", "AICTE"],
    highestPlacement: "₹1.9 CPA",
    averagePlacement: "₹22.5 LPA",
    establishedYear: 1959,
    ranking: "#4 in NIRF Engineering",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 Years", fees: 220000, eligibility: "10+2 with 75% + JEE Advanced" },
      { name: "B.Tech Aerospace", duration: "4 Years", fees: 220000, eligibility: "10+2 with 75% + JEE Advanced" }
    ]
  },
  {
    name: "Indian Institute of Technology Kharagpur",
    shortName: "IIT Kharagpur",
    location: "Kharagpur, West Bengal",
    description: "IIT Kharagpur is a public institute of technology established by the government of India. Founded in 1951, it is the first of the IITs to be established and is recognised as an Institute of National Importance.",
    rating: 9.5,
    reviewCount: 4800,
    tuition: 225000,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/Main_Building_IIT_Kharagpur.jpg",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/IIT_Kharagpur_Logo.svg/200px-IIT_Kharagpur_Logo.svg.png",
    tags: ["IIT", "Engineering", "Public"],
    type: "Public",
    approvals: ["UGC", "AICTE"],
    highestPlacement: "₹2.6 CPA",
    averagePlacement: "₹19.5 LPA",
    establishedYear: 1951,
    ranking: "#6 in NIRF Engineering",
    courses: [
      { name: "B.Tech Mechanical", duration: "4 Years", fees: 225000, eligibility: "10+2 with 75% + JEE Advanced" },
      { name: "B.Arch", duration: "5 Years", fees: 225000, eligibility: "10+2 with 75% + JEE Advanced" }
    ]
  },
  {
    name: "University of Delhi",
    shortName: "Delhi University",
    location: "New Delhi, Delhi",
    description: "The University of Delhi, informally known as Delhi University (DU), is a collegiate public central university located in New Delhi, India. It was founded in 1922 by an Act of the Central Legislative Assembly.",
    rating: 9.2,
    reviewCount: 15000,
    tuition: 15000,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Delhi_University_Vice_Chancellor_Office.jpg",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/8/84/University_of_Delhi.svg/200px-University_of_Delhi.svg.png",
    tags: ["Central University", "Arts", "Science", "Commerce"],
    type: "Public",
    approvals: ["UGC"],
    highestPlacement: "₹45 LPA",
    averagePlacement: "₹8 LPA",
    establishedYear: 1922,
    ranking: "#11 in NIRF Universities",
    courses: [
      { name: "B.Com (Hons)", duration: "3 Years", fees: 15000, eligibility: "10+2 with CUET" },
      { name: "B.Sc Physics", duration: "3 Years", fees: 18000, eligibility: "10+2 with CUET" }
    ]
  },
  {
    name: "Jadavpur University",
    shortName: "JU Kolkata",
    location: "Kolkata, West Bengal",
    description: "Jadavpur University is a public technical and research university located in Jadavpur, Kolkata, West Bengal, India. It is highly ranked for its engineering and arts programs.",
    rating: 9.3,
    reviewCount: 3200,
    tuition: 10000,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Jadavpur_University.jpg/800px-Jadavpur_University.jpg",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Jadavpur_University_Logo.svg/200px-Jadavpur_University_Logo.svg.png",
    tags: ["State University", "Engineering", "Arts", "Public"],
    type: "Public",
    approvals: ["UGC", "AICTE"],
    highestPlacement: "₹1.1 CPA",
    averagePlacement: "₹15 LPA",
    establishedYear: 1955,
    ranking: "#4 in NIRF Universities",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 Years", fees: 10000, eligibility: "10+2 + WBJEE" },
      { name: "BA Economics", duration: "3 Years", fees: 8000, eligibility: "10+2 merit" }
    ]
  },
  {
    name: "Anna University",
    shortName: "Anna Univ Chennai",
    location: "Chennai, Tamil Nadu",
    description: "Anna University is a public state university located in Tamil Nadu, India. The main campus is in Guindy, Chennai and the satellite campus is in Chromepet, Chennai.",
    rating: 9.0,
    reviewCount: 5600,
    tuition: 50000,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Anna_University_Main_Building.jpg",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Anna_University_Logo.svg/200px-Anna_University_Logo.svg.png",
    tags: ["State University", "Engineering", "Public"],
    type: "Public",
    approvals: ["UGC", "AICTE"],
    highestPlacement: "₹36 LPA",
    averagePlacement: "₹6.5 LPA",
    establishedYear: 1978,
    ranking: "#13 in NIRF Universities",
    courses: [
      { name: "B.E. Computer Science", duration: "4 Years", fees: 50000, eligibility: "10+2 + TNEA" },
      { name: "B.E. Electronics", duration: "4 Years", fees: 50000, eligibility: "10+2 + TNEA" }
    ]
  }
];

async function main() {
  console.log("Adding new prestigious colleges to the database...");

  let addedCount = 0;
  for (const college of newColleges) {
    const existing = await prisma.college.findFirst({
      where: { name: college.name }
    });

    if (!existing) {
      console.log(`Adding ${college.name}...`);
      await prisma.college.create({
        data: {
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
            create: college.courses
          }
        }
      });
      addedCount++;
    } else {
      console.log(`${college.name} already exists. Skipping.`);
    }
  }

  console.log(`Successfully added ${addedCount} new colleges!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
