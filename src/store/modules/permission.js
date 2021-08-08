import {
  asyncRoutes,
  constantRoutes,
} from '@/router'
import Cookies from 'js-cookie'
const _import = require('../../router/_import_' + process.env.NODE_ENV) 
import Layout from "@/layout" 



/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(Route) {
  const accessedRouters = Route.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') { 
        route.component = Layout
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length > 0) {
      route.children = filterAsyncRoutes(route.children)
    }
    return true
  })
  return accessedRouters

}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({
    commit
  }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      const testinfo = JSON.parse(localStorage.getItem('SCOPE'))
      accessedRoutes = filterAsyncRoutes(testinfo)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
