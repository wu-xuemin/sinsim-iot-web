import request from '@/utils/request'

//根据条件搜索员工
export function getDepartSearch(data) {
  return request({
    url: '/departing/staff/list',
    method: 'post',
    data
  })
}

//员工修改
export function updateDepart(account, data) {
  return request({
    url: `/departing/staff/update`,
    method: 'put',
    data
  })
}

//员工删除
export function deleteDepart(account, id) {
  return request({
    url: `/departing/staff/delete/${id}`,
    method: 'delete'
  })
}

//员工离职
export function entryStaff(staffId) {
  return request({
    url: `/departing/staff/setting/${staffId}`,
    method: 'post'
  })
}

//全量标签
export function getTagList() {
  return request({
    url: '/tag/info/list',
    method: 'get'
  })
}

//根据条件搜索标签
export function getTagSearch(data) {
  return request({
    url: '/tag/info/search',
    method: 'post',
    data
  })
}

//根据条件搜索标签
export function getParkTagSearch(data) {
  return request({
    url: '/park/info/tag',
    method: 'post',
    data
  })
}

//标签新增
export function addTag(account, data) {
  return request({
    url: `/tag/info/add`,
    method: 'post',
    data
  })
}

//标签修改
export function updateTag(account, data) {
  return request({
    url: `/tag/info/update`,
    method: 'put',
    data
  })
}

//标签删除
export function deleteTag(account, id) {
  return request({
    url: `/tag/info/delete/${id}`,
    method: 'delete'
  })
}

//检查卡号是否重复
export function checkCard(cardNumber) {
  return request({
    url: `/staff/info/check/card/${cardNumber}`,
    method: 'get'
  })
}

//检查工号是否重复
export function checkStaffNumber(staffNumber) {
  return request({
    url: `/staff/info/check/staff/${staffNumber}`,
    method: 'get'
  })
}

//检查标签名称是否重复
export function checkTagName(type, name) {
  return request({
    url: `/tag/info/check?tagType=${type}&tagName=${name}`,
    method: 'get'
  })
}
