/* eslint-disable import/no-extraneous-dependencies */
// devenvironment/start-dev-container.ts

import { execSync } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as net from 'node:net';
import * as readline from 'node:readline';

import * as dotenv from 'dotenv';

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const {
  DB_CONTAINER_NAME = 'postgres-dev',
  DB_PORT = '5432',
  DB_USER = 'postgres',
  DB_PASSWORD = 'postgres',
  DB_NAME = 'whitelabel_db',
  DB_IMAGE = 'postgres:15-alpine',
} = process.env;

const volumeDir = path.resolve(__dirname, './pgdata');

if (!fs.existsSync(volumeDir)) {
  console.log('📁 Creating volume directory...');
  fs.mkdirSync(volumeDir, { recursive: true });
}

function waitForPostgres(port: number, host = 'localhost'): Promise<void> {
  let dots = 0;
  const spinner = setInterval(() => {
    dots = (dots + 1) % 4;
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`⏳ Waiting for PostgreSQL${'.'.repeat(dots)} `);
  }, 500);

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const socket = net.connect(port, host, () => {
        clearInterval(interval);
        clearInterval(spinner);
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.log('🟢 PostgreSQL is ready for connections.');
        socket.end();
        resolve();
      });
      socket.on('error', () => socket.destroy());
    }, 1000);
  });
}

async function launchContainer(): Promise<void> {
  try {
    console.log(
      `🧼 Cleaning up any existing '${DB_CONTAINER_NAME}' container...`,
    );
    execSync(`docker rm -f ${DB_CONTAINER_NAME}`, { stdio: 'ignore' });
  } catch {
    console.log('ℹ️ No previous container found. Proceeding...');
  }

  console.log('🐳 Launching PostgreSQL container...');
  const dockerRunCommand = [
    'docker run -d --rm',
    `--name ${DB_CONTAINER_NAME}`,
    `-e POSTGRES_USER=${DB_USER}`,
    `-e POSTGRES_PASSWORD=${DB_PASSWORD}`,
    `-e POSTGRES_DB=${DB_NAME}`,
    `-p ${DB_PORT}:5432`,
    `-v "${volumeDir}:/var/lib/postgresql/data"`,
    DB_IMAGE,
  ].join(' ');

  try {
    execSync(dockerRunCommand, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to run Docker container.');
    console.error(error);
    process.exit(1);
  }

  try {
    await waitForPostgres(Number(DB_PORT));
    console.log(
      `✅ Container '${DB_CONTAINER_NAME}' is running on port ${DB_PORT}`,
    );
  } catch {
    console.error('❌ Failed waiting for PostgreSQL to become available.');
    try {
      const logs = execSync(`docker logs ${DB_CONTAINER_NAME}`, {
        encoding: 'utf-8',
      });
      console.error('📋 Container logs:\n', logs);
    } catch {
      console.error('⚠️ Could not read container logs.');
    }
    process.exit(1);
  }
}

void launchContainer();
