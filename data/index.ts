import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { TestData } from '../utils/helper/interface';

dotenv.config();

const ENV = process.env.ENV || 'staging';
const dataFilePath = path.join(__dirname, `${ENV}.json`);

if (!fs.existsSync(dataFilePath)) {
  throw new Error(`❌ Test data file not found: ${dataFilePath}`);
}

export const testData: TestData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
