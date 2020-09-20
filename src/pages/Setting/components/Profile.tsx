import * as React from 'react';
import { SettingProps } from './index';
import { LoadingButton } from '../../../components/LoadingButton';

export const ProfileSetting: React.FunctionComponent<SettingProps> = ({
  loggedInUser,
  onSubmitUpdate,
}) => {
  const [gender, setGender] = React.useState<string>(loggedInUser.gender || '');
  const [website, setWebsite] = React.useState<string>('');
  const [introduction, setIntroduction] = React.useState<string>(
    loggedInUser.introduction || '',
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSubmit = () => {
    if (!loggedInUser || loading) {
      return;
    }

    setLoading(true);
    onSubmitUpdate({ gender, introduction }, () => setLoading(false));
  };

  return (
    <div className="profile-setting">
      <div className="edit-item">
        <label>性别</label>
        <input
          type="radio"
          id="Male"
          name="gender"
          checked={gender === 'Male'}
          onChange={e => setGender('Male')}
        />
        <label htmlFor="Male">男</label>
        <input
          type="radio"
          id="Female"
          name="gender"
          checked={gender === 'Female'}
          onChange={e => setGender('Female')}
        />
        <label htmlFor="Female">女</label>
        <input
          type="radio"
          id="empty"
          name="gender"
          checked={gender === ''}
          onChange={e => setGender('')}
        />
        <label htmlFor="empty">保密</label>
      </div>
      <div className="edit-item">
        <label>个人简介</label>
        <input
          value={introduction}
          onChange={e => setIntroduction(e.target.value)}
        />
      </div>
      <div className="edit-item">
        <label>个人网站</label>
        <input value={website} onChange={e => setWebsite(e.target.value)} />
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
