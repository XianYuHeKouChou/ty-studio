/**
 * 侧边栏配置信息
 * 结构说明：
 *  pageInfo: [
 *   {name: '页面名称', key: '路由key', children: {name: '子页面名称', key: '子路由key'}}
 *  ]
 *  建议最多支持两级菜单
 */
export default {
  pageInfo: [
    {name: '首页', key: 'homeView'},
    {name: '工单管理', key: 'workOrder'},
    {
      name: '系统管理', key: 'systemAdministration', children: {
        name: '日志管理', key: 'logManagement'
      }
    },
  ]
}
