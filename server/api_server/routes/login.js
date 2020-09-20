require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { database } = require('../database/model');
const { resolvers } = require('../graphql/resolvers');
const { cryptoPassword } = require('../utils/index');
const { Sequelize } = require('sequelize');
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await database.models.user.findOne({
      where: { [Sequelize.Op.or]: [{ email: username }, { phone: username }] },
      raw: true,
    });

    if (!user) {
      res.status(200).send({
        success: false,
        message: '手机号码/邮箱地址格式错误',
      });
      return;
    }

    if (user.password !== cryptoPassword(password)) {
      res.status(200).send({
        success: false,
        message: '手机号码/邮箱地址和密码不匹配',
      });
      return;
    }

    // get more user detailed info if verified
    const statistics = await resolvers.User.statistics({ id: user.id }, null, {
      database,
    });
    const followingUserIds = await resolvers.User.followingUserIds(
      { id: user.id },
      null,
      { database },
    );
    const likedPostIds = await resolvers.User.likedPostIds(
      { id: user.id },
      null,
      { database },
    );
    const likedCommentIds = await resolvers.User.likedCommentIds(
      { id: user.id },
      null,
      { database },
    );

    const token = jwt.sign(
      { userId: '' + user.id, expire: new Date().getTime() + 604800000 },
      SECRET_KEY,
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      domain: 'localhost',
      // sameSite: 'none',
      // secure: true, //on HTTPS
      maxAge: 604800000,
    });

    // set another not http only cookie to record expire time
    // on client side
    res.cookie('session_expire', new Date().getTime() + 604800000, {
      httpOnly: false,
      domain: 'localhost',
      // sameSite: 'none',
      // secure: true, //on HTTPS
    });

    res.send({
      success: true,
      data: {
        user: {
          ...user,
          statistics,
          followingUserIds,
          likedCommentIds,
          likedPostIds,
        },
      },
    });
  } catch (error) {
    next({ code: 500, message: '登录失败，请重试' });
  }
});

module.exports = router;
