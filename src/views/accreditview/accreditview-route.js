const route = [
  {
    path: '/visitor/accredit/accreditvisitor',
    component: 'accreditvisitor/index',
    name: 'Accreditvisitor',
    meta: {
      title: '访客',
      icon: 'table'
    }
  },
  {
    path: '/visitor/accredit/accreditstaff',
    component: 'accreditstaff/index',
    name: 'Accreditstaff',
    meta: {
      title: '员工',
      icon: 'table',
      activeMenu: '/visitor/accredit/accreditvisitor'
    }
  }
]

export default route
