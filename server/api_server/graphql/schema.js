const { gql } = require('apollo-server-express');

// Construct a type definition
const typeDefs = gql`
  type Query {
    User(userId: Int): User
    Post(postId: Int): Post
    PostComments(postId: Int): [Comment!]
    UserPosts(userId: Int): [Post!]
    UserActivities(userId: Int): [Activity!]
    UserLastUpdatedPosts(userId: Int): [Post!]
    UserLikedPosts(userId: Int): [Post!]
    UserFollowers(userId: Int): [User!]
    UserFollowings(userId: Int): [User!]
    RecommendedPosts(postId: Int): [Post]
    PostList(offset: Int, limit: Int): [Post]
    RecommendedUsers: [User]
    LoggedInUser: User
  }

  type Mutation {
    Signup(user: SignupInput): User
    AddComment(comment: CommentInput): Comment
    LikePost(like: LikePostInput): LikePost
    UnlikePost(unlike: LikePostInput): LikePost
    FollowUser(follow: FollowUserInput): Follow
    UnFollowUser(unFollow: FollowUserInput): Follow
    LikeComment(like: LikeCommentInput): LikeComment
    UnlikeComment(unlike: LikeCommentInput): LikeComment
    AddPost(post: AddPostInput): Post
    UpdateUser(user: UpdateUserInput): User
  }

  type User {
    id: Int
    email: String
    phone: String
    password: String
    gender: String
    name: String
    introduction: String
    avatar: String
    is_verified: Boolean
    statistics: UserStatistics
    likedPostIds: [Int]
    followingUserIds: [Int]
    likedCommentIds: [Int]
  }

  type UserStatistics {
    id: Int
    user_id: Int
    like_count: Int
    post_count: Int
    asset_amount: Float
    character_count: Int
    follower_count: Int
    following_count: Int
  }

  type Post {
    id: Int
    user_id: Int
    title: String
    summary: String
    content: String
    created_at: String
    last_modified_at: String
    cover_image: String
    character_count: Int
    like_count: Int
    view_count: Int
    asset_amount: Float
    comment_count: Int
    author: User
  }

  type Comment {
    id: Int
    post_id: Int
    user_id: Int
    parent_id: Int
    content: String
    created_at: String
    like_count: Int
    user: User
  }

  type LikePost {
    id: Int
    user_id: Int
    post_id: Int
  }

  type LikeComment {
    id: Int
    user_id: Int
    comment_id: Int
  }

  type Activity {
    post: Post
    comment: Comment
  }

  type Follow {
    user_id: Int
    followed_user_id: Int
  }

  input SignupInput {
    name: String
    phone: String
    password: String
  }

  input CommentInput {
    post_id: Int
    content: String
    parent_id: Int
  }

  input LikePostInput {
    post_id: Int
  }

  input LikeCommentInput {
    comment_id: Int
  }

  input FollowUserInput {
    followed_user_id: Int
  }

  input AddPostInput {
    title: String
    summary: String
    character_count: Int
    content: String
    cover_image: String
  }

  input UpdateUserInput {
    name: String
    gender: String
    email: String
    phone: String
    introduction: String
  }
`;

module.exports = {
  typeDefs,
};
