require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const { database } = require('../database/model');

const context = ({ req }) => {
  // get the jwt cookie from request header
  const token =
    (req.headers.cookie && req.headers.cookie.split(';')[0].slice(4)) || '';
  let session = null;
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY) || null;
    // verify the session is not expired
    if (decodedToken && parseInt(decodedToken.expire) > new Date().getTime()) {
      session = decodedToken;
    }
  } catch (e) {
  } finally {
    return {
      session,
      database,
    };
  }
};

module.exports = {
  context,
};
