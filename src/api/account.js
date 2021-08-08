import request from "@/utils/request";

//条件查询账号
export function getAccountSearch(data) {
  return request({
    url: "/account/info/search",
    method: "post",
    data
  });
}

//账号新增
export function addAccount(account, data) {
  return request({
    url: `/account/info/add`,
    method: "post",
    data
  });
}

//账号修改
export function updateAccount(account, data) {
  return request({
    url: `/account/info/update`,
    method: "put",
    data
  });
}

//账号删除
export function deleteAccount(account, id) {
  return request({
    url: `/account/info/delete/${id}`,
    method: "delete"
  });
}

//判断账号是否重复

export function accountSearch(data) {
  return request({
    url: `/account/info/check/${data}`,
    method: "get"
  });
}

//获取账号详情

export function accountDetail(accountId) {
  return request({
    url: `account/info/detail/${accountId}`,
    method: "get"
  });
}

//获取表格数据
export function getList(data) {
  return request({
    url: "/account/info/search",
    method: "post",
    data
  });
}
