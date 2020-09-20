import * as React from 'react';
import { Affix, Skeleton } from 'antd';
import { recommendedPostsQuery } from '../../../api/queries';

interface RecommendListProps {
  postId: number;
}

export const RecommendList: React.FunctionComponent<RecommendListProps> = React.memo(
  ({ postId }) => {
    const { loading, data } = recommendedPostsQuery(postId);

    return (
      <Affix offsetTop={56}>
        <div className="recommended-list">
          <div className="title">推荐阅读</div>
          {!loading && data ? (
            <>
              {data.RecommendedPosts.map((article, index) => (
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
            </>
          ) : (
            <Skeleton active></Skeleton>
          )}
        </div>
      </Affix>
    );
  },
);
