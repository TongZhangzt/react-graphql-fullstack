import * as React from 'react';
import { SettingProps } from './index';
import { avatars } from '../../../utils/images';
import { LoadingButton } from '../../../components/LoadingButton';
import { load } from 'dotenv/types';

export const BasicSetting: React.FunctionComponent<SettingProps> = ({
  loggedInUser,
  onSubmitUpdate,
}) => {
  const [name, setName] = React.useState<string>(loggedInUser.name);
  const [email, setEmail] = React.useState<string>(loggedInUser.email || '');
  const [phone, setPhone] = React.useState<string>(loggedInUser.phone || '');
  const [loading, setLoading] = React.useState<boolean>(false);

  const isSubmitDisabled = !name || !email || !phone;
  const onSubmit = () => {
    if (isSubmitDisabled || !loggedInUser || loading) {
      return;
    }

    setLoading(true);
    onSubmitUpdate({ name, email, phone }, () => setLoading(false));
  };

  return (
    <div className="basic-setting">
      <div className="vertical-middle">
        <img src={avatars[parseInt(loggedInUser.avatar)]} />
        <div className="update-avatar-button has-link vertical-middle">
          更换头像
        </div>
      </div>

      <div className="edit-item">
        <label>昵称</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={20}
        />
      </div>
      <div className="edit-item">
        <label>电子邮件</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          maxLength={30}
        />
      </div>
      <div className="edit-item">
        <label>手机</label>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          maxLength={12}
        />
      </div>

      <div className="edit-item">
        <label>语言设置</label>
        <input type="radio" id="jian" defaultChecked name="language" />
        <label htmlFor="jian">简体中文</label>
        <input type="radio" id="fan" name="language" />
        <label htmlFor="fan">繁体中文</label>
      </div>
      <div className="edit-item">
        <label>邮件通知</label>
        <input type="radio" id="only" defaultChecked name="email" />
        <label htmlFor="only">只接收关注的</label>
        <input type="radio" id="all" name="email" />
        <label htmlFor="all">接收所有邮件</label>
      </div>

      <LoadingButton
        onSubmit={onSubmit}
        buttonClass="submit-button my-button"
        isLoading={loading}
        loadingStyle={{ fontSize: 20, color: 'white' }}
        text="保存"
      />
    </div>
  );
};
