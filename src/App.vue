<template>
  <el-container class="h-screen">
    <el-aside v-show="!isFullscreen" width="200px">
      <aside-menu/>
    </el-aside>
    <el-container>
      <el-header v-show="!isFullscreen">
        <header-menu/>
      </el-header>
      <el-main style="padding: 0">
        <router-view/>
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
