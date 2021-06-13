import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store'
// import * as types from '../store/action-types';


import {
  getSession
} from '@/utils/local'
Vue.use(VueRouter)

export const routes = [{
    path: '/login',
    component: () => import('@/views/Login.vue'),
    show: false
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/',
    meta: {
      role: 'admin'
    },
    component: () => import('@/views/Home.vue'),
    redirect: '/overview',
    children: [{
        name: 'look',
        path: '/overview',
        component: () => import('@/views/overview/Overview.vue'),
        meta: {
          title: '运维总览',
          icon: 'icon el-icon-copy-document',
        },
        redirect: '/overview/mapMode',
        children: [{
            path: '/overview/mapMode',
            component: () => import('@/views/overview/MapMode.vue'),
          },
          {
            path: '/overview/statisticsMode',
            component: () => import('@/views/overview/StatisticsMode.vue'),
          }
        ]
      },
      {
        name: 'machine',
        path: '/monitor',
        component: () => import('@/views/Monitor.vue'),
        meta: {
          title: '机器人管理',
          icon: 'icon el-icon-copy-document',
        }
      },
      {
        name: 'check',
        path: '/inspecting',
        component: () => import('@/views/Inspecting.vue'),
        meta: {
          title: '巡检任务管理',
          icon: 'icon el-icon-copy-document',
        }
      },
      {
        name: 'option',
        path: '/repair',
        redirect: '/repair/repairOrder',
        component: () => import('@/views/repair/Repair.vue'),
        meta: {
          title: '运维工单管理',
          icon: 'icon el-icon-copy-document',
        },
        children: [{
            name: '维修工单',
            path: '/repair/repairOrder',
            component: () => import('@/views/repair/RepairOrder.vue'),
          },
          {
            name: '维修进度',
            path: '/repair/repairProgress',
            component: () => import('@/views/repair/RepairProgress.vue'),
          }
        ]
      },
      {
        name: 'sys',
        path: '/report',
        redirect: '/report/TaskReport',
        component: () => import('@/views/report/Report.vue'),
        meta: {
          title: '系统报表',
          icon: 'icon el-icon-copy-document',
        },
        children: [
          {
            path: '/report/orderReport',
            component: () => import('@/views/report/OrderReport.vue'),
          },
          {
            path: '/report/taskReport',
            component: () => import('@/views/report/TaskReport.vue'),
          },
          {
            path: '/report/failureReport',
            component: () => import('@/views/report/FailureReport.vue'),
          },
          {
            path: '/report/sensorReport',
            component: () => import('@/views/report/SensorReport.vue'),
          },
          {
            path: '/report/sensorReport/details',
            component: () => import('@/views/report/SensorRepoDetails.vue'),
          },
        ]
      },
      {
        name: 'user',
        path: '/account',
        component: () => import('@/views/Account.vue'),
        meta: {
          title: '账户管理',
          icon: 'icon el-icon-copy-document',
        }
      },
      {
        name: 'role',
        path: '/role',
        component: () => import('@/views/Role.vue'),
        meta: {
          title: '角色权限管理',
          icon: 'icon el-icon-copy-document',
        }
      },
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const has = getSession('hasPermission');
  if (to.path === '/login' || has) {
    next()
  } else {
    next('/login')
  }
})

export default router
