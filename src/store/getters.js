const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  user: state => state.user.user,
  roles: state => state.user.roles,
  account: state => state.user.account,
  permission_routes: state => state.permission.routes,
  token: state => state.user.token,
}
export default getters
