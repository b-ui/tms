import { routerRedux } from 'dva/router'
import { login } from 'services/login'

export default {
  namespace: 'register',

  state: {},

  effects: {
    * register ({
      payload,
    }, { put, call, select }) {
      console.log('________________________')
      console.log(payload)
      /*const data = yield call(login, payload)
      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw data
      }*/
    },
  },

}
