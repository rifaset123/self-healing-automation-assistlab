import dotenv from 'dotenv';
import { devConfig } from '../env/dev';
import { EnvironmentConfig } from './interface';

dotenv.config();

const ENV = process.env.ENV || 'staging';

export const config: EnvironmentConfig = (() => {
  switch (ENV) {
    case 'dev': return devConfig;
    default:
      console.warn(`⚠️ Unknown ENV: "${ENV}", defaulting to "staging"`);
      return devConfig; // ✅ Always return a valid object
  }
})();
