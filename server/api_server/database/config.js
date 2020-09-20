const dontenv = require('dotenv');
dontenv.config();

const config = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  connectTimeout: 5000, // 连接超时
};

const settings = {
  host: config.host,
  dialect: process.env.DB_TYPE,
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
  },
  define: {
    timestamps: false,
    underscored: true,
  },
  logging: false,
};

if (process.env.DB_TYPE === 'sqlite') {
  settings.storage = './server/api_server/database/database.sqlite';
}

module.exports = {
  settings,
  config,
};
