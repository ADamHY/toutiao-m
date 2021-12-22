<template>
  <div class="update-birthday">
    <!--
      currentDate  双向绑定了日期选择器
        设置日期选择器的默认值
        同步日期选择器选择的日期
      min-date 可选择最小日期
      max-date 可选的最大日期
     -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1), // 不写的话默认值是减十年
      maxDate: new Date(), // 不写的话默认值是加十年
      currentDate: new Date(this.value)
    }
  },
  computed: {}, // 计算属性
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      console.log(1)
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        console.log(currentDate)
        await updateUserProfile({
          birthday: currentDate
        })
        // 更新视图
        this.$emit('input', currentDate)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
