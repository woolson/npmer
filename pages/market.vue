<template lang="pug">
div.market
  input.market__search(
    placeholder="搜索"
  )
  h1.market__title Trend
  ul.market__list
    li.list__item(v-for="item in list")
      div.item__img
        img(:src="encode(baseUrl + item.path)")
      div.item__option
        el-tooltip(content="复制链接" placement="top")
          i.el-icon-link(
            v-clipboard="encode(baseUrl + item.path)"
            @click="$notify.success({title: TEXT.copy + TEXT.success})"
          )
        //- el-tooltip(content="自定义" placement="top")
        //-   i.el-icon-set-up
        el-tooltip(content="点赞" placement="top")
          i.el-icon-star-off
            span {{item.star}}
  el-pagination(
    background
    layout="prev, pager, next"
    :total="data.length"
    :current-page="pageIndex"
    @current-change="pageIndex = $event"
  )
</template>

<script>
import TEXT from '~/assets/js/text'
import axios from '~/plugins/axios'

export default {
  data () {
    return {
      TEXT,
      pageIndex: 1,
      baseUrl: 'https://woolson.gitee.io/npmer-badge/',
      data: [
        { path: 'Make with-fb5656--ebebeb-heart-f43232-right-square-flat-plain.svg', star: 10 },
        { path: 'Make with-fb5656--ebebeb-heart-f43232-right-square-flat-plain.svg', star: 10 },
        { path: 'Make with-fb5656--ebebeb-heart-f43232-right-square-flat-plain.svg', star: 10 },
        { path: 'Make with-fb5656--ebebeb-heart-f43232-right-square-flat-plain.svg', star: 10 }
      ]
    }
  },

  computed: {
    list () {
      const start = (this.pageIndex - 1) * 10
      return this.data.slice(start, start + 16)
    }
  },

  mounted () {
    this.fetchTrend()
  },

  methods: {
    async fetchTrend () {
      const resData = await axios.get('https://gitee.com/api/v5/repos/woolson/npmer-badge/git/trees/7028b7065d26265b2c5a8fd5f5c15589e1c85eee?access_token=6b12b7cf077e0666f6447aacb83edf83')
      this.data = resData.data.tree
    },
    encode (value) {
      return encodeURI(value)
    }
  }
}
</script>

<style lang="stylus" scoped>
.market
  display flex
  flex-direction column
  align-items center
  min-height 100vh
  background $background-color

.market__search
  width 600px
  height 45px
  margin-top 100px
  padding 10px 30px
  box-sizing border-box
  background rgba(0,0,0,.05)
  -webkit-appearance none
  border none
  box-shadow inset 0 0 2px rgba(0,0,0,.1)
  border-radius 7px
  font-size 16px
  color $color-text
  caret-color $color-main
  text-align center

.market__title
  width $body-width
  margin-top 30px
  font-size 24px
  font-weight bold
  border-bottom 1px solid rgba($color-text, .1)
  line-height 50px

.market__list
  list-style none
  width $body-width
  display grid
  padding 0
  margin 0
  margin-top 10px
  grid-template-columns repeat(4, 1fr)
  grid-column-gap 20px

.list__item
  display flex
  align-items center
  justify-content center
  flex-direction column
  background white
  padding 10px 0
  border-radius 5px
  margin-bottom 20px
  box-shadow 0 0 2px $border-color
  &:hover i
    opacity 1 !important
  .item__img
    line-height 100px
  .item__option
    margin-top -16px
    width 100%
    padding 0 10px
    box-sizing border-box
    display flex
    justify-content flex-end
    cursor pointer
    i
      margin-left 10px
      transition all .3s
      opacity .3
      &.el-icon-link
      &.el-icon-set-up
        opacity 0
      &:hover
        color $color-main
      span
        font-size 12px
        margin-left 3px
</style>
