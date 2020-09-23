import * as React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Skeleton, message } from 'antd';
import { connect, Dispatch, FetchResult } from 'react-redux';

import { ErrorComponent } from '../../components';
import { avatars } from '../../utils/images';
import {
  AuthorInfo,
  BottomBar,
  SideTools,
  RecommendList,
  LikeAndDonate,
  Comments,
} from './components/index';
import {
  followUserMutation,
  likePostMutation,
  unLikePostMutation,
  addCommentMutation,
} from '../../api/mutations';
import { postCommentsQuery, postDetailQuery } from '../../api/queries';
import { AddCommentData } from '../../api/interfaces';
import { User, UIState } from '../../utils/types';
import { formatDate } from '../../utils/formatter';
import './index.scss';

interface PostProps {
  loggedInUser: User;
  dispatch: Dispatch;
}

const Post: React.FunctionComponent<PostProps> = ({
  loggedInUser,
  dispatch,
}) => {
  const id = +useParams().id;
  const history = useHistory();
  const [likes, setLikes] = React.useState<number>(0);

  // fetch post details
  const { loading, error, data } = postDetailQuery(+id, data => {
    setLikes(data?.Post?.like_count);
  });

  // fetch comments
  const commentsData = postCommentsQuery(+id);

  // update document title
  React.useEffect(() => {
    if (data?.Post) {
      document.title = data.Post?.title + ' - 博客';
      return () => {
        document.title = '博客';
      };
    }
  }, [data]);

  const showFollowUser: boolean =
    !loggedInUser ||
    !(
      data &&
      (loggedInUser.followingUserIds.find(id => id === data?.Post?.user_id) ||
        loggedInUser.id === data?.Post?.user_id)
    );

  // build all the mutations
  const [onFollowUser] = followUserMutation(dispatch),
    [onLikePost] = likePostMutation(dispatch),
    [onUnLikePost] = unLikePostMutation(dispatch);
  const [onComment] = addCommentMutation(
    error => message.error(error.message),
    () => commentsData.refetch(),
  );

  const onClickFollow = React.useCallback(() => {
    if (!loggedInUser) {
      message.warning('请先登录!');
      setTimeout(() => history.push('/login'), 600);
    } else {
      onFollowUser({
        variables: {
          follow: {
            followed_user_id: data.Post.user_id,
          },
        },
      });
    }
  }, [loggedInUser, data]);

  const isPostLiked: boolean = !!(
    loggedInUser &&
    loggedInUser.likedPostIds &&
    loggedInUser.likedPostIds.find(postId => postId === id)
  );

  const onClickLike = React.useCallback(() => {
    if (loggedInUser) {
      if (isPostLiked) {
        onUnLikePost({
          variables: {
            unlike: {
              post_id: id,
            },
          },
        }).then(res => {
          if (res && res.data) {
            setLikes(likes - 1);
          }
        });
      } else {
        onLikePost({
          variables: {
            like: {
              post_id: id,
            },
          },
        }).then(res => {
          if (res && res.data) {
            setLikes(likes + 1);
          }
        });
      }
    } else {
      message.warning('请登录后再操作');
      setTimeout(history.push('/login'), 600);
    }
  }, [loggedInUser, id, likes]);

  const onClickComment: (
    commentContent: string,
    parentId: number | null,
  ) => Promise<FetchResult<AddCommentData>> = React.useCallback(
    (commentContent, parentId) => {
      if (!commentContent) {
        return;
      }
      if (!loggedInUser) {
        message.warning('请登录后再操作');
        setTimeout(history.push('/login'), 600);
      }

      return onComment({
        variables: {
          comment: {
            post_id: id,
            content: commentContent,
            parent_id: parentId,
          },
        },
      });
    },
    [loggedInUser, id],
  );

  if (error || (commentsData && commentsData.error)) {
    return <ErrorComponent />;
  }

  if (!loading && !data.Post) {
    return (
      <ErrorComponent
        status="404"
        title="抱歉，你访问的页面不存在"
        buttonText="返回首页"
        onRefresh={() => history.push('/')}
        subTitle="可能是因为您的链接地址有误、该文章已经被作者删除或转为私密状态"
      />
    );
  }

  return (
    <div
      className="article-container"
      style={{
        background: !loading && data?.Post ? '#f9f9f9' : 'white',
      }}
    >
      {!loading && data?.Post ? (
        <>
          <div className="main-content">
            <Row>
              <Col span={18}>
                <div className="article-content">
                  <div className="title">{data.Post.title}</div>

                  <div className="user-info">
                    <a href={`/user/${data.Post.user_id}`} target="_blank">
                      <img
                        className="has-link"
                        src={avatars[parseInt(data.Post.author.avatar)]}
                      />
                    </a>

                    <div className="info">
                      <div className="author-name vertical-middle">
                        <a href={`/user/${data.Post.user_id}`} target="_blank">
                          {data.Post.author.name}
                        </a>
                        {showFollowUser && (
                          <span
                            className="follow-button has-link"
                            onClick={onClickFollow}
                          >
                            关注
                          </span>
                        )}
                      </div>
                      <div className="meta">
                        <span className="assests">
                          <i className="iconfont icon-diamond"></i>
                          {data.Post.asset_amount}
                        </span>
                        <span>{formatDate(data.Post.last_modified_at)}</span>
                        <span>{`字数 ${data.Post.character_count}`}</span>
                        <span>{`阅读 ${data.Post.view_count}`}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: data.Post.content,
                    }}
                  ></div>

                  <LikeAndDonate
                    likesCount={likes}
                    onClickLike={onClickLike}
                    isPostLiked={isPostLiked}
                    author={data.Post.author}
                    showFollowUser={showFollowUser}
                    onClickFollow={onClickFollow}
                  />
                </div>

                {commentsData.data && !commentsData.loading ? (
                  <Comments
                    loggedInUser={loggedInUser}
                    authorId={data.Post.user_id}
                    dispatch={dispatch}
                    comments={commentsData.data.PostComments}
                    onClickComment={onClickComment}
                  />
                ) : (
                  <Skeleton active></Skeleton>
                )}
              </Col>
              <Col span={6}>
                <AuthorInfo
                  postDetail={data.Post}
                  showFollowUser={showFollowUser}
                  onClickFollow={onClickFollow}
                />
                <RecommendList postId={data.Post.id} />
              </Col>
            </Row>
          </div>
          <SideTools
            likesCount={likes}
            onClickLike={onClickLike}
            isPostLiked={isPostLiked}
          />
          <BottomBar
            likesCount={likes}
            commentCount={
              commentsData.data && commentsData.data.PostComments.length
            }
            onClickComment={onClickComment}
            onClickLike={onClickLike}
            isPostLiked={isPostLiked}
          />
        </>
      ) : (
        <Skeleton active></Skeleton>
      )}
    </div>
  );
};

const mapStateToProps = (state: UIState) => ({
  loggedInUser: state.user,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
