import { PageContainer, ProTable } from '@ant-design/pro-components'
import { Button, Modal, Popconfirm, Switch, Tag, message } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'umi'
import AdminForm from './component/adminForm'
import { useModel } from '@umijs/max'

function Admin(props) {
  const dispatch = useDispatch()

  const {initialState} = useModel('@@initialState')
  console.log(initialState)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 存储当前要修改的管理员信息
  const [adminInfo, setAdminInfo] = useState(null);

  /**
   * 打开修改面板
   * @param {*} it
   */
  const showModal = it => {
    setIsModalOpen(true)
    setAdminInfo(it)
  }

  const handleOk = () => {
    dispatch({
      type: 'admin/_updateAdmin',
      payload: {
        adminInfo,
        newAdminInfo: adminInfo
      }
    })
    message.success("修改管理员信息成功")
    setIsModalOpen(false)
    setAdminInfo(null)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setAdminInfo(null)
  }

  // 从仓库获取管理员数据
  const { adminList } = useSelector(state => state.admin)

  useEffect(() => {
    if (!adminList.length) {
      dispatch({
        type: 'admin/_initAdminList'
      })
    }
  }, [adminList])

  // 对应表格每一列的配置
  const columns = [
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
      align: 'center'
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
      align: 'center'
    },
    {
      title: '权限',
      dataIndex: 'permission',
      key: 'permission',
      align: 'center',
      render: (_, row) => {
        let tag =
          row.permission === 1 ? (
            <Tag color="orange" key={row._id}>
              超级管理
            </Tag>
          ) : (
            <Tag color="blue" key={row._id}>
              普通管理
            </Tag>
          )
        return tag
      }
    },
    {
      title: '账号状态',
      dataIndex: 'enabled',
      key: 'enabled',
      align: 'center',
      render: (_, row) => {
        if(row._id === initialState.adminInfo._id) {
          return <Tag color='red'>-</Tag>
        }
        return <Switch key={row._id} size="small" defaultChecked={row.enabled ? true : false} onClick={() => handleAbledClick(row)} onChange={value => switchChange(row, value)}></Switch>
      }
    },
    {
      title: '操作',
      width: 150,
      key: 'option',
      align: 'center',
      render: (_, row) => {
        return (
          <div key={row._id}>
            <Button type="link" size="small" onClick={() => showModal(row)}>
              编辑
            </Button>
            <Popconfirm title="你确认要删除吗？" onConfirm={() => deleteConfirm(row)} okText="确定">
              <Button type="link" size="small">
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  const handleAbledClick = it => {
    console.log(it)
  }

  /**
   * 用户是否禁用选项
   * @param {*} row
   * @param {*} value
   */
  const switchChange = (row, value) => {
    // 派发一个action
    dispatch({
      type: 'admin/_updateAdmin',
      payload: {
        adminInfo: row,
        newAdminInfo: {
          enabled: value
        }
      }
    })
    if (value) {
      message.success('管理员的状态已激活')
    } else {
      message.warning('管理员的状态已禁用')
    }
  }

  /**
   * 删除管理员
   * @param {*} adminInfo
   */
  const deleteConfirm = adminInfo => {
    // 判断是否是当前登陆的账户
    dispatch({
      type: 'admin/_deleteAdmin',
      payload: adminInfo
    })
    message.success('删除管理员成功！')
  }

  return (
    <div>
      <PageContainer>
        <ProTable headerTitle="管理员列表" dataSource={adminList} rowKey={row => row._id} columns={columns} search={false} pagination={{ pageSize: 5 }}></ProTable>
      </PageContainer>
      <Modal 
        title="修改管理员信息" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        footer={false}
      >
        <AdminForm
          type="edit"
          adminInfo={adminInfo}
          setAdminInfo={setAdminInfo}
          submitHandle={handleOk}
        />
      </Modal>
    </div>
  )
}

export default Admin
