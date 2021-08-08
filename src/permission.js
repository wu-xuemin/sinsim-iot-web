import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import { deteleObject } from '@/utils/index'
import { stopUpdatePage } from '@/utils/update-page'

export const IMAGE = 'http://117.184.129.146:21081'

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login']

const getRoleFirst = function(role) {
  let routeName = ''
  const routeFirst = role[0]
  let children = routeFirst.children
  while (children) {
    if (Array.isArray(children)) {
      routeName = children[0].name
    }
    children = children.children
  }
  return routeName
}

router.beforeEach(async (to, from, next) => {
  stopUpdatePage() // 清除页面更新定时器
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0

      if (hasRoles) {
        next()
      } else {
        try {
          const roles = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            roles
          )
          router.options.routes = deteleObject(router.options.routes)
          accessRoutes.push({
            path: '*',
            redirect: '/404',
            hidden: true
          })
          router.options.routes.push(...accessRoutes)
          router.addRoutes(accessRoutes)
          // 跳转到权限路由的第一个
          const toRouteName = getRoleFirst(accessRoutes)
          if (from.path === '/login') {
            next({
              name: toRouteName,
              replace: true
            })
          } else {
            next({
              ...to,
              replace: true
            })
          }
        } catch {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  if (from.path != '/login' && from.path != '/' && to.path == '/login') {
    window.location.reload()
  }
  NProgress.done()
})
