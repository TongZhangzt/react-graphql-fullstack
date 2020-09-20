import {
  useQuery,
  useLazyQuery,
  QueryResult,
  QueryTuple,
} from '@apollo/client';
import * as graphql from './schema';
import * as Interface from './interfaces';

export const postDetailQuery: (
  postId: number,
  callback: (data: any) => void,
) => QueryResult<Interface.PostDetailData, Interface.PostDetailVars> = (
  postId,
  callback,
) =>
  useQuery(graphql.getPostDetail, {
    variables: { postId },
    onCompleted: data => callback(data),
  });

export const postCommentsQuery: (
  postId: number,
) => QueryResult<
  Interface.PostCommentsData,
  Interface.PostCommentsVars
> = postId =>
  useQuery(graphql.getPostComments, {
    variables: { postId },
  });

export const userPostsQuery: (
  userId: number,
) => QueryResult<Interface.UserPostsData, Interface.UserPostsVars> = userId =>
  useQuery(graphql.getUserPosts, {
    variables: { userId },
  });

export const fullUserInfoQuery: (
  userId: number,
) => QueryResult<
  Interface.FullUserInfoData,
  Interface.FullUserInfoVars
> = userId =>
  useQuery(graphql.getFullUserInfo, {
    variables: { userId },
  });

export const recommendedPostsQuery: (
  postId: number,
) => QueryResult<
  Interface.RecommendedPostsData,
  Interface.RecommendedPostsVars
> = postId =>
  useQuery(graphql.getRecommendedPosts, {
    variables: { postId },
  });

export const postListQuery: (params: {
  offset: number;
  limit: number;
}) => QueryResult<Interface.PostListData, Interface.PostListVars> = ({
  offset,
  limit,
}) =>
  useQuery(graphql.getPostList, {
    variables: {
      offset,
      limit,
    },
    fetchPolicy: 'cache-and-network',
  });

export const recommendedUserQuery: () => QueryResult<
  Interface.RecommendedUsersData
> = () => useQuery(graphql.getRecommendedUsers);

export const userActivitiesLazyQuery: (
  userId: number,
) => QueryTuple<
  Interface.UserActivitiesData,
  Interface.UserActivitiesVars
> = userId =>
  useLazyQuery(graphql.getUserActivities, { variables: { userId } });

export const userLastUpdatedPostsLazyQuery: (
  userId: number,
) => QueryTuple<
  Interface.UserLastUpdatedPostsData,
  Interface.UserLastUpdatedPostsVars
> = userId =>
  useLazyQuery(graphql.getUserLastUpdatedPosts, { variables: { userId } });

export const userFollowersQuery: (
  userId: number,
) => QueryResult<
  Interface.UserFollowersData,
  Interface.UserFollowersVars
> = userId => useQuery(graphql.getUserFollowers, { variables: { userId } });

export const userFollowingsQuery: (
  userId: number,
) => QueryResult<
  Interface.UserFollowingsData,
  Interface.UserFollowingsVars
> = userId => useQuery(graphql.getUserFollowings, { variables: { userId } });

export const userLikedPostsQuery: (
  userId: number,
) => QueryResult<
  Interface.UserLikedPostsData,
  Interface.UserLikedPostsVars
> = userId => useQuery(graphql.getUserLikedPosts, { variables: { userId } });
