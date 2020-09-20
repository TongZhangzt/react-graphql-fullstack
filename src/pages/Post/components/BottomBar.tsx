import * as React from 'react';
import { FetchResult } from '@apollo/client';
import { AddCommentData } from '../../../api/interfaces';

interface BottomBarProps {
  likesCount: number;
  commentCount: number;
  onClickLike: () => void;
  isPostLiked: boolean;
  onClickComment: (
    comment: string,
    parentId: number | null,
  ) => Promise<FetchResult<AddCommentData>>;
}

export const BottomBar: React.FunctionComponent<BottomBarProps> = React.memo(
  ({ likesCount, commentCount, onClickLike, isPostLiked, onClickComment }) => {
    const [isFocused, setIsFocused] = React.useState<boolean>(false);
    const [comment, setComment] = React.useState<string>('');

    const onCancel = () => {
      setIsFocused(false);
      setComment('');
    };

    const onSendComment = () => {
      onClickComment(comment, null).then(res => {
        if (res?.data) {
          setComment('');
          setIsFocused(false);
        }
      });
    };

    return (
      <div
        className="bottom-bar"
        style={{ height: isFocused ? '76px' : '56px' }}
      >
        <div className="bar-content vertical-middle">
          <textarea
            onFocus={() => setIsFocused(true)}
            value={comment}
            onChange={e => setComment(e.target.value)}
            className={isFocused ? 'focused' : ''}
            placeholder="写下你的评论..."
          ></textarea>

          {isFocused ? (
            <>
              <div className="add-comment my-button" onClick={onSendComment}>
                发布
              </div>
              <div className="cancel-comment my-button" onClick={onCancel}>
                取消
              </div>
            </>
          ) : (
            <>
              <div className="comment-box vertical-middle has-link">
                <i className="iconfont icon-comment"></i>
                <span>评论 {commentCount}</span>
              </div>
              <div
                onClick={onClickLike}
                className={`like-box vertical-middle has-link ${
                  isPostLiked ? 'liked' : ''
                }`}
              >
                <i className="iconfont icon-thumbup"></i>
                <span>赞 {likesCount}</span>
              </div>
              <div className="menu-box"></div>
            </>
          )}
        </div>
      </div>
    );
  },
);
