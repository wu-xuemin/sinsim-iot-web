import request from "@/utils/request";

//员工信息导出
export function staffExport(account, data) {
    return request({
      url: `staff/info/export/zip`,
      method: "post",
      data
    });
}

//监控记录导出
export function candidExport(account, data) {
  return request({
    url: `/visit/record/export/visitRecord`,
    method: "post",
    data
  });
}

//全量记录导出
export function recordExport(account, data) {
  return request({
    url: `/visit/record/export/allRecord`,
    method: "post",
    data,
    timeout: 0
  });
}

//通行记录导出
export function visitExport(account, data) {
  return request({
    url: `/visit/record/export/accessRecord`,
    method: "post",
    data
  });
}
