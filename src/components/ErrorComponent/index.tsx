import * as React from 'react';
import { Button, Result } from 'antd';
import './index.scss';

interface ErrorComponentProps {
  onRefresh?: () => void;
}

export const ErrorComponent: React.FunctionComponent<ErrorComponentProps> = React.memo(
  ({
    onRefresh = React.useCallback(() => {
      window.location.reload();
    }, []),
  }) => {
    return (
      <div className="error-component">
        <Result
          status="500"
          title="服务器开小差了"
          subTitle="服务器暂时无法响应"
          extra={
            <Button type="primary" onClick={onRefresh}>
              刷新页面
            </Button>
          }
        />
      </div>
    );
  },
);
