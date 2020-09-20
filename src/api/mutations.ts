import { useMutation, MutationTuple, ApolloError } from '@apollo/client';
import { Dispatch } from 'react-redux';
import { message } from 'antd';
import * as graphql from './schema';
import * as Interface from './interfaces';
import {
  followUserAction,
  unFollowUserAction,
  likePostAction,
  unLikePostAction,
  likeCommentAction,
  unLikeCommentAction,
  updateUserAction,
} from '../store/actions';

export const followUserMutation: (
  dispatch: Dispatch,
) => MutationTuple<
  Interface.FollowUserData,
  Interface.FollowUserVars
> = dispatch => {
  return useMutation(graphql.followUser, {
    onCompleted(data) {
      if (data && data.FollowUser) {
        message.success('关注成功');
        dispatch(followUserAction(data.FollowUser));
      }
    },
    onError(error) {
      message.error(error.message);
    },
  });
};

export const unFollowUserMutation: (
  dispatch: Dispatch,
) => MutationTuple<
  Interface.UnFollowUserData,
  Interface.UnFollowUserVars
> = dispatch => {
  return useMutation(graphql.unfollowUser, {
    onCompleted(data) {
      if (data.UnFollowUser) {
        message.success('取消关注成功');
        dispatch(unFollowUserAction(data.UnFollowUser));
      }
    },
    onError(error) {
      message.error(error.message);
    },
  });
};

export const likePostMutation: (
  dispatch: Dispatch,
) => MutationTuple<
  Interface.LikePostData,
  Interface.LikePostVars
> = dispatch => {
  return useMutation(graphql.likePost, {
    onCompleted(data) {
      if (data && data.LikePost) {
        dispatch(likePostAction(data.LikePost));
      }
    },
    onError(error) {
      message.error(error.message);
    },
  });
};

export const unLikePostMutation: (
  dispatch: Dispatch,
) => MutationTuple<
  Interface.UnLikePostData,
  Interface.UnLikePostVars
> = dispatch => {
  return useMutation(graphql.unlikePost, {
    onCompleted(data) {
      if (data.UnlikePost) {
        message.success('取消赞成功');
        dispatch(unLikePostAction(data.UnlikePost));
      }
    },
    onError(error) {
      message.error(error.message);
    },
  });
};

export const likeCommentMutation: (
  dispatch: Dispatch,
  callback: () => void,
) => MutationTuple<Interface.LikeCommentData, Interface.LikeCommentVars> = (
  dispatch,
  callback,
) => {
  return useMutation(graphql.likeComment, {
    onCompleted(data) {
      if (data && data.LikeComment) {
        dispatch(likeCommentAction(data.LikeComment));
        if (callback) {
          callback();
        }
      }
    },
    onError(error) {
      message.error(error.message);
    },
  });
};

export const unLikeCommentMutation: (
  dispatch: Dispatch,
  callback: () => void,
) => MutationTuple<Interface.UnLikeCommentData, Interface.UnLikeCommentVars> = (
  dispatch,
  callback,
) => {
  return useMutation(graphql.unlikeComment, {
    onCompleted(data) {
      if (data && data.UnlikeComment) {
        message.success('取消赞成功');
        dispatch(unLikeCommentAction(data.UnlikeComment));
        if (callback) {
          callback();
        }
      }
    },
    onError(error) {
      message.error(error.message);
    },
  });
};

export const signupMutation: (
  history: any,
) => MutationTuple<Interface.SignupData, Interface.SignupVars> = history =>
  useMutation(graphql.signup, {
    onCompleted() {
      message.success('注册成功，请登录！');
      setTimeout(history.push('/login'), 600);
    },
    onError(error) {
      message.error(error.message);
    },
  });

export const addCommentMutation: (
  errorCallback: (error: ApolloError) => void,
  completedCallback: () => void,
) => MutationTuple<Interface.AddCommentData, Interface.AddCommentVars> = (
  errorCallback,
  completedCallback,
) =>
  useMutation(graphql.addComment, {
    onError(error) {
      errorCallback(error);
    },
    onCompleted() {
      completedCallback();
    },
  });

export const addPostMutation: () => MutationTuple<
  Interface.AddPostsData,
  Interface.AddPostsVars
> = () => {
  return useMutation(graphql.addPost);
};

export const updateUserMutation: (
  dispatch: Dispatch,
) => MutationTuple<
  Interface.UpdateUserData,
  Interface.UpdateUserVars
> = dispatch => {
  return useMutation(graphql.updateUser, {
    onCompleted(data) {
      if (data && data.UpdateUser) {
        message.success('更新成功!');
        dispatch(updateUserAction(data.UpdateUser));
      }
    },
    onError(error) {
      message.error(error.message);
    },
  });
};
