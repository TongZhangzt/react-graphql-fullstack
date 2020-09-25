import * as React from 'react';
import { Skeleton } from 'antd';

import { avatars } from '../../../utils/images';
import { Post } from '../../../utils/types';
import { userPostsQuery } from '../../../api/queries';

interface AuthorInfoProps {
  postDetail: Post;
  showFollowUser: boolean;
  onClickFollow: () => void;
}

export const AuthorInfo: React.FunctionComponent<AuthorInfoProps> = ({
  postDetail,
  showFollowUser,
  onClickFollow,
}) => {
  const { loading, data } = userPostsQuery(postDetail.user_id);

  return (
    <div className="author-info">
      <div className="upper-section">
        <img src={avatars[parseInt(postDetail.author.avatar)]} />
        <div className="info">
          <div className="author-name vertical-middle">
            <a
              className="has-link fix-overflow"
              target="_blank"
              href={`/user/${postDetail.user_id}`}
            >
              {postDetail.author.name}
            </a>
            {showFollowUser && (
              <div
                className="follow-button has-link vertical-middle"
                onClick={onClickFollow}
              >
                关注
              </div>
            )}
          </div>
          <div className="meta">
            {`总资产${postDetail.author.statistics.asset_amount} (约${(
              postDetail.author.statistics.asset_amount / 11
            ).toFixed(2)}元)`}
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {!loading && data ? (
        <div className="list">
          {data.UserPosts.map((article, index) => (
            <div className="list-item" key={index}>
              <a
                className="item-title fix-overflow"
                target="_blank"
                href={`/post/${article.id}`}
              >
                {article.title}
              </a>
              <div className="view-count fix-overflow">{`阅读 ${article.view_count}`}</div>
            </div>
          ))}
        </div>
      ) : (
        <Skeleton active></Skeleton>
      )}
    </div>
  );
};
