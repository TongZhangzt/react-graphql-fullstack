import * as React from 'react';
import { Skeleton } from 'antd';

import { avatars } from '../../../utils/images';
import { recommendedUserQuery } from '../../../api/queries';

interface RecommendedAuthorsProps {
  showFollowUser: (id: number) => boolean;
  onClickFollow: (followedUserId: number) => void;
}

export const RecommendedAuthors: React.FunctionComponent<RecommendedAuthorsProps> = React.memo(
  ({ showFollowUser, onClickFollow }) => {
    const { loading, data, refetch } = recommendedUserQuery();
    const handleClick = id => () => onClickFollow(id);

    return (
      <div className="recommended-authors">
        <div className="title">
          推荐作者
          <span className="refresh has-link" onClick={() => refetch()}>
            <i className="iconfont icon-refresh"></i>换一批
          </span>
        </div>
        {!loading && data ? (
          <>
            <div className="list">
              {data.RecommendedUsers.map((user, index) => (
                <div className="author-item" key={index}>
                  <a href={`/user/${user.id}`} target="_blank">
                    <img src={avatars[parseInt(user.avatar)]} />
                  </a>

                  <div className="info">
                    <div className="name">
                      <a href={`/user/${user.id}`} target="_blank">
                        {user.name}
                      </a>
                      {showFollowUser(user.id) && (
                        <div
                          className="follow-button has-link"
                          onClick={handleClick(user.id)}
                        >
                          <i className="iconfont icon-add"></i>关注
                        </div>
                      )}
                    </div>
                    <div className="meta">{`写了${user.statistics.character_count}字 · ${user.statistics.like_count}喜欢`}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="more-authors has-link">
              查看全部 <i className="iconfont icon-right-arrow"></i>
            </div>
          </>
        ) : (
          <Skeleton active></Skeleton>
        )}
      </div>
    );
  },
);
