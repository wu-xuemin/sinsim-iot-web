import request from '@/utils/request'


//全量角色
export function getRoleList() {
  return request({
    url: '/role/info/list',
    method: 'get'
  })
}

//根据条件搜索角色
export function getRoleSearch(data) {
  return request({
    url: '/role/info/search',
    method: 'post',
    data
  })
}

//角色新增
export function addRole(account, data) {
  return request({
    url: `/role/info/add`,
    method: 'post',
    data
  })
}

//角色修改
export function updateRole(account, data) {
  return request({
    url: `/role/info/update`,
    method: 'put',
    data
  })
}

//角色删除
export function deleteRole(account, id) {
  return request({
    url: `/role/info/delete/${id}`,
    method: 'delete'
  })
}

//查询角色是否重复
export function roleSearch(params) {
  return request({
    url: `/role/info/check`,
    method: 'get',
    params
  })
}
