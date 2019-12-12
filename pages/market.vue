<template lang="pug">
div.market
  input.market__search(
    :placeholder="$t('search')"
  )
  h1.market__title {{$t('trend')}}
  ul.market__list
    li.list__item(v-for="item in list")
      div.item__img
        img(:src="encode(baseUrl + item.path)")
      div.item__option
        el-tooltip(:content="$t('copy')" placement="top")
          i.el-icon-link(
            v-clipboard="encode(baseUrl + item.path)"
            @click="$notify.success({\
              title: $t('copy') + $t('success'),\
              position: 'bottom-right'\
            })"
          )
            span {{$t('copy')}}
        //- el-tooltip(content="自定义" placement="top")
        //-   i.el-icon-set-up
        el-tooltip(:content="$t('star')" placement="top")
          i.el-icon-star-off
            span {{$t('star')}}
            span {{item.star}}
  el-pagination(
    background
    layout="prev, pager, next"
    :total="data.length"
    :current-page="pageIndex"
    @current-change="pageIndex = $event"
  )
  //- npmer-foot
</template>

<script>
// import axios from '~/plugins/axios'
import NpmerFoot from '~/components/npmer-foot.vue'

export default {
  components: {
    NpmerFoot
  },

  data () {
    return {
      pageIndex: 1,
      baseUrl: 'https://woolson.gitee.io/npmer-badge/',
      data: []
    }
  },

  computed: {
    list () {
      const start = (this.pageIndex - 1) * 10
      return this.data.slice(start, start + 32)
    }
  },

  mounted () {
    this.fetchTrend()
  },

  methods: {
    async fetchTrend () {
      this.data = [
        { path: 'Make with-fb5656--ebebeb-heart-f43232-right-square-flat-plain.svg', star: 10 },
        { path: 'Make with-fb5656--ebebeb-heart-f43232-right-square-flat-plain.svg', star: 10 },
        { path: 'Make with-fb5656--ebebeb-heart-f43232-right-square-flat-plain.svg', star: 10 },
        { path: 'Make with-fb5656--ebebeb-heart-f43232-right-square-flat-plain.svg', star: 10 }
      ]
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
  padding 0 50px 50px
  background $background-color

.market__search
  max-width 600px
  width 100%
  height 45px
  margin 100px 20px 0 20px
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
  width 50%
  text-align center
  margin-top 30px
  font-size 24px
  font-weight bold
  border-bottom 1px solid rgba($color-text, .1)
  line-height 50px

.market__list
  width 100%
  list-style none
  // width $body-width
  display grid
  padding 0
  margin 0
  margin 10px 0 20px 0
  grid-column-gap 20px

@media screen and (max-width: 1909px)
  .market__list
    grid-template-columns repeat(5, 1fr)

@media screen and (max-width: 1539px)
  .market__list
    grid-template-columns repeat(4, 1fr)

@media screen and (max-width: 1169px)
  .market__list
    grid-template-columns repeat(3, 1fr)

@media screen and (max-width: 767px)
  .market__list
    grid-template-columns repeat(2, 1fr)

@media screen and (max-width: 620px)
  .market__list
    grid-template-columns repeat(1, 1fr)

.list__item
  display flex
  align-items center
  justify-content center
  flex-direction column
  background white
  padding 20px 0
  border-radius 5px
  margin-bottom 20px
  box-shadow 0 0 2px $color-shadow
  &:hover i
    opacity 1 !important
  .item__img
    line-height 100px
  .item__option
    margin-bottom -10px
    width 100%
    padding 0 10px
    box-sizing border-box
    display flex
    align-items center
    justify-content flex-end
    cursor pointer
    i
      margin-left 15px
      transition all .3s
      opacity .3
      display flex
      align-items center
      &.el-icon-link
      &.el-icon-set-up
        opacity 0
      &:hover
        color $color-main
      span
        font-size 12px
        margin-left 3px
</style>
