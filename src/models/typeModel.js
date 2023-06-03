import TypeController from '@/services/type.js'

export default {
  namespace: 'type',
  state: {
    typeList: []
  },
  reducers: {
    initTypeList(state, {payload}){
      const obj = {...state}
      obj.typeList = payload
      return obj
    },
    deleteType(state, {payload}) {
      const newObj = {...state}
      const index = newObj.typeList.indexOf(payload)
      const arr = [...newObj.typeList]
      arr.splice(index, 1)
      newObj.typeList = arr
      return newObj
    },
    addType(state, {payload}) {
      const newObj = {...state}
      const arr = [...newObj.typeList]
      arr.unshift(payload)
      newObj.typeList = arr
      return newObj
    }
  },
  effects: {
    *_initTypeList(_, {put, call}) {
      const {data} = yield call(TypeController.getType)
      yield put({
        type: 'initTypeList',
        payload: data
      })
    },
    *_deleteType({payload}, {put, call}) {
      const {data} = yield call(TypeController.deleteType, payload._id)
      console.log('delete', data)
      yield put({
        type: 'deleteType',
        payload
      })
    },
    *_addType({payload}, {put,call}) {
      const {data} = yield call(TypeController.addType, payload)
      yield put({
        type: 'addType',
        payload: data
      })
    }
  }
}