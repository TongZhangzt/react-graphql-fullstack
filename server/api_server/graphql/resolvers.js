const { UserInputError, AuthenticationError } = require('apollo-server');
const { cryptoPassword } = require('../utils/index');
const { Sequelize } = require('sequelize');

// get the userId from the context
const getLoggedInUserId = session => {
  if (session && session.userId) {
    return +session.userId;
  } else {
    throw new AuthenticationError('操作前请先登录');
  }
};

const isSqlite = database => database.options.dialect === 'sqlite';

// The root provides a resolver function for each API endpoint
const resolvers = {
  Query: {
    async User(_, { userId }, { database }) {
      return await database.models.user.findByPk(userId);
    },
    async Post(_, { postId }, { database }) {
      return await database.models.post
        .increment('view_count', {
          by: 1,
          where: {
            id: postId,
          },
        })
        .then(res => {
          return database.models.post.findByPk(postId);
        });
    },
    async PostComments(_, { postId }, { database }) {
      return await database.models.comment.findAll({
        where: { post_id: postId },
      });
    },
    async UserPosts(_, { userId }, { database }) {
      return await database.models.post.findAll({
        where: { user_id: userId, is_public: 1 },
      });
    },
    async UserActivities(_, { userId }, { database }) {
      let activities = [];
      // get user's posts
      const posts = await database.models.post.findAll({
        where: { user_id: userId },
      });
      // get user's comments and the related post
      const comments = await database.models.comment.findAll({
        where: { user_id: userId },
        include: [database.models.post],
      });

      posts.forEach(post => activities.push({ post }));
      comments.forEach(comment =>
        activities.push({ post: comment.post, comment }),
      );

      return activities;
    },
    async UserLastUpdatedPosts(_, { userId }, { database }) {
      return await database.models.post
        .findAll({ where: { user_id: userId } })
        .then(posts => posts.filter(post => post.comment_count > 0));
    },
    async UserLikedPosts(_, { userId }, { database }) {
      return await database.models.post_likes
        .findAll({
          where: { user_id: userId },
          include: [database.models.post],
        })
        .then(result => result.map(like => like.post));
    },
    async UserFollowers(_, { userId }, { database }) {
      return await database.models.follow
        .findAll({
          where: { followed_user_id: userId },
          include: [database.models.user],
        })
        .then(result => result.map(follow => follow.user));
    },
    async UserFollowings(_, { userId }, { database }) {
      return await database.models.follow
        .findAll({
          where: { user_id: userId },
        })
        .then(result => {
          return database.models.user.findAll({
            where: {
              id: result.map(follow => follow.followed_user_id),
            },
          });
        });
    },
    async PostList(_, { offset, limit }, { database }) {
      return await database.models.post.findAll({
        offset,
        limit,
        where: { is_public: 1 },
      });
    },
    async RecommendedUsers(_, args, { session, database }) {
      let users = await database.models.user.findAll({
        limit: 6,
        order: [Sequelize.literal(isSqlite(database) ? 'RANDOM()' : 'RAND()')],
      });
      // filter out the loggedIn User
      if (session && session.userId) {
        users = users.filter(user => user.id !== +session.userId);
      }
      return users;
    },
    async RecommendedPosts(_, { postId }, { database }) {
      return await database.models.post.findAll({
        where: { id: { [Sequelize.Op.not]: postId }, is_public: 1 },
        limit: 4,
      });
    },
    async LoggedInUser(_, args, { session, database }) {
      if (
        session &&
        session.userId &&
        parseInt(session.expire) > new Date().getTime()
      ) {
        return await database.models.user.findByPk(+session.userId);
      }
      return null;
    },
  },
  User: {
    async statistics(parent, _, { database }) {
      return await database.models.user_statistics.findOne({
        where: { user_id: parent.id },
      });
    },
    async likedPostIds(parent, _, { database }) {
      return await database.models.post_likes
        .findAll({
          where: { user_id: parent.id },
        })
        .then(res => res.map(like => like.post_id));
    },
    async followingUserIds(parent, _, { database }) {
      return await database.models.follow
        .findAll({
          where: { user_id: parent.id },
        })
        .then(res => res.map(follow => follow.followed_user_id));
    },
    async likedCommentIds(parent, _, { database }) {
      return await database.models.comment_likes
        .findAll({
          where: { user_id: parent.id },
        })
        .then(res => res.map(like => like.comment_id));
    },
  },
  Post: {
    async author(parent, _, { database }) {
      return await database.models.user.findOne({
        where: { id: parent.user_id },
      });
    },
  },
  Comment: {
    async user(parent, _, { database }) {
      return await database.models.user.findOne({
        where: { id: parent.user_id },
      });
    },
  },
  Mutation: {
    async Signup(_, { user }, { database }) {
      if (!user.name || !user.phone || !user.password) {
        throw new UserInputError('昵称/手机号/密码不能为空');
      }

      const newUser = {
        ...user,
        avatar: '2',
        is_verified: false,
        password: cryptoPassword(user.password),
      };
      const res = await database.models.user.create(newUser);
      await database.models.user_statistics.create({ user_id: res.id });

      return res;
    },
    async AddComment(_, { comment }, { session, database }) {
      const user_id = getLoggedInUserId(session);

      const newComment = {
        ...comment,
        user_id,
      };

      const res = await database.models.comment.create(newComment);
      // update the comment count in the post
      await database.models.post.increment('comment_count', {
        by: 1,
        where: {
          id: comment.post_id,
        },
      });

      return res;
    },
    async LikePost(_, { like }, { session, database }) {
      const { post_id } = like;
      const user_id = getLoggedInUserId(session);

      const res = await database.models.post_likes.create({
        user_id,
        post_id,
      });

      // update the like count in the post
      await database.models.post.increment('like_count', {
        by: 1,
        where: {
          id: post_id,
        },
      });

      return res;
    },
    async UnlikePost(_, { unlike }, { session, database }) {
      const { post_id } = unlike;
      const user_id = getLoggedInUserId(session);

      await database.models.post_likes.destroy({
        where: { user_id, post_id },
      });

      // update the like count in the post
      await database.models.post.decrement('like_count', {
        by: 1,
        where: {
          id: post_id,
        },
      });

      return { user_id, post_id };
    },
    async FollowUser(_, { follow }, { session, database }) {
      const { followed_user_id } = follow;
      const user_id = getLoggedInUserId(session);

      const res = await database.models.follow.create({
        user_id,
        followed_user_id,
      });

      // update the follower count and following count
      await database.models.user_statistics.increment('following_count', {
        by: 1,
        where: {
          user_id,
        },
      });
      await database.models.user_statistics.increment('follower_count', {
        by: 1,
        where: {
          user_id: followed_user_id,
        },
      });

      return res;
    },
    async UnFollowUser(_, { unFollow }, { session, database }) {
      const { followed_user_id } = unFollow;
      const user_id = getLoggedInUserId(session);

      await database.models.follow.destroy({
        where: { user_id, followed_user_id },
      });

      // update the follower count and following count
      await database.models.user_statistics.decrement('following_count', {
        by: 1,
        where: {
          user_id,
        },
      });
      await database.models.user_statistics.decrement('follower_count', {
        by: 1,
        where: {
          user_id: followed_user_id,
        },
      });

      return { user_id, followed_user_id };
    },
    async LikeComment(_, { like }, { session, database }) {
      const { comment_id } = like;
      const user_id = getLoggedInUserId(session);

      const res = await database.models.comment_likes.create({
        user_id,
        comment_id,
      });

      // update the comment like count
      await database.models.comment.increment('like_count', {
        by: 1,
        where: {
          id: comment_id,
        },
      });

      return res;
    },
    async UnlikeComment(_, { unlike }, { session, database }) {
      const { comment_id } = unlike;
      const user_id = getLoggedInUserId(session);

      await database.models.comment_likes.destroy({
        where: { user_id, comment_id },
      });

      // update the comment like count
      await database.models.comment.decrement('like_count', {
        by: 1,
        where: {
          id: comment_id,
        },
      });

      return { user_id, comment_id };
    },
    async AddPost(_, { post }, { session, database }) {
      const user_id = getLoggedInUserId(session);

      const newPost = {
        user_id,
        ...post,
      };

      const res = await database.models.post.create(newPost);

      // update the post  count
      await database.models.user_statistics.increment('post_count', {
        by: 1,
        where: {
          user_id: user_id,
        },
      });

      return res;
    },
    async UpdateUser(_, { user }, { session, database }) {
      const user_id = getLoggedInUserId(session);

      await database.models.user.update(
        { ...user },
        {
          where: { id: user_id },
        },
      );

      return user;
    },
  },
};

module.exports = {
  resolvers,
};
