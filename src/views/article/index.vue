<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
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
            class="follow-btn"
            round
            size="small"
            :loading="follwLoading"
            @click="onFollow"
            >已关注</van-button
          > -->
          <!--
           模板中的  $event 是事件参数
           当我们传递给子组件的数据纪要使用还要修改
              传递 props
                 :is-followed="article.is_followed"
              修改：自定义事件
              @updateIsFollowed="article.is_followed = $event"
          简写方式 在组件上使用v-model
            value="acticle.is_followed"
            @input="acticle.is_followed=$event"
            如果需要修改v-model 的规则名称 可以通过子组件的 model 属性来匹配修改

            一个组件上只能使用一次 v-model
            如果有多个数据实现类似于v-model 的效果咋办?
            可以使用
           -->
          <!-- <followUser
            class="follow-btn"
            :userId="article.aut_id"
            :is-followed="article.is_followed"
            @updateIsFollowed="article.is_followed = $event"
          /> -->
          <!-- v-model简写形式 -->
          <followUser
            class="follow-btn"
            v-model="article.is_followed"
            :userId="article.aut_id"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <!--
          1 给每一张图片绑定点击事件来实现vant组件的图片预览 -> 如何获取点击图片？
          2 需要获取每一张图片 -> 如何精准的获取 v-html 下的所有 top？
          3 通过ref可以获取v-html的所有dom节点

         -->
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <comment-list
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentCount = $event.total_count"
          @reply-click="onReplyClick"
        />
        <!-- /文章评论列表 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <van-icon
            class="comment-icon"
            name="comment-o"
            :badge="totalCommentCount"
          />
          <!-- <van-icon color="#777" name="star-o" /> -->

          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          ></collect-article>

          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          >
          </like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          ></comment-post>
        </van-popup>
        <!-- /发布评论 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <!--
        v-if 条件渲染 true：渲染元素节点 false 不渲染
       -->
      <CommentReply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import { getAricleById } from '@/api/acticle'
import { ImagePreview } from 'vant'
import followUser from '@/components/follow-user'
import collectArticle from '@/components/collect-article'
import likeArticle from '@/components/like-article'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'
import CommentReply from './components/comment-reply.vue'
export default {
  name: 'ArticleIndex',
  components: {
    followUser,
    collectArticle,
    likeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的 loading 状态
      errStatus: 0, // 失败的状态码
      totalCommentCount: 0,
      isPostShow: false, // 控制发布评论的显示状态
      commentList: [], // 评论列表
      isReplyShow: false,
      currentComment: {} // 当前点击回复的评论项
    }
  },
  // 给所有的后代组件提供数据
  // 注意不要滥用
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      // 展示 loading 加载中
      this.loading = true
      try {
        // if (Math.random() > 0.5) {
        //   JSON.parse('asdfasdfsasdf')
        // }
        const { data } = await getAricleById(this.articleId)
        console.log(data)
        // 数据驱动视图不是立即的
        this.article = data.data
        // this.loading = false

        // 初始化图片点击预览
        setTimeout(() => {
          // console.log(this.$refs['article-content'].querySelectorAll('img'))
          // console.log(document.querySelector('.article-content'))
          this.previewImage()
        }, 0)
        // this.$nextTick(() => {  //
        // console.log(this.$refs['article-content'])
        // this.previewImage()
        // })
        // 请求成功 关闭 loading
      } catch (err) {
        // this.loading = false
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        this.$toast('获取失败')
      }

      // 无论成功还是失败都需要关闭loading
      this.loading = false
    },

    previewImage() {
      // 得到所有的 img 节点

      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images,
            // 起始位置 从0开始
            startPosition: index,
            // closeable: true, // 显示右上角关闭按钮
            onClose() {
              // 图片关闭的回调
              console.log('onClose')
            }
            // })
          })
        }
      })
    },

    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    },

    onReplyClick(comment) {
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
