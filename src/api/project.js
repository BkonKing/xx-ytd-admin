import request from '@/utils/request'

export const project = {
  getAllCompany: '/public/common/getAllCompany',
  getProjectStage: '/public/common/getProjectStage',
  getProjectList: '/operate/project/projectList',
  addProject: '/operate/project/addProject',
  updateProject: '/operate/project/updateProject',
  removeProject: '/operate/project/removeProject'
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
export function getProjectList (data) {
  return request({
    url: project.getProjectList,
    method: 'post',
    data
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