export const Route = [
  {
    path: '',
    component: 'Layout',
    redirect: 'employee',
    children: [
      {
        path: 'employee',
        component: 'employee/index',
        name: 'Employee',
        meta: {
          title: '人员管理',
          icon: 'peoples'
        }
      }
    ]
  },
  {
    path: 'departingEmployee',
    component: 'Layout',
    redirect: 'departingEmployee',
    children: [
      {
        path: 'departingEmployee',
        component: 'departingemployee/index',
        name: 'DepartingEmployee',
        meta: {
          title: '离职人员',
          icon: 'user'
        }
      }
    ]
  },
  {
    path: 'equipment',
    component: 'Layout',
    redirect: 'equipment',
    children: [
      {
        path: 'equipment',
        component: 'equipment/index',
        name: 'equipment',
        meta: {
          title: 'IOT机器列表',
          icon: 'component'
        }
      }
    ]
  },
  // {
  //   path: '/permission',
  //   component: 'Layout',
  //   redirect: '/permission/equipment',
  //   alwaysShow: true,
  //   meta: {
  //     title: '设备管理',
  //     icon: "component"
  //   },
  //   children: [{
  //       path: 'equipment',
  //       component: 'equipment/index',
  //       name: 'Equipment',
  //       meta: {
  //         title: '设备列表',
  //       }
  //     },
  //     {
  //       path: 'total',
  //       component: 'total/index',
  //       name: 'Total',
  //       meta: {
  //         title: '全量记录',
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/thoroug',
  //   component: 'Layout',
  //   redirect: '/thoroug/thorougrecord',
  //   alwaysShow: true,
  //   name: 'ThorougAdmin',
  //   meta: {
  //     title: '通行管理',
  //     icon: "guide"
  //   },
  //   children: [{
  //       path: 'thorougrecord',
  //       component: 'thoroug/index',
  //       name: 'Thorougrecord',
  //       meta: {
  //         title: '通行记录',
  //         roles: ['admin']
  //       }
  //     },
  //     {
  //       path: 'tactics',
  //       component: 'tactics/index',
  //       name: 'Tactics',
  //       meta: {
  //         title: '通行策略',
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/intellitask',
  //   component: 'Layout',
  //   redirect: '/intellitask/monitor',
  //   alwaysShow: true,
  //   name: 'ExampleTask',
  //   meta: {
  //     title: '智能任务',
  //     icon: "table"
  //   },
  //   children: [{
  //       path: 'monitor',
  //       component: 'monitor/index',
  //       name: 'Monitor',
  //       meta: {
  //         title: '监控墙',
  //       }
  //     },
  //     {
  //       path: 'monitorrecord',
  //       component: 'monitorrecord/index',
  //       name: 'Monitorrecord',
  //       meta: {
  //         title: '监控记录',
  //       }
  //     },
  //     {
  //       path: 'monitorconfig',
  //       component: 'monitorconfig/index',
  //       name: 'Monitorconfig',
  //       meta: {
  //         title: '监控配置',
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/visitor',
  //   component: 'Layout',
  //   redirect: '/visitor/visitorinfo/nowvisitor',
  //   meta: {
  //     title: "访客管理",
  //     icon: "user"
  //   },
  //   alwaysShow: true,
  //   children: [{
  //       path: 'visitorinfo',
  //       component: 'visitorview/index',
  //       name: 'Visitorinfo',
  //       meta: {
  //         title: "访客信息",
  //       },
  //       alwaysShow: false,
  //       redirect: '/visitor/visitorinfo/nowvisitor',
  //       children: [{
  //         path: 'nowvisitor',
  //         component: 'nowvisitor/index',
  //         name: 'Nowvisitor',
  //         meta: {
  //           title: "当前来访",
  //         },
  //       },
  //       // {
  //       //   path: 'ordervisitor',
  //       //   component: 'ordervisitor/index',
  //       //   name: 'Ordervisitor',
  //       //   meta: {
  //       //     title: "预约来访",
  //       //     activeMenu: '/visitor/visitorinfo/nowvisitor'
  //       //   },
  //       // },
  //        {
  //         path: 'history',
  //         component: 'historyvisitor/index',
  //         name: 'Historyvisitor',
  //         meta: {
  //           title: "历史来访",
  //           activeMenu: '/visitor/visitorinfo/nowvisitor'
  //         },
  //       }]
  //     }, {
  //       path: 'accredit',
  //       name: 'Accredit',
  //       component: 'accreditview/index',
  //       redirect: "/visitor/accredit/accreditvisitor",
  //       meta: {
  //         title: "授权名单",
  //         icon: "table"
  //       },
  //       alwaysShow: true,
  //       children: [{
  //           path: 'accreditvisitor',
  //           component: 'accreditvisitor/index',
  //           name: 'Accreditvisitor',
  //           meta: {
  //             title: "访客",
  //           },

  //         },
  //         {
  //           path: 'accreditstaff',
  //           component: 'accreditstaff/index',
  //           name: 'Accreditstaff',
  //           meta: {
  //             title: "员工",
  //             activeMenu: '/visitor/accredit/accreditvisitor'
  //           },
  //         },

  //       ]
  //     },
  //      {
  //       path: 'auditconfig',
  //       name: 'Auditconfig',
  //       component: 'auditconfig/index',
  //       meta: {
  //         title: "审核配置",
  //       },
  //     },
  //     {
  //       path: 'goout',
  //       name: 'Goout',
  //       component: 'goout/index',
  //       meta: {
  //         title: "迁入迁出",
  //       },
  //     }
  //   ]
  // },

  {
    path: '/attendance',
    component: 'Layout',
    redirect: '/attendance/list',
    name: 'AttendanceAdmin',
    meta: {
      title: '考勤管理',
      icon: 'form'
    },
    children: [
      {
        path: 'list',
        component: 'attendance/index',
        name: 'Attendance',
        meta: {
          title: '考勤列表'
        }
      },
      {
        path: 'push',
        component: 'attendancepush/index',
        name: 'Attendancepush',
        meta: {
          title: '考勤统计'
        }
      },
      {
        path: 'reissue',
        component: 'attendanceReissue/index',
        name: 'AttendanceReissue',
        meta: {
          title: '补签管理'
        }
      },
      {
        path: 'park',
        component: 'attendancepark/index',
        name: 'Attendancepark',
        meta: {
          title: '园区考勤统计'
        }
      },
      {
        path: 'unit',
        component: 'attendanceunit/index',
        name: 'Attendanceunit',
        meta: {
          title: '单位考勤统计'
        }
      }
    ]
  },
  {
    path: '/system',
    component: 'Layout',
    redirect: '/system/list',
    name: 'SystemAdmin',
    meta: {
      title: '系统管理',
      icon: 'xitongshezhi'
    },
    children: [
      {
        path: 'list',
        component: 'system/index',
        name: 'System',
        meta: {
          title: '平台用户'
        }
      },
      {
        path: 'rolesadd',
        component: 'rolesadd/index',
        name: 'Rolesadd',
        meta: {
          title: '角色权限'
        }
      },
      {
        path: 'park',
        component: 'park/index',
        name: 'Park',
        meta: {
          title: '园区设置'
        }
      },
      {
        path: 'operationlog',
        component: 'operationlog/index',
        name: 'Operationlog',
        meta: {
          title: '操作日志'
        }
      }
    ]
  }
]
