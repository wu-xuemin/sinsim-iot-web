import request from "@/utils/request";

export function getInfo(id) {
  return request({
    url: `/role/info/detail/${id}`,
    method: "get"
  });
}

export function logout(data) {
  return request({
    url: `/account/info/logout/${data}`,
    method: "get"
  });
}

export function login(data) {
  return request({
    url: '/account/info/login',
    method: 'post',
    data
  })
}

export function getToken() {
  return request({
    url: '/account/info/get/token',
    method: 'post'
  })
}
