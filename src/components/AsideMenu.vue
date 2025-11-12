<template>
  <div class="h-full flex flex-col bg-[#304156]">
    <div class="h-[60px] flex justify-center items-center">
      <img src="@/static/element-plus-logo.svg" alt="" class="w-3/4">
    </div>
    <el-menu :router="true" :default-active="$route.path" :unique-opened="true" class="aside-menu">
      <template v-for="group in menuTree" :key="group.key">
        <!-- 单页顶级菜单 -->
        <el-menu-item v-if="group.single" :index="group.single.path">
          {{ group.name }}
        </el-menu-item>
        <!-- 有子项的分组 -->
        <el-sub-menu v-else :index="`group-${group.key}`">
          <template #title>{{ group.name }}</template>
          <template v-for="child in group.children" :key="child._key">
            <el-sub-menu v-if="child.type === 'child-group'" :index="`child-${group.key}-${child.key}`">
              <template #title>{{ child.name }}</template>
              <el-menu-item v-for="item in child.items" :key="item.path" :index="item.path">
                {{ item.title }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="child.path">
              {{ child.title }}
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>

</template>

<script>
import {USER_PERMISSIONS_KEY, DEFAULT_ROLE} from '@/config/settings.js'
import menuMeta from '@/views/pages.js'

// 扫描页面元数据
const pageModules = import.meta.glob('../views/**/page.js', {eager: true, import: 'default'})

function buildRoutePath(modPath) {
  let p = modPath.replace('../views', '').replace(/\/page\.js$/, '')
  if (p === '/initial') return '/'
  return p
}

function hasAccess(metaRoles, role) {
  if (!Array.isArray(metaRoles)) return false
  return metaRoles.includes(role)
}

function normalizeChildrenSpec(childrenSpec) {
  if (!childrenSpec) return []
  return Array.isArray(childrenSpec) ? childrenSpec : [childrenSpec]
}

function buildMenuTree(role) {
  const groupOrder = (menuMeta?.pageInfo || []).map(i => i.key)
  const groupDict = {}
  const ensureGroup = (key, name) => {
    if (!groupDict[key]) {
      groupDict[key] = {
        key,
        name: name || key,
        childrenSpec: [],
        children: [],
        single: null
      }
    }
    return groupDict[key]
  }

  for (const g of (menuMeta?.pageInfo || [])) {
    const group = ensureGroup(g.key, g.name)
    group.childrenSpec = normalizeChildrenSpec(g.children)
  }

  for (const [modPath, meta] of Object.entries(pageModules)) {
    const path = buildRoutePath(modPath)
    const segs = path.split('/').filter(Boolean)
    if (segs.length === 0) continue
    if (!hasAccess(meta?.roles || [DEFAULT_ROLE], role)) continue

    const topKey = segs[0]
    const group = ensureGroup(topKey, groupDict[topKey]?.name || topKey)

    const secondKey = segs.length > 1 ? segs[1] : null
    const declaredChild = group.childrenSpec.find(c => c.key === secondKey)

    const item = {
      title: meta?.title || segs[segs.length - 1],
      path
    }

    if (declaredChild) {
      let childGroup = group.children.find(c => c.type === 'child-group' && c.key === declaredChild.key)
      if (!childGroup) {
        childGroup = {
          _key: `child-group:${declaredChild.key}`,
          type: 'child-group',
          key: declaredChild.key,
          name: declaredChild.name,
          items: []
        }
        group.children.push(childGroup)
      }
      childGroup.items.push(item)
    } else {
      group.children.push({
        _key: `item:${item.path}`,
        type: 'item',
        ...item
      })
    }
  }

  const result = []
  for (const key of groupOrder) {
    const g = groupDict[key]
    if (!g) continue
    // 标记单页分组：无 childrenSpec 且只有一个普通 item
    const plainItems = g.children.filter(c => c.type === 'item')
    if (g.childrenSpec.length === 0 && plainItems.length === 1) {
      g.single = {path: plainItems[0].path}
      result.push({
        key: g.key,
        name: g.name,
        single: g.single
      })
      continue
    }
    if (g.children.length > 0) {
      result.push({
        key: g.key,
        name: g.name,
        children: g.children
      })
    }
  }
  return result
}

export default {
  inject: ['store'],
  name: 'AsideMenu',
  computed: {
    menuTree() {
      return buildMenuTree(this.store()[USER_PERMISSIONS_KEY])
    }
  }
}
</script>

<style scoped>
.el-menu {
  --el-menu-bg-color: #304156;
  --el-menu-text-color: #bfcbd9;
  --el-menu-active-color: #409eff;
  --el-menu-hover-bg-color: rgba(0, 0, 0, .06)
}

.aside-menu {
  border-right: none;
}
</style>
