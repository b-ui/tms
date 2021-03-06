const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')
const city = require('../utils/city')
const tools = require('../utils/cityTools')
const cookietools = require('../utils/cookietools')
const {PayState, PayType, OrderDetailState, PayChannel} = require('../utils/enums')
const { apiPrefix } = config
//DTO举例
/*et orderPostDTO = Mock.mock({
  'data|15-20': [
    {
      from: {name: '@cname', phone: /^1[34578]\d{9}$/, district: '@county(true)', address: {str:'@cword(5, 10)', x:'33', y:'116'}},
      orders:[
        {
          to: {name: '@cname', phone: /^1[34578]\d{9}$/, district: '@county(true)', address: {str:'@cword(5, 10)', x:'33', y:'116'}}, 
          payment: {
            'deliverPrice|150-250.1-2': 1, 
            'insurancePrice|150-250.1-2': 1, 
          },
          cargoes: [{name: '@cname', remark: '@cname', 'weight|10-100.1-2': 1, 'volume|10-100.1-2': 1, 'price|10-100.1-2': 1, 'cargoType|+1':["冷链", "百货", "建材"]}], 
          distance: 100,
        }
      ],
      payment: {
        'deliverPrice|150-250.1-2': 1, 
        'insurancePrice|150-250.1-2': 1, 
        'payPrice|300-500.1-2': 1, 
      },
      'customerId|+1': [0,1,2,3,4,5],
    }
  ],
})*/

let orderModals = Mock.mock({
  'data|3-5': [
    {
      'id|+1': 10000001,
      // id: '@id',
      'state|+1': [/*OrderDetailState.NOT_DISTRIBUTED, OrderDetailState.ONBOARD, */OrderDetailState.COMPLETED, /*.INVALID*/],
      from: {name: '@cname', phone: /^1[34578]\d{9}$/, district: '@county(true)', address: {str:'@cword(5, 10)', x:'33', y:'116'}},
      to:   {name: '@cname', phone: /^1[34578]\d{9}$/, district: '@county(true)', address: {str:'@cword(5, 10)', x:'33', y:'116'}}, 
      cargoes: [{name: '@cname', remark: '@cname', 'weight|10-100.1-2': 1, 'volume|10-100.1-2': 1, 'price|10-100.1-2': 1, 'cargoType|+1':["冷链", "百货", "建材"]}], 
      payment: {
        'deliverPrice|150-250.1-2': 1, 
        'insurancePrice|150-250.1-2': 1, 
        'payPrice|300-500.1-2': 1, 
        'originalPrice|150-250.1-2': 1, 
        'payType|+1': [PayType.SENDER_PAY/*, PayType.RECEIVER_PAY, PayType.SENDER_ORDER_PAY*/],
        'payState|+1': [/*PayState.UNPAY, */PayState.COMPLETE],
        'items': [{id: '@id', payState: PayState.COMPLETE, payChannel: PayChannel.ALIPAY, tradeNo:'@id', finishTime:'@datetime'}]
      },
      distance: 100,
      'deliverOrders|+1':[/*[{}],*/[{'id|+1':10000001, deliverOrderState:3, distance: 100,'customerOrder.id|+1':10000001,from:{name:'@cname',phone:/^1[34578]\d{9}$/,district:'@county(true)',address:'@ctitle'},to:{name:'@cname',phone:/^1[34578]\d{9}$/,district:'@county(true)',address:'@ctitle'},'price|150-250.1-2':1,vehicle:{id:"@id",number:'贵'+'@character("upper")'+'@string("number", 5)'},driver:{id:"@id",name:'@cname',phone:/^1[34578]\d{9}$/},detail:'@ctitle','cube|1-100.1-2':1,'status|0-3':1,createTime:'@datetime',distributTime:'@datetime',loadTime:'@datetime',completeTime:'@datetime'}]],
      createTime: '@datetime',
      'customerId|+1': [0,1,2,3,4,5],
      'driverId|+1': [0,1,2,3,4,5],
    }
  ],
})

let orderListDTO = Mock.mock({
  'data|3-5': [
    {
      'id|+1': 10000001,
      'state|+1': [/*OrderDetailState.NOT_DISTRIBUTED, OrderDetailState.ONBOARD, */OrderDetailState.COMPLETED, /*.INVALID*/],
      from: {name: '@cname', phone: /^1[34578]\d{9}$/, district: '@county(true)', address: {str:'@cword(5, 10)', x:'33', y:'116'}},
      to:   {name: '@cname', phone: /^1[34578]\d{9}$/, district: '@county(true)', address: {str:'@cword(5, 10)', x:'33', y:'116'}}, 
      payment: {
        'payPrice|300-500.1-2': 1, 
      },
      createTime: '@datetime',
      'customerId|+1': [0,1,2,3,4,5],
    }
  ],
})


let vodb = orderListDTO.data
let database = orderModals.data

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] == key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {

  [`GET ${apiPrefix}/orders`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1
    var user = cookietools.getUser(req);
    if(user.role == "CUSTOMER"){
      other['customerId'] = user.id
    }
    if(user.role == "DRIVER"){
      other['driverId'] = user.id
    }
    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          // if ({}.hasOwnProperty.call(item, key)) {
            var itemValue = '';
            if (user.role == "DRIVER"){
              if(item.state == OrderDetailState.NOT_DISTRIBUTED)
                return 1;
            }
            if (key.indexOf('.')>-1) {
              itemValue = String(item[key.split('.')[0]][key.split('.')[1]]).trim();
            }  
            else if (key === 'createTime') {
              const start = new Date(other[key][0]).getTime()
              const end = new Date(other[key][1]).getTime()
              const now = new Date(item[key]).getTime()
              if (start && end) {
                return now >= start && now <= end
              }
              return true
            }else{
              itemValue = item[key];
            }
            return String(itemValue).trim().indexOf(decodeURI(other[key]).trim()) > -1
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`DELETE ${apiPrefix}/orders`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/orders`] (req, res) {
    const newData = req.body
   
    var user = cookietools.getUser(req);
    newData.from.district = tools.getFullName(newData.from.district)
    for(var i in newData.orders){
      var customerOrder = {};
      customerOrder.id = Mock.mock('@id');
      customerOrder.state = OrderDetailState.NOT_DISTRIBUTED;
      customerOrder.from = newData.from
      customerOrder.to = newData.orders[i].to
      customerOrder.to.district = tools.getFullName(customerOrder.to.district)
      customerOrder.cargoes = newData.orders[i].cargoes
      customerOrder.payment = newData.payment
      customerOrder.distance = newData.orders[i].distance
      customerOrder.createTime = Mock.mock('@datetime')
      customerOrder.customerId = user.id
      customerOrder.deliverOrders = []
      database.unshift(customerOrder)

    }

    // database.unshift(newData)
    res.status(200).end()
  },

  [`GET ${apiPrefix}/orders/:id`] (req, res) {
    const { id } = req.params
    console.log(database)
    const data = queryArray(database, id, 'id')
    console.log(data)
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/orders/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`POST ${apiPrefix}/orders/stateTransfer`] (req, res) {
    const { id, state } = req.body
    let isExist = false;
    database = database.map((item) => {
      if (item.id === id) {
        isExist = true
        item.state = state
        //测试代码 司机id=2
        console.log(state);
        if(state == OrderDetailState.NOT_PAID)
          item.deliverOrders = Mock.mock([{'id|+1':10000001, deliverOrderState:state, distance: 100,from:item.from,to:item.to,'price|150-250.1-2':1,vehicle:{id:"@id",number:'贵A12345'},driver:{id:2,name:'测试司机',phone:/^1[34578]\d{9}$/},detail:'@ctitle','cube|1-100.1-2':1,'status|0-3':1,createTime:'@datetime',distributTime:'@datetime',loadTime:'@datetime',completeTime:'@datetime'}]);
        item.deliverOrders[0].deliverOrderState = state;
        item.driverId = 2
        console.log(item)
        // if(item.)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },
}
