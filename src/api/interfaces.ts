import {
  Post,
  Comment,
  User,
  Activity,
  Follow,
  LikeComment,
  LikePost,
} from '../utils/types';

export interface PostDetailData {
  Post: Post;
}

export interface PostDetailVars {
  postId: number;
}

export interface PostCommentsData {
  PostComments: Comment[];
}

export interface PostCommentsVars {
  postId: number;
}

export interface UserPostsData {
  UserPosts: Post[];
}

export interface UserPostsVars {
  userId: number;
}

export interface FollowUserData {
  FollowUser: Follow;
}

export interface FollowUserVars {
  follow: FollowUserInput;
}

export interface UnFollowUserData {
  UnFollowUser: Follow;
}

export interface UnFollowUserVars {
  unFollow: FollowUserInput;
}

export interface LikePostData {
  LikePost: LikePost;
}

export interface LikePostVars {
  like: LikePostInput;
}

export interface UnLikePostData {
  UnlikePost: LikePost;
}

export interface UnLikePostVars {
  unlike: LikePostInput;
}

export interface LikeCommentData {
  LikeComment: LikeComment;
}

export interface LikeCommentVars {
  like: LikeCommentInput;
}

export interface UnLikeCommentData {
  UnlikeComment: LikeComment;
}

export interface UnLikeCommentVars {
  unlike: LikeCommentInput;
}

export interface AddCommentData {
  AddComment: {
    id: number;
    post_id: number;
    user_id: number;
  };
}

export interface AddCommentVars {
  comment: AddCommentInput;
}

export interface FullUserInfoData {
  User: User;
}

export interface FullUserInfoVars {
  userId: number;
}

export interface RecommendedPostsData {
  RecommendedPosts: Post[];
}

export interface RecommendedPostsVars {
  postId: number;
}

export interface PostListData {
  PostList: Post[];
}

export interface PostListVars {
  offset: number;
  limit: number;
}

export interface RecommendedUsersData {
  RecommendedUsers: User[];
}

export interface SignupVars {
  user: SignupInput;
}

export interface SignupData {
  Signup: SignupInput;
}

export interface UserActivitiesData {
  UserActivities: Activity[];
}

export interface UserActivitiesVars {
  userId: number;
}

export interface UserLastUpdatedPostsData {
  UserLastUpdatedPosts: Post[];
}

export interface UserLastUpdatedPostsVars {
  userId: number;
}

export interface UserFollowersData {
  UserFollowers: User[];
}

export interface UserFollowersVars {
  userId: number;
}

export interface UserFollowingsData {
  UserFollowings: User[];
}

export interface UserFollowingsVars {
  userId: number;
}

export interface UserLikedPostsData {
  UserLikedPosts: Post[];
}

export interface UserLikedPostsVars {
  userId: number;
}

export interface AddPostsData {
  AddPost: {
    id: number;
    user_id: number;
    title: string;
  };
}

export interface AddPostsVars {
  post: AddPostInput;
}

export interface UpdateUserData {
  UpdateUser: UpdateUserInput;
}

export interface UpdateUserVars {
  user: UpdateUserInput;
}

export interface LikeCommentInput {
  comment_id: number;
}

export interface LikePostInput {
  post_id: number;
}

export interface FollowUserInput {
  followed_user_id: number;
}

export interface AddCommentInput {
  post_id: number;
  content: string;
  parent_id?: number;
}

export interface SignupInput {
  name: String;
  phone: String;
  password: String;
}

export interface AddPostInput {
  title: string;
  summary: string;
  character_count: number;
  content: string;
  cover_image: string;
}

export interface UpdateUserInput {
  name?: string;
  introduction?: string;
  phone?: string;
  email?: string;
  gender?: string;
}
