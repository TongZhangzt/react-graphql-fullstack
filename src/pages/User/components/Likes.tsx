import * as React from 'react';
import { Skeleton, Tabs, Empty } from 'antd';
import { useParams } from 'react-router-dom';

import { userLikedPostsQuery } from '../../../api/queries';
import { avatars } from '../../../utils/images';
import { ErrorComponent, ArticleItem } from '../../../components';
import { formatDate } from '../../../utils/formatter';

export const Likes: React.FunctionComponent = React.memo(() => {
  const id = +useParams().id;

  // fetch data from API
  const { loading, error, data } = userLikedPostsQuery(id);

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <Tabs defaultActiveKey="likes">
      {!loading && data ? (
        <Tabs.TabPane
          tab={
            <div className="tab-header">{`喜欢的文章 ${data.UserLikedPosts.length}`}</div>
          }
          key="likes"
        >
          {data.UserLikedPosts.length ? (
            data.UserLikedPosts.map((post, index) => (
              <React.Fragment key={index}>
                <div className="activity-content">
                  <div className="activity-header vertical-midle">
                    <img src={avatars[parseInt(post.author.avatar)]} />
                    <a
                      className="name has-link"
                      href={`/user/${post.user_id}`}
                      target="_blank"
                    >
                      {post.author.name}
                    </a>
                    <span className="other-content">
                      {formatDate(post.created_at).slice(5)}
                    </span>
                  </div>
                </div>

                <ArticleItem article={post} showAuthor={false}></ArticleItem>
              </React.Fragment>
            ))
          ) : (
            <Empty description="暂无数据" />
          )}
        </Tabs.TabPane>
      ) : (
        <Skeleton active></Skeleton>
      )}
    </Tabs>
  );
});
