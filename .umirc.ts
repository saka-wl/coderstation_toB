import { defineConfig } from '@umijs/max'

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'CodeStation'
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
      access: 'NormalAdmin'
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      icon: 'icon-shouye',
      access: 'NormalAdmin'
    },
    {
      name: ' 管理员',
      path: '/admin',
      icon: 'icon-guanliyuan',
      access: 'SuperAdmin',
      routes: [
        { path: 'adminList', name: '管理员列表', component: './Admin', access: 'SuperAdmin' },
        { path: 'addAdmin', name: '添加管理员', component: './Admin/addAdmin', access: 'SuperAdmin' }
      ]
    },
    {
      name: ' 用户',
      path: '/user',
      icon: 'icon-yonghu',
      access: 'NormalAdmin',
      routes: [
        { path: 'userList', name: '用户列表', component: './User', access: 'NormalAdmin' },
        { path: 'addUser', name: '添加用户', component: './User/addUser', access: 'NormalAdmin' },
        { path: 'editUser/:id', name: '编辑用户', component: './User/editUser', access: 'NormalAdmin', hideInMenu: true }
      ]
    },
    {
      name: '书籍',
      path: '/book',
      icon: 'icon-shuji',
      access: 'NormalAdmin',
      routes: [
        { path: 'bookList', name: '书籍列表', access: 'NormalAdmin', component: './Book' },
        { path: 'addBook', name: '添加书籍', access: 'NormalAdmin', component: './Book/addBook' },
        { path: 'editBook/:id', name: '编辑书籍', access: 'NormalAdmin', component: './Book/editBook', hideInMenu: true }
      ]
    },
    {
      name: '面试题',
      path: '/interview',
      icon: 'icon-mianshitiku',
      access: 'NormalAdmin',
      routes: [
        { path: 'interviewList', name: '题目列表', access: 'NormalAdmin', component: './Interview' },
        { path: 'interviewList/:id', name: '题目详情', access: 'NormalAdmin', component: './Interview/InterviewDetail', hideInMenu: true },
        { path: 'interviewEdit/:id', name: '题目编辑', access: 'NormalAdmin', component: './Interview/editInterview', hideInMenu: true },
        { path: 'addInterview', name: '添加题目', access: 'NormalAdmin', component: './Interview/addInterview' }
      ]
    },
    {
      name: ' 问答',
      path: '/issue',
      icon: 'icon-wenda',
      component: './Issue',
      access: 'NormalAdmin'
    },
    {
      name: '问答详情',
      path: '/issue/:id',
      component: './Issue/detailIssue',
      hideInMenu: true,
      access: 'NormalAdmin'
    },
    {
      name: '评论',
      path: '/commentList',
      icon: 'icon-pinglun',
      component: './Comment',
      access: 'NormalAdmin'
    },
    {
      name: '类型',
      path: '/typeList',
      icon: 'icon-fuwuleixing',
      component: './Type',
      access: 'NormalAdmin'
    },
    {
      path: '/login',
      component: './Login',
      menuRender: false
    }
  ],
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true
    },
    '/static': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true
    },
    '/res': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true
    }
  },
  dva: {},
  npmClient: 'npm'
})
