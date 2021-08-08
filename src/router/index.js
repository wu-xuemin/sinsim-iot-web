import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    // component: (resolve) => require(["@/views/login/index"],resolve),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    // component: (resolve) => require(["@/views/404"],resolve),
    hidden: true
  }
]

export const asyncRoutes = [
  {
    path: '/employee',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Employee',
        component: () => import('@/views/employee/index'),
        meta: {
          title: '人员管理',
          icon: 'peoples'
        }
      }
    ]
  },
  {
    path: '/departingEmployee',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'DepartingEmployee',
        component: () => import('@/views/departingemployee/index'),
        meta: {
          title: '离职人员',
          icon: 'user'
        }
      }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/equipment',
    alwaysShow: true,
    name: 'Example',
    meta: {
      title: '设备管理',
      icon: 'component',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'equipment',
        name: 'Equipment',
        component: () => import('@/views/equipment/index'),
        meta: {
          title: '设备列表'
        }
      },
      {
        path: 'total',
        name: 'Total',
        component: () => import('@/views/total/index'),
        meta: {
          title: '全量记录'
        }
      }
    ]
  },

  {
    path: '/thoroug',
    component: Layout,
    redirect: '/thoroug/thorougrecord',
    alwaysShow: true,
    name: 'ThorougAdmin',
    meta: {
      title: '通行管理',
      icon: 'guide',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'thorougrecord',
        name: 'Thoroug',
        component: () => import('@/views/thoroug/index'),
        meta: {
          title: '通行记录'
        }
      },
      {
        path: 'tactics',
        name: 'Tactics',
        component: () => import('@/views/tactics/index'),
        meta: {
          title: '通行策略'
        }
      }
    ]
  },

  {
    path: '/intellitask',
    component: Layout,
    redirect: '/intellitask/monitor',
    alwaysShow: true,
    name: 'ExampleTask',
    meta: {
      title: '智能任务',
      icon: 'table'
    },
    children: [
      {
        path: 'monitor',
        name: 'Monitor',
        component: () => import('@/views/monitor/index'),
        meta: {
          title: '监控墙'
        }
      },
      {
        path: 'monitorrecord',
        name: 'Monitorrecord',
        component: () => import('@/views/monitorrecord/index'),
        meta: {
          title: '监控记录'
        }
      },
      {
        path: 'monitorconfig',
        name: 'Monitorconfig',
        component: () => import('@/views/monitorconfig/index'),
        meta: {
          title: '监控配置'
        }
      }
    ]
  },

  {
    path: '/visitor',
    component: Layout,
    redirect: '/visitor/visitorinfo/nowvisitor',
    alwaysShow: true,
    meta: {
      title: '访客管理',
      icon: 'user'
    },
    children: [
      {
        path: 'visitorinfo',
        name: 'Visitorinfo',
        component: () => import('@/views/visitorview/index'),
        redirect: '/visitor/visitorinfo/nowvisitor',
        meta: {
          title: '访客信息'
        },
        children: [
          {
            path: 'nowvisitor',
            name: 'Nowvisitor',
            component: () => import('@/views/nowvisitor/index'),
            meta: {
              title: '当前来访'
            },
            hidden: true
          },
          // {
          //   path: 'ordervisitor',
          //   name: 'Ordervisitor',
          //   component: () => import('@/views/ordervisitor/index'),
          //   meta: {
          //     title: '预约来访'
          //   },
          //   hidden: true
          // },
          {
            path: 'history',
            name: 'Historyvisitor',
            component: () => import('@/views/historyvisitor/index'),
            meta: {
              title: '历史来访'
            },
            hidden: true
          }
        ]
      },
      {
        path: 'accredit',
        name: 'Accredit',
        component: () => import('@/views/accreditview/index'),
        redirect: '/visitor/accredit/accreditvisitor',
        meta: {
          title: '授权名单'
        },
        children: [
          {
            path: 'accreditvisitor',
            name: 'Accreditvisitor',
            component: () => import('@/views/accreditvisitor/index'),
            meta: {
              title: '访客'
            },
            hidden: true
          },
          {
            path: 'accreditstaff',
            name: 'Accreditstaff',
            component: () => import('@/views/accreditstaff/index'),
            meta: {
              title: '员工'
            },
            hidden: true
          }
        ]
      },
      {
        path: 'auditconfig',
        name: 'Auditconfig',
        component: () => import('@/views/auditconfig/index'),
        meta: {
          title: '审核配置'
        }
      },
      {
        path: 'goout',
        name: 'Goout',
        component: () => import('@/views/goout/index'),
        meta: {
          title: '迁入迁出'
        }
      }
    ]
  },

  {
    path: '/attendance',
    component: Layout,
    redirect: '/attendance/list',
    alwaysShow: true,
    name: 'AttendanceAdmin',
    meta: {
      title: '考勤管理',
      icon: 'form'
    },
    children: [
      {
        path: 'list',
        name: 'Attendance',
        component: () => import('@/views/attendance/index'),
        meta: {
          title: '考勤列表'
        }
      },
      {
        path: 'push',
        name: 'Attendancepush',
        component: () => import('@/views/attendancepush/index'),
        meta: {
          title: '考勤统计'
        }
      },
      {
        path: 'reissue',
        name: 'AttendanceReissue',
        component: () => import('@/views/attendanceReissue/index'),
        meta: {
          title: '补签管理'
        }
      },
      {
        path: 'park',
        name: 'Attendancepark',
        component: () => import('@/views/attendancepark/index'),
        meta: {
          title: '园区考勤统计'
        }
      },
      {
        path: 'unit',
        name: 'Attendanceunit',
        component: () => import('@/views/attendanceunit/index'),
        meta: {
          title: '单位考勤统计'
        }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/list',
    alwaysShow: true,
    name: 'SystemAdmin',
    meta: {
      title: '系统管理',
      icon: 'xitongshezhi'
    },
    children: [
      {
        path: 'list',
        name: 'System',
        component: () => import('@/views/system/index'),
        meta: {
          title: '平台用户'
        }
      },
      {
        path: 'rolesadd',
        name: 'Rolesadd',
        component: () => import('@/views/rolesadd/index'),
        meta: {
          title: '角色权限'
        }
      },
      {
        path: 'park',
        name: 'Park',
        component: () => import('@/views/park/index'),
        meta: {
          title: '园区设置'
        }
      },
      {
        path: 'operationlog',
        name: 'Operationlog',
        component: () => import('@/views/operationlog/index'),
        meta: {
          title: '操作日志'
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  router.matcher = createRouter().matcher
}

export default router
