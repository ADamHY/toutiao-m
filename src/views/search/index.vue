<template>
  <div class="search-container">
    <!-- 顶部的搜索栏 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。
       show-action 有这个属性才会显示取消
     -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
        class="search-form"
      />
    </form>
    <!-- /顶部的搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :searchText="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggenstion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :searchHistories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
    />
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import searchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import SearchSuggenstion from './components/search-suggenstion.vue'
import { setItem, getItem } from '@/utils/storage'

export default {
  components: { searchHistory, SearchResult, SearchSuggenstion },
  name: 'searchIndex',

  data() {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索的历史记录
    }
  },
  watch: {
    searchHistories(value) {
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
  methods: {
    onSearch(val) {
      // console.log(val)
      this.searchText = val // 更新文本框内容
      // 存储搜索历史记录
      // 要求 不要有重复历史记录 最细你的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      this.isResultShow = true // 渲染搜索结果
    },
    onCancel() {
      this.$router.back()
      // Toast('取消')
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;

  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
