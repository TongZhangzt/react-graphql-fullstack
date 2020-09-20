import * as React from 'react';
import { Skeleton, Tabs, Empty } from 'antd';
import { useLocation, useHistory, useParams } from 'react-router-dom';

import { userFollowersQuery, userFollowingsQuery } from '../../../api/queries';
import { avatars } from '../../../utils/images';
import { ErrorComponent } from '../../../components';

interface FollowsProps {
  userFollowers: number;
  userFollows: number;
  loggedInUserId: number;
  showFollowButton: (id: number) => boolean;
  onClickFollow: (id: number) => () => void;
}

interface Tab {
  text: string;
  key: string;
  getData: (data: any) => any;
}

export const Follows: React.FunctionComponent<FollowsProps> = React.memo(
  ({
    userFollowers,
    userFollows,
    loggedInUserId,
    showFollowButton,
    onClickFollow,
  }) => {
    const location = useLocation(),
      history = useHistory(),
      id = +useParams().id;

    const tabs: Tab[] = [
      {
        text: `关注用户 ${userFollows}`,
        key: `/user/${id}/following`,
        getData: data => data.UserFollowings,
      },
      {
        text: `粉丝 ${userFollowers}`,
        key: `/user/${id}/followers`,
        getData: data => data.UserFollowers,
      },
    ];

    // fetch follower/followings data from API
    const { loading, error, data } = location.pathname.includes('followers')
      ? userFollowersQuery(id)
      : userFollowingsQuery(id);

    if (loading) {
      return <Skeleton active />;
    }

    if (error) {
      return <ErrorComponent />;
    }

    return (
      <Tabs
        defaultActiveKey={location.pathname}
        onTabClick={key => history.push(key)}
      >
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            <Tabs.TabPane
              tab={<div className="tab-header">{tab.text}</div>}
              key={tab.key}
            >
              {tab.getData(data) && tab.getData(data).length ? (
                tab.getData(data).map((followUser, index) => (
                  <div className="follow-container" key={index}>
                    <div className="vertical-middle">
                      <img src={avatars[parseInt(followUser.avatar)]} />
                      <div className="user-info">
                        <a
                          className="user-name has-link"
                          href={`/user/${followUser.id}`}
                          target="_blank"
                        >
                          {followUser.name}
                          {!!followUser.gender && (
                            <span
                              style={{
                                color:
                                  followUser.gender === 'Male'
                                    ? '#3194d0'
                                    : '#ea6f5a',
                              }}
                            >
                              {followUser.gender === 'Male' ? '♂' : '♀'}
                            </span>
                          )}
                        </a>
                        <div className="user-meta">
                          {`关注 ${followUser.statistics.follower_count}  |  粉丝 ${followUser.statistics.following_count}  
                          |  文章 ${followUser.statistics.post_count}`}
                        </div>
                        <div className="user-meta">
                          {`写了 ${followUser.statistics.character_count} 字，获得了 ${followUser.statistics.like_count}喜欢`}
                        </div>
                      </div>
                    </div>

                    {(!loggedInUserId || followUser.id !== loggedInUserId) && (
                      <div
                        className={`${
                          showFollowButton(followUser.id)
                            ? 'follow-button'
                            : 'unfollow-button'
                        } my-button`}
                        onClick={onClickFollow(followUser.id)}
                      >
                        <i
                          className={`${
                            showFollowButton(followUser.id)
                              ? 'icon-add'
                              : 'icon-dui'
                          } iconfont`}
                        ></i>
                        {showFollowButton(followUser.id) ? '关注' : '已关注'}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <Empty description="暂无数据" />
              )}
            </Tabs.TabPane>
          </React.Fragment>
        ))}
      </Tabs>
    );
  },
);
