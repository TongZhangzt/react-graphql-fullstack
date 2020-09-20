import * as React from 'react';
import { Modal, message, notification } from 'antd';
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { addPostMutation } from '../../api/mutations';
import { UIState, User } from '../../utils/types';
import { AddPostInput } from '../../api/interfaces';
import { LoadingButton } from '../../components/LoadingButton';

interface AddPostProps {
  loggedInUser: User;
}

const AddPost: React.FunctionComponent<AddPostProps> = ({ loggedInUser }) => {
  const [title, setTitle] = React.useState<string>('');
  const [value, setValue] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [onAddPost] = addPostMutation();

  const onTitleInput = event => setTitle(event.target.value);

  const onReset = () => {
    setTitle('');
    setValue('');
    setVisible(false);
    setLoading(false);
  };

  const onSubmit = () => {
    if (!loggedInUser || loading) {
      return;
    }
    if (!title || !value) {
      message.warning('标题或内容不能为空');
      return;
    }

    setLoading(true);

    const pureText: string = document.querySelector('.ql-editor').textContent;
    const addPostInput: AddPostInput = {
      title,
      content: value,
      summary: pureText.slice(0, 26),
      character_count: pureText.length,
      cover_image: JSON.stringify(Math.floor(Math.random() * 3)),
    };

    onAddPost({ variables: { post: addPostInput } })
      .then(res => {
        if (res?.data?.AddPost) {
          notification.open({
            message: '发布成功',
            duration: 60,
            description: <p className="has-link">文章正在审核中, 点击预览</p>,
            key: '0',
            onClick: () => {
              window.open(`/post/${res.data.AddPost.id}`);
              notification.close('0');
            },
          });
          onReset();
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        message.warning('发布失败, 请稍后重试');
      });
  };

  const onCloseModal = () => setVisible(false);

  return (
    <div className="add-post">
      <div className="title">新建文章</div>
      <input
        name="title"
        placeholder="请输入标题"
        value={title}
        onChange={onTitleInput}
      />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        placeholder="请输入内容"
      />

      <div className="add-post-buttons">
        <div className="reset my-button" onClick={onCloseModal}>
          重置
        </div>

        <LoadingButton
          isLoading={loading}
          text="提交"
          onSubmit={onSubmit}
          buttonClass="submit my-button"
        />
      </div>

      <Modal
        title="确定清除所有内容"
        visible={visible}
        onOk={onReset}
        onCancel={onCloseModal}
      >
        操作不能撤销
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: UIState) => ({
  loggedInUser: state.user,
});

export default connect(mapStateToProps)(AddPost);
