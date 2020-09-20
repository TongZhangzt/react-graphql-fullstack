import * as React from 'react';
import { BackTop } from 'antd';
import './index.scss';

export const BackToTop: React.FunctionComponent = () => {
  return (
    <BackTop>
      <div className="back-to-top">
        <i className="iconfont icon-up-arrow"></i>
      </div>
    </BackTop>
  );
};
