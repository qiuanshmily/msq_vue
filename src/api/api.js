import axiosIns from './axios-ins'
import axiosForm from './axios-form'
import * as url from './url' //ES6整体加载写法，将url.js中的所有输出值都在url对象上加载进来

export function logout() {
    return axiosIns.get(url.LOG_OUT);
}

export function login(user) {
    return axiosForm.post(url.LOGIN, user);
}
export function isOnline() {
    return axiosIns.get(url.IS_ONLINE);
}

export function getUserList(json) {
    return axiosIns.post(url.GET_USER_LIST, json);
}

export function getUserMessage(json) {
    return axiosIns.post(url.GET_USER_MESSAGES, json);
}

export function getMessage(userId, otherUserId, time, json) {
    return axiosIns.post(url.GET_MESSAGES + "/" + userId + "/" + otherUserId + "/" + time, json);
}


export function getEssay(json) {
    return axiosIns.post(url.GET_ESSAY, json);
}


export function getCommentByEssayId(id, json) {
    return axiosIns.post(url.GET_ESSAY_COMMENT + id, json);
}

export function getEmployeeList(json) {
    return axiosIns.post(url.GET_EMPLOYEE_LIST, json);
}

export function getDataBaseConfigList(json) {
    return axiosIns.post(url.GET_DATABASE_LIST, json);
}

export function saveUpdateDataBase(json) {
  return axiosIns.post(url.SAVE_UPDATA_DATABASE,json);
}

export function deleteDataBase(json) {
  return axiosIns.post(url.VAR_DELETE_DATABASE,json);
}

export function saveUpdateEmployee(json) {
    return axiosIns.post(url.SAVE_UPDATE_EMPLOYEE, json);
}


export function getRoleList(json) {
    return axiosIns.post(url.GET_ROLE_LIST, json);
}

export function saveUpdateRole(json) {
    return axiosIns.post(url.SAVE_UPDATE_ROLE, json);
}

export function roleDelete(id) {
    return axiosIns.get(url.ROLE_DELETE + id);
}

export function employeeDelete(id) {
    return axiosIns.get(url.EMPLOYEE_DELETE + id);
}

export function employeeAssignRole(json) {
    return axiosIns.post(url.EMPLOYEE_ASSIGN_ROLE, json);
}

export function permissionList() {
    return axiosIns.get(url.PERMISSION_LIST);
}

export function assignPerm(json) {
    return axiosIns.post(url.ASSIGN_PERM, json);
}

/* essayinfo.vue中新增删除功能 20190116 */
export function essayinfoDelete(id) {
    return axiosIns.get(url.EMPLOYEE_DELETE + id);
}
/* searchSql.vue中新增增删改查功能 20190116 begin*/
export function searchSqlList(json) {
    return axiosIns.post(url.SEARCH_SQL_LIST, json);
}

export function searchSqlUpdate(json) {
    return axiosIns.post(url.SEARCH_SQL_UPDATE, json);
}

export function searchSqldelete(json) {
    return axiosIns.post(url.SEARCH_SQL_DELETE, json);
}

/* searchSql.vue中新增增删改查功能 20190116 ending*/
export function getFieldList(json) {
    return axiosIns.post(url.FIELD_CONFIG_LIST, json);
}

/* varconfig.vue中新增新增增删改查功能 20190202 start */
export function varConfigFile(json) {
    return axiosIns.post(url.VAR_CONFIG_LIST, json);
}
export function varConfigdelete(json) {
    return axiosIns.post(url.VAR_CONFIG_DELETE, json);
}
export function varConfigUpdate(json) {
    return axiosIns.post(url.VAR_CONFIG_UPDATE, json);
}
/* varconfig.vue中新增新增增删改查功能 20190202 end */

/*api接口管理*/
export function apiServiceList(json) {
  return axiosIns.post(url.API_SERVICE_LIST,json);
}
export function apiServiceUpdataOrInsert(json) {
  return axiosIns.post(url.API_SERVICE_UPDATE,json);
}
export function apiServiceDelete(json) {
  return axiosIns.post(url.API_SERVICE_DELETE,json);
}
