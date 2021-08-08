import { login, logout, getInfo } from '@/api/user'
import { getToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'
import md5 from 'blueimp-md5'
import {Decrypt,Encrypt} from '@/utils/crypto'

const getDefaultState = () => {
  return {
    token: '',
    name: '',
    avatar: '',
    logOutDialog: false,
    user: {},
    roles: [],
    account: '',
  }
}

const state = getDefaultState()

const mutations = {
  //token
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  //账户
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  //权限
  SET_ROLES: (state, roles) => {
    const Role = []
    Role.push(roles)

    state.roles = Role
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  RESET_DIALOG: (state, status) => {
    state.logOutDialog = status
  },
}

const actions = {
  login({ commit }, userInfo) {
    let { username, password } = userInfo
    // password = md5(password)
    password = Encrypt(password)
    return new Promise((resolve, reject) => {
      login({
        account: username.trim(),
        password: password,
      })
        .then((response) => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          Cookies.set('Token', data.token)
          Cookies.set('UserInfo', data.role)
          Cookies.set('User', data)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  setuser({ commit }, user) {
    commit('SET_USER', user)
  },

  // get user info
  getInfo({ commit, state }) {
    let roleId = Cookies.get('UserInfo')
    return new Promise((resolve, reject) => {
      getInfo(roleId)
        .then((response) => {
          const { data } = response
          localStorage.setItem('SCOPE', data.scope)
          const roles = []
          roles.push(data.roleName)
          let test = Cookies.get('UserInfo')
          commit('SET_ROLES', test)
          resolve(roles)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    const user = JSON.parse(Cookies.get('User')).account
    return new Promise((resolve, reject) => {
      logout(user)
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // 清除token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken()
      commit('RESET_STATE')
      resolve()
    })
  },

  // logOutDialog
  logOutDialog({ commit }, status) {
    commit('RESET_DIALOG', status)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
