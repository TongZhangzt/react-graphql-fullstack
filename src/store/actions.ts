import { User, LikeComment, LikePost, Follow } from '../utils/types';
import {
  LOGIN_USER,
  LOGOUT_USER,
  FOLLOW_USER,
  UNFOLLOW_USER,
  UNLIKE_POST,
  LIKE_POST,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  UPDATE_USER,
} from './constants';
import { UpdateUserInput } from '../api/interfaces';

export const loginAction = (user: User) => ({
  type: LOGIN_USER,
  user,
});

export const logoutAction = () => ({
  type: LOGOUT_USER,
});

export const followUserAction = (follow: Follow) => ({
  type: FOLLOW_USER,
  follow,
});

export const unFollowUserAction = (unfollow: Follow) => ({
  type: UNFOLLOW_USER,
  unfollow,
});

export const likePostAction = (like: LikePost) => ({
  type: LIKE_POST,
  like,
});

export const unLikePostAction = (unlike: LikePost) => ({
  type: UNLIKE_POST,
  unlike,
});

export const likeCommentAction = (like: LikeComment) => ({
  type: LIKE_COMMENT,
  like,
});

export const unLikeCommentAction = (unlike: LikeComment) => ({
  type: UNLIKE_COMMENT,
  unlike,
});

export const updateUserAction = (user: UpdateUserInput) => ({
  type: UPDATE_USER,
  user,
});
