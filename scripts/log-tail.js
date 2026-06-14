import fs from 'fs';
import path from 'path';
import pinoPretty from 'pino-pretty';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LINE_COUNT = 50;

const prettyPrinter = pinoPretty({
  colorize: true,
});

async function tailLogs() {
  const reqIdFilter = process.argv[2];

  if (!fs.existsSync(LOG_DIR)) {
    console.error('Log directory not found');
    process.exit(1);
  }

  const files = fs.readdirSync(LOG_DIR).filter(f => f.startsWith('research-sessionB'));
  if (files.length === 0) {
    console.error('No log files found');
    process.exit(1);
  }

  const latestFile = files.sort().reverse()[0];
  const LOG_FILE = path.join(LOG_DIR, latestFile);

  const content = fs.readFileSync(LOG_FILE, 'utf8');
  const lines = content.trim().split('\n');
  const lastLines = lines.slice(-LINE_COUNT);

  lastLines.forEach(line => {
    if (!line) return;
    try {
      const log = JSON.parse(line);
      if (reqIdFilter && log.reqId !== reqIdFilter) return;
      process.stdout.write(prettyPrinter(log) + '\n');
    } catch (e) {
      process.stdout.write(line + '\n');
    }
  });
}

tailLogs().catch(console.error);
