import { gql } from '@apollo/client';

/** Queries */
export const getPostList = gql`
  query GetPostList($offset: Int, $limit: Int) {
    PostList(offset: $offset, limit: $limit) {
      id
      user_id
      cover_image
      like_count
      title
      summary
      author {
        name
      }
      comment_count
      asset_amount
    }
  }
`;

export const getRecommendedUsers = gql`
  query GetRecommendedUsers {
    RecommendedUsers {
      id
      name
      avatar
      statistics {
        character_count
        like_count
      }
    }
  }
`;

export const getPostDetail = gql`
  query GetPostDetail($postId: Int!) {
    Post(postId: $postId) {
      id
      last_modified_at
      user_id
      character_count
      like_count
      view_count
      asset_amount
      title
      content
      comment_count
      author {
        name
        introduction
        statistics {
          asset_amount
          character_count
          like_count
          follower_count
        }
        avatar
      }
    }
  }
`;

export const getFullUserInfo = gql`
  query GetFullUserInfo($userId: Int!) {
    User(userId: $userId) {
      id
      gender
      name
      avatar
      is_verified
      introduction
      statistics {
        following_count
        follower_count
        post_count
        character_count
        like_count
        asset_amount
      }
    }
  }
`;

export const getUserPosts = gql`
  query GetUserPosts($userId: Int!) {
    UserPosts(userId: $userId) {
      id
      title
      summary
      created_at
      last_modified_at
      cover_image
      like_count
      view_count
      comment_count
      asset_amount
    }
  }
`;

export const getUserActivities = gql`
  query GetUserActivities($userId: Int!) {
    UserActivities(userId: $userId) {
      post {
        id
        cover_image
        like_count
        view_count
        title
        summary
        comment_count
        created_at
        last_modified_at
      }
      comment {
        content
        created_at
      }
    }
  }
`;

export const getUserLastUpdatedPosts = gql`
  query GetUserLastUpdatedPosts($userId: Int!) {
    UserLastUpdatedPosts(userId: $userId) {
      id
      created_at
      last_modified_at
      cover_image
      like_count
      view_count
      title
      summary
      comment_count
    }
  }
`;

export const getUserFollowers = gql`
  query GetUserFollowers($userId: Int!) {
    UserFollowers(userId: $userId) {
      id
      gender
      name
      avatar
      statistics {
        following_count
        follower_count
        post_count
        character_count
        like_count
      }
    }
  }
`;

export const getUserFollowings = gql`
  query GetUserFollowings($userId: Int!) {
    UserFollowings(userId: $userId) {
      id
      gender
      name
      avatar
      statistics {
        following_count
        follower_count
        post_count
        character_count
        like_count
      }
    }
  }
`;

export const getUserLikedPosts = gql`
  query GetUserLikedPosts($userId: Int!) {
    UserLikedPosts(userId: $userId) {
      id
      created_at
      last_modified_at
      cover_image
      title
      summary
      like_count
      view_count
      comment_count
      author {
        name
        avatar
      }
    }
  }
`;

export const getPostComments = gql`
  query GetPostComments($postId: Int!) {
    PostComments(postId: $postId) {
      id
      post_id
      user_id
      parent_id
      content
      created_at
      like_count
      user {
        name
        avatar
      }
    }
  }
`;

export const getRecommendedPosts = gql`
  query GetRecommendedPosts($postId: Int!) {
    RecommendedPosts(postId: $postId) {
      id
      created_at
      last_modified_at
      view_count
      title
    }
  }
`;

export const getLoggedInUser = gql`
  query GetLoggedInUser {
    LoggedInUser {
      id
      gender
      name
      phone
      email
      avatar
      is_verified
      introduction
      likedPostIds
      followingUserIds
      likedCommentIds
    }
  }
`;

/** Mutations */
export const signup = gql`
  mutation Signup($user: SignupInput!) {
    Signup(user: $user) {
      name
      phone
      password
    }
  }
`;

export const followUser = gql`
  mutation FollowUser($follow: FollowUserInput!) {
    FollowUser(follow: $follow) {
      user_id
      followed_user_id
    }
  }
`;

export const unfollowUser = gql`
  mutation UnFollowUser($unFollow: FollowUserInput!) {
    UnFollowUser(unFollow: $unFollow) {
      user_id
      followed_user_id
    }
  }
`;

export const likePost = gql`
  mutation LikePost($like: LikePostInput!) {
    LikePost(like: $like) {
      user_id
      post_id
    }
  }
`;

export const unlikePost = gql`
  mutation UnlikePost($unlike: LikePostInput!) {
    UnlikePost(unlike: $unlike) {
      user_id
      post_id
    }
  }
`;

export const addComment = gql`
  mutation AddComment($comment: CommentInput) {
    AddComment(comment: $comment) {
      post_id
      user_id
    }
  }
`;

export const likeComment = gql`
  mutation LikeComment($like: LikeCommentInput!) {
    LikeComment(like: $like) {
      user_id
      comment_id
    }
  }
`;

export const unlikeComment = gql`
  mutation UnlikeComment($unlike: LikeCommentInput!) {
    UnlikeComment(unlike: $unlike) {
      user_id
      comment_id
    }
  }
`;

export const addPost = gql`
  mutation AddPost($post: AddPostInput!) {
    AddPost(post: $post) {
      id
      user_id
      title
    }
  }
`;

export const updateUser = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    UpdateUser(user: $user) {
      name
      introduction
      phone
      email
    }
  }
`;
