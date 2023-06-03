import { PageContainer } from '@ant-design/pro-components'
import { useDispatch, useNavigate } from '@umijs/max'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import AdminForm from './component/adminForm'
import { useSelector } from '@umijs/max'

function AddAdmin(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [newAdminInfo, setNewAdminInfo] = useState({
    loginId: '',
    loginPwd: '',
    nickname: '',
    avatar: '',
    permission: 2 // 默认普通管理员
  })

  const { adminList } = useSelector(state => state.admin)

  useEffect(() => {
    if(adminList.length === 0) {
      dispatch({
        type: 'admin/_initAdminList'
      })
    }
  }, [adminList])

  const submitHandle = () => {
    // 用户点击表单后的处理
    dispatch({
      type: 'admin/_addAdmin',
      payload: newAdminInfo
    })
    setNewAdminInfo({
      loginId: '',
      loginPwd: '',
      nickname: '',
      avatar: '',
      permission: 2 // 默认普通管理员
    })
    message.success('新增管理员成功！')
    navigate('/admin/adminList')
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: 500 }}>
        <AdminForm type="add" adminInfo={newAdminInfo} setAdminInfo={setNewAdminInfo} submitHandle={submitHandle}></AdminForm>
      </div>
    </PageContainer>
  )
}

export default AddAdmin
