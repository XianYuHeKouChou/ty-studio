<template>
  <el-container class="h-screen">
    <el-header v-show="!isFullscreen">
      <HeaderMenu/>
    </el-header>
    <el-container>
      <el-aside v-show="!isFullscreen" width="200px">
        <AsideMenu/>
      </el-aside>
      <el-main style="padding: 0">
        <RouterView/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AsideMenu from "@/components/AsideMenu.vue";
import HeaderMenu from "@/components/HeaderMenu.vue";

export default {
  components: {
    HeaderMenu,
    AsideMenu
  },
  computed: {
    isFullscreen() {
      return this.$route?.meta?.fullscreen === true
    }
  }
}
</script>


<style scoped>
</style>
