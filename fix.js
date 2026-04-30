const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'src/lib/mock-data.ts');
let content = fs.readFileSync(mockDataPath, 'utf8');

// The messed up injected content is everything between "name: string;" and "duration: string;"
const startToken = "name: string;";
const endToken = "duration: string;";

const startIdx = content.indexOf(startToken);
const endIdx = content.indexOf(endToken);

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find tokens");
  process.exit(1);
}

// Extract the injected block
const injectedBlock = content.slice(startIdx + startToken.length, endIdx);

// Fix the interface by removing the injected block
let fixedContent = content.slice(0, startIdx + startToken.length) + "\\r\\n  " + content.slice(endIdx);

// Now we need to insert the injected block right after "export const mockColleges: College[] = ["
const arrayStart = fixedContent.indexOf('export const mockColleges: College[] = [');
if (arrayStart !== -1) {
  const bracketIdx = fixedContent.indexOf('[', arrayStart);
  fixedContent = fixedContent.slice(0, bracketIdx + 1) + injectedBlock + fixedContent.slice(bracketIdx + 1);
}

fs.writeFileSync(mockDataPath, fixedContent);
console.log("Fixed mock-data.ts successfully");
