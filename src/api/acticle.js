/*
  文章请求模块
 */
import request from '@/utils/request'

/*
  请求获取文章列表数据
*/
export const getAricles = params => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params
  })
}

/*
  请求获取文章列表数据
*/
export const getAricleById = aricleId => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${aricleId}`
  })
}

/*
  请求收藏文章列表数据
*/
export const addCollect = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target
    }
  })
}

/*
  取消收藏文章列表数据
*/
export const deleteCollect = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}

/*
  点赞文章
*/
export const addLike = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target
    }
  })
}
/*
  取消点赞
*/
export const deleteLike = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`
  })
}
