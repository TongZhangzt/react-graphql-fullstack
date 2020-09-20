import dotenv from 'dotenv';

dotenv.config();
const environments = {
  isDev: process.env.NODE_ENV === 'development',
  apiBaseUrl: process.env.API_BASE_URL,
};

export default environments;
