import dotenv from 'dotenv';

dotenv.config();
const environments = {
  isDev: process.env.MODE === 'development',
  apiBaseUrl: process.env.API_BASE_URL,
};

export default environments;
