import * as React from 'react';
import { message, Skeleton } from 'antd';
import { connect, Dispatch } from 'react-redux';
import { Switch, Route, useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'antd';
import './index.scss';
import { Articles, Follows, Likes } from './components/index';
import { ErrorComponent } from '../../components';
import { avatars, verifiedImg } from '../../utils/images';
import { fullUserInfoQuery } from '../../api/queries';
import { followUserMutation, unFollowUserMutation } from '../../api/mutations';
import { User, UIState } from '../../utils/types';

interface InfoItem {
  text: string;
  link?: (id: number) => string;
  value: (user: User) => number;
}

interface UserProps {
  loggedInUser: User;
  dispatch: Dispatch;
}

const subRoutes: Route[] = [
  {
    path: '/user/:id',
    exact: true,
    component: Articles,
  },
  {
    path: '/user/:id/following',
    component: Follows,
  },
  {
    path: '/user/:id/followers',
    component: Follows,
  },
  {
    path: '/user/:id/likes',
    component: Likes,
  },
];

const infoItems: InfoItem[] = [
  {
    text: '关注',
    link: id => `/user/${id}/following`,
    value: user => user.statistics.following_count || 0,
  },
  {
    text: '粉丝',
    link: id => `/user/${id}/followers`,
    value: user => user.statistics.follower_count || 0,
  },
  {
    text: '文章',
    link: id => `/user/${id}`,
    value: user => user.statistics.post_count || 0,
  },
  {
    text: '字数',
    value: user => user.statistics.character_count || 0,
  },
  {
    text: '收获喜欢',
    value: user => user.statistics.like_count || 0,
  },
  {
    text: '总资产',
    value: user => user.statistics.asset_amount || 0,
  },
];

const UserPage: React.FunctionComponent<UserProps> = ({
  loggedInUser,
  dispatch,
}) => {
  const id = +useParams().id;
  const isSelf: boolean = loggedInUser && loggedInUser.id === id;
  const history = useHistory();

  // fetch user data from API
  const { loading, error, data } = fullUserInfoQuery(id);

  const showFollowButton: (id: number) => boolean = React.useCallback(
    id =>
      !loggedInUser ||
      !loggedInUser.followingUserIds.find(followId => followId === id),
    [loggedInUser],
  );

  // follow and unfollow user mutations
  const [onFollowUser] = followUserMutation(dispatch),
    [onUnFollowUser] = unFollowUserMutation(dispatch);

  const onClickFollow: (id: number) => () => void = id => () => {
    if (!loggedInUser) {
      message.warning('请先登录!');
      setTimeout(() => history.push('/login'), 600);
    } else if (showFollowButton(id)) {
      onFollowUser({
        variables: {
          follow: { followed_user_id: id },
        },
      });
    } else {
      onUnFollowUser({
        variables: {
          unFollow: { followed_user_id: id },
        },
      });
    }
  };

  const onClickItem: (
    link: (id: number) => string,
  ) => () => void | null = link => () =>
    link ? history.push(link(data.User.id)) : null;

  if (error) {
    return <ErrorComponent />;
  }

  if (!loading && !data.User) {
    return (
      <ErrorComponent
        status="404"
        title="抱歉，你访问的页面不存在"
        buttonText="返回首页"
        onRefresh={() => history.push('/')}
        subTitle="可能是因为您的链接地址有误、该用户已注销"
      />
    );
  }

  return (
    <div className="user-center">
      {!loading && data ? (
        <Row>
          <Col span={16}>
            <div className="main-content">
              <div className="upper-section">
                <div className="user-info">
                  <img
                    className="user-avatar has-link"
                    src={avatars[parseInt(data.User.avatar)]}
                  />
                  <div className="info-list">
                    <div className="user-name">
                      <span className="name has-link">{data.User.name}</span>

                      {!!data.User.gender && (
                        <span
                          style={{
                            color:
                              data.User.gender === 'Male'
                                ? '#3194d0'
                                : '#ea6f5a',
                          }}
                        >
                          {data.User.gender === 'Male' ? '♂' : '♀'}
                        </span>
                      )}
                    </div>
                    <div className="list">
                      {infoItems.map(item => (
                        <div
                          key={item.text}
                          className={`item ${item.link && 'has-link'}`}
                          onClick={onClickItem(item.link)}
                        >
                          <div>{item.value(data.User)}</div>
                          <div className="text">
                            {item.text}
                            {item.link && (
                              <i className="iconfont icon-right-arrow"></i>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {!isSelf && (
                  <div className="user-action">
                    <div className="my-button send-message">发简信</div>
                    <div
                      className={`${
                        showFollowButton(data.User.id)
                          ? 'follow-button'
                          : 'unfollow-button'
                      } my-button`}
                      onClick={onClickFollow(data.User.id)}
                    >
                      <i
                        className={`${
                          showFollowButton(data.User.id)
                            ? 'icon-add'
                            : 'icon-dui'
                        } iconfont`}
                      ></i>
                      {showFollowButton(data.User.id) ? '关注' : '已关注'}
                    </div>
                  </div>
                )}
              </div>

              <div className="tab-content">
                <Switch>
                  {subRoutes.map(route => (
                    <Route
                      {...route}
                      key={route.path}
                      component={() => (
                        <route.component
                          userName={data.User.name}
                          userAvatar={data.User.avatar}
                          userFollowers={data.User.statistics.follower_count}
                          userFollows={data.User.statistics.following_count}
                          loggedInUserId={loggedInUser && loggedInUser.id}
                          showFollowButton={showFollowButton}
                          onClickFollow={onClickFollow}
                        />
                      )}
                    />
                  ))}
                </Switch>
              </div>
            </div>
          </Col>
          <Col span={7} offset={1}>
            <div className="left-section">
              {data.User.is_verified && (
                <div className="verified">
                  <img src={verifiedImg} />
                  博客认证作者
                </div>
              )}
              <div className="introduction">
                <div className="title">个人介绍</div>
                <div className="content">
                  {data.User.introduction || '暂无个人介绍'}
                </div>
              </div>
              <div className="subscriptions">
                <div className="vertical-middle has-link">
                  <i className="iconfont icon-more"></i>
                  {data.User.gender === 'Male' ? '他' : '她'}
                  关注的专题/文集/连载
                </div>

                <a
                  href={`/user/${data.User.id}/likes`}
                  target="_blank"
                  className="vertical-middle"
                >
                  <i className="iconfont icon-like"></i>
                  {data.User.gender === 'Male' ? '他' : '她'}
                  喜欢的文章
                </a>
              </div>
            </div>
          </Col>
        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
