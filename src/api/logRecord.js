import request from '@/utils/request'
import Cookies from 'js-cookie'

// 分页
export function getLogSearch(data) {
  return request({
    url: '/log/record/search',
    method: 'post',
    data
  })
}

// 日志导出
export function exportLog (account, data) {
  return request({
    url: `/log/record/export/`,
    method: 'post',
    data
  })
}

