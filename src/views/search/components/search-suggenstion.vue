<template>
  <div class="search-suggestion">
    <van-cell icon="search" v-for="(text, index) in suggstions" :key="index"
    @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>

    <!-- 使用 v-html 指令可以绑定渲染带有 HTML 标签的字符串 -->
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
// 按需加载有好处：只会吧使用到的成员打包到结果中
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggenstion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggstions: [] // 建议的请求列表
    }
  },
  computed: {}, // 计算属性
  watch: {
    searchText: {
      // 当 searchText 发生改变的时候就会调用handler 函数
      // 注意 ：handler 函数名称是固定的
      // teep: true, // 深度监视
      immediate: true, // 一开始执行一次
      // handler(q, oldName) {
      //   // console.log(newName, oldName);
      //   this.loadSearchSuggestions(q)
      // }

      handler: debounce(function (q) {
        this.loadSearchSuggestions(q)
      }, 200)
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestions(q) {
      try {
        const { data } = await getSearchSuggestion(q)
        console.log(data)
        this.suggstions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败 请稍后重试')
      }
    },
    highlight(text) {
      // 1 先定义要高亮的模板字符串
      // 2 定义要替换的正则表达式
      // 3 用suggestiontext替换里面需要高亮的文字
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式 // 中间的内容都会当匹配字符来使用 而不是数据变量
      // 如果需要根据数据变量动态创建正则则手动 new RegExp
      // RegExp 正则表达式构造函数
      //    参数1 匹配模式字符串 他会根据这个字符串 创建正则对象
      //    参数2 匹配模式 要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr) // replace 不会修改原始数据会返回一个新的字符串
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    // color: #319cff;
    color: red;
  }
}
// .search-suggestion {
//   /deep/ span.active {
//     color: #3296fa;
//   }
// }
</style>
