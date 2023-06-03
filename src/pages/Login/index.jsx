import AdminController from '@/services/admin'
import { Button, Checkbox, Col, Form, Input, Row, message } from 'antd'
import { useEffect, useState } from 'react'
import ReactCanvasNest from 'react-canvas-nest'
import styles from './index.module.css'
// import { UserOutlined, LockOutlined, BarcodeOutlined } from '@ant-design/compatible';

function Login(props) {
  const [loginInfo, setLoginInfo] = useState({
    loginId: '',
    loginPwd: '',
    captcha: '',
    remember: true
  })
  const [captcha, setCaptcha] = useState(null)

  useEffect(() => {
    captchaClickHandle()
  }, [])

  const handleFormFinish = async () => {
    const resp = await AdminController.login(loginInfo)
    console.log(resp)
    if (resp.data) {
      const adminInfo = resp.data
      if (!adminInfo.data) {
        message.warning('账号密码不正确')
        captchaClickHandle()
      } else if (!adminInfo.data.enabled) {
        message.warning('账号被封禁，请联系管理员')
        captchaClickHandle()
      } else {
        localStorage.setItem('adminInfo', adminInfo.token)
        location.href = '/'
      }
    } else {
      message.warning(resp.msg)
      captchaClickHandle()
    }
  }

  const updateInfo = (value, key) => {
    let obj = { ...loginInfo }
    obj[key] = value
    setLoginInfo(obj)
  }

  const captchaClickHandle = async () => {
    const resp = await AdminController.getCaptcha()
    setCaptcha(resp)
  }

  return (
    <div>
      <ReactCanvasNest config={{ pointColor: ' 255, 255, 255 ', count: 66 }} style={{ zIndex: 99 }} />
      <div className={styles.container}>
        <h1>coder station 后台管理系统</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true
          }}
          onFinish={handleFormFinish}
        >
          {/* 输入账号 */}
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入账号'
              }
            ]}
          >
            <Input
              // prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="请输入账号"
              value={loginInfo.loginId}
              onChange={e => updateInfo(e.target.value, 'loginId')}
            />
          </Form.Item>

          {/* 输入密码 */}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码'
              }
            ]}
          >
            <Input
              // prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="请输入密码"
              value={loginInfo.loginPwd}
              onChange={e => updateInfo(e.target.value, 'loginPwd')}
            />
          </Form.Item>

          {/* 验证码 */}
          <Form.Item
            name="captcha"
            rules={[
              {
                required: true,
                message: '请输入验证码'
              }
            ]}
          >
            <Row align="middle">
              <Col span={16}>
                <Input
                  // prefix={<BarcodeOutlined className="site-form-item-icon" />}
                  placeholder="请输入验证码"
                  value={loginInfo.captcha}
                  onChange={e => updateInfo(e.target.value, 'captcha')}
                />
              </Col>
              <Col span={6}>
                <div className={styles.captchaImg} onClick={captchaClickHandle} dangerouslySetInnerHTML={{ __html: captcha }}></div>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item name="remember" className={styles.remember}>
            <Checkbox checked={loginInfo.remember} onChange={e => updateInfo(e.target.checked, 'remember')}>
              7天免登录
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginBtn}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
