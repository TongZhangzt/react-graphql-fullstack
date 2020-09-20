const { config, settings } = require('./config');
const Sequelize = require('sequelize');
const { createMockData } = require('./mock');

const database = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...settings,
  },
);

const Users = database.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: Sequelize.STRING(50),
    validate: {
      isEmail: true,
    },
    unique: {
      args: 'email',
      msg: '该邮箱已注册!',
    },
  },
  phone: {
    type: Sequelize.STRING(12),
    allowNull: false,
    unique: {
      args: 'phone',
      msg: '该手机号已注册!',
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  introduction: {
    type: Sequelize.STRING(100),
  },
  gender: {
    type: Sequelize.STRING(10),
  },
  name: {
    type: Sequelize.STRING(20),
    allowNull: false,
    unique: {
      args: 'name',
      msg: '该昵称已被占用!',
    },
  },
  avatar: { type: Sequelize.STRING, defaultValue: '0' },
  is_verified: { type: Sequelize.INTEGER, defaultValue: 0 },
});

const Posts = database.define('post', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  summary: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  cover_image: {
    type: Sequelize.STRING(20),
  },
  character_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  like_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  view_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  comment_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  asset_amount: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
  },
  is_public: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  last_modified_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

const UserStatistics = database.define(
  'user_statistics',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    character_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    like_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    post_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    follower_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    following_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    asset_amount: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
  },
  {
    tableName: 'user_statistics',
  },
);

const Comments = database.define('comment', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  post_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  parent_id: {
    type: Sequelize.INTEGER,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  like_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

const Follows = database.define('follow', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    unique: 'user_follow',
    allowNull: false,
  },
  followed_user_id: {
    type: Sequelize.INTEGER,
    unique: 'user_follow',
    allowNull: false,
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

const PostLikes = database.define(
  'post_likes',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      unique: 'user_like',
      allowNull: false,
    },
    post_id: {
      type: Sequelize.INTEGER,
      unique: 'user_like',
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: 'post_likes',
  },
);

const CommentLikes = database.define(
  'comment_likes',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      unique: 'user_like',
      allowNull: false,
    },
    comment_id: {
      type: Sequelize.INTEGER,
      unique: 'user_like',
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    table_name: 'comment_likes',
  },
);

/** Model Assocaitions */
// Users - UserStatistics
Users.hasOne(UserStatistics);
// Users - Posts
Users.hasMany(Posts);
Posts.belongsTo(Users);
// Users - Comments
Users.hasMany(Comments);
Comments.belongsTo(Users);
// Posts - Comments
Posts.hasMany(Comments);
Comments.belongsTo(Posts);
// Users - Follows
Users.hasMany(Follows);
Follows.belongsTo(Users);
// Users - PostLikes
Users.hasMany(PostLikes);
PostLikes.belongsTo(Users);
// Users - CommentLikes
Users.hasMany(CommentLikes);
CommentLikes.belongsTo(Users);
// Posts - PostLikes
Posts.hasMany(PostLikes);
PostLikes.belongsTo(Posts);
// Comments - CommentLikes
Comments.hasMany(CommentLikes);
CommentLikes.belongsTo(Comments);

// create mock data for sqlite database
if (settings.dialect === 'sqlite') {
  createMockData(database);
}

module.exports = { database };
