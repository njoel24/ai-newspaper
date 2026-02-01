#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, 'package.json');

// Read original package.json
const originalContent = readFileSync(packageJsonPath, 'utf8');
const packageJson = JSON.parse(originalContent);

// Backup peerDependencies
const peerDeps = { ...packageJson.peerDependencies };

console.log('📦 Converting peerDependencies to dependencies for standalone build...');

// Move peerDependencies to dependencies
packageJson.dependencies = {
  ...packageJson.dependencies,
  ...peerDeps
};
delete packageJson.peerDependencies;

// Write modified package.json
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

try {
  console.log('🔨 Building standalone package...');
  execSync('npm run build:standalone', { stdio: 'inherit' });
  console.log('✅ Standalone build complete!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exitCode = 1;
} finally {
  console.log('🔄 Restoring original package.json...');
  writeFileSync(packageJsonPath, originalContent);
  console.log('✅ package.json restored');
}
