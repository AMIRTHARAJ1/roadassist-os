import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, '..', 'test-results.json');
const csvFilePath = path.join(__dirname, '..', 'test_report.csv');

if (!fs.existsSync(jsonFilePath)) {
  console.error('test-results.json not found! Ensure mocha was run with --reporter json > test-results.json');
  process.exit(1);
}

const rawData = fs.readFileSync(jsonFilePath, 'utf8');
let report;
try {
  report = JSON.parse(rawData);
} catch (e) {
  console.error('Failed to parse test-results.json. It might not be valid JSON.');
  process.exit(1);
}

// Prepare CSV Headers
let csvContent = 'Test Suite,Test Name,Status,Duration (ms),Error Message\n';

if (report.passes) {
  report.passes.forEach(test => {
    const fullTitle = `"${test.fullTitle.replace(/"/g, '""')}"`;
    const title = `"${test.title.replace(/"/g, '""')}"`;
    csvContent += `${fullTitle},${title},Passed,${test.duration || 0},""\n`;
  });
}

if (report.failures) {
  report.failures.forEach(test => {
    const fullTitle = `"${test.fullTitle.replace(/"/g, '""')}"`;
    const title = `"${test.title.replace(/"/g, '""')}"`;
    const err = test.err && test.err.message ? `"${test.err.message.replace(/"/g, '""')}"` : '""';
    csvContent += `${fullTitle},${title},Failed,${test.duration || 0},${err}\n`;
  });
}

fs.writeFileSync(csvFilePath, csvContent);
console.log(`Successfully generated CSV report at ${csvFilePath}`);
