const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'indian_universities_200.csv');
const outPath = path.join(__dirname, 'src', 'lib', 'mock-data.ts');

const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const headers = lines[0].split(',');
const colleges = [];

for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',');
  if (values.length < 8) continue;
  
  const [University_Name, Type, Region, State, City, Avg_Annual_Fees, Rating, NIRF_Rank] = values;
  
  const college = {
    id: i.toString(),
    name: University_Name,
    shortName: University_Name.split(' ')[0], // simple heuristic
    location: `${City}, ${State}`,
    description: `A prominent ${Type.toLowerCase()} institution located in ${City}, ${State}, offering various undergraduate and postgraduate programs. Ranked #${NIRF_Rank} by NIRF.`,
    rating: parseFloat(Rating),
    reviewCount: Math.floor(Math.random() * 1000) + 100,
    tuition: parseInt(Avg_Annual_Fees, 10) || 150000,
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Indian_Institute_of_Technology_Bombay_Logo.svg/1200px-Indian_Institute_of_Technology_Bombay_Logo.svg.png",
    tags: [Type, Region],
    type: Type === "IIT" ? "Public" : Type,
    approvals: ["UGC", "AICTE"],
    highestPlacement: `₹${(Math.random() * 50 + 10).toFixed(1)} LPA`,
    averagePlacement: `₹${(Math.random() * 10 + 5).toFixed(1)} LPA`,
    establishedYear: 1950 + Math.floor(Math.random() * 60),
    ranking: `#${NIRF_Rank} in India`,
    courses: [
      { name: "B.Tech Computer Science", duration: "4 Years", fees: parseInt(Avg_Annual_Fees, 10), eligibility: "10+2 with 75%" },
      { name: "MBA", duration: "2 Years", fees: parseInt(Avg_Annual_Fees, 10) * 1.2, eligibility: "Graduation with 50%" }
    ]
  };
  
  colleges.push(college);
  
  if (colleges.length >= 75) break; // Limit to 75 as user asked
}

const outContent = `export interface Course {
  name: string;
  duration: string;
  fees: number;
  eligibility: string;
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  location: string;
  description: string;
  rating: number;
  reviewCount: number;
  tuition: number; // In INR
  imageUrl: string;
  logoUrl: string;
  tags: string[];
  type: string;
  approvals: string[];
  highestPlacement: string;
  averagePlacement: string;
  courses: Course[];
  establishedYear: number;
  ranking: string;
}

export const mockColleges: College[] = ${JSON.stringify(colleges, null, 2)};
`;

fs.writeFileSync(outPath, outContent);
console.log('Successfully generated mock-data.ts with ' + colleges.length + ' colleges.');
