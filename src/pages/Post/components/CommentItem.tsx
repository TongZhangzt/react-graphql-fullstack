import * as React from 'react';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';
import { Dispatch, FetchResult } from 'react-redux';

import {
  likeCommentMutation,
  unLikeCommentMutation,
} from '../../../api/mutations';
import { AddCommentData } from '../../../api/interfaces';
import { avatars } from '../../../utils/images';
import { Comment, User } from '../../../utils/types';
import { formatDate } from '../../../utils/formatter';

interface CommentItemProps {
  comment: Comment;
  authorId: number;
  onClickComment: (
    commentContent: string,
    parentId: number | null,
  ) => Promise<FetchResult<AddCommentData>>;
  dispatch: Dispatch;
  loggedInUser: User;
}

export const CommentItem: React.FunctionComponent<CommentItemProps> = ({
  comment,
  authorId,
  onClickComment,
  dispatch,
  loggedInUser,
}) => {
  const [isCommenting, setIsCommenting] = React.useState(false);
  const [commentContent, setCommentContent] = React.useState('');
  const [likes, setLikes] = React.useState(comment.like_count);
  const commentInput = React.useRef(null);
  const history = useHistory();

  // like/unlike comment mutations
  const [likeComment] = likeCommentMutation(dispatch, () =>
      setLikes(likes + 1),
    ),
    [unlikeComment] = unLikeCommentMutation(dispatch, () =>
      setLikes(likes - 1 > 0 ? likes - 1 : 0),
    );

  const isCommentLiked =
    loggedInUser?.likedCommentIds &&
    loggedInUser.likedCommentIds.find(id => id === comment.id);

  const onClickLike = () => {
    if (!loggedInUser) {
      message.warning('请登录后进行操作');
      setTimeout(() => history.push('/login'), 500);
    } else if (isCommentLiked) {
      unlikeComment({
        variables: {
          unlike: { comment_id: comment.id },
        },
      });
    } else {
      likeComment({
        variables: {
          like: { comment_id: comment.id },
        },
      });
    }
  };

  const onClickReply = () => {
    setIsCommenting(true);
    setTimeout(() => commentInput.current.focus(), 200);
  };

  const onClickSend = () => {
    onClickComment(commentContent, comment.id).then(res => {
      if (res?.data) {
        onCancel();
      }
    });
  };

  const onCancel = () => {
    setIsCommenting(false);
    setCommentContent('');
  };

  const onKeyDown = e => {
    if (e.keyCode == 13 && e.metaKey) {
      onClickSend();
    }
  };

  return (
    <div className="comment-item">
      <a target="_blank" href={`/user/${comment.user_id}`}>
        <img
          className="user-avatar"
          src={avatars[parseInt(comment.user.avatar)]}
        />
      </a>

      <div className="comment-content">
        <a target="_blank" href={`/user/${comment.user_id}`}>
          <div className="commenter-name vertical-middle">
            {comment.user.name}
            {comment.user.id === authorId && (
              <span className="is-author">作者</span>
            )}
          </div>
        </a>
        <div className="comment-time">
          {comment.id + 1}楼 {formatDate(comment.created_at)}
        </div>
        <div className="content">{comment.content}</div>
        <div className="comment-reaction vertical-middle">
          <div
            className={`likes has-link ${isCommentLiked ? 'liked' : ''}`}
            onClick={onClickLike}
          >
            <i className="iconfont icon-thumbup"></i>
            {likes > 0 ? ' ' + likes : ' 赞'}
          </div>
          <div className="reply has-link" onClick={onClickReply}>
            <i className="iconfont icon-comment"></i> 回复
          </div>
        </div>

        <div className="sub-comments">
          {comment.subComments.map((subComment, index) => (
            <div className="sub-comment-content" key={index}>
              <div className="vertical-middle">
                <a target="_blank" href={`/user/${subComment.user_id}`}>
                  <img
                    className="user-avatar"
                    src={avatars[parseInt(subComment.user.avatar)]}
                  />
                </a>
                <div>
                  <div className="commenter-name vertical-middle">
                    <a target="_blank" href={`/user/${subComment.user_id}`}>
                      {subComment.user.name}
                      {subComment.user_id === authorId && (
                        <span className="is-author">作者</span>
                      )}
                    </a>
                  </div>
                  <div className="comment-time">
                    {formatDate(subComment.created_at)}
                  </div>
                </div>
              </div>
              <div className="content">{subComment.content}</div>
              <div className="comment-reaction vertical-middle">
                <div className="reply has-link" onClick={onClickReply}>
                  <i className="iconfont icon-comment"></i> 回复
                </div>
              </div>
            </div>
          ))}
        </div>

        {isCommenting && (
          <div className="input-box">
            <textarea
              ref={commentInput}
              placeholder="写下你的评论..."
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              onKeyDown={onKeyDown}
            ></textarea>
            <div className="send-comment vertical-middle">
              <div className="tip">⌘ + Return 发表</div>
              <div className="vertical-middle">
                <div
                  className={`add-comment my-button ${
                    !commentContent ? 'disabled' : ''
                  }`}
                  onClick={onClickSend}
                >
                  发布
                </div>
                <div className="cancel-comment my-button" onClick={onCancel}>
                  取消
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
