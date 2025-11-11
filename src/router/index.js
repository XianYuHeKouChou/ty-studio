/**
 * 路由配置
 * 1. 自动导入 views 目录下的 page.js 和 index.vue 组件
 * 2. 根据 page.js 中的元数据组装路由
 * 3. 提供 applyUserRoutes 方法，根据用户角色动态添加路由
 * 4. 全局守卫处理未登录访问控制和未知路径重定向
 *
 * 目录结构说明：
 * - views/
 *  - somePage/
 *  -   page.js          // 路由元数据
 *  -   index.vue        // 组件
 *
 *  pages.js说明：
 *  export default {
 *   title: '登录',   // 页面标题
 *   fullscreen: true,    // 是否全屏显示（无边栏等）
 *   roles: ['admin', 'leader', 'member', 'Unauthorized']   // 可访问角色列表，详细见权限配置/src/config/settings.js
 * }
 *
 */
import {createRouter, createWebHistory} from 'vue-router'

import {USER_PERMISSIONS_KEY, DEFAULT_ROLE} from '@/config/settings.js'

// 自动导入
const pages = import.meta.glob('../views/**/page.js', {eager: true, import: 'default'})
const components = import.meta.glob('../views/**/*.vue', {eager: true, import: 'default'})

// 组装全部路由
const allRoutes = Object.entries(pages).map(([path, meta]) => {
  const componentPath = path.replace('page.js', 'index.vue')
  let routePath = path.replace('../views', '').replace(/\/page\.js$/, '')
  let name = routePath.split('/').filter(Boolean).join('-')
  if (routePath === '/initial' && name === 'initial') {
    routePath = '/'
    name = 'initial'
  }
  return {path: routePath, name, component: components[componentPath], meta}
})

// 辅助：是否仅未登录可访问
function isUnauthorizedOnly(meta) {
  return Array.isArray(meta?.roles) && meta.roles.length === 1 && meta.roles[0] === DEFAULT_ROLE
}

// 访问控制：已登录不再继承公共未登录页
function hasAccess(metaRoles, role) {
  if (!Array.isArray(metaRoles)) return false
  if (role === DEFAULT_ROLE) return metaRoles.includes(DEFAULT_ROLE)
  // 已登录用户只访问包含自身角色的路由
  return metaRoles.includes(role)
}

// 公共初始路由（未登录可访问）
const publicRoutes = allRoutes.filter(r => hasAccess(r.meta?.roles, DEFAULT_ROLE))
const baseRoutes = [...publicRoutes]

// 路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: baseRoutes
})

// 应用用户角色路由
export function applyUserRoutes() {
  const role = localStorage.getItem(USER_PERMISSIONS_KEY)
  // 1. 移除仅未登录页（如登录页）
  for (const r of publicRoutes) {
    if (isUnauthorizedOnly(r.meta) && router.hasRoute(r.name)) {
      router.removeRoute(r.name)
    }
  }
  // 2. 动态添加用户可访问的其它路由
  const allowed = allRoutes.filter(r => hasAccess(r.meta?.roles, role))
  for (const r of allowed) {
    if (!router.hasRoute(r.name)) router.addRoute(r)
  }
}

// 全局守卫
router.beforeEach((to, from, next) => {
  // 登录后阻止进入仅未登录路由（即使用户直接输入地址或后退）
  if (localStorage.getItem(USER_PERMISSIONS_KEY) !== DEFAULT_ROLE && isUnauthorizedOnly(to.meta)) {
    return next({path: '/'})
  }
  // 正常路由存在则放行
  if (router.hasRoute(to.name)) {
    return next()
  }
  // 未匹配路由但在已知路由中，重定向到首页
  if (to.matched.length === 0) {
    // 未匹配：若在已定义的全部路由中，认为是有效路径（只是尚未动态注册）
    const isKnownPath = allRoutes.some(r => r.path === to.path)
    if (isKnownPath) {
      return next({
        path: '/',
        query: {redirectedFrom: to.fullPath},
        replace: true
      })
    }
  }
  // 未匹配路由且不在已知路由中，重定向到 404 页面
  return next({name: 'errPages-404'})
})

router.afterEach((to) => {
  if (to?.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
