import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get('Token')
}

export function setToken(token) {
  return Cookies.set('Token', token)
}

export function removeToken() {
  Cookies.remove('Token')
  Cookies.remove('User')
  Cookies.remove('UserInfo')
  localStorage.clear();
}
