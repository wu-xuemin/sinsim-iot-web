import request from "@/utils/request";

//条件查询任务
export function getTaskSearch(data) {
  return request({
    url: "/monitoring/task/search",
    method: "post",
    data
  });
}

//任务列表
export function getTaskList() {
  return request({
    url: '/monitoring/task/list',
    method: 'get'
  })
}

//任务新增
export function addTask(account, data) {
  return request({
    url: `/monitoring/task/add`,
    method: "post",
    data
  });
}

//任务修改
export function updateTask(account, data) {
  return request({
    url: `/monitoring/task/update`,
    method: "put",
    data
  });
}

//任务删除
export function deleteTask(account, id) {
  return request({
    url: `/monitoring/task/delete/${id}`,
    method: "delete"
  });
}

//检查智能任务是否存在
export function checkTaskName(taskName) {
  return request({
    url: `/monitoring/task/check?name=${taskName}`,
    method: 'get'
  })
}
