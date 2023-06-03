import React, { useState } from 'react';
import UserForm from './component/userForm'
import userController from '@/services/user'
import { PageContainer } from '@ant-design/pro-components';
import { message } from 'antd';
import { useNavigate } from '@umijs/max';

function AddUser(props) {

  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState({
    loginId: '',
    loginPwd: '',
    avatar: '',
    nickname: '',
    mail: '',
    qq: '',
    wechat: '',
    intro: '',
  })

  const handleSubmit = async () => {
    const {data} = await userController.addUser(userInfo)
    message.success("添加用户成功！")
    setUserInfo({
      loginId: '',
      loginPwd: '',
      avatar: '',
      nickname: '',
      mail: '',
      qq: '',
      wechat: '',
      intro: '',
    })
    navigate('/user/userList')
  }

  return (
    <PageContainer>
      <div style={{width: 500}}>
        <UserForm
          type='add'
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          handleSubmit={handleSubmit}
        />
      </div>
    </PageContainer>
  );
}

export default AddUser;