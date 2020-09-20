import { combineReducers } from 'redux';
import { UIState } from '../utils/types';
import {
  LOGIN_USER,
  LOGOUT_USER,
  FOLLOW_USER,
  UNFOLLOW_USER,
  LIKE_POST,
  UNLIKE_POST,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  UPDATE_USER,
} from './constants';

const initialState: UIState = {
  user: null,
};

const user = (state = initialState.user, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...action.user,
      };
    case LOGOUT_USER:
      return null;
    case FOLLOW_USER:
      return {
        ...state,
        followingUserIds: [
          ...state.followingUserIds,
          action.follow.followed_user_id,
        ],
      };
    case UNFOLLOW_USER:
      return {
        ...state,
        followingUserIds: state.followingUserIds.filter(
          id => id !== action.unfollow.followed_user_id,
        ),
      };
    case LIKE_POST:
      return {
        ...state,
        likedPostIds: [...state.likedPostIds, action.like.post_id],
      };
    case UNLIKE_POST:
      return {
        ...state,
        likedPostIds: state.likedPostIds.filter(
          id => id !== action.unlike.post_id,
        ),
      };
    case LIKE_COMMENT:
      return {
        ...state,
        likedCommentIds: [...state.likedCommentIds, action.like.comment_id],
      };
    case UNLIKE_COMMENT:
      return {
        ...state,
        likedCommentIds: state.likedCommentIds.filter(
          id => id !== action.unlike.comment_id,
        ),
      };
    case UPDATE_USER:
      return {
        ...state,
        ...action.user,
      };
    default:
      return state;
  }
};

const reducers = combineReducers({ user });
export default reducers;
