import * as React from 'react';
import { Affix } from 'antd';

interface SideToolsProps {
  likesCount: number;
  onClickLike: () => void;
  isPostLiked: boolean;
}

export const SideTools: React.FunctionComponent<SideToolsProps> = React.memo(
  ({ likesCount, onClickLike, isPostLiked }) => {
    return (
      <div className="side-tools">
        <Affix offsetTop={210}>
          <div className="like-box has-link">
            <div
              className={`like-icon vertical-middle ${
                isPostLiked ? 'liked' : ''
              }`}
              onClick={onClickLike}
            >
              <i className="iconfont icon-thumbup"></i>
            </div>
            <div className="like-text">{`${likesCount}赞`}</div>
          </div>

          <div className="like-box has-link">
            <div className="like-icon vertical-middle text">赏</div>
            <div className="like-text">赞赏</div>
          </div>
        </Affix>
      </div>
    );
  },
);
