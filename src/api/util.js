import request from '@/utils/request'
import Cookies from 'js-cookie'

// const HOST = '117.184.129.146:9010'
const HOST = "http://127.0.0.1:6666";
// const TOMCAT = '117.184.129.146:21081'
const TOMCAT = '127.0.0.1'
const ACCOUNT = JSON.parse(Cookies.get('User')).account

export function loginGetPark(accountId){
  return `/account/info/detail/${accountId}`
}
//上次文件
export function uploadFile() {
  return `/api/staff/info/import`
}
//上传人像
// export function uploadImage() {
//   return `/staff/info/image_quality/verify`
// }
// //上传访客人像
export function uploadImage() {
  return `/images/quality/verify`
}
//获取人像
export function feachImage(id) {
  return `/images/${id}`
}
//获取场景照
export function feachSceneImage(id) {
  return `/images/face/${id}`
}
//获取抓拍照
export function feachFaceImage(id) {
  return `/images/scene/${id}`
}

//根据标签id查询标签名称
export function getTagNameByTagId(tagIds, tagList) {
  return tagList.filter(v => tagIds.includes(v.tagId)).map(v => v.tagName)
}

//根据标签id查询园区名称
export function getParkNameByParkId(parkIds, parkList) {
  return parkList.filter(v => parkIds.includes(v.parkId)).map(v => v.parkName)
}

//根据标签id查询全量数据名称
export function getTagListByTagId(tagIds, tagList) {
  return tagList
    .filter(v => tagIds.includes(v.tagId))
    .map(v => {
      return {
        "tagName": v.tagName,
        "tagId": v.tagId
      }
    })
}

//根据标签id查询所有单位
export function getUnitByParkId(parkIds, parkList) {
  return parkList.filter(v => parkIds.includes(v.parkId)).map(v => v.unit)
}

//检查值是否存在特殊字符
export function verifyValue(value) {
  let result = false
  console.log(value)
  let pat = /[`~!@#$%^&*()\+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/im
  if (pat.test(value)) {
    result = true
  }
  return result
}

//ip地址
export function verifyIp(value) {
  let result = true
  let reg = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/
  if (reg.test(value)) {
    result = false
  }

  return result
}

//检查值是否只有字母和数字
export function verifyStaffNum(value) {
  let result = true
  let staffId = /^[A-Za-z0-9]+$/
  if (staffId.test(value)) {
    result = false
  }
  return result
}

//检查值是否只有数字
export function verifyNum(value) {
  let result = true
  let number = /^[0-9]+$/
  if (number.test(value)) {
    result = false
  }
  return result
}
