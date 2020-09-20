import * as React from 'react';
import { avatars } from '../../../utils/images';
import { User } from '../../../utils/types';

interface LikeAndDonateProps {
  likesCount: number;
  onClickLike: () => void;
  isPostLiked: boolean;
  author: User;
  showFollowUser: boolean;
  onClickFollow: () => void;
}

export const LikeAndDonate: React.FunctionComponent<LikeAndDonateProps> = ({
  likesCount,
  onClickLike,
  isPostLiked,
  author,
  showFollowUser,
  onClickFollow,
}) => {
  return (
    <div className="like-and-donate">
      <div className="likes vertical-middle">
        <div
          className={`like-button has-link ${isPostLiked ? 'liked' : ''}`}
          onClick={onClickLike}
        >
          <i className="iconfont icon-thumbup"></i>
        </div>

        <span className="likes-num has-link">{likesCount}人点赞 &gt;</span>
      </div>
      <div className="divider"></div>
      <div className="donate-container">
        <div className="donate-title">"小礼物走一走，来博客关注我"</div>
        <div className="donate-button my-button">赞赏支持</div>
        <div className="donate-text">还没有人赞赏，支持一下</div>
      </div>

      <div className="user-info">
        <div className="vertical-middle">
          <a href={`/user/${author.id}`} target="_blank">
            <img
              className="user-avatar"
              src={avatars[parseInt(author.avatar)]}
            />
          </a>
          <div className="user-detail">
            <a
              className="user-name"
              href={`/user/${author.id}`}
              target="_blank"
            >
              {author.name}
              <span className="introduction">{author.introduction}</span>
            </a>

            <div className="user-meta">
              <span>{`总资产${author.statistics.asset_amount} (约${(
                author.statistics.asset_amount / 11
              ).toFixed(2)}元)`}</span>
              <span>{`共写了${author.statistics.character_count}字`}</span>
              <span>{`获得${author.statistics.like_count}个赞`}</span>
              <span>{`共${author.statistics.follower_count}个粉丝`}</span>
            </div>
          </div>
        </div>

        {showFollowUser && (
          <div className="follow-button my-button" onClick={onClickFollow}>
            关注
          </div>
        )}
      </div>
    </div>
  );
};
