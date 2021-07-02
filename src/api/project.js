import request from '@/utils/request'

export const project = {
  getAllCompany: '/public/common/getAllCompany',
  getProjectStage: '/public/common/getProjectStage',
  getProjectList: '/operate/project/projectList',
  addProject: '/operate/project/addProject',
  updateProject: '/operate/project/updateProject',
  removeProject: '/operate/project/removeProject',
  projectInfo: '/operate/project/projectInfo',
  getProOrderPayList: '/public/common/getProOrderPayList'
}

// 获取所有公司接口
export function getAllCompany (data) {
  return request({
    url: project.getAllCompany,
    method: 'post',
    data
  })
}

// 获取项目阶段接口
export function getProjectStage (data) {
  return request({
    url: project.getProjectStage,
    method: 'post',
    data
  })
}

// 获取项目列表
export function getProjectList (params) {
  return request({
    url: project.getProjectList,
    method: 'get',
    params
  })
}

// 创建项目接口
export function addProject (data) {
  return request({
    url: project.addProject,
    method: 'post',
    data
  })
}

// 编辑项目接口
export function updateProject (data) {
  return request({
    url: project.updateProject,
    method: 'post',
    data
  })
}

// 获取删除项目
export function removeProject (data) {
  return request({
    url: project.removeProject,
    method: 'post',
    data
  })
}

// 项目详情接口
export function getProjectInfo (params) {
  return request({
    url: project.projectInfo,
    method: 'get',
    params
  })
}

// 项目详情接口
export function getProOrderPayList (params) {
  return request({
    url: project.getProOrderPayList,
    method: 'get',
    params
  })
}
