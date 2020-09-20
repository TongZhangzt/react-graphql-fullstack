import * as React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

interface LoadingButtonProps {
  text: string;
  onSubmit: () => void;
  isLoading: boolean;
  buttonClass?: string;
  loadingStyle?: any;
}

export const LoadingButton: React.FunctionComponent<LoadingButtonProps> = React.memo(
  ({ text, buttonClass, onSubmit, isLoading, loadingStyle }) => {
    return (
      <div className={`${buttonClass || ''}`} onClick={onSubmit}>
        {isLoading && (
          <Spin
            indicator={
              <LoadingOutlined
                style={
                  loadingStyle || {
                    fontSize: 15,
                    color: 'white',
                    marginRight: '5px',
                  }
                }
                spin
              />
            }
          />
        )}
        {text}
      </div>
    );
  },
);
