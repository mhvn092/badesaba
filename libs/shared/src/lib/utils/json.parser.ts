import * as fs from 'fs';

// import * as path from 'path';

export function jsonParser<T>(relativePath: string):T {
  try {
    const data = fs.readFileSync(relativePath, 'utf8');

    return JSON.parse(data);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
}
