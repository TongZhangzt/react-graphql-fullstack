import * as React from 'react';
import { Popover } from 'antd';
import { connect, Dispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import SearchBar from './Searchbar';
import UserCenter from './UserCenter';
import { User, UIState } from '../../utils/types';
import { navbarImgs } from '../../utils/images';
import './index.scss';

interface NavHeaderProps {
  user: User;
  dispatch: Dispatch;
}

const NavHeaderComponent: React.FunctionComponent<NavHeaderProps> = ({
  user = null,
  dispatch,
}) => {
  const history = useHistory();
  const goToHome = () => history.push('/');

  return (
    <div className="navHeader-container">
      <div className="left-nav">
        <div className="logo has-link" onClick={goToHome}>
          博 客
        </div>
        <div className="home-link has-link" onClick={goToHome}>
          <i className="iconfont icon-navbar-home"></i>首页
        </div>
        <div className="app-link">
          <i className="iconfont icon-navbar-download"></i>下载App
        </div>
        <SearchBar></SearchBar>
      </div>

      <div className="right-nav">
        <div className="language-button">Aa</div>
        <Popover
          content={<img src={navbarImgs[1]} style={{ width: '150px' }} />}
        >
          <img className="beta-img" src={navbarImgs[0]} />
        </Popover>

        <UserCenter
          history={history}
          user={user}
          dispatch={dispatch}
        ></UserCenter>
        <a href="/writer" target="_blank" className="post-button my-button">
          <i className="iconfont icon-navbar-write"></i>写文章
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = (state: UIState) => ({
  user: state.user,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
});

export const NavHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavHeaderComponent);
