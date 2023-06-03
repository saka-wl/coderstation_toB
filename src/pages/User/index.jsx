import UserController from '@/services/user'
import { formatDate } from '@/utils/tool'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { useNavigate } from '@umijs/max'
import { Button, Image, Modal, Popconfirm, Switch, Tag, message } from 'antd'
import { useRef, useState } from 'react'
import { useAccess, Access } from '@umijs/max'

function User(props) {
  const navigate = useNavigate()
  const actionRef = useRef()
  const access = useAccess()

  const [userInfo, setUserInfo] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 维护一组分页的数据，会作为参数发送请求
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  })

  const openModal = row => {
    setUserInfo(row)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setUserInfo(null)
    setIsModalOpen(false)
  }

  const columns = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      search: false,
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1
      }
    },
    {
      title: '登录账号',
      dataIndex: 'loginId',
      key: 'loginId',
      align: 'center'
    },
    {
      title: '登录密码',
      dataIndex: 'loginPwd',
      key: 'loginPwd',
      align: 'center',
      search: false
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center'
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      valueType: 'image',
      align: 'center',
      search: false
    },
    {
      title: '账户状态',
      dataIndex: 'enabled',
      key: 'enabled',
      align: 'center',
      search: false,
      render: (_, row, index, action) => {
        const defaultChecked = row.enabled ? true : false
        return [<Switch key={row._id} defaultChecked={defaultChecked} size="small" onChange={value => switchChange(row, value)} />]
      }
    },
    {
      title: '操作',
      width: 200,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: (_, row) => {
        return (
          <div>
            <Button type="link" size="small" onClick={() => openModal(row)}>
              详情
            </Button>
            <Button type="link" size="small" onClick={() => navigate(`/user/editUser/${row._id}`)}>
              编辑
            </Button>
            <Access accessible={access.SuperAdmin === true}>
              <Popconfirm title="你确定要删除吗?" onConfirm={() => deleteHandle(row)} okText="删除" cancelText="取消">
                <Button type="link" size="small">
                  删除
                </Button>
              </Popconfirm>
            </Access>
          </div>
        )
      }
    }
  ]

  /**
   * 用户可用状态改变
   */
  const switchChange = (row, val) => {
    UserController.editUser(row._id, {
      enabled: val
    })
    if (val) {
      message.success('用户状态已激活')
    } else {
      message.success('该用户已被禁用')
    }
  }

  /**
   * 分页组件发生修改时
   */
  const handlePageChange = (current, pageSize) => {
    setPagination({
      current,
      pageSize
    })
  }

  const deleteHandle = row => {
    UserController.deleteUser(row._id)
    actionRef.current.reload()
    message.success('删除成功！')
  }

  return (
    <div>
      <PageContainer>
        <ProTable
          headerTitle="用户列表"
          columns={columns}
          actionRef={actionRef}
          rowKey={row => row._id}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 15],
            ...pagination,
            onChange: handlePageChange
          }}
          request={async params => {
            const resp = await UserController.getUserByPage(params)
            return {
              data: resp.data.data,
              success: resp?.code,
              total: resp.data.count
            }
          }}
        />
      </PageContainer>
      {/* 用户详情信息 */}
      <Modal title={userInfo?.nickname} open={isModalOpen} onCancel={handleCancel} style={{ top: 20 }} footer={false}>
        <h3>登录账号</h3>
        <p>
          <Tag color="red">{userInfo?.loginId}</Tag>
        </p>
        <h3>登录密码</h3>
        <p>
          <Tag color="magenta">{userInfo?.loginPwd}</Tag>
        </p>
        <h3>当前头像</h3>
        <Image src={userInfo?.avatar} width={60} />

        <h3>联系方式</h3>
        <div
          style={{
            display: 'flex',
            width: '350px',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h4>QQ</h4>
            <p>{userInfo?.qq ? userInfo.qq : '未填写'}</p>
          </div>
          <div>
            <h4>微信</h4>
            <p>{userInfo?.wechat ? userInfo.weichat : '未填写'}</p>
          </div>
          <div>
            <h4>邮箱</h4>
            <p>{userInfo?.mail ? userInfo.mail : '未填写'}</p>
          </div>
        </div>
        <h3>个人简介</h3>
        <p>{userInfo?.intro ? userInfo.intro : '未填写'}</p>
        <h3>时间信息</h3>
        <div
          style={{
            display: 'flex',
            width: '450px',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h4>注册时间</h4>
            <p>{formatDate(userInfo?.registerDate)}</p>
          </div>
          <div>
            <h4>上次登录</h4>
            <p>{formatDate(userInfo?.lastLoginDate)}</p>
          </div>
        </div>
        <h3>当前积分</h3>
        <p>{userInfo?.points} 分</p>
      </Modal>
    </div>
  )
}

export default User
