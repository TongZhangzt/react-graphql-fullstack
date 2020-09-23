import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Row, Col, Skeleton, Carousel, Popover, message } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import './index.scss';
import { ErrorComponent, ArticleItem } from '../../components';
import { RecommendedAuthors } from './components/RecommendAuthors';
import { User, UIState } from '../../utils/types';
import { postListQuery } from '../../api/queries';
import { followUserMutation } from '../../api/mutations';
import { swipers, navbarImgs } from '../../utils/images';

interface HomeProps {
  loggedInUser: User;
  dispatch: Dispatch;
}

interface Banner {
  text: string;
  background: string;
  fontColor: string;
}

const banners: Banner[] = [
  {
    text: '博客会员',
    background: '#ffb631',
    fontColor: 'white',
  },
  {
    text: '文章书籍',
    background: '#f7d99f',
    fontColor: '#d0931b',
  },
  {
    text: '博客版权',
    background: '#86e2d2c7',
    fontColor: '#1ca990e0',
  },
  {
    text: '博客大学堂',
    background: '#a7d8fd',
    fontColor: '#4474bf',
  },
];

const Home: React.FunctionComponent<HomeProps> = ({
  loggedInUser,
  dispatch,
}) => {
  const { error, data, fetchMore } = postListQuery({
    offset: 0,
    limit: 6,
  });

  const history = useHistory();
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [onFollowUser] = followUserMutation(dispatch);

  const showFollowUser: (id: number) => boolean = React.useCallback(
    id =>
      !loggedInUser ||
      (!loggedInUser.followingUserIds.find(followId => followId === id) &&
        loggedInUser.id !== id),
    [loggedInUser],
  );

  const onClickFollow: (followedUserId: number) => void = React.useCallback(
    followedUserId => {
      if (!loggedInUser) {
        message.warning('请先登录!');
        setTimeout(() => history.push('/login'), 600);
      } else {
        onFollowUser({
          variables: {
            follow: {
              followed_user_id: followedUserId,
            },
          },
        });
      }
    },
    [loggedInUser],
  );

  const onLoadMore = React.useCallback(() => {
    setTimeout(() => {
      if (hasMore) {
        fetchMore({
          variables: {
            offset: data.PostList.length,
          },
          updateQuery: (prev: any, { fetchMoreResult }) => {
            if (!fetchMoreResult.PostList) {
              setHasMore(false);
              return prev;
            }
            if (fetchMoreResult.PostList.length < 6) {
              setHasMore(false);
            }
            return Object.assign({}, prev, {
              PostList: [...prev.PostList, ...fetchMoreResult.PostList],
            });
          },
        });
      }
    }, 1000);
  }, [data, hasMore]);

  if (error) {
    return <ErrorComponent></ErrorComponent>;
  }

  return (
    <div className="home">
      <div className="container">
        {data ? (
          <Row>
            <Col span={16}>
              <Carousel dots={false} autoplay>
                {swipers.map((swiper, index) => (
                  <img className="has-link" src={swiper} key={index} />
                ))}
              </Carousel>

              <InfiniteScroll
                pageStart={0}
                hasMore={hasMore}
                loadMore={onLoadMore}
                loader={<Skeleton active avatar key={0}></Skeleton>}
              >
                <div className="acticle-list">
                  {data.PostList.map((post, index) => (
                    <ArticleItem article={post} key={index}></ArticleItem>
                  ))}
                </div>
              </InfiniteScroll>
            </Col>
            <Col span={7} offset={1}>
              <div className="board">
                {banners.map((banner, index) => (
                  <div
                    key={index}
                    className="has-link vertical-middle"
                    style={{
                      background: banner.background,
                      color: banner.fontColor,
                    }}
                  >
                    {banner.text} &gt;
                  </div>
                ))}
              </div>

              <Popover
                content={<img src={navbarImgs[1]} style={{ width: '150px' }} />}
              >
                <div className="download-qrcode has-link">
                  <img src={navbarImgs[1]} />
                  <div className="info">
                    <div className="title">
                      下载博客手机App
                      <i className="iconfont icon-right-arrow"></i>
                    </div>
                    <div className="description">随时随地发现和创作内容</div>
                  </div>
                </div>
              </Popover>

              <RecommendedAuthors
                showFollowUser={showFollowUser}
                onClickFollow={onClickFollow}
              ></RecommendedAuthors>
            </Col>
          </Row>
        ) : (
          <Skeleton active avatar></Skeleton>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: UIState) => ({
  loggedInUser: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
