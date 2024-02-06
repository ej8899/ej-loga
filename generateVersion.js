console.log("in generateVersion.js")
// generateVersion.js
import { writeFileSync } from 'fs';

const version = {
  buildDate: new Date().toISOString(),
};

const jsonString = JSON.stringify(version);

// Save the JSON to version.json
writeFileSync('./src/version.json', jsonString);

console.log('Version information saved to version.json');
