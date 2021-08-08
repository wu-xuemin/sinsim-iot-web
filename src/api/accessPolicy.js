import request from '@/utils/request'

// 条件查询策略
export function getPolicySearch(data) {
  return request({
    url: '/access/policy/search',
    method: 'post',
    data
  })
}

// 策略新增
export function addPolicy(account, data) {
  return request({
    url: `/access/policy/add`,
    method: 'post',
    data
  })
}

// 策略修改
export function updatePolicy(account, data) {
  return request({
    url: `/access/policy/update`,
    method: 'put',
    data
  })
}

// 策略删除
export function deletePolicy(account, id) {
  return request({
    url: `/access/policy/delete/${id}`,
    method: 'delete'
  })
}

export function checkPolicyName(poliName) {
  return request({
    url: `/access/policy/checkPolicyName/${poliName}`,
    method: 'get'
  })
}
