import * as React from 'react';
import { Button, Result } from 'antd';
import { useHistory } from 'react-router-dom';

export const NotFound: React.FunctionComponent = () => {
  const history: any = useHistory();
  const goToHome = () => history.push('/');

  return (
    <Result
      style={{ marginTop: '56px' }}
      status="404"
      title="404"
      subTitle="您要找的页面不存在"
      extra={
        <Button type="primary" onClick={goToHome}>
          回到首页
        </Button>
      }
    />
  );
};
