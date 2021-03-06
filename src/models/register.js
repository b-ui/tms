import { routerRedux } from 'dva/router'
import { login } from 'services/login'

export default {
  namespace: 'register',

  state: {},
  reducers: {
    captcha (state) {
      return { ...state, isCaptchaClicked: true }
    },
  },
  effects: {
    * register ({
      payload,
    }, { put, call, select }) {
      console.log('________________________')
      console.log(payload)
      // TODO cookie操作
      yield put(routerRedux.push('/authentication'))
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
