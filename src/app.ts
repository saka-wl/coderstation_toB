// 运行时配置

import { message } from "antd";
import { RunTimeLayoutConfig } from "./.umi/plugin-layout/types";
import AdminController from '@/services/admin'

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<any> {
  if(location.pathname === "/login") {
    // 强行前往登录页面
    const token = localStorage.getItem('adminInfo')
    if(token) {
      const resp = await AdminController.getInfo()
      console.log(resp)
      if(resp.data) {
        message.warning("请先退出后登录")
        history.go(-1)
      }
    }
  }else {
    // 强行前往其他页面
    const resp = await AdminController.getInfo()
    if(resp.data) {
      const {data} : any = await AdminController.getAdminById(resp.data._id)
      let obj: Object = {
        name: data.nickname,
        avatar: data.avatar,
        adminInfo: data
      }
      return obj
    }else {
      message.warning('登录过期，请重新登录')
      localStorage.removeItem('adminInfo')
      location.href = '/login'
    }
  }
  return { name: '@umijs/max' };
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    logo: 'https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-10-18-074620.png',
    menu: {
      locale: false,
    },
    iconfontUrl: '//at.alicdn.com/t/c/font_4083333_nldxelf3a6.js',
    logout: () => {
      localStorage.removeItem('adminInfo')
      location.href = '/login'
      message.success("退出登录成功")
    }
  };
};

export const request = {
  timeout: 3000,
  requestInterceptors: [function(url: any, options: any) {
    const token = localStorage.getItem('adminInfo')
    if(token) {
      options.headers['Authorization'] = 'Bearer ' + token
    }
    return {url, options}
  }]
}
