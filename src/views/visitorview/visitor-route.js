// 访客信息子级路由-不需要配置权限
const route = [
  {
    path: '/visitor/visitorinfo/nowvisitor',
    component: 'nowvisitor/index',
    name: 'Nowvisitor',
    meta: {
      title: '当前来访',
      icon: 'table'
    }
  },
  //  {
  //   path: '/visitor/visitorinfo/ordervisitor',
  //   component: 'ordervisitor/index',
  //   name: 'Ordervisitor',
  //   meta: {
  //     title: '预约来访',
  //     icon: 'table',
  //     activeMenu: '/visitor/visitorinfo/nowvisitor'
  //   }
  // },
   {
    path: '/visitor/visitorinfo/history',
    component: 'historyvisitor/index',
    name: 'Historyvisitor',
    meta: {
      title: '历史来访',
      icon: 'table',
      activeMenu: '/visitor/visitorinfo/nowvisitor'
    }
  }
]

export default route
