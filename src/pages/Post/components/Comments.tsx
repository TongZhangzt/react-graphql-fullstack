import * as React from 'react';
import { Dispatch, FetchResult } from 'react-redux';
import { Empty } from 'antd';
import { avatars } from '../../../utils/images';
import { CommentItem } from './CommentItem';
import { Comment, User } from '../../../utils/types';
import { AddCommentData } from '../../../api/interfaces';

interface CommentsProps {
  comments: Comment[];
  loggedInUser: User;
  authorId: number;
  dispatch: Dispatch;
  onClickComment: (
    commentContent: string,
    parentId: number | null,
  ) => Promise<FetchResult<AddCommentData>>;
}

export const Comments: React.FunctionComponent<CommentsProps> = ({
  comments,
  loggedInUser,
  authorId,
  dispatch,
  onClickComment,
}) => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const [isReversed, setIsReversed] = React.useState<boolean>(true);
  const [isAuthorOnly, setIsAuthorOnly] = React.useState<boolean>(false);
  const [comment, setComment] = React.useState<string>('');

  const getComments: Comment[] = React.useMemo(() => {
    if (!comments) {
      return null;
    }
    let data: Comment[] = comments.slice();
    // update the comments according to the state
    if (isAuthorOnly) {
      data = data.filter(comment => comment.user_id === authorId);
    }

    // put sub-comments under the comment
    let finalComments: { [propName: string]: Comment } = {};
    data.forEach(comment => {
      if (!comment.parent_id) {
        finalComments[comment.id] = {
          ...comment,
          subComments: [],
        };
      }
    });
    data.forEach(comment => {
      if (comment.parent_id && finalComments[comment.parent_id]) {
        finalComments[comment.parent_id].subComments.push(comment);
      }
    });
    return isReversed
      ? Object.values(finalComments).reverse()
      : Object.values(finalComments);
  }, [comments, isAuthorOnly, isReversed]);

  const onClickSend = () => {
    onClickComment(comment, null).then(res => {
      if (res?.data) {
        setComment('');
        setIsFocused(false);
      }
    });
  };

  const onClickCancel = () => {
    setIsFocused(false);
    setComment('');
  };

  const onKeyDown = e => {
    if (e.keyCode == 13 && e.metaKey) {
      onClickSend();
    }
  };

  const onFocus = () => setIsFocused(true);
  const onClickAuthorOnly = () => setIsAuthorOnly(!isAuthorOnly);
  const onClickReverseOrder = () => setIsReversed(!isReversed);

  return (
    <div className="comments-container" id="comments">
      <div className="comment-input">
        {loggedInUser ? (
          <img
            src={avatars[parseInt(loggedInUser.avatar)]}
            className="user-avatar"
          />
        ) : (
          <div className="user-avatar"></div>
        )}
        <div className="input-box">
          <textarea
            onFocus={onFocus}
            className={isFocused ? 'focused' : ''}
            placeholder="写下你的评论..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={onKeyDown}
          ></textarea>
          {isFocused && (
            <div className="send-comment vertical-middle">
              <div className="tip">⌘ + Return 发表</div>
              <div className="vertical-middle">
                <div
                  onClick={onClickSend}
                  className={`add-comment my-button ${
                    !comment ? 'disabled' : ''
                  }`}
                >
                  发布
                </div>
                <div
                  className="cancel-comment my-button"
                  onClick={onClickCancel}
                >
                  取消
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="comments">
        <div className="vertical-middle title">
          <div>
            全部评论
            <span className="comments-count">{comments.length}</span>
            <span
              className={`author-only-button has-link ${
                isAuthorOnly ? 'active' : ''
              }`}
              onClick={onClickAuthorOnly}
            >
              只看作者
            </span>
          </div>

          <div>
            <span
              className={`reverse-button has-link ${
                isReversed ? 'active' : ''
              }`}
              onClick={onClickReverseOrder}
            >
              按时间倒序
            </span>
            <span
              className={`reverse-button has-link ${
                isReversed ? '' : 'active'
              }`}
              onClick={onClickReverseOrder}
            >
              按时间正序
            </span>
          </div>
        </div>

        {comments.length ? (
          <div className="comments-list">
            {getComments.map((comment, index) => (
              <CommentItem
                key={index}
                comment={comment}
                authorId={authorId}
                onClickComment={onClickComment}
                dispatch={dispatch}
                loggedInUser={loggedInUser}
              />
            ))}
          </div>
        ) : (
          <Empty description="暂无评论" />
        )}
      </div>
    </div>
  );
};
