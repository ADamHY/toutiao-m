<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    >
    </van-nav-bar>
    <!-- /导航栏 -->
    <input type="file" hidden ref="file" @change="onFileChange" />

    <!-- 个人信息 -->
    <van-cell
      class="photo-cell"
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUdateNameShow = true"
    >
    </van-cell>
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUdateGenderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUdateBirthdayShow = true"
    ></van-cell>
    <!-- /个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup style="height: 100%" position="bottom" v-model="isUdateNameShow">
      <update-name
        v-if="isUdateNameShow"
        v-model="user.name"
        @close="isUdateNameShow = false"
      />
    </van-popup>
    <!-- /编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup position="bottom" v-model="isUdateGenderShow">
      <update-gender
        v-if="isUdateGenderShow"
        v-model="user.gender"
        @close="isUdateGenderShow = false"
      />
    </van-popup>
    <!-- /编辑性别 -->
    <!-- 编辑生日 -->
    <van-popup position="bottom" v-model="isUdateBirthdayShow">
      <update-birthday
        v-if="isUdateBirthdayShow"
        v-model="user.birthday"
        @close="isUdateBirthdayShow = false"
      />
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑图片 -->
    <van-popup
      position="bottom"
      style="height: 100%"
      v-model="isUpdatePhotoShow"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @uptate-photo="user.photo = $event"
      />
    </van-popup>
    <!-- /编辑图片 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  components: { UpdateName, UpdateGender, UpdateBirthday, UpdatePhoto },
  props: {},
  data() {
    return {
      user: {}, // 用户的个人信息
      isUdateNameShow: false,
      isUdateGenderShow: false,
      isUdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null // 预览的图片
    }
  },
  computed: {}, // 计算属性
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },

    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取 blob数据
      this.img = window.URL.createObjectURL(file)
      this.isUpdatePhotoShow = true

      // file-input 如果选了同一个文件不会出阿发 change 事件
      // 解决方法就是每次使用完毕 吧他的 value 清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
