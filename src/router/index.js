import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import login from '@/components/login'
import indexmain from '@/components/indexmain'
import apiServiceSet from '@/components/apiServiceSet'
import sqlSearch from '@/components/sqlSearch'
import dataSourceSet from '@/components/dataSourceSet'
import essaydetail from '@/components/essaydetail'
import employee from '@/components/employee'
import role from '@/components/role'
import system from '@/components/system'
// Add 变量配置页面 variableconfig.vue
import varconfig from '@/components/varconfig'
Vue.use(Router)
export const constantRouterMap = [{
        path: '/login',
        name: 'login',
        component: login
    },
    {
        path: '/',
        redirect: '/login',
    }
]
export default new Router({
    routes: constantRouterMap
        // routes: asyncRouterMap
})

export const asyncRouterMap = [{
        path: '/index',
        name: 'index',
        component: index,
        children: [{
                path: '',
                name: 'indexmain',
                component: indexmain,
                meta: {
                    title: "首页",
                    icon: "el-icon-location"
                },
            },
            {
                path: 'dataSourceSet',
                name: 'dataSourceSet',
                component: dataSourceSet,
                //menu: "dataSourceSet",
                meta: {
                    title: "数据源配置服务",
                    icon: "el-icon-document"
                },
            },
            {
                path: 'varconfig',
                name: 'varconfig',
                component: varconfig,
                menu: "varconfig",
                meta: {
                    title: "变量配置服务",
                    icon: "el-icon-location"
                },
            },
            {
                path: 'sqlSearch',
                name: 'sqlSearch',
                component: sqlSearch,
                //menu: "sqlSearch",
                meta: {
                    title: "SQL查询服务",
                    icon: "el-icon-message"
                }
            },
            {
                path: 'apiServiceSet',
                name: 'apiServiceSet',
                component: apiServiceSet,
                //menu: "apiServiceSet",
                meta: {
                    title: "API接口服务",
                    icon: "el-icon-info"
                },
            },
            {
                path: 'essaydetail',
                name: 'essaydetail',
                component: essaydetail,
                hidden: true
            },
            {
                path: 'system',
                name: 'system',
                component: system,
                redirect: "system/employee",
                meta: {
                    title: "系统管理",
                    icon: "el-icon-setting"
                },
                children: [{
                        path: 'employee',
                        name: 'employee',
                        component: employee,
                        menu: "employee",
                        meta: {
                            title: "人员管理",
                            icon: "el-icon-setting"
                        },
                    },
                    {
                        path: 'role',
                        name: 'role',
                        component: role,
                        menu: "role",
                        meta: {
                            title: "角色管理",
                            icon: "el-icon-setting"
                        },
                    }
                ]
            },

        ]
    },

]
