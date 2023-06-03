import { Button, Form, Image, Input, Radio, Upload } from 'antd'
import { useRef } from 'react'
import AdminControlApi from '@/services/admin'
import admin from '@/services/admin'

/**
 * 公共表单
 * @param {*} props
 * @returns
 */
function AdminForm({ adminInfo, setAdminInfo, submitHandle, type }) {
  const formRef = useRef()

  if(formRef.current) {
    formRef.current.setFieldsValue(adminInfo)
  }

  let avatarPreview = null
  if(type === 'edit') {
    avatarPreview = (
      <Form.Item
        label='当前头像'
        name='avatarPreview'
      >
        <Image 
          src={adminInfo?.avatar}
          width={100}
        />
      </Form.Item>
    )
  }

  // 更新表单内容到父组件
  const updateInfo = (newContent, key) => {
    const newAdminInfo = { ...adminInfo }
    newAdminInfo[key] = newContent
    setAdminInfo(newAdminInfo)
  }

  const checkLoginId = async () => {
    if(adminInfo.loginId && type === 'add') {
      const {data} = await AdminControlApi.adminIsExist(adminInfo.loginId)
      if(data) {
        return Promise.reject('换一个账户吧')
      }
    }
  }

  // const formItemLayout = {
  //   labelCol: {
  //     xs: { span: 24 },
  //     sm: { span: 7 },
  //   },
  //   wrapperCol: {
  //     xs: { span: 24 },
  //     sm: { span: 17 },
  //   },
  // }

  return (
    <Form name="basic" initialValues={adminInfo} autoComplete="off" ref={formRef} onFinish={submitHandle} layout='horizontal'>
      {/* 账户 */}
      <Form.Item label="管理员账户" name="loginId" rules={[{ required: true, message: '请输入管理员账户！' }, {validateTrigger: 'onblur', validator: checkLoginId}]}>
        <Input value={adminInfo?.loginId} onChange={e => updateInfo(e.target.value, 'loginId')} disabled={type === 'edit'} />
      </Form.Item>
      {/* 密码 */}
      <Form.Item label="密码" name="loginPwd" rules={[type === 'edit' ? { required: true, message: '密码不能为空' } : null]}>
        <Input.Password placeholder={type === 'add' ? '密码可选，默认密码为123123' : ''} value={adminInfo?.loginPwd} onChange={e => updateInfo(e.target.value, 'loginPwd')} />
      </Form.Item>
      {/* 昵称 */}
      <Form.Item label="管理员昵称" name="nickname">
        <Input placeholder={type === 'add' ? '昵称可选，默认是新增管理员' : ''} rules={[type === 'edit' ? { required: 'true', message: '昵称不能为空' } : null]} value={adminInfo?.nickname} onChange={e => updateInfo(e.target.value, 'nickname')} />
      </Form.Item>
      {/* 权限 */}
      <Form.Item label="权限选择" name="permission" rules={[{ required: true, message: '请选择管理员权限' }]}>
        <Radio.Group onChange={e => updateInfo(e.target.value, 'permission')} value={adminInfo?.permission}>
          <Radio value={2}>普通管理员</Radio>
          <Radio value={1}>超级管理员</Radio>
        </Radio.Group>
      </Form.Item>

      {/* 当前头像 */}
      {avatarPreview}

      {/* 上传头像 */}
      <Form.Item label="上传头像">
        <Upload
          listType="picture-card"
          action="/api/upload"
          maxCount={1}
          onChange={e => {
            if (e.file.status === 'done') {
              const url = e.file.response.data
              updateInfo(url, 'avatar')
            }
          }}
        >
          <div>
            <h4 style={{ fontSize: 30, fontWeight: 150, marginTop: -10, display: 'block' }}>+</h4>
            <div style={{ marginTop: -15, display: 'block' }}>头像可选</div>
          </div>
        </Upload>
      </Form.Item>

      {/* 按钮容器 */}
      <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {type === 'add' ? '确认新增' : '修改'}
        </Button>

        <Button type="link" htmlType="submit" className="resetBtn">
          重置
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AdminForm
