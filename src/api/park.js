import request from '@/utils/request'

//搜索园区
export function getParkSearch(data) {
  return request({
    url: '/park/info/list',
    method: 'post',
    data
  })
}

//根据条件搜索员工
export function getStaffSearch(data) {
  return request({
    url: '/staff/info/search',
    method: 'post',
    data
  })
}

//员工新增
export function addPark(account, data) {
  return request({
    url: `/park/info/add`,
    method: 'post',
    data
  })
}

export function addParkTag(account, data) {
  return request({
    url: `/park/info/tag/add`,
    method: 'post',
    data
  })
}

export function addStaffMonitor(account, data) {
  return request({
    url: `/staff/info/add/stranger`,
    method: 'post',
    data
  })
}

//员工修改
export function updatePark(account, data) {
  return request({
    url: `/park/info/update`,
    method: 'put',
    data
  })
}

//员工删除
export function deletePark(account, parkId) {
  return request({
    url: `/park/info/delete/${parkId}`,
    method: 'delete'
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
export function checkParkName(parkName) {
  return request({
    url: `/park/info/check?parkName=${parkName}`,
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
