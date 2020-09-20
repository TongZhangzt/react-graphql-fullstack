const crypto = require('crypto');

// crypto password
const cryptoPassword = password =>
  crypto
    .createHash('md5')
    .update(password)
    .digest('hex');

module.exports = {
  cryptoPassword,
};
