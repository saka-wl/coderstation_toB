import UserController from '@/services/user'
import { PageContainer } from '@ant-design/pro-components'
import { useNavigate, useParams } from '@umijs/max'
import { useEffect, useState } from 'react'
import UserForm from './component/userForm'
import { message } from 'antd'

function editUser(props) {
  const [userInfo, setUserInfo] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      const { data } = await UserController.getUserById(id)
      setUserInfo(data)
    }
    fetchData()
  }, [])

  const submitHandle = () => {
    // 因为没有使用状态机，所以直接调用控制器方法，进行新增
    UserController.editUser(userInfo._id, userInfo)
    message.success('信息修改成功')
    navigate('/user/userList')
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: 800 }}>
        <UserForm type="edit" handleSubmit={submitHandle} userInfo={userInfo} setUserInfo={setUserInfo} />
      </div>
    </PageContainer>
  )
}

export default editUser
