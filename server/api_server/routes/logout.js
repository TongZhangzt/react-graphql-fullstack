const express = require('express');
const router = express.Router();
const { database } = require('../database/model');

router.post('/logout', async (req, res) => {
  const { id } = req.body;

  try {
    const user = await database.models.user.findByPk(id);

    if (!user) {
      res.status(200).send({
        success: false,
        message: `登出的用户不存在`,
      });
      return;
    }

    // clear all the cookie
    res.clearCookie('jwt');
    res.clearCookie('session_expire');

    res.send({
      success: true,
    });
  } catch (error) {
    next({ code: 500, message: '登出失败，请重试' });
  }
});

module.exports = router;
