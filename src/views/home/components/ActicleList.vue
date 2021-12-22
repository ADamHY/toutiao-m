<template>
  <!-- <div class="article-list" :style="{ height: sreenHeight }"> -->
  <div class="article-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-pull-refresh
        v-model="isreFreshLoading"
        :success-text="refreshSuccessText"
        :success-duration="1500"
        @refresh="onRefresh"
      >
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
        <acticle-item
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
          :article="article"
        >
        </acticle-item>
      </van-pull-refresh>
    </van-list>
  </div>
</template>

<script>
import { getAricles } from '@/api/acticle'
import ActicleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ActicleItem
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: +new Date(), // 请求获取下一页的时间戳
      error: false, // 控制失败的提示状态
      count: 0,
      isreFreshLoading: false,
      refreshSuccessText: ''
      // sreenHeight: '79vh'
    }
  },

  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 初始化或滚动到底部的时候会触发调用onLoad
    async onLoad() {
      try {
        // 1 请求获取数据
        const { data } = await getAricles({
          channel_id: this.channel.id, // 频道ID
          // timestamp, 简单理解就是请求数据的页码
          // 请求第1页数据：当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          // timestamp: this.timestamp || Date.now(),
          timestamp: this.timestamp,
          with_top: 1 // 是否包含指定 进入页面第一次请求时要包含置顶
        })

        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('asdfasdfasdf')
        // }

        const { results } = data.data
        this.list.push(...results)
        // 吧请求结果数据放到list数组中
        // 3 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false

        // 4 判断数据是否全部加载完成
        if (data.data.pre_timestamp) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了将 finished 设置为 true  不在load 加载更多
          this.finished = true
        }
        // 如果没有数据了 吧 finished 设置为 true 之后不在触发加载更多
      } catch (err) {
        // this.$toast('请求失败 请稍后重试', err)
        this.error = true // 展示错误提示
        this.loading = false // 请求失败了 loading 也需要关闭
      }
    },
    // 当下拉刷新的时候 会触发调用该函数
    async onRefresh() {
      // 请求获取数据
      try {
        // 1 请求获取数据
        const { data } = await getAricles({
          channel_id: this.channel.id, // 频道ID
          // timestamp, 简单理解就是请求数据的页码
          // 请求第1页数据：当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          // timestamp: this.timestamp || Date.now(),
          // 每次下拉刷新都希望拿到最新的数据 所以需要传递最新的毫秒数
          timestamp: this.timestamp, // 下来刷新 每次请求获取最新数据
          with_top: 1 // 是否包含指定 进入页面第一次请求时要包含置顶
        })
        // 3 本次数据加载结束之后要把加载状态设置为结束
        // 4 判断数据是否全部加载完成
        if (data.data.pre_timestamp) {
          this.list.unshift(...data.data.results)
          this.isreFreshLoading = false
          this.refreshSuccessText = `刷新了成功更新了${data.data.results.length}条数据`
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了将 finished 设置为 true  不在load 加载更多
          this.finished = true
          this.isreFreshLoading = false
          this.refreshSuccessText = '数据无了'
        }
      } catch (err) {
        this.isreFreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
      // 将数据追加到列表的顶部
      // 关闭下来刷新的 loading 状态
      this.isreFreshLoading = false
    }

    // scrollsss() {
    //   this.sreenHeight =
    //     window.screen.availHeight -
    //     document.querySelector('.van-nav-bar__content').offsetHeight -
    //     document.querySelector('.van-tabs__wrap').offsetHeight -
    //     document.querySelector('.layout-tabbar').offsetHeight +
    //     'px'
    //   console.log(this.sreenHeight)
    // }
  },
  mounted() {
    // let that = this
    // document.querySelector('.article-list').onscroll = function () {
    //   that.scrollsss()
    // }
    // console.log(
    //   window.screen.availHeight,
    //   document.querySelector('.van-nav-bar__content').offsetHeight,
    //   document.querySelector('.van-tabs__wrap').offsetHeight,
    //   document.querySelector('.layout-tabbar').offsetHeight
    // )
    // this.sreenHeight =
    //   window.screen.availHeight -
    //   document.querySelector('.van-nav-bar__content').offsetHeight -
    //   document.querySelector('.van-tabs__wrap').offsetHeight -
    //   document.querySelector('.layout-tabbar').offsetHeight +
    //   'px'

    console.log(this.channel)
  }
}
</script>

<style lang="less" scoped>
.article-list {
  // 百分比单位是相对于父元素的
  overflow-y: auto;
  height: 80vh;
}
</style>
