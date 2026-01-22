import { Readable } from 'stream';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export function streamFromString(data, chunkSize = 64 * 1024) {
  let offset = 0;

  return new Readable({
    encoding: 'utf8',
    read() {
      if (offset >= data.length) {
        this.push(null);
        return;
      }

      const chunk = data.slice(offset, offset + chunkSize);
      offset += chunkSize;
      this.push(chunk);
    }
  });
}

export async function readInput(question) {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(question);
  rl.close();
  return answer;
}