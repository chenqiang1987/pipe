import Vue from 'vue'
import VueRouter from 'vue-router'

import {
  getSession,
  setSession
} from '@/utils/local'
Vue.use(VueRouter)



export const constantRoutes = [{
    path: '/',
    redirect: '/login'
  },
  {
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
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export const asyncRoutes = [{
  path: '/home',
  redirect: '/overview',
  component: () => import('@/views/Home.vue'),
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
          name: 'MapMode',
          path: '/overview/mapMode',
          component: () => import('@/views/overview/MapMode.vue'),
        },
        {
          name: 'StatisticsMode',
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
      },
    },
    {
      name: 'check',
      path: '/inspecting',
      component: () => import('@/views/Inspecting.vue'),
      meta: {
        title: '巡检任务管理',
        icon: 'icon el-icon-copy-document',
      },
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
          name: 'RepairOrder',
          path: '/repair/repairOrder',
          component: () => import('@/views/repair/RepairOrder.vue'),
        },
        {
          name: 'RepairProgress',
          path: '/repair/repairProgress',
          component: () => import('@/views/repair/RepairProgress.vue'),
        }
      ]
    },
    {
      name: 'sys',
      path: '/report',
      redirect: '/report/orderReport',
      component: () => import('@/views/report/Report.vue'),
      meta: {
        title: '系统报表',
        icon: 'icon el-icon-copy-document',
      },
      children: [{
          name: 'OrderReport',
          path: '/report/orderReport',
          component: () => import('@/views/report/OrderReport.vue'),
        },
        {
          name: 'TaskReport',
          path: '/report/taskReport',
          component: () => import('@/views/report/TaskReport.vue'),
        },
        {
          name: 'FailureReport',
          path: '/report/failureReport',
          component: () => import('@/views/report/FailureReport.vue'),
        },
        {
          name: 'SensorReport',
          path: '/report/sensorReport',
          component: () => import('@/views/report/SensorReport.vue'),
        },
        {
          name: 'SensorReportDetails',
          path: '/report/sensorReport/details',
          component: () => import('@/views/report/SensorRepoDetails.vue'),
        },
      ]
    },
    {
      name: 'expert',
      path: '/expert',
      component: () => import('@/views/Expert.vue'),
      meta: {
        title: '专家协助模式',
        icon: 'icon el-icon-copy-document',
      },
    },
    {
      name: 'user',
      path: '/account',
      component: () => import('@/views/Account.vue'),
      meta: {
        title: '账户管理',
        icon: 'icon el-icon-copy-document',
      },
    },
    {
      name: 'role',
      path: '/role',
      component: () => import('@/views/Role.vue'),
      meta: {
        title: '角色权限管理',
        icon: 'icon el-icon-copy-document',
      },
    }
  ]
}]

const createRouter = () => new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// router.beforeEach((to, from, next) => {
//   const has = getSession('hasPermission');
//   if (to.path === '/login' && has) {
//     const isMountedRoutes = permission.state.isMountedRoutes;
//     const accessRoutes = permission.state.asyncRoutes;
//     console.log(isMountedRoutes);
//     console.log(accessRoutes);
//     if (isMountedRoutes) {
//       // dynamically add accessible routes
//       router.addRoutes(accessRoutes)
//       // hack method to ensure that addRoutes is complete
//       // set the replace: true, so the navigation will not leave a history record
//       next({ ...to, replace: true })
//     } else {
//       next('/login')
//     }
//     // next()
//   } else {
//     next('/login')
//   }
// })

router.beforeEach((to, from, next) => {
  const has = getSession('hasPermission');
  const isMounted = getSession('isMounted');
  const accessRoutes = getSession('asyncRoutes');
  if (has) {
    if (isMounted) {
      if (to.path === '/login') {
        next('/')
      } else {
        next()
      }
    } else {
      try {
        // dynamically add accessible routes
        router.addRoutes(accessRoutes);
        console.log(accessRoutes)
        // hack method to ensure that addRoutes is complete
        // set the replace: true, so the navigation will not leave a history record
        setSession('isMounted', true)
        next({
          ...to,
          replace: true
        })
      } catch (e) {
        next('/403')
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})


export default router
