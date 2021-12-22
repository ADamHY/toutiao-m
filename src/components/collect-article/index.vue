<template>
  <van-button
    :icon="value ? 'star' : 'star-o'"
    :color="value ? 'red' : '#002fa7'"
    @click="onCollect"
  ></van-button>
</template>

<script>
import { addCollect, deleteCollect } from '@/api/acticle'
export default {
  name: 'CollectArticle',
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {}, // 计算属性
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onCollect() {
      this.loading = true
      try {
        if (this.value) {
          // 已收藏 取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 没有收藏 添加收藏
          await addCollect(this.articleId)
        }
        // 更新视图
        // 自定义事件并不是立即的
        this.$emit('input', !this.value)
        // 提示信息
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('操作失败 请重试')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
// .collected {
//   color: #002fa7;
// }
</style>
