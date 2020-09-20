import * as React from 'react';
import { Tabs, Skeleton, Empty } from 'antd';
import { useParams } from 'react-router-dom';

import { ErrorComponent, ArticleItem } from '../../../components';
import {
  userPostsQuery,
  userActivitiesLazyQuery,
  userLastUpdatedPostsLazyQuery,
} from '../../../api/queries';
import { avatars } from '../../../utils/images';
import { formatDate } from '../../../utils/formatter';

interface ArticlesProps {
  userName: string | null;
  userAvatar: string | null;
}

interface Tab {
  text: string;
  key: string;
  icon: string;
  res: any;
  data: any;
}

export const Articles: React.FunctionComponent<ArticlesProps> = React.memo(
  ({ userName, userAvatar }) => {
    const id = +useParams().id;

    const userPosts = userPostsQuery(id);
    const [fetchUserActivities, userActivities] = userActivitiesLazyQuery(id);
    const [
      fetchUserLastUpdatedPosts,
      userLastUpdatedPosts,
    ] = userLastUpdatedPostsLazyQuery(id);

    // for rendering tabs
    const tabs: Tab[] = [
      {
        text: '文章',
        key: 'articles',
        icon: 'icon-articles',
        res: userPosts,
        data: userPosts.data && userPosts.data.UserPosts,
      },
      {
        text: '动态',
        key: 'activities',
        icon: 'icon-tongzhi',
        res: userActivities,
        data: userActivities.data && userActivities.data.UserActivities,
      },
      {
        text: '最新评论',
        key: 'comments',
        icon: 'icon-comment',
        res: userLastUpdatedPosts,
        data:
          userLastUpdatedPosts.data &&
          userLastUpdatedPosts.data.UserLastUpdatedPosts,
      },
      {
        text: '热门',
        key: 'trending',
        icon: 'icon-remen',
        res: userPosts,
        data:
          userPosts.data &&
          userPosts.data.UserPosts.slice().sort(
            (a, b) => b.like_count - a.like_count,
          ),
      },
    ];

    const onSwitchTab: (activeKey: string) => void = activeKey => {
      if (activeKey === 'acticles' || activeKey === 'tranding') {
        if (userPosts && userPosts.refetch) {
          userPosts.refetch();
        }
      } else if (activeKey === 'activities') {
        fetchUserActivities({ variables: { userId: id } });
      } else if (activeKey === 'comments') {
        fetchUserLastUpdatedPosts({ variables: { userId: id } });
      }
    };

    // display error component if any api request return error
    if (
      (userPosts && userPosts.error) ||
      (userActivities && userActivities.error) ||
      (userLastUpdatedPosts && userLastUpdatedPosts.error)
    ) {
      return <ErrorComponent />;
    }

    return (
      <Tabs defaultActiveKey="articles" onChange={onSwitchTab}>
        {tabs.map(tab => (
          <React.Fragment key={tab.key}>
            <Tabs.TabPane
              tab={
                <div className="tab-header">
                  <i className={`iconfont ${tab.icon}`}></i>
                  {tab.text}
                </div>
              }
              key={tab.key}
            >
              {tab.res && !tab.res.loading && tab.res.data ? (
                tab.data.length ? (
                  tab.data.map((article, index) => (
                    <React.Fragment key={index}>
                      {tab.key === 'activities' && (
                        <div className="activity-content">
                          <div className="activity-header vertical-midle">
                            <img src={avatars[parseInt(userAvatar)]} />
                            <span className="name has-link">{userName}</span>
                            <span className="other-content">
                              {article.comment
                                ? `发表了评论 · ${formatDate(
                                    article.comment.created_at,
                                  ).slice(5)}`
                                : `发布了文章 · ${formatDate(
                                    article.post.created_at,
                                  ).slice(5)}`}
                            </span>
                          </div>
                          {article.comment && (
                            <div className="activity-comment">
                              {article.comment.content}
                            </div>
                          )}
                        </div>
                      )}
                      <div
                        className={
                          tab.key === 'activities' && article.comment
                            ? 'is-activity'
                            : ''
                        }
                      >
                        <ArticleItem
                          article={
                            tab.key === 'activities' ? article.post : article
                          }
                          showAuthor={false}
                        ></ArticleItem>
                      </div>
                    </React.Fragment>
                  ))
                ) : (
                  <Empty description="暂无数据" />
                )
              ) : (
                <Skeleton active></Skeleton>
              )}
            </Tabs.TabPane>
          </React.Fragment>
        ))}
      </Tabs>
    );
  },
);
