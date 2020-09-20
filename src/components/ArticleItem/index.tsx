import * as React from 'react';
import { contentImgs } from '../../utils/images';
import { Post } from '../../utils/types';
import { formatDate } from '../../utils/formatter';
import './index.scss';

interface ArticleItemProps {
  article: Post;
  showAuthor?: boolean;
}

export const ArticleItem: React.FunctionComponent<ArticleItemProps> = React.memo(
  ({ article, showAuthor = true }) => {
    const id: number = article.id;

    return (
      <div className="article-item">
        <div className="content">
          <a className="title has-link" target="_blank" href={`/post/${id}`}>
            {article.title}
          </a>
          <div className="brief">{article.summary.slice(0, 60)}...</div>
          <div className="meta vertical-middle">
            {article.asset_amount > 0 && (
              <div className="assets vertical-middle">
                <i className="iconfont icon-diamond"></i> {article.asset_amount}
              </div>
            )}
            {showAuthor ? (
              <a href={`/user/${article.user_id}`} target="_blank">
                <div className="author vertical-middle has-link">
                  {article.author.name}
                </div>
              </a>
            ) : (
              <div className="views vertical-middle">
                <i className="iconfont icon-eye"></i> {article.view_count}
              </div>
            )}
            {article.comment_count > 0 && (
              <a
                href={`/post/${id}`}
                target="_blank"
                className="comments vertical-middle"
              >
                <i className="iconfont icon-comment"></i>{' '}
                {article.comment_count}
              </a>
            )}
            {article.like_count > 0 && (
              <div className="likes vertical-middle">
                <i className="iconfont icon-like"></i> {article.like_count}
              </div>
            )}
            {!showAuthor && (
              <div className="lastModified">
                {formatDate(article.last_modified_at).slice(5)}
              </div>
            )}
          </div>
        </div>
        {article.cover_image && (
          <img
            className="image"
            src={contentImgs[parseInt(article.cover_image)]}
          />
        )}
      </div>
    );
  },
);
