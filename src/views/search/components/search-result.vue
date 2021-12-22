<template>
  <div class="">
    <van-list
      v-model="loading"
      :error.sync="error"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearch } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      error: false,
      finished: false,
      page: 1,
      perPage: 20
    }
  },
  computed: {}, // 计算属性
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      // 1 请求获取数据
      try {
        const { data } = await getSearch({
          page: this.page, // 页码
          per_page: this.perPage, // 每页大小
          q: this.searchText // 查询关键词
        })
        console.log(data)
        // 2 将数据添加到数组列表中
        const { results } = data.data
        // console.log(results)
        this.list.push(...results)
        // 3 将本次加载中的 loading 关闭
        this.loading = false
        // 4 判断是否还有数据
        if (results.length) {
          //   如果有 则更新获取下一个数据的页码
          this.page++
        } else {
          //   如果没有 则将加载状态  finished 设置为结束
          this.finished = true
        }
      } catch (err) {
        this.$toast('获取数据失败')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
