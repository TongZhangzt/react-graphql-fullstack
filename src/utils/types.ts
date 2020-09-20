export interface User {
  id: number;
  email: string;
  phone: string;
  password: string;
  gender: string;
  name: string;
  introduction: string;
  avatar: string;
  is_verified: boolean;
  statistics?: UserStatistics;
  likedPostIds?: [number];
  followingUserIds?: [number];
  likedCommentIds?: [number];
}

export interface UserStatistics {
  user_id: number;
  like_count: number;
  post_count: number;
  asset_amount: number;
  character_count: number;
  follower_count: number;
  following_count: number;
}

export interface Post {
  id: number;
  created_at: string;
  last_modified_at: string;
  user_id: number;
  cover_image: string;
  title: string;
  summary: string;
  content: string;
  character_count: number;
  like_count: number;
  view_count: number;
  asset_amount: number;
  comment_count: number;
  author?: User;
}

export interface Activity {
  post: Post;
  comment?: Comment;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  like_count: number;
  user?: User;
  parent_id?: number;
  subComments?: Comment[];
}

export interface LikePost {
  user_id: number;
  post_id: number;
}

export interface LikeComment {
  user_id: number;
  comment_id: number;
}

export interface Follow {
  user_id: number;
  followed_user_id: number;
}

export interface UIState {
  user: User;
}

export interface UIRoute {
  path: string;
  component: React.Component;
  noAuth?: boolean;
  auth?: boolean;
  noBackToTop?: boolean;
  exact?: boolean;
}
