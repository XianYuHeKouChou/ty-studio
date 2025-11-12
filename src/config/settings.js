// 全局用户权限配置key
export const USER_PERMISSIONS_KEY = 'currentUserRole'

// 所有权限列表
export const ALL_PERMISSIONS = [
  {label: '管理员', value: 'admin'},
  {label: '组长', value: 'leader'},
  {label: '组员', value: 'member'},
  {label: '未授权', value: 'Unauthorized'}
]

// 所有权限值列表
export const PERMISSION_VALUES = ["admin", "leader", "member", "Unauthorized"]

// 默认权限
export const DEFAULT_ROLE = 'Unauthorized'
