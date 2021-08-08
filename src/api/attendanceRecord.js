import request from '@/utils/request'

// // 分页
// export function getAttendanceSearch(data) {
//   return request({
//     url: '/attendance/record/search',
//     method: 'post',
//     data
//   })
// }
export function deleteAttendanceConfigList(id) {
  return request({
    url: `/attendance/config/delete/${id}`,
    method: 'delete'
  })
}

export function updateAttendanceConfigList(data) {
  return request({
    url: '/attendance/config/update',
    method: 'put',
    data
  })
}

export function addAttendanceConfigList(data) {
  return request({
    url: '/attendance/config/add',
    method: 'post',
    data
  })
}

export function getAttendanceConfigList(data) {
  return request({
    url: '/attendance/config/list',
    method: 'post',
    data
  })
}

export function getAttendanceDetail(data) {
  return request({
    url: '/attendance/record/countAttendance/detail',
    method: 'post',
    data
  })
}

export function getAttendanceDetailExcel(data) {
  return request({
    url: '/attendance/record/export/countAttendance/detail',
    method: 'post',
    data
  })
}

export function getAttendanceCount(data) {
  return request({
    url: '/attendance/record/countAttendance',
    method: 'post',
    data
  })
}

export function getAttendanceCountExport(data) {
  return request({
    url: '/attendance/record/export/countAttendance',
    method: 'post',
    data
  })
}

// 分页
export function getAttendanceSearch(data) {
  return request({
    url: '/attendance/record/list',
    method: 'post',
    data
  })
}

//导出
export function getAttendanceExport(data) {
  return request({
    url: '/attendance/record/export',
    method: 'post',
    data
  })
}

//导出园区
export function getParkAttendanceExport(data) {
  return request({
    url: '/attendance/record/export/park',
    method: 'post',
    data
  })
}

//单位导出
export function getUnitAttendanceExport(data) {
  return request({
    url: '/attendance/record/export/unit',
    method: 'post',
    data
  })
}

//设置
export function setAttendanceConfig(data) {
  return request({
    url: '/attendance/config/update',
    method: 'put',
    data
  })
}

//获取设置
export function getAttendanceConfig(data) {
  return request({
    url: `/attendance/config/detail/${data}`,
    method: 'get'
  })
}

//设置推送
export function setAttendancePush(data) {
  return request({
    url: '/attendance/record/push',
    method: 'post',
    data
  })
}

export function setAttendanceBu(data) {
  return request({
    url: '/attendance/record/push/record',
    method: 'post',
    data
  })
}

//园区考勤统计
export function getParkAttendanceSearch(data) {
  return request({
    url: '/attendance/record/count/park',
    method: 'post',
    data
  })
}

//单位考勤统计
export function getUnitAttendanceSearch(data) {
  return request({
    url: '/attendance/record/count/unit',
    method: 'post',
    data
  })
}


export const ReservationType = {
  0: '刷脸',
  1: '补签'
}
