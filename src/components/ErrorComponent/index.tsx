import * as React from 'react';
import { Button, Result } from 'antd';
import './index.scss';
import { ResultStatusType } from 'antd/lib/result';

interface ErrorComponentProps {
  onRefresh?: () => void;
  title?: string;
  subTitle?: string;
  status?: ResultStatusType;
  buttonText?: string;
}

export const ErrorComponent: React.FunctionComponent<ErrorComponentProps> = React.memo(
  ({
    onRefresh = React.useCallback(() => {
      window.location.reload();
    }, []),
    title = '服务器开小差了',
    subTitle = '服务器暂时无法响应',
    status = '500',
    buttonText = '刷新页面',
  }) => {
    return (
      <div className="error-component">
        <Result
          status={status}
          title={title}
          subTitle={subTitle}
          extra={
            <Button type="primary" onClick={onRefresh}>
              {buttonText}
            </Button>
          }
        />
      </div>
    );
  },
);
