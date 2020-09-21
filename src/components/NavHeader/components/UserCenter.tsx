import * as React from 'react';
import { message } from 'antd';
import { Dispatch } from 'react-redux';

import { logoutAction } from '../../../store/actions';
import { avatars } from '../../../utils/images';
import { User } from '../../../utils/types';
import environments from '../../../utils/environments';

interface UserCenterProps {
  history: any;
  user: User;
  dispatch: Dispatch;
}

export const UserCenter: React.FunctionComponent<UserCenterProps> = ({
  history,
  user,
  dispatch,
}) => {
  const [dropdown, setDropdown] = React.useState<string>('none');

  const goToPage: (path: string) => () => void = path => () =>
    history.push(path);

  const onSetDropdown: (style: string) => () => void = style => () =>
    setDropdown(style);

  const onLogout = () => {
    const options: RequestInit = {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `id=${user.id}`,
    };

    fetch(`${environments.apiBaseUrl}/logout`, options)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // update the redux store
          dispatch(logoutAction());
          message.success('登出成功');
        } else {
          message.error(data.message);
        }
      });
  };

  if (!user) {
    return (
      <>
        <div className="login-button" onClick={goToPage('/login')}>
          登录
        </div>
        <div
          className="register-button my-button"
          onClick={goToPage('/register')}
        >
          注册
        </div>
      </>
    );
  }

  return (
    <div
      className="user-section"
      onMouseEnter={onSetDropdown('block')}
      onMouseLeave={onSetDropdown('none')}
    >
      <div className="user-image">
        <img src={avatars[parseInt(user.avatar)]}></img>
        <i className="iconfont icon-arrow-down"></i>
      </div>
      <div
        className="user-dropdown"
        style={{ display: dropdown }}
        onClick={onSetDropdown('none')}
      >
        <div className="dropdown-item" onClick={goToPage(`/user/${user.id}`)}>
          <i className="iconfont icon-user"></i>我的主页
        </div>
        <div
          className="dropdown-item"
          onClick={goToPage(`/user/${user.id}/likes`)}
        >
          <i className="iconfont icon-like"></i>我的喜欢
        </div>
        <div className="dropdown-item" onClick={goToPage(`/help`)}>
          <i className="iconfont icon-comment"></i>帮助和反馈
        </div>
        <div className="dropdown-item" onClick={goToPage(`/setting`)}>
          <i className="iconfont icon-setting"></i>设置
        </div>
        <div className="dropdown-item" onClick={onLogout}>
          <i className="iconfont icon-log-out"></i>退出
        </div>
      </div>
    </div>
  );
};
