import request from '@/utils/request'

export function getReissueRecord(data){
  return request({
    url: "/staff/reissue/record/list",
    method:'post',
    data
  }) 
}

export function confirmReissueRecord(data){
  return request({
    url:"/staff/reissue/record/confirm",
    method:'post',
    data
  })
}

export function exportReissueRecord(data){
  return request({
    url:"/staff/reissue/record/export",
    method:'post',
    data
  })
}


export const ReservationStatus = {
  WAIT_CONFIRM: '待审核',
  CONFIRM: '审核通过',
  REFUSE: '已拒绝',
}
