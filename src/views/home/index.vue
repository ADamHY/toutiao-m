<template>
  <div class="home-container">
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>

    <!-- 频道列表 -->
    <!--
      通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签
      通过 animated 属性可以开启切换标签内容时的转场动画
      通过 swipeable 属性可以开启滑动切换标签页
     -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <acticle-list :channel="channel"></acticle-list>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>

      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChennelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channei-edit
        :mychannels="channels"
        :active="active"
        @onUpadtteActive="onUpdateActive"
      ></channei-edit>
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import acticleList from './components/ActicleList.vue'
import ChanneiEdit from './components/channei-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  components: { acticleList, ChanneiEdit },
  data() {
    return {
      active: 0,
      channels: [], // 所有的列表
      isChennelEditShow: false // 控制编辑频道弹出层的显示状态
    }
  },
  created() {
    this.loadChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadChannels() {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        // 先判断用户是否以登录
        // 1 如果已登录 直接获取用户的频道列表
        // 2 如果未登录
        // 2.1 判断本地存储是否有数据 如果有就拿来用
        // 2.2 如果本地存储也没有数据 调用后台推荐频道列表

        let channels = []

        if (this.user) {
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录
          const logalChannels = getItem('TOUTIAO_CHANNELS')
          // 有拿来使用
          if (logalChannels) {
            channels = logalChannels
          } else {
            // 咩有 请求获取默认的用户列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
        // console.log(this.channels)
      } catch (err) {
        this.$toast('获取频道失败')
      }
    },

    onUpdateActive(index, isChennelEditShow = false) {
      console.log('home', index)
      this.active = index
      // 关闭编辑频道弹层
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }

  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 2px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
