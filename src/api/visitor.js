import request from '@/utils/request'
// 根据条件搜索邀约列表
export function getInvitationSearch(data) {
  return request({
    url: '/visiting/application/search',
    headers: {
      'content-type': 'application/json'
    },
    method: 'post',
    data
  })
}

//添加访客
export function addVisitor(account, data) {
  return request({
    url: `/visiting/application/add`,
    headers: {
      'content-type': 'application/json'
    },
    method: 'post',
    data
  })
}

//员工修改
export function updateVisitor(account, data) {
  return request({
    url: `/visiting/application/update`,
    method: 'put',
    data
  })
}

// 查询所有区域
export function getRegion() {
  return request({
    url: '/audit/region/list',
    method: 'get'
  })
}

// 根具条件查询所有授权员工
export function getStaffAuthInfoSearch(data) {
  return request({
    url: '/staff/auth/info/search',
    headers: {
      'content-type': 'application/json'
    },
    method: 'post',
    data
  })
}

// 根据条件查询所有授权访客
export function getVisitorAuthInfoSearch(data) {
  return request({
    url: '/visitor/auth/info/search',
    headers: {
      'content-type': 'application/json'
    },
    method: 'post',
    data
  })
}

// 查询所有上级审核
export function getCheckLeader() {
  return request({
    url: '/staff/auth/info/audit/leader/list',
    method: 'get'
  })
}

// 根据授权员工主键集合查询对应集合
export function getStaffAuthInfoIds(ids) {
  return request({
    url: '/staff/auth/info/find/' + ids,
    method: 'get'
  })
}

// 查询所有授权员工
export function getStaffAuthInfos() {
  return request({
    url: '/staff/auth/info/list',
    method: 'get'
  })
}

// 查询签入设置
export function getConfigCheckIn() {
  return request({
    url: '/invitation/config/find/check/in',
    method: 'get'
  })
}

// 查询签出设置
export function getConfigCheckOut() {
  return request({
    url: '/invitation/config/find/check/out',
    method: 'get'
  })
}

// 查询签出设置
export function editCheckOut(data) {
  return request({
    url: '/invitation/config/edit/check/out',
    headers: {
      'content-type': 'application/json'
    },
    method: 'post',
    data
  })
}

// 查询签出设置
export function editCheckIn(data) {
  return request({
    url: '/invitation/config/edit/check/in',
    headers: {
      'content-type': 'application/json'
    },
    method: 'post',
    data
  })
}

// 查询签出设置
export function delLeaderStaffId(id) {
  return request({
    url: '/staff/auth/info/del/leader/' + id,
    headers: {
      'content-type': 'application/json'
    },
    method: 'post'
  })
}

// 新增区域设置
export function addRegion(data) {
  return request({
    url: '/audit/region/add',
    headers: {
      'content-type': 'application/json'
    },
    method: 'post',
    data
  })
}
// 新增区域设置
export function checkRegionName(name) {
  return request({
    url: '/audit/region/check/name/' + name,
    method: 'get'
  })
}

// 修改区域设置
export function updateRegion(data) {
  return request({
    url: '/audit/region/update',
    headers: {
      'content-type': 'application/json'
    },
    method: 'put',
    data
  })
}

// 新增区域设置
export function delRegion(id) {
  return request({
    url: '/audit/region/delete/' + id,
    method: 'delete'
  })
}

//访问删除
export function deleteVisit(account, id) {
  return request({
    url: `/visiting/application/delete/${id}`,
    method: 'delete'
  })
}

// 冻结访客
export function freezeVisitor(id) {
  return request({
    url: '/visitor/auth/info/freeze/' + id,
    method: 'put'
  })
}

// 解冻访客
export function thawVisitor(id) {
  return request({
    url: '/visitor/auth/info/thaw/' + id,
    method: 'put'
  })
}

// 冻结授权员工
export function freezeStaff(id) {
  return request({
    url: '/staff/auth/info/freeze/' + id,
    method: 'put'
  })
}

// 解冻授权员工
export function thawStaff(id) {
  return request({
    url: '/staff/auth/info/thaw/' + id,
    method: 'put'
  })
}

// 通过id查询授权员工信息
export function staffDetail(id) {
  return request({
    url: '/staff/auth/info/detail/' + id,
    method: 'get'
  })
}
// 通过条件导出授权员工
export function staffExportRecord(data) {
  return request({
    url: '/staff/auth/info/{account}/exportRecord',
    method: 'post',
    data
  })
}
// 通过条件导出授权访客
export function visitorExportRecord(data) {
  return request({
    url: '/visitor/auth/info/{account}/exportRecord',
    method: 'post',
    data
  })
}
// 通过条件导出约访信息
export function invitationExportRecord(data) {
  return request({
    url: '/invitation/{account}/exportRecord/',
    method: 'post',
    data
  })
}

//全量标签
export function getTagList() {
  return request({
    url: '/tag/info/list',
    method: 'get'
  })
}

//根据条件搜索标签
export function getTagSearch(data) {
  return request({
    url: '/tag/info/search',
    method: 'post',
    data
  })
}

//标签新增
export function addTag(account, data) {
  return request({
    url: `/tag/info/add`,
    method: 'post',
    data
  })
}

//标签修改
export function updateTag(account, data) {
  return request({
    url: `/tag/info/update`,
    method: 'put',
    data
  })
}

//标签删除
export function deleteTag(account, id) {
  return request({
    url: `/tag/info/delete/${id}`,
    method: 'delete'
  })
}

export function checkTagName(type, name) {
  return request({
    url: `/tag/info/check?tagType=${type}&tagName=${name}`,
    method: 'get'
  })
}