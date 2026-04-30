const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'src/lib/mock-data.ts');
let content = fs.readFileSync(mockDataPath, 'utf8');

// Extract the mockColleges array content
const startIdx = content.indexOf('export const mockColleges: College[] = [');
if (startIdx === -1) {
  console.log("Could not find mockColleges array");
  process.exit(1);
}

const premiumColleges = `
  {
    "id": "iit-bombay-1",
    "name": "IIT Bombay",
    "shortName": "IITB",
    "location": "Mumbai, Maharashtra",
    "description": "Indian Institute of Technology Bombay is a globally ranked public engineering institution renowned for its CS and Engineering programs.",
    "rating": 9.8,
    "reviewCount": 1240,
    "tuition": 220000,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/IIT_Bombay_Main_Building.jpg/1024px-IIT_Bombay_Main_Building.jpg",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Indian_Institute_of_Technology_Bombay_Logo.svg/1200px-Indian_Institute_of_Technology_Bombay_Logo.svg.png",
    "tags": ["IIT", "Public", "West"],
    "type": "Public",
    "approvals": ["UGC", "AICTE"],
    "highestPlacement": "₹1.5 CPA",
    "averagePlacement": "₹23.0 LPA",
    "establishedYear": 1958,
    "ranking": "#3 in India",
    "courses": [
      {
        "name": "B.Tech Computer Science",
        "duration": "4 Years",
        "fees": 220000,
        "eligibility": "10+2 with 75% & JEE Advanced"
      }
    ]
  },
  {
    "id": "iit-delhi-1",
    "name": "IIT Delhi",
    "shortName": "IITD",
    "location": "New Delhi, Delhi",
    "description": "Indian Institute of Technology Delhi is one of the premier technology institutes in India.",
    "rating": 9.7,
    "reviewCount": 1150,
    "tuition": 225000,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/IIT_Delhi_Main_Building.jpg/1024px-IIT_Delhi_Main_Building.jpg",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg/1200px-Indian_Institute_of_Technology_Delhi_Logo.svg.png",
    "tags": ["IIT", "Public", "North"],
    "type": "Public",
    "approvals": ["UGC", "AICTE"],
    "highestPlacement": "₹1.3 CPA",
    "averagePlacement": "₹22.5 LPA",
    "establishedYear": 1961,
    "ranking": "#2 in India",
    "courses": [
      {
        "name": "B.Tech Computer Science",
        "duration": "4 Years",
        "fees": 225000,
        "eligibility": "10+2 with 75% & JEE Advanced"
      }
    ]
  },
  {
    "id": "bits-pilani-1",
    "name": "BITS Pilani",
    "shortName": "BITS",
    "location": "Pilani, Rajasthan",
    "description": "Birla Institute of Technology and Science, Pilani is a top-tier private institution offering world-class engineering education.",
    "rating": 9.6,
    "reviewCount": 980,
    "tuition": 450000,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/BITS_Pilani_clock_tower.jpg/1024px-BITS_Pilani_clock_tower.jpg",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/BITS_Pilani_logo.svg/1200px-BITS_Pilani_logo.svg.png",
    "tags": ["BITS", "Private", "North"],
    "type": "Private",
    "approvals": ["UGC"],
    "highestPlacement": "₹60.0 LPA",
    "averagePlacement": "₹18.0 LPA",
    "establishedYear": 1964,
    "ranking": "#1 Private in India",
    "courses": [
      {
        "name": "B.E. Computer Science",
        "duration": "4 Years",
        "fees": 450000,
        "eligibility": "10+2 with 75% & BITSAT"
      }
    ]
  },
  {
    "id": "vit-vellore-1",
    "name": "VIT Vellore",
    "shortName": "VIT",
    "location": "Vellore, Tamil Nadu",
    "description": "Vellore Institute of Technology is a reputed private deemed university known for its massive campus and excellent placements.",
    "rating": 8.9,
    "reviewCount": 2100,
    "tuition": 198000,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/VIT_University_Main_Building.jpg/1024px-VIT_University_Main_Building.jpg",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Vellore_Institute_of_Technology_seal_2017.svg/1200px-Vellore_Institute_of_Technology_seal_2017.svg.png",
    "tags": ["VIT", "Private", "South"],
    "type": "Private",
    "approvals": ["UGC", "AICTE"],
    "highestPlacement": "₹1.2 CPA",
    "averagePlacement": "₹8.5 LPA",
    "establishedYear": 1984,
    "ranking": "#11 in India",
    "courses": [
      {
        "name": "B.Tech Computer Science",
        "duration": "4 Years",
        "fees": 198000,
        "eligibility": "10+2 with 60% & VITEEE"
      }
    ]
  },
`;

const arrayStartStr = 'export const mockColleges: College[] = [\\n';
const injectionPoint = content.indexOf(arrayStartStr) + arrayStartStr.length;

// Insert the new premium colleges at the top of the array
const newContent = content.slice(0, injectionPoint) + premiumColleges + content.slice(injectionPoint);

// Let's also regex replace some existing logos for generic NITs/IITs
let finalContent = newContent
  .replace(/https:\/\/upload.wikimedia.org\/wikipedia\/en\/thumb\/f\/fd\/Indian_Institute_of_Technology_Bombay_Logo.svg\/1200px-Indian_Institute_of_Technology_Bombay_Logo.svg.png/g, "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Indian_Institute_of_Technology_Bombay_Logo.svg/200px-Indian_Institute_of_Technology_Bombay_Logo.svg.png")
  .replace(/"name": "NIT Trichy",([\s\S]*?)"imageUrl": ".*?",/g, '"name": "NIT Trichy",$1"imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/NIT_Trichy_Clock_Tower.jpg/1024px-NIT_Trichy_Clock_Tower.jpg",')
  .replace(/"name": "NIT Surathkal",([\s\S]*?)"imageUrl": ".*?",/g, '"name": "NIT Surathkal",$1"imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/NITK_Main_Building.jpg/1024px-NITK_Main_Building.jpg",');

fs.writeFileSync(mockDataPath, finalContent);
console.log("Successfully injected premium colleges and updated images!");
