import request from '@/utils/request'

//全量设备
// export function getDeviceList() {
//   return request({
//     url: '/device/info/list',
//     method: 'get'
//   })
// }

// 分页
export function getDeviceSearch(data) {
  return request({
    url: '/device/info/list',
    method: 'post',
    data
  })
}

//更新
export function updataDevice(account, data) {
  return request({
    url: `/device/info/update`,
    method: 'put',
    data
  })
}

// 删除
export function deleteDevice(account, id) {
  return request({
    url: `/device/info/delete/${id}`,
    method: 'delete'
  })
}

// 新增
export function addDevice(account, data) {
  return request({
    url: `/device/info/add`,
    method: 'post',
    data
  })
}

export function issued(data = []) {
  return request({
    url: '/device/info/image_issue',
    method: 'post',
    data
  })
}

//全量区域
export function getAreaList() {
  return request({
    url: '/area/info/list',
    method: 'get'
  })
}

//条件查询区域
export function getAreaSearch(data) {
  return request({
    url: '/area/info/search',
    method: 'post',
    data
  })
}

//区域新增
export function addArea(account, data) {
  return request({
    url: `/area/info/add`,
    method: 'post',
    data
  })
}

//区域修改
export function updateArea(account, data) {
  return request({
    url: `/area/info/update`,
    method: 'put',
    data
  })
}

//区域删除
export function deleteArea(account, id) {
  return request({
    url: `/area/info/delete/${id}`,
    method: 'delete'
  })
}

//查询设备ID是否重复
export function checkDeviceId(deviceId) {
  return request({
    url: `/device/info/check/id/${deviceId}`,
    method: 'get'
  })
}

//查询设备IP是否重复
export function checkDeviceIp(deviceIp) {
  return request({
    url: `/device/info/check/ip/${deviceIp}`,
    method: 'get'
  })
}
