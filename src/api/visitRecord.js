import request from '@/utils/request'

// 表格数据
export function fetchVisitRecordList(data) {
  return request({
    url: '/visit/record/search',
    method: 'post',
    data
  })
}

export function fetchTaskRecord(data) {
  return request({
    url: '/visit/record/findTaskRecord',
    method: 'post',
    data
  })
}

export function fetchRecordByTaskId(data) {
  return request({
    url: '/visit/record/findReocrdByTaskId',
    method: 'post',
    data
  })
}

export function fetchAccessRecord(data) {
  return request({
    url: '/visit/record/findByAccessRecord',
    method: 'post',
    data
  })
}
