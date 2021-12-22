<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon
        slot="left"
        name="cross"
        @click="$router.back()"
        class="van-icon"
      ></van-icon>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <!--
      表单验证
        1 给 van-field 组件配置 rules 验证规则
          参考文档：https://vant-contrib.gitee.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
        2 当表单提交的时候会自动触发表单验证
          如果验证通过 会触发 submit事件
          如果验证失败 不会触发submit

     -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <template #left-icon>
          <i class="toutiao toutiao-shouji"></i>
        </template>
      </van-field>
      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <template #left-icon>
          <i class="toutiao toutiao-yanzhengma"></i>
        </template>
        <template #button>
          <!--
            time : 倒计时时间
           -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss 秒"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            type="default"
            native-type="button"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>
<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810' // 密码
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          { required: true, message: '请填写用户名' },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 登录
    async onSubmit() {
      // login(this.user).then(
      //   (res) => {
      //     console.log('登录成功')
      //     console.log(res)
      //   },
      //   (error) => {
      //     console.log(error.message)
      //   }
      // )

      // 1 获取表单数据

      // TODO // 2 表单验证
      // 在组件中必须通过 this.$toast 来调用 Toast 组件
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间 默认是2000 如果为0 则持续显示
      })
      // 3 提交表单请求登录
      try {
        const { data } = await login(this.user)
        console.log('登录成', data.data)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        // 登录成功，跳转回原来页面
        // back 的方式不严谨，后面讲功能优化的时候再说
        this.$router.back()
      } catch (err) {
        console.log(err)
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          console.log('登录失败请稍后再试')
          this.$toast.fail('登录失败请稍后再试')
        }
      }
      // 4 根据请求响应结果处理后续操作
    },
    // 发送验证码
    async onSendSms() {
      // 1 校验手机号
      console.log(this.$refs)
      this.$toast.loading({
        message: '发送中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间 默认是2000 如果为0 则持续显示
      })
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2 验证通过 显示倒计时
      // 3 请求发送验证码
      try {
        const res = await sendSms(this.user.mobile)
        console.log('发送成功', res)
        this.isCountDownShow = true
        this.$toast.success('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后再试')
        } else {
          this.$toast('发送失败，请稍后再试')
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 36px;
  }
  .send-sms-btn {
    width: 156px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
