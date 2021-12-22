<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        <!-- 注意 是想清空数组的内容 而非替换数组 所以最优的方式应该是使用splice删除全部内容 -->
        <!-- <span @click="searchHistories.splice(0)">全部删除</span> -->
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>

      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    // prop 数据
    //   prop 是受父组件数据影响的
    //      如果是普通数据（数字、字符串、布尔值）绝对不能修改 即便改了也不会传导给父组件

    //      如果是引用类型数据（数组、对象）
    //        可以修改 例如 [].push(xxx) 对象.xxx = xxx
    //        不能重新赋值， xxx = []

    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleteShow: false // 控制删除显示转态
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 删除转态 删除历史记录数据
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态 直接进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
