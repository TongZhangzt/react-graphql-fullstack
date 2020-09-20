import { Dispatch } from 'react-redux';
import { User } from '../../../utils/types';
import { UpdateUserInput } from '../../../api/interfaces';

export * from './Basic';
export * from './Account';
export * from './Profile';

export interface SettingProps {
  loggedInUser: User;
  dispatch?: Dispatch;
  onSubmitUpdate?: (user: UpdateUserInput, callback: () => void) => void;
}
