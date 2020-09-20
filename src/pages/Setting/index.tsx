import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';
import { Row, Col } from 'antd';

import './index.scss';
import {
  AccountSetting,
  ProfileSetting,
  BasicSetting,
  SettingProps,
} from './components/index';
import { UIState } from '../../utils/types';
import { updateUserMutation } from '../../api/mutations';

interface Tab {
  icon: string;
  text: string;
  route: string;
}

const subRoutes: Route[] = [
  {
    path: '/setting',
    exact: true,
    component: BasicSetting,
  },
  {
    path: '/setting/profile',
    component: ProfileSetting,
  },
  {
    path: '/setting/account',
    component: AccountSetting,
  },
];

const tabs: Tab[] = [
  {
    icon: 'icon-edit-basic',
    text: '基础设置',
    route: '/setting',
  },
  {
    icon: 'icon-edit-profile',
    text: '个人资料',
    route: '/setting/profile',
  },
  {
    icon: 'icon-edit-account',
    text: '账号管理',
    route: '/setting/account',
  },
];

const SettingPage: React.FunctionComponent<SettingProps> = ({
  loggedInUser,
  dispatch,
}) => {
  const history = useHistory(),
    location = useLocation();

  const onClickTab = tab => () => history.push(tab.route);
  const [onUpdateUser] = updateUserMutation(dispatch);

  const onSubmitUpdate: SettingProps['onSubmitUpdate'] = React.useCallback(
    (user, callback) => {
      onUpdateUser({ variables: { user } }).then(callback);
    },
    [],
  );

  return (
    <div className="setting">
      <Row>
        <Col span={7}>
          <div className="tab-options">
            {tabs.map((tab, index) => (
              <div
                key={index}
                onClick={onClickTab(tab)}
                className={`tab-item has-link ${
                  tab.route === location.pathname ? 'active' : ''
                }`}
              >
                <i className={`iconfont ${tab.icon}`} />
                {tab.text}
              </div>
            ))}
          </div>
        </Col>
        <Col span={16} offset={1}>
          <div className="main-content">
            <Switch>
              {subRoutes.map(route => (
                <Route
                  {...route}
                  key={route.path}
                  component={() => (
                    <route.component
                      loggedInUser={loggedInUser}
                      onSubmitUpdate={onSubmitUpdate}
                    />
                  )}
                />
              ))}
            </Switch>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state: UIState) => ({
  loggedInUser: state.user,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingPage);
