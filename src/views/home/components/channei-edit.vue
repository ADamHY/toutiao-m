<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="small"
        color="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        v-for="(channel, index) in mychannels"
        :key="index"
        class="grid-item"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && !fiexdChannels.includes(channel.id)"
        ></van-icon>
        <span slot="text" class="text" :class="{ active: active === index }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChanneiEdit',
  data() {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexdChannels: [0, 11] // 固定频道不允许删除
    }
  },
  props: {
    mychannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      require: true
    }
  },
  computed: {
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化 则计算属性会重新执行
    // recommendChannels() {
    //   const channels = []
    //   this.allChannels.forEach((channel) => {
    //     // find 遍历数组 找到满足条件的元素项
    //     const ret = this.mychannels.find((mychannel) => {
    //       return mychannel.id === channel.id
    //     })

    //     // 如果我的频道中不包括该频道项 则收集到 推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   // 吧计算结果返回
    //   return channels
    // }

    // remojianhua() {
    //   // 数组的 filter 方法 遍历数组 吧符合条件的元素存储到新数组中
    //   return this.allChannels.filter((channel) => {
    //     // const channels = []

    //     // 数组的find 方法 ：遍历数组 吧复合条件的第一个元素返回
    //     return !this.mychannels.find((mychannel) => {
    //       return mychannel.id === channel.id
    //     })

    //     // return channles
    //   })
    // }

    recommendChannels() {
      return this.allChannels.filter(
        (chennel) =>
          !this.mychannels.find((chennels) => chennel.id === chennels.id)
      )
    },
    ...mapState(['user'])
  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取失败')
      }
    },

    async onAddChannel(channel) {
      // 因为 recommendChannels是基this.myChannels计算出来的 所以 this.myChannels发生变化 recommendChannels会重新计算
      // this.myChannels 是从父组件传递过来的 只有为复杂数据类型的时候才可以进行修改
      // console.log(cahnnle)
      this.mychannels.push(channel)

      // 数据持久化处理
      if (this.user) {
        // 已登录 吧数据请求接口放到线上
        try {
          await addUserChannel({
            id: channel.id, // 频道ID
            seq: this.mychannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录 吧数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.mychannels)
      }
    },
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 如果是固定频道不允许删除
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        // 如果是编辑状态则 执行删除频道
        // 如果删除的激活频道之前的频道则更新激活的频道项
        this.mychannels.splice(index, 1)
        // 参数1 要删除的元素的索引
        // 参数2 删除的个数 如果不指定 则从参数1 开始一直删除
        if (index <= this.active) {
          // 让激活频道的索引 -1
          this.$emit('onupdateActive', this.active - 1, true)
        }
        this.deleteChannel(channel)
      } else {
        // 非编辑状态 执行切换频道
        this.$emit('onUpadtteActive', index)
      }
    },

    async deleteChannel(channel) {
      if (this.user) {
        // 已登录 则将数据更新到线上
        try {
          await deleteUserChannel(channel.id)
        } catch (err) {
          this.$toast('操作失败，请重试')
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.mychannels)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
