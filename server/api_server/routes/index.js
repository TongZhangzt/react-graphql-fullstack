const express = require('express');
const login = require('./login');
const logout = require('./logout');
const router = express.Router();

router.use('/api', login);
router.use('/api', logout);

// Error handling middleware
router.use((err, req, res, next) => {
  // Error code and message
  const errCode = err.code || 500;
  const errMsg = err.message || '服务器错误，请稍后重试';
  res.status(errCode).json({
    code: errCode,
    message: errMsg,
  });
});

module.exports = router;
