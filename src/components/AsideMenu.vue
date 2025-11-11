<template>
  <el-menu>
    <el-menu-item index="2">
      <template #title>Navigator Two</template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <template #title>Navigator Three</template>
    </el-menu-item>
    <el-menu-item index="4">
      <template #title>Navigator Four</template>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "AsideMenu"
}
</script>

<style scoped>

</style>
