<template>
  <div class="">
    <van-button
      v-if="isFollowed"
      type="info"
      color="#3296fa"
      round
      size="small"
      icon="plus"
      :loading="follwLoading"
      @click="onFollow"
      >关注</van-button
    >
    <van-button
      v-else
      round
      size="small"
      :loading="follwLoading"
      @click="onFollow"
      >已关注</van-button
    >
  </div>
</template>

<script>
// 1 创建组件
// 2 在页面引入组件
// 3 使用组件传入必要的属性
// 4 进行组件封装
//      4.1 template  赋值原本的代码 修改相对的属性
//      4.2 script
//      4.3 style
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: '',
  components: {},
  // 自定义 v-model 数据名称
  model: {
    prop: 'isFollowed', // 默认是value
    event: 'update-is_followed' // 默认是input
  },
  props: {
    isFollowed: {
      // 是否关注
      type: Boolean,
      required: true
    },
    userId: {
      // 关注的ID
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      follwLoading: false
    }
  },
  computed: {}, // 计算属性
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onFollow() {
      this.follwLoading = true // 展示关注按钮的 loading 状态
      try {
        if (this.isFollowed) {
          // 已关注 取消关注
          console.log(this.userId)
          const { data } = await deleteFollow(this.userId)
          console.log(data)
        } else {
          // 没有关注 添加关注
          // const { data } =
          await addFollow(this.userId)
          // console.log(data)
        }
        // 更新视图转态
        // this.isFollow = !this.isFollow
        // this.$emit('updateisFollow', !this.isFollow)
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败 请重试！'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.follwLoading = false // 关闭关注按钮的 loading 状态
    }
  }
}
</script>

<style scoped></style>
