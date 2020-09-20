import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { message } from 'antd';
import { NavLink, useHistory, useLocation } from 'react-router-dom';

import './index.scss';
import { loginAction } from '../../store/actions';
import { signupMutation } from '../../api/mutations';
import { LoadingButton } from '../../components/LoadingButton';
import environments from '../../utils/environments';

interface LoginProps {
  dispatch: Dispatch;
}

const Login: React.FunctionComponent<LoginProps> = ({ dispatch }) => {
  const location = useLocation();
  const history = useHistory();
  const isLogin: boolean = location.pathname === '/login';

  // set states used in this component
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [remember, setRemember] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  // add signup mutation
  const [signupRequest] = signupMutation(history);

  const onSubmit: () => void = () => {
    if (!username || !password || (!isLogin && !name)) {
      message.warning('用户名/密码/昵称不能为空!');
      return;
    }
    if (loading) {
      return;
    }
    // set loading indicator
    setLoading(true);

    if (isLogin) {
      const options: RequestInit = {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `username=${username}&password=${password}`,
      };

      fetch(`${environments.apiBaseUrl}/login`, options)
        .then(response => response.json())
        .then(res => {
          setLoading(false);
          if (res.success) {
            // update the redux store and navigate to user page∂
            dispatch(loginAction(res.data.user));
            history.push(`user/${res.data.user.id}`);
          } else {
            message.error(res.message);
          }
        })
        .catch(error => {
          setLoading(false);
          message.error(error.message);
        });
    } else {
      signupRequest({
        variables: { user: { name, phone: username, password } },
      })
        .then(_ => setLoading(false))
        .catch(err => setLoading(false));
    }
  };

  const onKeyDown = e => {
    if (e.keyCode == 13) {
      onSubmit();
    }
  };

  // validate the numeric input of phone numbers
  const validate = event => {
    if (!isLogin) {
      let key = '';
      // Handle paste
      if (event.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
      } else {
        // Handle key press
        key = String.fromCharCode(event.keyCode || event.which);
      }
      var regex = /[0-9]|\./;
      if (!regex.test(key)) {
        event.returnValue = false;
        if (event.preventDefault) event.preventDefault();
      }
    }
  };

  // use effect to update the document title
  React.useEffect(() => {
    document.title = isLogin ? '登录 - 博客' : '注册 - 博客';
    return () => {
      document.title = '博客';
    };
  });

  return (
    <div className="login">
      <div className="logo has-link" onClick={() => history.push('/')}>
        博 客
      </div>

      <div className="form-container">
        <div className="form-title">
          <NavLink to="/login" className="title-link" activeClassName="active">
            登录
          </NavLink>
          <b>·</b>
          <NavLink
            to="/register"
            className="title-link"
            activeClassName="active"
          >
            注册
          </NavLink>
        </div>

        <div className="form-body">
          <div className="input-pretend">
            {!isLogin && (
              <div className="input-box">
                <i className="iconfont icon-user"></i>
                <input
                  type="text"
                  name="name"
                  maxLength={20}
                  placeholder="你的昵称"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}
            <div className="input-box">
              <i
                className={`iconfont ${isLogin ? 'icon-user' : 'icon-phone'}`}
              ></i>
              <input
                type="text"
                maxLength={isLogin ? 30 : 12}
                name="username"
                value={username}
                onKeyPress={e => validate(e)}
                onChange={e => setUsername(e.target.value)}
                placeholder={isLogin ? '手机号或邮箱' : '手机号'}
              />
            </div>

            {!isLogin && !!username && (
              <div className="input-box">
                <i className="iconfont icon-verify"></i>
                <input type="text" name="sms_code" placeholder="手机验证码" />
                <div className="send-sms my-button">发送验证码</div>
              </div>
            )}

            <div className="input-box" style={{ border: 0 }}>
              <i className="iconfont icon-password"></i>
              <input
                type="password"
                maxLength={16}
                name="password"
                value={password}
                onKeyDown={onKeyDown}
                onChange={e => setPassword(e.target.value)}
                placeholder={isLogin ? '密码' : '设置密码'}
              />
            </div>
          </div>

          {isLogin && (
            <div className="forget-container">
              <div className="remember-btn">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="forget-checkbox"
                />
                <span>记住我</span>
              </div>
              <div className="forget-btn">
                <span className="has-link">登录遇到问题?</span>
              </div>
            </div>
          )}

          <LoadingButton
            onSubmit={onSubmit}
            buttonClass={`btn ${isLogin ? 'signin-btn' : 'signup-btn'}`}
            isLoading={loading}
            loadingStyle={{ fontSize: 20, color: 'white' }}
            text={isLogin ? ' 登录' : ' 注册'}
          />

          {!isLogin && (
            <div className="signup-msg">
              点击 “注册” 即表示您同意并愿意遵守博客
              <span className="has-link">用户协议</span> 和
              <span className="has-link"> 隐私政策</span> 。
            </div>
          )}

          <div className="more-sign">
            <div className="divider">
              {isLogin ? '社交账号登录' : '社交账号直接注册'}
            </div>
            <div className="links">
              <i className="iconfont icon-wechat"></i>
              <i className="iconfont icon-qq"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
});
export default connect(mapDispatchToProps)(Login);
