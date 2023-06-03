import AdminController from '@/services/admin'

export default {
  // 命名空间
  namespace: 'admin',
  // 仓库数据
  state: {
    adminList: [], // 所有的管理员信息
    adminInfo: null // 存储当前登录的管理员信息
  },
  // 同步更新仓库状态
  reducers: {
    // 初始化所有的管理员信息
    initAdminList(state, { payload }) {
      const newState = { ...state }
      newState.adminList = payload
      return newState
    },
    // 删除管理员
    deleteAdmin(state, { payload }) {
      const newState = { ...state }
      const index = newState.adminList.indexOf(payload)
      // const arr = [...newState.adminList]
      const arr = [...state.adminList]
      arr.splice(index, 1)
      newState.adminList = arr
      return newState
    },
    // 更新管理员信息
    updateAdmin(state, { payload }) {
      const newState = { ...state }
      for (let i = 0; i < newState.adminList.length; i++) {
        if (newState.adminList[i]._id === payload.adminInfo._id) {
          for (let key in payload.newAdminInfo) {
            newState.adminList[i][key] = payload.newAdminInfo[key]
          }
          // newState.adminList[i] = {
          //   ... newState.adminList[i],
          //   ... payload.adminInfo
          // }
        }
      }
      return newState
    },
    // 新增管理员
    addAdmin(state, {payload}) {
      const newState = { ...state }
      const arr = [...newState.adminList]
      arr.push(payload)
      newState.adminList = arr
      return newState
    }
  },
  // 处理副作用
  effects: {
    // 初始化所有的管理员信息
    *_initAdminList(_, { put, call }) {
      // 和服务器进行通讯，拿到数据
      const { data } = yield call(AdminController.getAdmins)
      // 调用reducer更新仓库
      yield put({
        type: 'initAdminList',
        payload: data
      })
    },
    // 删除一个管理员
    *_deleteAdmin({ payload }, { put, call }) {
      // 和服务器进行通讯，删除数据
      yield call(AdminController.deleteAdmin, payload._id)
      // 调用reducer更新仓库
      yield put({
        type: 'deleteAdmin',
        payload
      })
    },
    // 更新管理员信息
    *_updateAdmin({ payload }, { put, call }) {
      // 和服务器进行通讯，更新数据
      yield call(AdminController.editAdmin, payload.adminInfo._id, payload.newAdminInfo)
      // 调用reducer更新仓库
      yield put({
        type: 'updateAdmin',
        payload
      })
    },
    // 新增管理员信息
    *_addAdmin({payload}, {put, call}) {
      const {data} = yield call(AdminController.addAdmin, payload)
      yield put({
        type: 'addAdmin',
        payload: data
      })
    }
  }
}
