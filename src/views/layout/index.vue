<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <router-view></router-view>
    <!-- 标签导航栏 -->
    <van-tabbar v-model="active" class="layout-tabbar">
      <van-tabbar-item to="/">
        <template #icon>
          <i class="toutiao toutiao-shouye"></i>
        </template>
        首页</van-tabbar-item
      >
      <van-tabbar-item icon="search" to="/qa">
        <template #icon>
          <i class="toutiao toutiao-wenda"></i>
        </template>
        问答</van-tabbar-item
      >
      <van-tabbar-item icon="friends-o" to="/video">
        <template #icon>
          <i class="toutiao toutiao-shipin"></i>
        </template>
        视频</van-tabbar-item
      >
      <van-tabbar-item icon="setting-o" to="/my">
        <template #icon>
          <i class="toutiao toutiao-wode"></i>
        </template>
        <span class="text">{{ $store.state.user ? '我的' : '未登录' }}</span>
      </van-tabbar-item>
    </van-tabbar>
    <!-- 标签导航栏 -->
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  components: {},
  props: {},
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style lang="less" scoped>
.layout-container {
  .layout-tabbar {
    .toutiao {
      font-size: 25px;
    }
  }
}
</style>
